const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Brand must have a name"],
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: [true, "Sub Category Id is required"],
  },
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
