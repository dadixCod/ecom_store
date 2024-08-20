const SubCategory = require("../models/subCategory");
const Product = require("../models/product");
const Brand = require("../models/brand");
const handleAsync = require("../utils/asyncHandler");
//get all sub categories

exports.getAllSubCategories = handleAsync(async (req, res) => {
  const subCategories = await SubCategory.find()
    .populate("categoryId")
    .sort({ categoryId: 1 });
  res.json({
    status: "success",
    message: "Sub Categories retrieved successfully.",
    data: subCategories,
  });
});

//get one sub category

exports.getOneSubCategory = handleAsync(async (req, res) => {
  const subCategoryId = req.params.id;
  const subCategory = await SubCategory.findById(subCategoryId)
    .populate("categoryId")
    .sort({ categoryId: 1 });

  if (!subCategory) {
    res
      .status(404)
      .json({ status: "failed", message: "Sub category was not found" });
  }
  res.json({
    status: "success",
    message: "Sub Category retrieved successfully.",
    data: subCategory,
  });
});

//add a sub category
exports.addSubCategory = handleAsync(async (req, res) => {
  const { name, categoryId } = req.body;
  if (!name || !categoryId) {
    return res.status(400).json({
      status: "failed",
      message: "Name and Category are required",
    });
  }
  const newSubCategory = new SubCategory({
    name,
    categoryId,
  });

  await newSubCategory.save();
  res.status(201).json({
    status: "success",
    message: "Sub Category was created successfully",
    data: null,
  });
});

//Update a sub category
exports.updateSubCategory = handleAsync(async (req, res) => {
  const subCategoryId = req.params.id;
  const { name, categoryId } = req.body;
  if (!name || !categoryId) {
    return res.status(400).json({
      status: "failed",
      message: "Name and Category are required",
    });
  }
  const updatedSubCategory = await SubCategory.findByIdAndUpdate(
    subCategoryId,
    {
      name,
      categoryId,
    },
    { new: true }
  );
  if (!updatedSubCategory) {
    return res
      .status(404)
      .json({ status: "failed", message: "Sub-category not found." });
  }
  res.status(200).json({
    status: "success",
    message: "Sub Category was updated successfully",
    data: null,
  });
});

//Delete a category
exports.deleteSubCategory = handleAsync(async (req, res) => {
  const subCategoryId = req.params.id;

  const brands = await Brand.find({ subCategoryId });
  if (brands.length > 0) {
    return res.status(400).json({
      status: "failed",
      message:
        "Cannot delete sub-category. It is associated with one or more brands.",
    });
  }

  const products = await Product.find({ proSubCategoryId: subCategoryId });
  if (products.length > 0) {
    return res.status(400).json({
      status: "failed",
      message:
        "Cannot delete sub-category. It is associated with one or more products.",
    });
  }

  const deletedSubCategory = await SubCategory.findByIdAndDelete(subCategoryId);
  if (!deletedSubCategory) {
    return res
      .status(404)
      .json({ status: "failed", message: "Sub-category not found." });
  }
  res.status(200).json({
    status: "success",
    message: "Sub Category was deleted successfully",
  });
});
