import express from "express";
const router = express.Router()
import {
    createProduct, createProductReview,
    deleteProduct,
    getProductById,
    getProducts, getTopProduct,
    updateProduct
} from '../controllers/productController.js'
import {admin, protect} from "../middleware/authMiddleware.js";

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id').put(protect, admin, updateProduct).get(getProductById).delete(protect, admin, deleteProduct);

export default router