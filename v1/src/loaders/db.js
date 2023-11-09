const mongoose = require("mongoose");
const db = mongoose.connection;

db.once("open", () => {
  console.log("Db successfully connected");
});

const connectDb = async () => {
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = {
  connectDb,
};
