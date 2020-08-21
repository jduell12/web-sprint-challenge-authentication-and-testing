module.exports = {
  isValid,
  loginValid,
};

function isValid(user) {
  return Boolean(user.username && user.password);
}

function loginValid(user) {
  return Boolean(
    user.username && user.password && typeof user.password === "string",
  );
}
