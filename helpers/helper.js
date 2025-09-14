import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import User from '../models/userSchema/userModel.js'
import Category from '../models/userSchema/categoryModel.js'
dotenv.config()

const generateToken = (id) => {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const generateId = async (ids) => {
    let existingIds = [];
    let lastId;
    let idPrefix;
    let idLength = 8;

    if (ids === "STVU") {
        idPrefix = "STVU";
        lastId = await User.findOne().sort({ _id: -1 });
        existingIds.push(lastId && lastId.userId ? lastId.userId : "");
    } if (ids === "STVCAT") {
        idPrefix = "STVCAT";
        lastId = await Category.findOne().sort({ _id: -1 });
        existingIds.push(lastId && lastId.catId ? lastId.catId : "");
    }


    const maxNumericPart = existingIds.reduce((max, id) => {
        if (!id || !id.startsWith(idPrefix)) return max; // Check if id is undefined or doesn't start with idPrefix

        const numericPart = parseInt(id.substring(idPrefix.length), 10);
        return numericPart > max ? numericPart : max;
    }, 0);

    const nextCount = maxNumericPart + 1;
    const paddedCount = String(nextCount).padStart(idLength - (idPrefix ? idPrefix.length : 0), "0");
    const nextId = idPrefix + paddedCount;


    return nextId;
};

const authMiddleware = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const result = await User.findOne({ userId: decoded.userId }).select("-otp");
            req.user = result
            next();
        } catch (err) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });
};

export {
    generateToken,
    generateId,
    authMiddleware
}