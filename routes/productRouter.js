const router = require("express").Router();
const {
  getAllProducts,
  getOneProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.route("/").get(getAllProducts).post(addProduct);
router
  .route("/:id")
  .get(getOneProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
