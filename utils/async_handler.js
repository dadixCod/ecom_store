const handleAsync = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (error) {
      return res.status(400).json({
        status: "failed",
        message: error.message || "An unexpected error occurred.",
      });
    }
  };
};

module.exports = handleAsync;
