
import { generateId } from '../../helpers/helper.js';
import Category from '../../models/userSchema/categoryModel.js'


const addCategory = async (req, res) => {

    const { cat_name } = req.body;
    try {
        if (!cat_name) {
            return res.status(500).send({
                message: "Category name is missing",
                success: false
            })
        }
        const cat_id = await generateId('STVCAT')
        const result = await Category.create({
            catId: cat_id,
            cat_name: cat_name
        })
        return res.status(201).send({
            success: true,
            message: "Category added",
            cat_id: cat_id
        })

    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
            success: false,
            error: error.stack
        })
    }

}

const getAllCategory = async (req, res) => {
    try {
        const result = await Category.find({}, { _id:0 ,created_at:0,updated_at:0});
        if (result.length === 0) {
            return res.status(400).send({
                message: "Category not found",
                success: false,
            })
        }

        return res.status(200).send({
            success: true,
            message: "Get all categories",
            data: result
        })

    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
            success: false,
            error: error.stack
        })
    }
}

const updateCategory = async (req, res) => {
    let { cat_id, active, type } = req.query
    type = Number(type)
    try {
        if (!cat_id) {
            return res.status(500).send({
                message: "CategoryId missing",
                success: false
            })
        }
        if (type === 1) {
            const update = await Category.updateOne({ catId: cat_id }, {
                $set: {
                    active: Number(active)
                }
            })
        } else {
            const { cat_name } = req.body
            const update = await Category.updateOne({ catId: cat_id }, {
                $set: {
                    cat_name: cat_name
                }
            })
        }
        return res.status(200).send({
            success: true,
            message: "Category Updated",
            cat_id: cat_id
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
    addCategory,
    getAllCategory,
    updateCategory
}