const multer = require("multer");
const path = require("path");

const storageCategory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/categories");
  },
  filename: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );
    if (extname) {
      cb(
        null,
        Date.now() +
          "_" +
          Math.floor(Math.random() * 1000) +
          path.extname(file.originalname)
      );
    } else {
      cb("Error: only .jpeg, .jpg, .png files are allowed!");
    }
  },
});

const uploadCategory = multer({
  storage: storageCategory,
  limits: 1024 * 1024 * 5,
});


const storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/products");
  },
  filename: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );

    if (extname) {
      cb(
        null,
        Date.now() +
          "_" +
          Math.floor(Math.random() * 1000) +
          path.extname(file.originalname)
      );
    } else {
      cb("Error: only .jpeg, .jpg, .png files are allowed!");
    }
  },
});

const uploadProduct = multer({
  storage: storageProduct,
  limits: 1024 * 1024 * 5,
});

const storagePoster = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/posters");
  },
  filename: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );

    if (extname) {
      cb(
        null,
        Date.now() +
          "_" +
          Math.floor(Math.random() * 1000) +
          path.extname(file.originalname)
      );
    } else {
      cb("Error: only .jpeg, .jpg, .png files are allowed!");
    }
  },
});

const uploadPoster = multer({
  storage: storagePoster,
  limits: 1024 * 1024 * 5,
});

module.exports = {
  uploadCategory,
  uploadProduct,
  uploadPoster,
};
