import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({

    catId: {
        type: String,
        required: true
    },
    cat_name: {
        type: String,
        trim: true
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

export default mongoose.model('category', categorySchema);