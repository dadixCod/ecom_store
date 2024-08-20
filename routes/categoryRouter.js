const router = require("express").Router();
const {
  addCategory,
  deleteCategory,
  getAllCategories,
  getOneCategory,
  upadteCategory,
} = require("../controllers/categoryController");

router.route("/").get(getAllCategories).post(addCategory);
router
  .route("/:id")
  .get(getOneCategory)
  .put(upadteCategory)
  .delete(deleteCategory);

module.exports = router;
