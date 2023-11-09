const mongoose = require("mongoose");
const logger = require("../logger/projects");

const projectSchema = new mongoose.Schema(
  {
    name: String,
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// projectSchema.pre("save", (next, doc) => {
//   console.log("Before:", doc);
//   next();
// });

projectSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
  console.log("After:", doc);
});

module.exports = mongoose.model("project", projectSchema);
