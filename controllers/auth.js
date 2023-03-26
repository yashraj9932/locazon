const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const geocoder = require("../utils/geocoder");
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const path = require("path");

var fs = require("fs");

//@desc   Create New User
//@route  POST /auth/register
//@Acess  Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, phone, password } = req.body;
  // #swagger.tags = ['Users']
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
  // #swagger.tags = ['Users']

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
  // #swagger.tags = ['Users']

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
  // #swagger.tags = ['Users']

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
  // #swagger.tags = ['Users']

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

//@desc  To Confirm Otp
//@route POST /auth/confirmOtp/user
//@Acess Public

exports.confirmOtp = asyncHandler(async (req, res, next) => {
  const { phone, otp } = req.body;
  // #swagger.tags = ['Users']

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

//@desc  To Remove Profile Picture
//@route PUT /auth/updateLocation/user
//@Acess Private

exports.updateLocation = asyncHandler(async (req, res, next) => {
  const coordinates = req.body.coordinates;
  // #swagger.tags = ['Users']

  const loc = await geocoder.reverse({
    lat: coordinates[0],
    lon: coordinates[1],
  });

  // console.log(loc);
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

//@desc  To Add Profile Picture
//@route PUT /auth/picadd
//@Acess Private
exports.profilePhotoUploadUser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  // #swagger.tags = ['Users']

  if (!user) {
    return next(new ErrorResponse(`No user found`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${user._id}${path.parse(file.name).ext}`;
  // console.log(file);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await User.findByIdAndUpdate(req.user._id, { profilepicture: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

//@desc  To Remove Profile Picture
//@route DELETE /auth/picremove
//@Acess Private

exports.profilePhotoDeleteUser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  // #swagger.tags = ['Users']

  if (!user) {
    return next(new ErrorResponse(`No user found`, 404));
  }

  const filePath = `./public/uploads/${user.profilepicture}`;
  // console.log(path.basename(filePath, path.extname(filePath)));
  fs.unlinkSync(filePath);

  const ress = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilepicture: "",
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({ success: true, user: ress });
});

//Creates an otp and stores it into the database with a validity of 5 mins
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

//To genearate the token and send it forward when successful login done
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
