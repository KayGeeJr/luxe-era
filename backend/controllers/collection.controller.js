const Collection = require("../models/Collection");
const Product = require("../models/Product");

async function getCollections(req, res, next) {
  try {
    const collections = await Collection.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, collections });
  } catch (error) {
    next(error);
  }
}

async function getCollectionBySlug(req, res, next) {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug, isActive: true });
    if (!collection) {
      res.status(404);
      throw new Error("Collection not found");
    }
    const products = await Product.find({ collection: collection._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, collection, products });
  } catch (error) {
    next(error);
  }
}

async function createCollection(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400);
      throw new Error("name is required");
    }
    const image = req.file ? { url: req.file.path, publicId: req.file.filename } : undefined;
    const collection = await Collection.create({ name, description, image });
    console.log("Created collection:", collection._id.toString());
    res.status(201).json({ success: true, collection });
  } catch (error) {
    next(error);
  }
}

async function updateCollection(req, res, next) {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      res.status(404);
      throw new Error("Collection not found");
    }
    if (req.body.name !== undefined) collection.name = req.body.name;
    if (req.body.description !== undefined) collection.description = req.body.description;
    if (req.body.isActive !== undefined) collection.isActive = req.body.isActive === true || req.body.isActive === "true";
    if (req.file) collection.image = { url: req.file.path, publicId: req.file.filename };
    await collection.save();
    console.log("Updated collection:", collection._id.toString());
    res.json({ success: true, collection });
  } catch (error) {
    next(error);
  }
}

async function deleteCollection(req, res, next) {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      res.status(404);
      throw new Error("Collection not found");
    }
    collection.isActive = false;
    await collection.save();
    console.log("Archived collection:", collection._id.toString());
    res.json({ success: true, message: "Collection archived" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
};
