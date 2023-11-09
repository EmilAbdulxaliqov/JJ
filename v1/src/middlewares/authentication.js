const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/hash");

const authenticateToken = (req, res, next) => {
  const access_token = req.headers?.authorization?.split(" ")[1] || null;
  const refresh_token = req.cookies?.["refreshToken"] || null;
  if (access_token === null && refresh_token === null) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ error: "You don't have permission for this!" });
  }
  jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) {
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
              access_token: generateAccessToken({
                name: user.full_name,
                ...user,
              }),
              refresh_token: generateRefreshToken({
                name: user.full_name,
                ...user,
              }),
            },
          };
          delete user.password;
          res
            .cookie("refreshToken", user.token.refresh_token, {
              httpOnly: true,
              sameSite: "strict",
            })
            .send(user);
        }
      );
    }
    req.user = user?._doc;
    next();
  });
};

module.exports = authenticateToken;
