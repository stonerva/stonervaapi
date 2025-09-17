import mongoose from 'mongoose'
import validator from 'validator'

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required:true
    },
    description: {
        type: String,
        default:""
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        default:1
    },
    totalprice:{
        type:Number,
        required:true
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

export default mongoose.model('cart', cartSchema);