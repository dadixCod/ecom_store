const mongoose = require("mongoose");
const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Sub Category must have a name"],
    trim: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category Id is required"],
  },
});
const SubCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategory;
