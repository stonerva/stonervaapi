import { generateId, generateToken } from '../../helpers/helper.js';
import { sendSms } from '../../helpers/smsService.js';
import User from '../../models/userSchema/userModel.js'

const singup = async (req, res) => {
    const { phone } = req.body;
    try {
        if (!phone) return res.status(400).json({ message: "Phone required" });
        let user = await User.findOne({ phone });
        const otp = Math.floor(100000 + Math.random() * 900000);
        if (!user) {
            const userId = await generateId('STVU')
            user = new User({
                userId: userId,
                fname: "New", lname: "User",
                email: ``,
                phone, otp
            });
            await user.save();
        } else {
            user.otp = otp;
            await user.save();
        }

        const result = await sendSms(otp, phone);
        return res.status(200).send({
            message: "Otp send successfully",
            success: true,
            sid: result.sid
        })

    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
            success: false,
            error:error.stack
        })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        const user = await User.findOne({ phone });
        if (!user) return res.status(400).send({ message: "User not found", success: false });

        if (user.otp !== parseInt(otp)) {
            return res.status(400).send({ message: "Invalid OTP", success: false });
        }
        user.otp = null;
        user.verified = true;
        await user.save();

        const token = generateToken(user.userId);

        return res.status(200).send({
            message: "Login successful",
            token,
            user: { userId: user.userId, phone: user.phone, fname: user.fname, lname: user.lname, verified: user.verified }
        });

    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal server error" });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({userId:req.user.userId}).select("-otp");
        return res.status(200).send({user:user,success:true,message:"Get user details"});
    } catch (err) {
        return res.status(500).send({ success: false, message: "Internal server error",error:err.stack });

    }
}

export { singup ,verifyOtp , getProfile}