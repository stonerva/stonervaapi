import express from 'express';
import multer from 'multer'
import { addProducts, updateImages, updateProduct, updateStock, viewProduct } from '../../controllers/admin-apis/admincontroller.js';
import { handleChunkUpload, handleUpdateChunkUpload } from '../../helpers/helper.js';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('chunk');


router.post("/addproduct", addProducts);
router.put("/updateImage", updateImages);
router.put("/updateproduct", updateProduct);
router.post('/upload',upload,handleChunkUpload)
router.post('/updateimage',upload,handleUpdateChunkUpload)
router.post('/viewproduct',viewProduct)
router.put('/updatestock',updateStock)

export default router;