import twilio from 'twilio'
import dotenv from 'dotenv'
dotenv.config()

const accountSid = process.env.TW_ACCOUNT_SID;
const authTokenId = process.env.TW_AUTH_TOKEN;
const phoneNum = process.env.TW_PHONE_NUMBER;

const client =  twilio(accountSid,authTokenId);

const sendSms = async(otp,phone)=>{
    try {
        const result = await client.messages.create({
            body:`Your 6 digit otp is ${otp}. Kindly don't share this to anyone`,
            from:phoneNum,
            to:`+91${phone}`
        })
        return result
    } catch (error) {
        return error
    }
}

export {sendSms}