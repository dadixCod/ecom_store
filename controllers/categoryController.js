const handleAsync = require("../utils/asyncHandler");
const Category = require("../models/category");
const Product = require("../models/product");
const SubCategory = require("../models/subCategory");
const { uploadCategoy, uploadCategory } = require("../uploadFile");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

//Get all categories
exports.getAllCategories = handleAsync(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "success",
    message: "Categories retreived successfully",
    data: categories,
  });
});

//Get one category by id
exports.getOneCategory = handleAsync(async (req, res) => {
  const categoryId = req.params.id;
  const category = Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({
      status: "failed",
      message: "Category was not found",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Category retreived successfully",
    data: category,
  });
});

//Add  Category

exports.addCategory = handleAsync(async (req, res) => {
  uploadCategory.single("img")(req, res, async function (err) {
    //Checking erros
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        err.message = "File size is too large. Maximum filesize is 5MB.";
      }
      return res.json({ status: "failed", message: err });
    } else if (err) {
      console.log(`Add category: ${err}`);
      return res.json({ status: "failed", message: err });
    }

    const { name } = req.body;
    let imageUrl = "empty_url";
    if (req.file) {
      imageUrl = `http://localhost:4000/images/categories/${req.file.filename}`;
    }
    console.log("url ", req.file);
    if (!name) {
      return res
        .status(400)
        .json({ status: "failed", message: "Name is required." });
    }
    try {
      const newCategory = new Category({
        name,
        image: imageUrl,
      });
      await newCategory.save();
      res.json({
        status: "success",
        message: "Category created successfully.",
        data: null,
      });
    } catch (error) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  });
});

exports.upadteCategory = handleAsync(async (req, res) => {
  const categoryId = req.params.id;
  uploadCategory.single("img")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        err.message = "File size is too large. Maximum filesize is 5MB.";
      }
      return res.json({ status: "failed", message: err });
    } else if (err) {
      console.log(`Add category: ${err}`);
      return res.json({ status: "failed", message: err });
    }

    const { name } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = `http://localhost:4000/images/categories/${req.file.filename}`;
    }

    console.log("url ", req.file);
    if (!name || !image) {
      return res
        .status(400)
        .json({ status: "failed", message: "Name and image are required." });
    }
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {
          name,
          image,
        },
        { new: true }
      );
      if (!updatedCategory) {
        return res
          .status(404)
          .json({ status: "failed", message: "Category not found." });
      }

      res.json({
        status: "true",
        message: "Category updated successfully.",
        data: null,
      });
    } catch (error) {
      res.status(500).json({ status: "failed", message: error.message });
    }
  });
});

//Delete a category
exports.deleteCategory = handleAsync(async (req, res) => {
  const categoryId = req.params.id;

  //subcategories??
  const subcategories = await SubCategory.find({ categoryId });
  if (subcategories.length > 0) {
    return res.status(400).json({
      status: "failed",
      message: "Cannot delete category. Subcategories are referencing it.",
    });
  }

  //products
  const products = await Product.find({ proCategoryId: categoryId });
  if (products.length > 0) {
    return res.status(400).json({
      status: "failed",
      message: "Cannot delete category. Products are referencing it.",
    });
  }

  /// no subcategories no products delete category

  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    return res
      .status(404)
      .json({ status: "failed", message: "Category not found." });
  }

  const filePath = path.join(
    __dirname,
    "../public/categories",
    path.basename(category.image)
  );
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ status: "failed", message: err.message });
    }
  });
  res
    .status(200)
    .json({ status: "success", message: "Category deleted successfully." });
});
