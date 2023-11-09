const express = require("express");
const {
  create,
  index,
  login,
  projectsList,
  deleteUser,
  changePassword,
  verifyRefreshToken,
} = require("../controllers/users");
const {
  createValidation,
  loginValidation,
  resetPasswordValidation,
} = require("../validations/users");
const validator = require("../middlewares/validator");
const authenticateToken = require("../middlewares/authentication");

const router = express.Router();

router.post("/refresh-token", verifyRefreshToken);

router.get("/", index);
router.post("/", validator(createValidation), create);
router.post("/login", validator(loginValidation), login);
router.get("/projects", authenticateToken, projectsList);
// router.post(
//   "/reset-password",
//   authenticateToken,
//   validator(resetPasswordValidation),
//   resetPassword
// );
router.post(
  "/change-password",
  authenticateToken,
  validator(resetPasswordValidation),
  changePassword
);
router.delete("/:id", authenticateToken, deleteUser);

module.exports = {
  router,
};
