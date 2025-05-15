const express = require("express");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});
async function emailSendService(email, username, code) {
  await transporter.sendMail({
    from: '"no-reply" <codemail.noreply@gmail.com>',
    to: email,
    subject: `Acivate account ${username}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Activation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            padding: 20px;
            margin: 0;
        }
        .email-container {
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .email-title {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            margin-bottom: 20px;
        }
        .activation-code {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 4px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-title">This is your account activation email</div>
        <p>Use the activation code below to activate your account:</p>
        <div class="activation-code">${code}</div>
    </div>
</body>
</html>
`,
  });
}
const fotgotPasswordEmailSender = async (email, username, code) => {
  await transporter.sendMail({
    from: '"no-reply" <codemail.noreply@gmail.com>',
    to: email,
    subject: `Reset password ${username}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Activation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            padding: 20px;
            margin: 0;
        }
        .email-container {
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .email-title {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            margin-bottom: 20px;
        }
        .activation-code {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 4px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-title">This is your account activation email</div>
        <p>Use the activation code below to reset your password:</p>
        <div class="activation-code">${code}</div>
    </div>
</body>
</html>`,
  });
};
module.exports = {
  emailSendService,
  fotgotPasswordEmailSender,
};
