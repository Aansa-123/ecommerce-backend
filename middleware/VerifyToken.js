import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { sanitizeUser } from '../utils/SanitizeUser.js';

export const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Token missing, please login again" });
    }

    const decodedInfo = jwt.verify(token, process.env.SECRET_KEY);

    if (decodedInfo?._id && decodedInfo?.email) {
      // Optional: sanitize user before attaching to req
      req.user = sanitizeUser ? sanitizeUser(decodedInfo) : decodedInfo;
      return next();
    }

    return res.status(401).json({ message: "Invalid Token, please login again" });

  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired, please login again" });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid Token, please login again" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
