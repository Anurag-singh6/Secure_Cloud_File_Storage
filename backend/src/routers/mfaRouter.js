import express from "express";
import { Protect } from "../middlewares/authmiddleware.js";
import {
  setupMFA,
  verifyMFASetup,
  disableMFA,
  verifyMFA,
  regenerateBackupCodes,
} from "../controllers/mfaController.js";

const router = express.Router();

// Setup MFA (generate secret and QR code)
router.post("/setup", Protect, setupMFA);

// Verify MFA setup (enable MFA)
router.post("/verify-setup", Protect, verifyMFASetup);

// Disable MFA
router.post("/disable", Protect, disableMFA);

// Verify MFA during login (public route)
router.post("/verify", verifyMFA);

// Regenerate backup codes
router.post("/regenerate-codes", Protect, regenerateBackupCodes);

export default router;