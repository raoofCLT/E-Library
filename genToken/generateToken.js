import jwt from "jsonwebtoken";

const generateToken = (userId,res) => {
    const token = jwt.sign({ userId}, process.env.JWT_SECRET, {
        expiresIn: "10s",
      });
      res.cookie('token', token, {
        maxAge: 10 * 1000,
        httpOnly: true,
        sameSite: 'Strict',
    });
      return token
}

export default generateToken