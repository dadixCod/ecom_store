const router = require("express").Router();
const {
  addBrand,
  getAllBrands,
  getOneBrand,
  deleteBrand,
  updateBrand,
} = require("../controllers/brandController");

router.route("/").get(getAllBrands).post(addBrand);
router.route("/:id").get(getOneBrand).put(updateBrand).delete(deleteBrand);

module.exports = router;
