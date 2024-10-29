import jwt from 'jsonwebtoken';

const JWT_SECRET = "secret";

const auth = (req, res, next) => {
  console.log('p2')
  const authHeader = req.headers["authorization"];
  console.log('p3')
  console.log(authHeader)
  console.log('p33')
  if (!authHeader) {
    return res.status(403).json({ msg: "Missing auth header" });
  }
  console.log('p4')
  const decoded = jwt.verify(authHeader, JWT_SECRET);
  console.log('p5')
  if (decoded ) {
    console.log('p6')
    req.USER_DETAILS=decoded.existingUser;
    next();
  } else {
    console.log('p7')
    return res.status(403).json({ msg: "Incorrect token keerthan" });
  }
};

export default auth;