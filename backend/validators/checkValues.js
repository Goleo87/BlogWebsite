import createError from "http-errors";

function checkValues(props) {
  return function (req, res, next) {
    props.forEach((field) => {
      // E.g. for "username"
      // If req.body.username doesn't exist/is falsy
      // We can't use that data - pass an error onto the error handling middleware
      // In this case, the HTTP request does not go on to the controller function
      if (!req.body[field]) {
        return next(
          createError(
            400,
            `${field.slice(0, 1).toUpperCase() + field.slice(1)} is required`
          )
        );
      }
    });
    // Pass control to the controller function
    next();
  };
}

export default checkValues;
