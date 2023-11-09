const express = require("express");
const {
  create,
  index,
  update,
  deleteProject,
} = require("../controllers/projects");
const {
  createValidation,
  updateValidation,
} = require("../validations/projects");
const validator = require("../middlewares/validator");
const authenticateToken = require("../middlewares/authentication");

const router = express.Router();

router.get("/", authenticateToken, index);
router.post("/", authenticateToken, validator(createValidation), create);
router.patch("/:id", authenticateToken, validator(updateValidation), update);
router.delete("/:id", authenticateToken, deleteProject);

module.exports = {
  router,
};
