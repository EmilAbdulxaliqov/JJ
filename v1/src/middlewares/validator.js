const httpStatus = require("http-status");

const validator = (schema) => (req, res, next) => {
  const { val, error } = schema.validate(req.body);
  if (error) {
    const errMessage = error?.details.map((el) => el.message).join(", ");
    res.status(httpStatus.BAD_REQUEST).send(errMessage);
    return;
  }
  return next();
};

module.exports = validator;
