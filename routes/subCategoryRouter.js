const router = require("express").Router();
const {
  getAllSubCategories,
  getOneSubCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategoryController");

router.route("/").get(getAllSubCategories).post(addSubCategory);
router
  .route("/:id")
  .get(getOneSubCategory)
  .put(updateSubCategory)
  .delete(deleteSubCategory);

module.exports = router;
