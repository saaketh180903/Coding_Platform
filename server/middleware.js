import jwt from 'jsonwebtoken';
import User from './DB/models/user_schema.js';
const JWT_SECRET = "secret";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(403).json({ msg: "Missing auth header" });
    }

    const decoded = jwt.verify(authHeader, JWT_SECRET);
    if (decoded && decoded.existingUser && decoded.existingUser._id) {
      const userId = decoded.existingUser._id;

      // Fetch the latest user data from the database
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ msg: "User not found" });

      req.USER_DETAILS = {
        _id: user._id.toString(),
        email: user.email,
        isAdmin: user.isAdmin || false,
        isProblemSetter: user.isProblemSetter || false,
      };

      next();
    } else {
      return res.status(403).json({ msg: "Invalid token" });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(400).json({ msg: "Invalid token or server error" });
  }
};

export default auth;
