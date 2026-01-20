import jwt from "jsonwebtoken";

export interface userPayload {
  userId: string;
  email?: string;
}

function generateAccessToken(payload: userPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
}

function generateRefreshToken(payload: userPayload) {
  return jwt.sign(payload, process.env.REFRESH_JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string) as userPayload;
}

function verifyRefreshToken(token: string) {
  return jwt.verify(
    token,
    process.env.REFRESH_JWT_SECRET as string
  ) as userPayload;
}

// Helper function to generate both tokens
export const generateAccessAndRefreshToken = (payload: userPayload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
