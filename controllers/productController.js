const Product = require("../models/product");
const multer = require("multer");
const fs = require("fs");
const handleAsync = require("../utils/asyncHandler");
const { uploadProduct } = require("../uploadFile");

//Get All Products
exports.getAllProducts = handleAsync(async (req, res) => {
  const products = await Product.find()
    .populate("proCategoryId", "id name")
    .populate("proSubCategoryId", "id name")
    .populate("proBrandId", "id name");

  res.status(200).json({
    status: "success",
    message: "Products retreived successfully",
    data: products,
  });
});

//Get one product by id
exports.getOneProduct = handleAsync(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId)
    .populate("proCategoryId", "id name")
    .populate("proSubCategoryId", "id name")
    .populate("proBrandId", "id name");

  if (!product) {
    return res.status(404).json({
      status: "failed",
      message: "Product was not found",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Product retreived successfully",
    data: product,
  });
});

//Add product

exports.addProduct = handleAsync(async (req, res) => {
  uploadProduct.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ])(req, res, async function (err) {
    //Handling multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        err.message =
          "File size is too large. Maximum filesize is 5MB per image.";
      }
      console.log(`Add product: ${err}`);
      return res.json({ status: "failed", message: err.message });
    } else if (err) {
      // Handle other errors, if any
      console.log(`Add product: ${err}`);
      return res.json({ status: "failed", message: err });
    }

    //Exctracting infos
    const {
      name,
      description,
      quantity,
      price,
      offerPrice,
      proCategoryId,
      proSubCategoryId,
      proBrandId,
    } = req.body;

    // Check if any required fields are missing
    if (!name || !quantity || !price || !proCategoryId || !proSubCategoryId) {
      return res
        .status(400)
        .json({ status: "failed", message: "Required fields are missing." });
    }

    // Initialize an array to store image URLs
    const imageUrls = [];
    // Iterate over the file fields
    const fields = ["image1", "image2", "image3", "image4", "image5"];
    fields.forEach((field, index) => {
      if (req.files[field] && req.files[field].length > 0) {
        const file = req.files[field][0];
        const imageUrl = `http://localhost:4000/images/products/${file.filename}`;
        imageUrls.push({ image: index + 1, url: imageUrl });
      }
    });

    const newProduct = new Product({
      name,
      description,
      quantity,
      price,
      offerPrice,
      proCategoryId,
      proSubCategoryId,
      proBrandId,
      images: imageUrls,
    });

    // Save the new product to the database
    await newProduct.save();

    // Send a success response back to the client
    res.json({
      status: "success",
      message: "Product created successfully.",
      data: null,
    });
  });
});

//update product
exports.updateProduct = handleAsync(async (req, res) => {
  const productId = req.params.id;
  uploadProduct.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ])(req, res, async function (err) {
    //Handling multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        err.message =
          "File size is too large. Maximum filesize is 5MB per image.";
      }
      console.log(`Add product: ${err}`);
      return res.json({ status: "failed", message: err.message });
    } else if (err) {
      // Handle other errors, if any
      console.log(`Add product: ${err}`);
      return res.json({ status: "failed", message: err });
    }

    const {
      name,
      description,
      quantity,
      price,
      offerPrice,
      proCategoryId,
      proSubCategoryId,
      proBrandId,
    } = req.body;

    //Finding the product
    const productToUpdate = await Product.findById(productId);
    if (!productToUpdate) {
      return res
        .status(404)
        .json({ status: "failed", message: "Product not found." });
    }

    const fields = ["image1", "image2", "image3", "image4", "image5"];
    fields.forEach((field, index) => {
      if (req.files[field] && req.files[field].length > 0) {
        const file = req.files[field][0];
        const imageUrl = `http://localhost:4000/images/products/${file.filename}`;
        let imageEntry = productToUpdate.images.find(
          (img) => img.image === index + 1
        );

        if (imageEntry) {
          imageEntry.url = imageUrl;
        } else {
          // If the image entry does not exist, add it
          productToUpdate.images.push({ image: index + 1, url: imageUrl });
        }
      }
    });

    // Save the updated product
    await productToUpdate.save();
    res.json({ status: "success", message: "Product updated successfully." });
  });
});

//Delete a product
exports.deleteProduct = handleAsync(async (req, res) => {
  const productID = req.params.id;

  const product = await Product.findByIdAndDelete(productID);
  if (!product) {
    return res
      .status(404)
      .json({ status: "failed", message: "Product not found." });
  }
  product.images.forEach((image) => {
    const filePath = path.join(
      __dirname,
      "../public/products",
      path.basename(image.url)
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ status: "failed", message: err.message });
      }
    });
  });

  res.json({ status: "sucess", message: "Product deleted successfully." });
});
