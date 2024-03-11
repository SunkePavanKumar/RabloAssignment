import twilio from "twilio";
import UserDetails from "../model/user.model.js";
import otpGenerator from "otp-generator";

const user = async (req, res) => {
  try {
    // input validations to be handled later.
    const newUserDetails = new UserDetails(req.body);
    const savedUser = (await newUserDetails.save()).toObject();
    let response = {
      success: true,
      message: {
        userDetails: {},
        optDetails: {},
      },
    };
    if (savedUser) {
      response.message.userDetails.isSaved = true;
      response.message.userDetails.data = savedUser;
    }

    // generate OPT

    const sendOtp = await generateOpt(savedUser.mobile);

    if (sendOtp) {
      response.message.optDetails.isSent = true;
      response.message.optDetails.data = sendOtp;
      let filter = { _id: savedUser._id };
      let update = { otpDetails: sendOtp };
      const data = await UserDetails.findOneAndUpdate(filter, update).lean();
    } else {
      response.message.optDetails.isSent = false;
    }
    res.send(response);
  } catch (error) {
    res.send({
      success: false,
      Error: error,
    });
    console.error(`Error in user.controller METHOD : user Error:: ${error}`);
  }
};

const generateOpt = async (mobileNumber) => {
  try {
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUT_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const client = twilio(accountSid, authToken);
    const otp = otpGenerator.generate(4, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });
    const message = `Your OTP for registration at Rablo is : ${otp}`;
    const data = await client.messages.create({
      to: mobileNumber,
      from: twilioPhoneNumber,
      body: message,
    });
    // set the otp expiration
    const otpExpiration = Date.now() + 60 * 1000;
    let { body, from, to, dateUpdated } = data;
    let response = {
      code: otp,
      otpExpiration,
      body,
      from,
      to,
      dateUpdated,
    };
    return response;
  } catch (error) {
    console.error(`Error while sending the OPT,:: ${error}`);
  }
};

const verifyOpt = async (req, res) => {
  try {
    const { otp, userId } = req.body;
    if (!otp || !userId) {
      res.send({
        success: true,
        message: "Please provide the required fields",
      });
    }
    const user = await UserDetails.findById(userId).lean().exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { code, otpExpiration } = user.otpDetails;

    if (Date.now() > otpExpiration) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (code === otp) {
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully.",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    if (
      error &&
      error.message &&
      error.message.startsWith("Cast to ObjectId failed")
    ) {
      return res.status(401).json({
        success: false,
        message: "Please provide the valid userID",
      });
    }
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export { user, generateOpt, verifyOpt };
