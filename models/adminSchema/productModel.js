import mongoose from 'mongoose'

const productsSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    adminId:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "",
    },
    selling_price: {
        type: Number,
        required:true
    },
    buy_price:{
        type:Number,
        require:true
    },
    profit_price:{
        type:Number,
        require:true
    },
    cat_id:{
        type:String,
        required:true
    },
    thumbnail:{
        type:Object
    },
    otherimages:{
        type:Array
    },

    stock:{
        type:Number,
        required:true
    },
    active:{
        type:Number,
        default:1
    },
    created_at: {
        type: Date,
        default: () => {
            return Date.now();
        },
        immutable: true
    },
    updated_at: {
        type: Date,
        default: () => {
            return Date.now();
        }
    }
})

export default mongoose.model('products', productsSchema);