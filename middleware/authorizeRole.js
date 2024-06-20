import createError from "http-errors";

// This is a common pattern in Express middleware
// A function that returns another function
// Also known as a higher order function

// Call the function like authorizeRole("admin")
function authorizeRole(authorizedRole) {
  // The inner function is our actual middleware
  // It has access to the "authorizeRole" argument
  return function(req, res, next) {
    // req.user is the user document we found in the "authentication" middleware
    // If the user is not an admin, send an error to the error handling middleware
    // Only go to the next middleware if the user is an admin
    if (req.user.role !== authorizedRole) {
      return next(createError(403, "User is not authorized to perform this action"));
    }

    // Go to next middleware
    next();
  }
}

export default authorizeRole;