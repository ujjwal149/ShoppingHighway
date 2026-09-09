import jwt from "jsonwebtoken";

interface AuthTokenPayload {
  customerId: number;
}

const getJwtSecret = () => {
  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET_NOT_CONFIGURED",
    );
  }

  return secret;
};

export const createAuthToken = (
  customerId: number,
) => {
  return jwt.sign(
    {
      customerId,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    },
  );
};

export const verifyAuthToken = (
  token: string,
): AuthTokenPayload => {
  const decoded =
    jwt.verify(
      token,
      getJwtSecret(),
    );

  if (
    typeof decoded === "string" ||
    typeof decoded.customerId !==
      "number"
  ) {
    throw new Error(
      "INVALID_AUTH_TOKEN",
    );
  }

  return {
    customerId:
      decoded.customerId,
  };
};