import {
  otpRepo,
  BadRequist,
  SYS_ERRORS_MESSAGES,
  sendEmail,
  redisClint,
} from "./index.js";

export const createOtpAndSendEmail = async function (body) {
  const { email } = body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);
  // const createOtp= await otpRepo.create({email:body.email , otp , expiresAt:Date.now ()+5*60*1000})
  const createOtp = await redisClint.set(`${email}:otp`, otp, {
    EX: 7 * 60 * 1000,
  });
  if (!createOtp) throw BadRequist("ivalid to create OTP");
  console.log(createOtp);

  sendEmail({
    to: email,
    subject: `${otp} is your verification code`,
    html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
        <h2 style="color: #2d3748; text-align: center;">Verify Your Account</h2>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Hello,</p>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Please use the verification code below to complete your sign-in. This code is valid for <b>5 minutes</b>.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #edf2f7; padding: 15px 30px; border-radius: 10px; border: 2px solid #cbd5e0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2b6cb0;">${otp}</span>
            </div>
        </div>
        
        <p style="color: #718096; font-size: 14px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;">
        <p style="color: #a0aec0; font-size: 12px; text-align: center;">&copy; 2026 Your App Name. All rights reserved.</p>
    </div>
    `,
  });
};
