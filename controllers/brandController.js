const Brand = require("../models/brand");
const handleAsync = require("../utils/asyncHandler");

//Get all brands

exports.getAllBrands = handleAsync(async (req, res) => {
  const brands = await Brand.find()
    .populate("subCategoryId")
    .sort({ subCategoryId: 1 });
  res.status(200).json({
    status: "success",
    message: "Brands retreived successfully",
    data: brands,
  });
});

//Get one brand by id
exports.getOneBrand = handleAsync(async (req, res) => {
  const brandId = req.params.id;
  const brand = await Brand.findById(brandId).populate("subCategoryId");
  if (!brand) {
    return res.status(404).json({
      status: "failed",
      message: "Brand was not found",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Brand retreived successfully",
    data: brand,
  });
});

//Add a brand
exports.addBrand = handleAsync(async (req, res) => {
  const { name, subCategoryId } = req.body;

  if (!name || !subCategoryId) {
    return res.status(400).json({
      status: "failed",
      message: "Name and Sub Category ID are required.",
    });
  }
  const newBrand = Brand({ name, subCategoryId });
  await newBrand.save();
  res.status(201).json({
    status: "success",
    message: "Brand created successfully",
    data: null,
  });
});

//Update a brand
exports.updateBrand = handleAsync(async (req, res) => {
  const brandId = req.params.id;
  const { name, subCategoryId } = req.body;
  if (!name || !subCategoryId) {
    return res.status(400).json({
      status: "failed",
      message: "Name and Sub Category ID are required.",
    });
  }

  const updatedBrand = await Brand.findByIdAndUpdate(
    brandId,
    { name, subCategoryId },
    { new: true }
  );
  if (!updatedBrand) {
    return res.status(404).json({
      status: "failed",
      message: "Brand was not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Brand updated successfully",
    data: null,
  });
});

//Delete a brand
exports.deleteBrand = handleAsync(async (req, res) => {
  const brandId = req.params.id;
  const deletedBrand = await Brand.findByIdAndDelete(brandId);
  if (!deletedBrand) {
    return res.status(404).json({
      status: "failed",
      message: "Brand was not found",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Brand deleted successfully",
  });
});
