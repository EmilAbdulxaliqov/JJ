const UserModel = require("../models/users");

const insert = (userData) => {
  const user = new UserModel(userData);
  return user.save();
};

const loginUser = (data) => {
  return UserModel.findOne(data);
};

const list = () => {
  return UserModel.find({});
};

const modify = (where, data) => {
  return UserModel.findOneAndUpdate(where, data, { new: true });
};

const remove = (id) => {
  return UserModel.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  loginUser,
  modify,
  remove,
};
