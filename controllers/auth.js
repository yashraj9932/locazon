const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const geocoder = require("../utils/geocoder");
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

//@desc   Create New User
//@route  POST /auth/register
//@Acess  Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, phone, password } = req.body;

  const findIfExists = await User.findOne({ phone });
  if (findIfExists) {
    return next(new ErrorResponse("Phone number already Registered!", 401));
  }
  //Create User
  const user = await User.create({
    name,
    phone,
    password,
  });
  sendTokenResponse(user, 200, res);
});

//@desc   Get current Logged in User
//@route  GET /auth/me
//@Acess Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user details
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
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// exports.forgotPassword = asyncHandler(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return next(new ErrorResponse("There is no user with that email", 404));
//   }

//   // Get reset token
//   const resetToken = user.getResetPasswordToken();

//   await user.save({ validateBeforeSave: false });

//   // Create reset url
//   const resetUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/auth/resetpassword/${resetToken}`;

//   const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Password reset token",
//       message,
//     });

//     res.status(200).json({ success: true, data: "Email sent" });
//   } catch (err) {
//     console.log(err);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

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

//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new ErrorResponse("Invalid token", 400));
//   }

//   // Set new password
//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();

//   sendTokenResponse(user, 200, res);
// });

//@desc   Login User
//@route  POST /auth/loginpass
//@Acess Public

exports.loginPassword = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return next(
      new ErrorResponse("Please provide phone number and password", 404)
    );
  }

  //Check for user
  const user = await User.findOne({ phone }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  //Check is password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

//@desc   Login User
//@route  POST /auth/loginOtp
//@Acess Public
exports.loginOtp = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;

  if (!phone) {
    return next(new ErrorResponse("Phone Number not Entered", 404));
  }

  //Check for user
  const user = await User.findOne({ phone });

  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  sendAuthMessage(user.name, phone, 200, res);

  res.status(200).json({ success: true, message: "Otp has been sent" });
});

exports.confirmOtp = asyncHandler(async (req, res, next) => {
  const { phone } = req.params;
  const { otp } = req.body;

  const user = await User.findOne({ phone });
  const otpdb = user.otp;

  await User.findOneAndUpdate(
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
  sendTokenResponse(user, 200, res);
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
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { location, coordinates },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: user });
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
  // console.log(
  //   `Hey, ${name}. Your one time authentication password is ${number}`
  // );
  twilio.messages.create(
    {
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.CELL_PHONE_NUMBER,
      body: `Hey, ${name}. Your one time authentication password is ${number}`,
    },
    function (err, message) {
      if (err) {
        console.error(message);
      }
    }
  );

  const fieldsToUpdate = {
    otp: number,
  };

  const user = await User.findOneAndUpdate({ phone }, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  setTimeout(async () => {
    const user = await User.findOneAndUpdate(
      { phone },
      { otp: null },
      {
        new: true,
        runValidators: true,
      }
    );
  }, 1000 * 60 * 5);
};

const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

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
