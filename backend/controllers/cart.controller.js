const Cart = require("../models/Cart");
const Product = require("../models/Product");

function getSessionId(req) {
  return req.body?.sessionId || req.query?.sessionId || req.headers["x-session-id"];
}

async function resolveCart(req, { createIfMissing = false } = {}) {
  if (req.user) {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart && createIfMissing) cart = await Cart.create({ user: req.user._id, items: [] });
    return cart;
  }

  const sessionId = getSessionId(req);
  if (!sessionId) return null;
  let cart = await Cart.findOne({ sessionId });
  if (!cart && createIfMissing) cart = await Cart.create({ sessionId, items: [] });
  return cart;
}

async function getCart(req, res, next) {
  try {
    const cart = await resolveCart(req);
    if (!cart) {
      res.json({ success: true, cart: { items: [], discount: 0, couponCode: null } });
      return;
    }
    await cart.populate("items.product", "name slug price images variants");
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
}

async function addToCart(req, res, next) {
  try {
    const { productId, variantIndex = 0, quantity = 1 } = req.body;
    if (!productId) {
      res.status(400);
      throw new Error("productId is required");
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error("Product not found");
    }
    const variant = product.variants?.[variantIndex];
    if (!variant) {
      res.status(400);
      throw new Error("Invalid variantIndex");
    }

    const cart = await resolveCart(req, { createIfMissing: true });
    if (!cart) {
      res.status(400);
      throw new Error("sessionId is required for guest carts");
    }

    const existing = cart.items.find(
      (item) => item.product.toString() === productId && item.variantIndex === Number(variantIndex),
    );
    const requestedQty = Number(quantity);
    if (existing) {
      const nextQty = existing.quantity + requestedQty;
      if (nextQty > variant.stock) {
        res.status(400);
        throw new Error("Insufficient stock");
      }
      existing.quantity = nextQty;
    } else {
      if (requestedQty > variant.stock) {
        res.status(400);
        throw new Error("Insufficient stock");
      }
      cart.items.push({
        product: product._id,
        variantIndex: Number(variantIndex),
        quantity: requestedQty,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate("items.product", "name slug price images variants");
    console.log("Cart add:", productId);
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const { itemId, quantity } = req.body;
    if (!itemId || quantity === undefined) {
      res.status(400);
      throw new Error("itemId and quantity are required");
    }

    const cart = await resolveCart(req);
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    const item = cart.items.id(itemId);
    if (!item) {
      res.status(404);
      throw new Error("Cart item not found");
    }

    if (Number(quantity) <= 0) {
      item.deleteOne();
    } else {
      const product = await Product.findById(item.product);
      const variant = product?.variants?.[item.variantIndex];
      if (!product || !variant) {
        res.status(400);
        throw new Error("Invalid product or variant");
      }
      if (Number(quantity) > variant.stock) {
        res.status(400);
        throw new Error("Insufficient stock");
      }
      item.quantity = Number(quantity);
    }

    await cart.save();
    await cart.populate("items.product", "name slug price images variants");
    console.log("Cart update:", itemId);
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
}

async function removeCartItem(req, res, next) {
  try {
    const cart = await resolveCart(req);
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      res.status(404);
      throw new Error("Cart item not found");
    }
    item.deleteOne();
    await cart.save();
    await cart.populate("items.product", "name slug price images variants");
    console.log("Cart remove:", req.params.itemId);
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
}

async function clearCart(req, res, next) {
  try {
    const cart = await resolveCart(req);
    if (!cart) {
      res.json({ success: true, message: "Cart already empty" });
      return;
    }
    cart.items = [];
    cart.discount = 0;
    cart.couponCode = undefined;
    await cart.save();
    console.log("Cart cleared");
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
}

async function mergeCart(req, res, next) {
  try {
    const { sessionId } = req.body;
    if (!req.user) {
      res.status(401);
      throw new Error("Authentication required");
    }
    if (!sessionId) {
      res.status(400);
      throw new Error("sessionId is required");
    }

    const [guestCart, userCart] = await Promise.all([
      Cart.findOne({ sessionId }),
      resolveCart(req, { createIfMissing: true }),
    ]);
    if (!guestCart) {
      await userCart.populate("items.product", "name slug price images variants");
      res.json({ success: true, cart: userCart });
      return;
    }

    for (const guestItem of guestCart.items) {
      const same = userCart.items.find(
        (i) => i.product.toString() === guestItem.product.toString() && i.variantIndex === guestItem.variantIndex,
      );
      if (same) {
        same.quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }

    await userCart.save();
    await guestCart.deleteOne();
    await userCart.populate("items.product", "name slug price images variants");
    console.log("Cart merged:", sessionId);
    res.json({ success: true, cart: userCart });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
};
