import { generateId } from '../../helpers/helper.js';
import Product from '../../models/adminSchema/productModel.js'


const addProducts = async (req, res) => {

    let { name, description, selling_price, buy_price, profit_price, cat_id, thumbnail, otherimages, stock } = req.body
    const { adminId } = req.query
    console.log("adminId", adminId)
    selling_price = Number(selling_price);
    buy_price = Number(buy_price);
    profit_price = Number(buy_price);
    stock = Number(stock);
    try {
        if (!adminId) {
            return res.status(400).send({
                success: false,
                message: "Admin Id is missing"
            })
        }
        if (!name || !selling_price || !buy_price || !profit_price || !cat_id || !thumbnail || !otherimages || !stock) {
            return res.status(400).send({
                success: false,
                message: "Some mandatory fields are missing"
            })
        }

        const productId = await generateId('STVPD')
        await Product.create({
            adminId: adminId,
            productId: productId,
            name: name,
            description: description,
            selling_price: selling_price,
            buy_price: buy_price,
            profit_price: profit_price,
            cat_id: cat_id,
            thumbnail: thumbnail,
            otherimages: otherimages,
            stock: stock
        })

        return res.status(201).send({
            success: true,
            message: "Product added successfully",
            pdId: productId
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            err: error.stack
        })
    }
}

const getAllProducts = async (req, res) => {
    try {

    } catch (error) {

    }
}

const updateProduct = async (req, res) => {
    let { name, description, selling_price, buy_price, profit_price, cat_id, thumbnail, otherimages, stock } = req.body
    const { adminId, productId } = req.query
    selling_price = Number(selling_price);
    buy_price = Number(buy_price);
    profit_price = Number(buy_price);
    stock = Number(stock);
    try {
        if (!adminId) {
            return res.status(400).send({
                success: false,
                message: "Admin Id is missing"
            })
        }
        if (!productId) {
            return res.status(400).send({
                success: false,
                message: "ProductId Id is missing"
            })
        }
        if (!name || !selling_price || !buy_price || !profit_price || !cat_id || !thumbnail || !otherimages || !stock) {
            return res.status(400).send({
                success: false,
                message: "Some mandatory fields are missing"
            })
        }
        await Product.updateOne({ productId: productId }, {
            $set: {
                adminId: adminId,
                productId: productId,
                name: name,
                description: description,
                selling_price: selling_price,
                buy_price: buy_price,
                profit_price: profit_price,
                cat_id: cat_id,
                thumbnail: thumbnail,
                otherimages: otherimages,
                stock: stock
            }

        })

        return res.status(201).send({
            success: true,
            message: "Product Update successfully",
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            err: error.stack
        })
    }
}

const updateImages = async (req, res) => {
    const { productId, adminId } = req.query;

    try {
        if (!adminId) {
            return res.status(400).send({
                success: false,
                message: "Admin Id is missing"
            })
        }
        if (!productId) {
            return res.status(400).send({
                success: false,
                message: "ProductId Id is missing"
            })
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            err: error.stack
        })
    }
}

const viewProduct = async (req, res) => {
    const { productId, adminId, type } = req.query;
    let projection = {}

    try {
        if (!productId) {
            return res.staus(400).send({
                success: false,
                message: "ProductId is misiing"
            })
        }
        if (type === "User") {
            projection = {
                _id: 0,
                adminId: 0,
                buy_price: 0,
                profit_price: 0,
                active: 0,
            }
        } else {
            projection = {
                _id: 0
            }
        }

        const details = await Product.findOne({ productId: productId }, projection)

        return res.status(200).send({
            success: true,
            message: "View Product",
            data: details
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal server error",
            err: error.stack
        })
    }
}

const updateStock = async (req, res) => {
    let { productId, adminId, cat_id } = req.query;
    let stock = Number(stock)

    try {

        if (!adminId) {
            return res.status(400).send({
                success: false,
                message: "AdminId missing"
            })
        }
        if (!cat_id) {
            return res.status(400).send({
                success: false,
                message: "Category missing"
            })
        }
        if (stock < 0 || stock === 0) {
            return res.status(400).send({ sucess: false, message: "Stock must be a valid number >= 0" });
        }

        await Product.updateOne({ cat_id: cat_id, productId: productId}, {
            $set: {
                stock:stock
            }
        })
        return res.status(200).send({
            success:true,
            message:"Stock Updated"
        })


    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
            success: false,
            error: error.stack
        })
    }
}

export {
    addProducts,
    updateProduct,
    updateImages,
    viewProduct,
    updateStock
}