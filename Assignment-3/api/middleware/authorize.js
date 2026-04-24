// Generic authorization middleware that accepts a policy function.
// The policy function will receive (user, resource) and must return true/false.

module.exports = function authorize(policy) {
  return (req, res, next) => {
    // TODO: implement:
    // - Read req.user and req.mail (or other resource, depending on route).
    // - If policy(user, resource) === true, call next().
    // - Otherwise, create an appropriate "Forbidden" error and pass to next(err).
    const user = req.user;
    const mail = req.mail;

    if (!policy(user, mail)) {
      return next({
        statusCode: 403,
        error: "Forbidden",
        message: "Access denied",
      });
    }

    next();
  };
};