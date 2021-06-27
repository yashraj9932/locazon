const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Seller = require("../models/Seller");
const geocoder = require("../utils/geocoder");
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

//@desc   Create New Seller
//@route  POST /auth/register
//@Acess  Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, phone, password } = req.body;

  const findIfExists = await Seller.findOne({ phone });
  if (findIfExists) {
    return next(new ErrorResponse("Phone number already Registered!", 401));
  }
  //Create seller
  const seller = await Seller.create({
    name,
    phone,
    password,
  });
  sendTokenResponse(seller, 200, res);
});

//@desc   Get current Logged in seller
//@route  POST /auth/me
//@Acess Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const seller = await Seller.findById(req.seller.id);

  res.status(200).json({
    success: true,
    data: seller,
  });
});

// @desc      Update seller details
// @route     PUT /auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body;
  let fieldsToUpdate = {};
  if (name) {
    fieldsToUpdate.name = name;
  }
  if (email) {
    fieldsToUpdate.email = email;
  }
  if (phone) {
    fieldsToUpdate.phone = phone;
  }
  const seller = await Seller.findByIdAndUpdate(req.seller.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: seller,
  });
});

// // @desc      Update password
// // @route     PUT /api/v1/auth/updatepassword
// // @access    Private
// exports.updatePassword = asyncHandler(async (req, res, next) => {
//   const seller = await Seller.findById(req.seller.id).select("+password");

//   // Check current password
//   if (!(await seller.matchPassword(req.body.currentPassword))) {
//     return next(new ErrorResponse("Password is incorrect", 401));
//   }

//   seller.password = req.body.newPassword;
//   await seller.save();

//   sendTokenResponse(seller, 200, res);
// });

// // @desc      Log seller out / clear cookie
// // @route     GET /api/v1/auth/logout
// // @access    Public
// exports.logout = asyncHandler(async (req, res, next) => {
//   res.cookie("token", "none", {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });

//   res.status(200).json({
//     success: true,
//     data: {},
//   });
// });
// //@desc   Change Forgotten Password
// //@route  POST /api/v1/auth/forgotpassword
// //@Acess Public

// exports.forgotPassword = asyncHandler(async (req, res, next) => {
//   const seller = await Seller.findOne({ email: req.body.email });

//   if (!seller) {
//     return next(new ErrorResponse("There is no seller with that email", 404));
//   }

//   // Get reset token
//   const resetToken = seller.getResetPasswordToken();

//   await seller.save({ validateBeforeSave: false });

//   // Create reset url
//   const resetUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/auth/resetpassword/${resetToken}`;

//   const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

//   try {
//     await sendEmail({
//       email: seller.email,
//       subject: "Password reset token",
//       message,
//     });

//     res.status(200).json({ success: true, data: "Email sent" });
//   } catch (err) {
//     console.log(err);
//     seller.resetPasswordToken = undefined;
//     seller.resetPasswordExpire = undefined;

//     await seller.save({ validateBeforeSave: false });

//     return next(new ErrorResponse("Email could not be sent", 500));
//   }
// });

// // @desc      Reset password
// // @route     PUT /auth/resetpassword/:resettoken
// // @access    Public
// exports.resetPassword = asyncHandler(async (req, res, next) => {
//   // Get hashed token
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.resettoken)
//     .digest("hex");

//   const seller = await seller.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!seller) {
//     return next(new ErrorResponse("Invalid token", 400));
//   }

//   // Set new password
//   seller.password = req.body.password;
//   seller.resetPasswordToken = undefined;
//   seller.resetPasswordExpire = undefined;
//   await seller.save();

//   sendTokenResponse(seller, 200, res);
// });

//@desc   Login seller
//@route  POST /auth/loginpass
//@Acess Public

exports.loginPassword = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return next(
      new ErrorResponse("Please provide phone number and password", 404)
    );
  }

  //Check for seller
  const seller = await Seller.findOne({ phone }).select("+password");

  if (!seller) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  //Check is password matches
  const isMatch = await seller.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  sendTokenResponse(seller, 200, res);
});

//@desc   Login seller
//@route  POST /auth/loginOtp
//@Acess Public
exports.loginOtp = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return next(new ErrorResponse("Phone Number not Entered", 404));
  }

  //Check for seller
  const seller = await Seller.findOne({ phone });

  if (!seller) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  sendAuthMessage(seller.name, phone, 200, res);

  res.status(200).json({ success: true, message: "Otp has been sent" });
});

exports.confirmOtp = asyncHandler(async (req, res, next) => {
  const { phone } = req.params;
  const { otp } = req.body;

  const seller = await Seller.findOne({ phone });
  const otpdb = seller.otp;

  await Seller.findOneAndUpdate(
    { phone },
    { otp: null },
    {
      new: true,
      runValidators: true,
    }
  );

  if (otpdb !== otp) {
    return next(new ErrorResponse("Incorrect OTP", "401"));
  }
  sendTokenResponse(seller, 200, res);
});

exports.updateLocation = asyncHandler(async (req, res, next) => {
  const coordinates = req.body.coordinates;
  const loc = await geocoder.reverse({
    lat: coordinates[0],
    lon: coordinates[1],
  });
  const location = {
    type: "Point",
    formattedAddress: loc[0].formattedAddress,
    coordinates: [coordinates[1], coordinates[0]],
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
  const seller = await Seller.findByIdAndUpdate(
    req.seller.id,
    { location },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: seller });
});

exports.getSellersInDistance = asyncHandler(async (req, res, next) => {
  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = req.params.distance / 3963;
  const lat = req.user.coordinates[0];
  const lng = req.user.coordinates[1];

  // console.log(lat, lng);

  const sellers = await Seller.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: sellers.length,
    data: sellers,
  });
});

//function to create an otp and store it into the database with a validity of 5 mins
const sendAuthMessage = async (name, phone, statusCode, res) => {
  var otpLength = 6;
  let baseNumber = Math.pow(10, otpLength - 1);
  let number = Math.floor(Math.random() * baseNumber);
  /*
    Check if number have 0 as first digit
    */
  if (number < baseNumber) {
    number += baseNumber;
  }
  // console.log(twilio.messages);
  console.log(
    `Hey, ${name}. Your one time authentication password is ${number}`
  );
  // twilio.messages.create(
  //   {
  //     from: process.env.TWILIO_PHONE_NUMBER,
  //     to: process.env.CELL_PHONE_NUMBER,
  //     body: `Hey, ${name}. Your one time authentication password is ${number}`,
  //   },
  //   function (err, message) {
  //     if (err) {
  //       console.error(message);
  //     }
  //   }
  // );

  const fieldsToUpdate = {
    otp: number,
  };

  const seller = await Seller.findOneAndUpdate({ phone }, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  setTimeout(async () => {
    const seller = await Seller.findOneAndUpdate(
      { phone },
      { otp: null },
      {
        new: true,
        runValidators: true,
      }
    );
  }, 1000 * 60 * 5);
};

const sendTokenResponse = (seller, statusCode, res) => {
  //Create token
  const token = seller.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
