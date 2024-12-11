import { HydratedDocument, Types } from "mongoose";
import { User } from "@models";
import { ErrorResponse, setDefaultProjectForUser } from "@utilities";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { createHash, randomBytes } from "crypto";
import { IUser } from "@commons/types";

const { JWT_SECRET, JWT_EXPIRE, BASE_FRONTEND_URL } = process.env;

export const registerUser = async (
  name: string,
  password: string,
  email: string
) => {
  if (password.length < 3) {
    throw new Error("invalid password");
  }
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  const user = new User({ name, passwordHash, email });
  await user.save();
  const payload = {
    user: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  return { user: user._id, token };
};

export const loginUser = async (name: string, password: string) => {
  const user = await User.findOne({ name: name }).select("+passwordHash");
  if (!user) throw new Error("Invalid credentials");
  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordCorrect) throw new Error("Invalid Credentials");
  if (!user.currentProject?._id) await setDefaultProjectForUser(user);
  const payload = {
    user: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  return {
    user: user._id,
    token,
  };
};

export const resetUserPassword = async (resetToken, password) => {
  const resetTokenHash = createHash("sha256").update(resetToken).digest("hex");
  const user = await findOneWithResetToken(resetTokenHash);
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  await updatePassword(user, passwordHash);
};

export const userForgotPassword = async (email) => {
  const user = await findOneWithEmail({ email });
  try {
    const resetToken = await setResetToken(user);
    await sendResetTokenEmail(user.email, resetToken);
  } catch (error) {
    await unsetResetToken(user);
    console.log(error);
    throw new ErrorResponse("Email could not be sent", 500);
  }
};

const sendResetTokenEmail = async (email, token) => {
  const resetUrl = `${BASE_FRONTEND_URL}/passwordreset/${token}`;
  const message = `
      <h1>You requested to reset your password</h1>
      <p>Please make a PUT request to the following link: </p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;

  await sendEmail({
    to: email,
    subject: "Reset Password",
    text: message,
  });
};

async function unsetResetToken(receivedUser) {
  const user = receivedUser; // So it doesn't reassign the parameter value.
  user.resetTokenHash = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateModifiedOnly: true });
}

async function findOneWithResetToken(resetTokenHash) {
  const user = await User.findOne({
    resetTokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) throw new ErrorResponse("Invalid Token", 400);
  return user;
}

async function setResetToken(receivedUser: HydratedDocument<IUser>) {
  const user = receivedUser; // So it doesn't reassign the parameter value.
  const resetToken = randomBytes(20).toString("hex");
  user.resetTokenHash = createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordExpire = (Date.now() + 10 * (60 * 1000)).toString();
  await user.save({ validateModifiedOnly: true });
  return resetToken;
}

const findOneWithEmail = async ({ email }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Credenciales incorrectas");
    return user;
  } catch (error) {
    console.log("The error is here", email);
    throw error;
  }
};

async function updatePassword(receivedUser, passwordHash) {
  const user = receivedUser;
  user.passwordHash = passwordHash;
  await user.save({ validateModifiedOnly: true });
}
