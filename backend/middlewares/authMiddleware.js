import jwt from "jsonwebtoken"
import userService from "../services/userService.js";

const authMiddleware = (requiredRole = undefined) => {
  return async (req, res, next) => {
    try {
      const jwt_secret = process.env.JWT_SECRET;
      const authHeader = req.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const tokenArray = authHeader.split(' ');
      const decodedToken = jwt.verify(tokenArray[1], jwt_secret);

      const user = await userService.getUserById(decodedToken.userId);
      
      if(user){
        if (requiredRole && user.role !== requiredRole){
          return res.status(403).json({
            message: "Forbidden"
          });
        }

        req['user'] = user; 
        
        next();
      } else {
        res.status(401).json({
          message: "Unauthorized: User not found"
        });
      }
    } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      res.status(401).json({
        message: "Unauthorized: Invalid token"
      })
    }
  }
}

export default authMiddleware

