const ProjectModel = require("../models/projects");

const insert = (projectData) => {
  const project = new ProjectModel(projectData);
  return project.save();
};

const list = (where) => {
  console.log("where:", where);
  return ProjectModel.find(where || {}).populate({
    path: "user_id",
    select: "full_name email",
  });
};

const modify = (id, data) => {
  // return ProjectModel.findById(id).then((response) => {
  //   response.name = data.name;
  //   return response.save();
  // });
  return ProjectModel.findByIdAndUpdate(id, data, { new: true });
};

const remove = (id) => {
  return ProjectModel.findByIdAndDelete(id);
};

module.exports = {
  insert,
  list,
  modify,
  remove,
};
