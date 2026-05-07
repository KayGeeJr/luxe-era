const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

function parseBoolean(value) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
}

function parseJsonField(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeImageEntry(img) {
  if (img == null) return null;
  if (typeof img === "string") return { url: img, publicId: undefined };
  if (typeof img === "object" && img.url) {
    return { url: String(img.url), publicId: img.publicId != null ? String(img.publicId) : undefined };
  }
  return null;
}

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images.map(normalizeImageEntry).filter(Boolean);
}

async function listProducts(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 12), 1), 100);
    const skip = (page - 1) * limit;

    const query = { isActive: true };
    if (req.query.category) query.category = req.query.category;
    if (req.query.collection) query.collection = req.query.collection;
    if (req.query.featured !== undefined) query.isFeatured = parseBoolean(req.query.featured);

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.search) {
      query.$text = { $search: String(req.query.search) };
    }

    let sort = { createdAt: -1 };
    if (req.query.sort === "price_asc") sort = { price: 1 };
    if (req.query.sort === "price_desc") sort = { price: -1 };
    if (req.query.sort === "newest") sort = { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(query).populate("category collection", "name slug").sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate("category collection", "name slug");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, price, compareAtPrice, category, collection, tags, isFeatured, variants } = req.body;
    if (!name || !description || price === undefined || !category) {
      res.status(400);
      throw new Error("name, description, price and category are required");
    }
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400);
      throw new Error("Invalid category id");
    }
    if (collection && !mongoose.Types.ObjectId.isValid(collection)) {
      res.status(400);
      throw new Error("Invalid collection id");
    }

    const uploaded = (req.files || [])
      .filter((f) => f && f.path)
      .map((f) => ({ url: f.path, publicId: f.filename != null ? String(f.filename) : undefined }));
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice !== undefined ? Number(compareAtPrice) : undefined,
      category,
      collection: collection || undefined,
      tags: parseJsonField(tags, []),
      variants: parseJsonField(variants, []),
      isFeatured: parseBoolean(isFeatured) || false,
      images: uploaded,
    });

    console.log("Created product:", product._id.toString());
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const fields = ["name", "description"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });

    if (req.body.category !== undefined && req.body.category !== "" && req.body.category !== null) {
      if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
        res.status(400);
        throw new Error("Invalid category id");
      }
      product.category = req.body.category;
    }

    if (req.body.collection !== undefined) {
      if (req.body.collection === "" || req.body.collection === null) {
        product.collection = undefined;
      } else if (!mongoose.Types.ObjectId.isValid(req.body.collection)) {
        res.status(400);
        throw new Error("Invalid collection id");
      } else {
        product.collection = req.body.collection;
      }
    }
    if (req.body.price !== undefined) product.price = Number(req.body.price);
    if (req.body.compareAtPrice !== undefined) product.compareAtPrice = Number(req.body.compareAtPrice);
    if (req.body.tags !== undefined) product.tags = parseJsonField(req.body.tags, []);
    if (req.body.variants !== undefined) product.variants = parseJsonField(req.body.variants, []);
    if (req.body.isFeatured !== undefined) product.isFeatured = parseBoolean(req.body.isFeatured);
    if (req.body.isActive !== undefined) product.isActive = parseBoolean(req.body.isActive);

    if (req.body.keepImageUrls !== undefined) {
      // Authoritative keep-list: remove any existing image whose URL is not in this list
      const keepUrls = parseJsonField(req.body.keepImageUrls, null);
      if (Array.isArray(keepUrls)) {
        const removed = (product.images || []).filter((img) => {
          const url = typeof img === "object" && img != null ? img.url : img;
          return !keepUrls.includes(url);
        });
        for (const img of removed) {
          const pid = typeof img === "object" && img != null ? img.publicId : undefined;
          if (pid) {
            try { await cloudinary.uploader.destroy(pid); } catch {}
          }
        }
        product.images = (product.images || []).filter((img) => {
          const url = typeof img === "object" && img != null ? img.url : img;
          return keepUrls.includes(url);
        });
      }
    } else if (req.body.removeImagePublicIds) {
      const toRemove = parseJsonField(req.body.removeImagePublicIds, []);
      if (Array.isArray(toRemove) && toRemove.length) {
        for (const publicId of toRemove) {
          try { await cloudinary.uploader.destroy(publicId); } catch {}
        }
        product.images = (product.images || []).filter((img) => {
          const pid = typeof img === "object" && img != null ? img.publicId : undefined;
          return !toRemove.includes(pid);
        });
      }
    }

    const added = (req.files || [])
      .filter((f) => f && f.path)
      .map((f) => ({ url: f.path, publicId: f.filename != null ? String(f.filename) : undefined }));
    if (added.length) {
      product.images = [...(product.images || []), ...added];
    }

    product.images = normalizeImages(product.images || []);

    await product.save();
    console.log("Updated product:", product._id.toString());
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (req.query.permanent === "true") {
      for (const img of product.images || []) {
        if (img.publicId) {
          try {
            await cloudinary.uploader.destroy(img.publicId);
          } catch {
            // Continue deletion.
          }
        }
      }
      await product.deleteOne();
      console.log("Hard deleted product:", req.params.id);
      res.json({ success: true, message: "Product permanently deleted" });
      return;
    }

    product.isActive = false;
    await product.save();
    console.log("Soft deleted product:", req.params.id);
    res.json({ success: true, message: "Product deactivated" });
  } catch (error) {
    next(error);
  }
}

async function updateStock(req, res, next) {
  try {
    const { variantIndex, stock } = req.body;
    if (variantIndex === undefined || stock === undefined) {
      res.status(400);
      throw new Error("variantIndex and stock are required");
    }
    const parsedIndex = Number(variantIndex);
    const parsedStock = Number(stock);
    if (!Number.isInteger(parsedIndex) || parsedIndex < 0) {
      res.status(400);
      throw new Error("variantIndex must be a non-negative integer");
    }
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      res.status(400);
      throw new Error("stock must be a non-negative integer");
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    if (!product.variants[parsedIndex]) {
      res.status(400);
      throw new Error("Invalid variantIndex");
    }
    product.variants[parsedIndex].stock = parsedStock;
    await product.save();
    console.log("Updated stock:", req.params.id, variantIndex);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

async function toggleWishlist(req, res, next) {
  try {
    const productId = req.params.id;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const index = user.wishlist.findIndex((id) => id.toString() === productId);
    if (index >= 0) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  toggleWishlist,
};
