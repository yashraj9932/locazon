const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("./async");

//Protect routes
exports.protectSeller = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //To get the token from the cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    //decoding the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.seller = await Seller.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
