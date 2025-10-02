import { generateId, generateToken } from "../../helpers/helper.js";
import { sendSms } from "../../helpers/smsService.js";
import User from "../../models/userSchema/userModel.js";
import Cart from "../../models/userSchema/CartModel.js";

const singup = async (req, res) => {
  const { phone } = req.body;
  try {
    if (!phone) return res.status(400).json({ message: "Phone required" });
    let user = await User.findOne({ phone });
    const otp = Math.floor(100000 + Math.random() * 900000);
    if (!user) {
      const userId = await generateId("STVU");
      user = new User({
        userId: userId,
        fname: "New",
        lname: "User",
        email: ``,
        phone,
        otp,
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
      sid: result.sid,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      success: false,
      error: error.stack,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user)
      return res
        .status(400)
        .send({ message: "User not found", success: false });

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
      user: {
        userId: user.userId,
        phone: user.phone,
        fname: user.fname,
        lname: user.lname,
        verified: user.verified,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select("-otp");
    return res
      .status(200)
      .send({ user: user, success: true, message: "Get user details" });
  } catch (err) {
    return res
      .status(500)
      .send({
        success: false,
        message: "Internal server error",
        error: err.stack,
      });
  }
};

const addCart = async (req, res) => {
  const { userId, productId } = req.query;
  const { name, descriprion, price, quantity } = req.body;
  try {
    if (!userId) {
      return res.status(400).send({
        succes: false,
        message: "UserId is missing",
      });
    }
    if (!productId) {
      return res.status(400).send({
        succes: false,
        message: "UserId is missing",
      });
    }
    if (!name || !price) {
      return res.status(400).send({
        succes: false,
        message: "Either Name or Price is missing ",
      });
    }
    const checkPresentInCart = await Cart.findOne({
      userId: userId,
      productId: productId,
    });
    if (checkPresentInCart) {
      return res.status(400).send({
        success: false,
        message: "Product already in cart",
      });
    }

    await Cart.create({
      productId: productId,
      userId: userId,
      name: name,
      description: descriprion,
      price: Number(price),
      quantity: Number(quantity),
      totalprice: Number(quantity) * Number(price),
    });
    return res.status(201).send({
      success: true,
      message: "Product added in cart",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      success: false,
      error: error.stack,
    });
  }
};

const getAllCartItems = async (req, res) => {
  let { userId, limit, offset } = req.query;
  let response = [];
  try {
    if (!userId) {
      return res.status(400).send({
        succes: false,
        message: "UserId is missing",
      });
    }
    const result = await Cart.aggregate([
      {
        $match: {
          userId: { $in: userId },
        },
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          data: [{ $sort: { _id: -1 } }, { $skip: offset }, { $limit: limit }],
        },
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
          data: 1,
        },
      },
    ]);

    result[0].data.map((ele) => {
      response.push({
        productId: ele.productId,
        name: ele.name,
        description: ele.descriprion,
        price: ele.price,
        quantity: ele.quantity,
        totalprice: ele.totalprice,
      });
    });
    let totalCount = result[0]?.totalCount;
    return res
      .status(200)
      .send({
        success: true,
        message: "All cart items",
        totalData: totalCount,
        data: response,
      });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      success: false,
      error: error.stack,
    });
  }
};

const removeCart = async (req, res) => {
  const { userId, productId } = req.query;
  try {
    if (!userId) {
      return res.status(400).send({
        succes: false,
        message: "UserId is missing",
      });
    }
    if (!productId) {
      return res.status(400).send({
        succes: false,
        message: "ProductId is missing",
      });
    }

    await Cart.deleteOne({ userId: userId, productId: productId });
    return res.status(200).send({
      success: true,
      message: "Item remove from cart",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      success: false,
      error: error.stack,
    });
  }
};

export { singup, verifyOtp, getProfile, addCart, getAllCartItems, removeCart };
