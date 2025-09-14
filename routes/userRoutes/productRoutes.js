import express from 'express';
import { addCategory, getAllCategory, updateCategory } from '../../controllers/user-apis/productController.js';
const router = express.Router();


router.post("/addcat", addCategory);
router.get("/getcat", getAllCategory);
router.put("/updatecat", updateCategory);

export default router;