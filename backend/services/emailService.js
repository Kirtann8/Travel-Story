const nodemailer = require('nodemailer');

// Create test account for development
let transporter;

const initializeEmailService = async () => {
  try {
    // Try Gmail first
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    await transporter.verify();
    console.log('✅ Gmail email service ready');
  } catch (error) {
    console.log('⚠️ Gmail failed, using test email service');
    
    // Fallback to Ethereal test service
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('✅ Test email service ready');
  }
};

// Initialize on startup
initializeEmailService();

const sendVerificationEmail = async (email, token, fullName) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@travelstory.com',
    to: email,
    subject: 'Verify Your Email - Travel Story App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #05B6D3;">Welcome to Travel Story App!</h2>
        <p>Hi ${fullName},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #05B6D3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">Travel Story App Team</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  
  // Log preview URL for test emails
  if (process.env.NODE_ENV !== 'production') {
    console.log('📧 Verification email sent');
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview URL:', previewUrl);
    }
  }
};

const sendPasswordResetEmail = async (email, token, fullName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@travelstory.com',
    to: email,
    subject: 'Reset Your Password - Travel Story App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #05B6D3;">Password Reset Request</h2>
        <p>Hi ${fullName},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #05B6D3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">Travel Story App Team</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  
  // Log preview URL for test emails
  if (process.env.NODE_ENV !== 'production') {
    console.log('📧 Password reset email sent');
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview URL:', previewUrl);
    }
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};