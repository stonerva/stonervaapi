import mongoose from 'mongoose'
import validator from 'validator'

const userSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        trim: true
    },
    lname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        // unique: true,
        default:""
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10 digit phone number!`
        }
    },
    address: {
        type: Array,
        default: [],
    },
    likes: {
        type: Array,
        default: [],
    },
    otp: {
        type: Number,
        default: null
    },
    verified: {
        type: Boolean,
        default: false
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

export default mongoose.model('users', userSchema);