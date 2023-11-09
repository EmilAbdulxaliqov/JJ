const mongoose = require("mongoose");
const logger = require("../logger/users");

const userSchema = new mongoose.Schema(
  {
    full_name: String,
    password: String,
    email: String,
    profile_image: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
});

module.exports = mongoose.model("user", userSchema);
