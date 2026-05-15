import User from "../models/User.js";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import crypto from "crypto";

export const setupMFA = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statuscode = 404;
      return next(error);
    }

    // Generate MFA secret
    const secret = speakeasy.generateSecret({
      name: `SecureZilla (${user.email})`,
      issuer: 'SecureZilla',
      length: 32
    });

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    // Store secret temporarily (will be confirmed later)
    user.mfaSecret = secret.base32;
    user.mfaBackupCodes = backupCodes;
    await user.save();

    res.status(200).json({
      message: "MFA setup initiated",
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        backupCodes: backupCodes
      }
    });
  } catch (error) {
    console.error("MFA setup error:", error);
    next(error);
  }
};

export const verifyMFASetup = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { token } = req.body;

    if (!token) {
      const error = new Error("MFA token is required");
      error.statuscode = 400;
      return next(error);
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statuscode = 404;
      return next(error);
    }

    if (!user.mfaSecret) {
      const error = new Error("MFA setup not initiated");
      error.statuscode = 400;
      return next(error);
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time windows (30 seconds each)
    });

    if (!verified) {
      const error = new Error("Invalid MFA token");
      error.statuscode = 401;
      return next(error);
    }

    // Enable MFA
    user.mfaEnabled = true;
    await user.save();

    res.status(200).json({
      message: "MFA enabled successfully",
      data: {
        mfaEnabled: true,
        backupCodes: user.mfaBackupCodes
      }
    });
  } catch (error) {
    console.error("MFA verification error:", error);
    next(error);
  }
};

export const disableMFA = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { token } = req.body;

    if (!token) {
      const error = new Error("MFA token is required to disable MFA");
      error.statuscode = 400;
      return next(error);
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statuscode = 404;
      return next(error);
    }

    if (!user.mfaEnabled) {
      const error = new Error("MFA is not enabled");
      error.statuscode = 400;
      return next(error);
    }

    // Verify the token before disabling
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      const error = new Error("Invalid MFA token");
      error.statuscode = 401;
      return next(error);
    }

    // Disable MFA
    user.mfaEnabled = false;
    user.mfaSecret = null;
    user.mfaBackupCodes = [];
    await user.save();

    res.status(200).json({
      message: "MFA disabled successfully",
      data: {
        mfaEnabled: false
      }
    });
  } catch (error) {
    console.error("MFA disable error:", error);
    next(error);
  }
};

export const verifyMFA = async (req, res, next) => {
  try {
    const { email, token, backupCode } = req.body;

    if (!email || (!token && !backupCode)) {
      const error = new Error("Email and MFA token or backup code are required");
      error.statuscode = 400;
      return next(error);
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statuscode = 404;
      return next(error);
    }

    if (!user.mfaEnabled) {
      const error = new Error("MFA is not enabled for this user");
      error.statuscode = 400;
      return next(error);
    }

    let verified = false;

    if (token) {
      // Verify TOTP token
      verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 2
      });
    } else if (backupCode) {
      // Verify backup code
      const codeIndex = user.mfaBackupCodes.indexOf(backupCode);
      if (codeIndex !== -1) {
        verified = true;
        // Remove used backup code
        user.mfaBackupCodes.splice(codeIndex, 1);
        await user.save();
      }
    }

    if (!verified) {
      const error = new Error("Invalid MFA token or backup code");
      error.statuscode = 401;
      return next(error);
    }

    // Generate JWT token
    const { genToken } = await import("../utils/authToken.js");
    genToken(user, res);

    res.status(200).json({
      message: "MFA verification successful",
      data: user
    });
  } catch (error) {
    console.error("MFA verification error:", error);
    next(error);
  }
};

export const regenerateBackupCodes = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statuscode = 404;
      return next(error);
    }

    if (!user.mfaEnabled) {
      const error = new Error("MFA must be enabled to regenerate backup codes");
      error.statuscode = 400;
      return next(error);
    }

    // Generate new backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }

    user.mfaBackupCodes = backupCodes;
    await user.save();

    res.status(200).json({
      message: "Backup codes regenerated successfully",
      data: {
        backupCodes: backupCodes
      }
    });
  } catch (error) {
    console.error("Regenerate backup codes error:", error);
    next(error);
  }
};