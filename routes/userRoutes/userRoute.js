import express from 'express';
import { getProfile, singup, updateProfile, verifyOtp } from '../../controllers/user-apis/usercontroller.js';
import { authMiddleware } from '../../helpers/helper.js';
const router = express.Router();

router.post("/login", singup);
router.post("/verify-otp", verifyOtp);
router.get("/getprofile", authMiddleware, getProfile);
router.put("/updateprofile", updateProfile);

export default router;
