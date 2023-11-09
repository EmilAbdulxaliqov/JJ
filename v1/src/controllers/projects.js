const { insert, list, modify } = require("../services/projects");
const httpStatus = require("http-status");

const index = (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((err) => {
      res.status(httpStatus.NOT_FOUND).send(err);
    });
};

const create = (req, res) => {
  console.log("Before inserting data");
  req.body.user_id = req.user;
  console.log(req.body);
  insert(req.body)
    .then((response) => {
      console.log("create response");
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((err) => {
      console.log("create error");
      console.log("error", err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
  console.log("After inserting data");
};

const update = (req, res) => {
  console.log(req.params.id);
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: "Id required!" });
  }
  modify(req.params.id, req.body)
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((err) => {
      console.log("error", err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
};

const deleteProject = (req, res) => {
  console.log(req.params.id);
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: "Id required!" });
  }
  remove(req.params.id)
    .then((response) => {
      console.log("Response:", response);
      res.status(httpStatus.OK).send({ message: "Project has been deleted" });
    })
    .catch((_) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "Something went wrong deleted project time",
      });
    });
};

module.exports = {
  create,
  index,
  update,
  deleteProject,
};
