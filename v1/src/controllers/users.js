const projectService = require("../services/projects");
const {
  insert,
  list,
  loginUser,
  modify,
  remove,
} = require("../services/users");
const eventEmitter = require("../events/eventEmitter");
const httpStatus = require("http-status");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/hash");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

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
  req.body.password = passwordToHash(req.body.password);
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((err) => {
      console.log("error", err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  loginUser(req.body)
    .then((user) => {
      if (!user) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "User not found" });
      }
      user = {
        ...user.toObject(),
        token: {
          access_token: generateAccessToken({ name: user.full_name, ...user }),
          refresh_token: generateRefreshToken({
            name: user.full_name,
            ...user,
          }),
        },
      };
      delete user.password;

      res
        .status(httpStatus.OK)
        .cookie("refreshToken", user.token.refresh_token, {
          httpOnly: true,
          sameSite: "strict",
        })
        .send(user);
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
};

const verifyRefreshToken = (req, res) => {
  console.log("refresh token>>>>", req.body);
  const refresh_token = req.cookies["refreshToken"];
  if (!refresh_token) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ message: "Access denied! No refresh token provided" });
  }
  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    (err, user) => {
      if (err) {
        return res.status(httpStatus.FORBIDDEN).send({ error: err });
      }
      user = {
        ...user._doc,
        token: {
          access_token: generateAccessToken({ name: user.full_name, ...user }),
          refresh_token: generateRefreshToken({
            name: user.full_name,
            ...user,
          }),
        },
      };
      delete user.password;
      console.log("USER>>>>>", user._doc);
      res.status(httpStatus.OK).send(user);
    }
  );
};

const projectsList = (req, res) => {
  console.log(req.user);
  projectService
    .list({ user_id: req.user?._id })
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((err) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
    });
};

const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  modify({ _id: req.user._id }, req.body)
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch(() => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Something went wrong change password time" });
    });
};

const resetPassword = (req, res) => {
  const new_password =
    uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
  modify({ email: req.body.email }, passwordToHash(new_password))
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(httpStatus.NOT_FOUND).send({ error: "User not found!" });
      }

      eventEmitter.emit("send_email", {
        to: updatedUser.email,
        subject: "Reset Password",
        html: `Reset Password operation successfull <br/>
        After logging in, Don't forget to change your password  <br/>
        Your new password: <b>${new_password}</b>
        `,
      });

      res.status(httpStatus.OK).send({
        message: "Email sent successfully for reset password operation",
      });
    })
    .catch((err) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Reset password error" });
    });
};

const deleteUser = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: "Id required!" });
  }
  remove(req.params?.id)
    .then((response) => {
      if (!response) {
        return res.status(httpStatus.NOT_FOUND).send({
          message: "Not found this user",
        });
      }
      res.status(httpStatus.OK).send(response);
    })
    .catch((err) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Something went wrong deleted user time" });
    });
};

module.exports = {
  create,
  index,
  login,
  projectsList,
  resetPassword,
  changePassword,
  deleteUser,
  verifyRefreshToken,
};
