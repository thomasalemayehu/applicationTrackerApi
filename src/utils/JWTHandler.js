const jwt = require("jsonwebtoken");
const SECRET = process.env.TOKEN;
class JWTHandler {
  static generate(data) {
    return jwt.sign(data, SECRET);
  }
  static validate(token) {
    const decoded = jwt.verify(token, SECRET);
    return decoded.id;
  }
  static getData(jwt) {}
}

module.exports = JWTHandler;
