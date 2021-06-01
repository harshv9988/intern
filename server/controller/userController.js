const User = require("../models/User");
const sendTokenUser = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = "";
const client = new OAuth2Client(CLIENT_ID);

module.exports.googleSignup = async (req, res) => {
  try {
    let body = req.body;
    const token = body.token;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const { given_name, family_name, email, picture } = ticket.getPayload();
    let user = await User.findOne({ email: email });
    if (user) {
      await sendTokenUser(user, 200, res);
    } else {
      const username = given_name + family_name;
      user = await User.create({
        email,
        firstname: given_name,
        lastname: family_name,
        username,
        verified: true,
        password: token,
      });
      user.avatar.url = picture;
      await user.save();
      await sendTokenUser(user, 200, res);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Internal server error",
    });
  }
};

module.exports.signupEmail = async (req, res) => {
  try {
    const user1 = await User.findOne({ email: req.body.email });
    const user2 = await User.findOne({ username: req.body.username });
    if (user2) {
      return res.status(400).json({
        error: "user already exist with this username",
        success: false,
      });
    }
    if (user1) {
      return res.status(400).json({
        error: "user already exist with this email",
        success: false,
      });
    }

    const newUser = await User.create(req.body);
    const resetToken = newUser._id;
    const resetUrl = `http://localhost:3000/password/reset/${resetToken}`;
    const message = `Your password verification token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
    await sendEmail({
      email: newUser.email,
      subject: "verification",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${newUser.email}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Internal server error",
    });
  }
};

module.exports.verify = async (req, res) => {
  try {
    const user = await User.findById(req.query.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    user.verified = true;
    await user.save();
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Internal server error",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user.verified) {
      return res.status(400).json({
        error: "Email not verified",
        success: false,
      });
    }

    if (!user) {
      return res.status(400).json({
        error: "user already exist with this email",
        success: false,
      });
    }

    if (user.password === req.body.password) {
      await sendTokenUser(user, 200, res);
    } else {
      return res.status(404).json({
        message: "wrong password entered",
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Internal server error",
    });
  }
};

module.exports.getDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Internal server error",
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.cookie("intern", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    return res.status(200).json({
      message: "signout success",
    });
  } catch (error) {
    console.log(error);
    return;
  }
};