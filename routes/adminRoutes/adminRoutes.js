import express from "express";
import multer from "multer";
import {
  addProducts,
  updateImages,
  updateProduct,
  updateStock,
  viewProduct,
} from "../../controllers/admin-apis/admincontroller.js";
import {
  authMiddleware,
  getAdminProfile,
  loginAdminUser,
  registerAdminUser,
  resendOtpForAdmin,
  verifyOtpForAdmin,
} from "../../controllers/admin-apis/adminuser.js";
import {
  handleChunkUpload,
  handleUpdateChunkUpload,
} from "../../helpers/helper.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("chunk");

router.post("/addproduct", addProducts);
router.put("/updateImage", updateImages);
router.put("/updateproduct", updateProduct);
router.post("/upload", upload, handleChunkUpload);
router.post("/updateimage", upload, handleUpdateChunkUpload);
router.post("/viewproduct", viewProduct);
router.put("/updatestock", updateStock);

// admin login route

router.post("/loginAdmin", loginAdminUser);
router.post("/verify-otp", verifyOtpForAdmin);
router.post("/resend-otp", resendOtpForAdmin);
router.post("/registerAdmin", registerAdminUser);
router.get("/getprofile", authMiddleware, getAdminProfile);

export default router;
