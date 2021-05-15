import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1));
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
})

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error(`Product not found`);
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product) {
        product.remove();
        res.json({
            message: 'Product has been deleted'
        });
    } else {
        res.status(404);
        throw new Error(`Product not found`);
    }
})


const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
    } = req.body

    const product = new Product({
       name: name,
       price: price,
       description: description,
       user: req.user._id,
       image: image,
       brand: brand,
       category: category,
       countInStock: countInStock,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
})

const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
    } = req.body

    const product = await Product.findById(req.params.id);
    if(product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save();
        res.json(updatedProduct)
    } else {
        res.status(404);
        throw new Error(`Product not found`);
    }
})

const createProductReview = asyncHandler(async (req, res) => {
    const {
        rating,
        comment,
    } = req.body

    const product = await Product.findById(req.params.id);
    if(product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
        if(alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0 ) / product.numReviews;
        await product.save();
        res.status(201).json({ message: 'review added' });
    } else {
        res.status(404);
        throw new Error(`Product not found`);
    }
})

const getTopProduct = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.json(products);
})

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProduct
}