const User = require("../models/user");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utilities/catchAsync");
const sendEmail = require("../utilities/email");
const appErrors = require("../utilities/appErrors");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const filterObj = (obj, ...allowFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) {
      newObject[el] = obj[el];
    }
  });
  return newObject;
};

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    pic: req.body.pic,
  });

  const token = signToken(newUser._id);

  res.status(200).json({
    status: "success!",
    token,
    user: newUser,
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appErrors("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appErrors("Incorrect data", 401));
  }

  const token = signToken(user._id);
  const { _id, username, pic, score } = user;
  res.status(200).json({
    status: "success!",
    token,
    user: {
      _id,
      username,
      email,
      pic,
      score,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new appErrors("You're not logged in!", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return next(new appErrors("You're not authorized!", 401));
    }

    const { id, iat } = payload;

    const freshUser = await User.findById(id);
    if (!freshUser) {
      return next("Token doesn't exists", 401);
    }

    if (freshUser.changePasswordAfter(iat)) {
      return next(new appErrors("User recently changed password!", 401));
    }

    User.findById(id).then((userData) => {
      req.username = userData;
      next();
    });
  });
});

exports.updatePicture = (req, res) => {
  User.findByIdAndUpdate(
    req.username._id,
    {
      $set: { pic: req.body.pic },
    },
    { new: true },
    (err, result) => {
      if (err) {
        res.status(422).json({ error: "Something gone wrong!!!" });
      }
      res.json(result);
    }
  );
};
exports.updateScore = (req, res) => {
  User.findByIdAndUpdate(
    req.username._id,
    {
      $set: { score: req.body.score },
    },
    { new: true },
    (err, result) => {
      if (err) {
        res.status(422).json({ error: "Something gone wrong!!!" });
      }
      res.json(result);
    }
  );
};

exports.updatePasswordLoggedIn = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.username._id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new appErrors("You're not this user!", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: "success!",
    token,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new appErrors("This route is not for passwords", 400));
  }
  const filteredBody = filterObj(req.body, "username", "email");

  const updatedUser = await User.findByIdAndUpdate(
    req.username._id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success!",
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.username._id);

  res.status(204).json({
    status: "success!",
    data: null,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new appErrors("There is no user with that email address", 404));
  }

  // 2) Generate the random tokens
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send back to user's email

  const message = `<h2>Hello,</h2>
  <p>We've received a request to reset the password for your MapU account associated with ${email}. No changes have been made to your account yet. You can reset your password by clicking <a href="https://mapu-app.herokuapp.com/resetpassword/${resetToken}">this link</a>. If you haven't forget your password please ignore this email!</p><footer>--The MapU team</footer>`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password for MapU - Valid for 10m",
      message,
    });

    res.status(200).json({
      status: "success!",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new appErrors("There was an error sending the email", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new appErrors("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: "success!",
    token,
  });
});
