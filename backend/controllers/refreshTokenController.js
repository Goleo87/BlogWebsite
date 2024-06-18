import jwt from "jsonwebtoken";

export function refreshTokens(req, res, next) {
  // If the user has included a valid refresh token in their request
  // Generate a new access token and a new refresh token, and send back in the response

  const accessToken = jwt.sign({ id: req.user.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id: req.user.id }, process.env.SECRET_KEY, { expiresIn: "1d" });

  res.json({
    accessToken,
    refreshToken
  })
}