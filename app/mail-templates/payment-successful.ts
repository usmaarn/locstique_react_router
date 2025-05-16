export function paymentSuccessfulTemplate(
  customerName: string,
  amount: number,
  transactionId: string,
  transactionDate: string
) {
  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    .header {
      background-color: #4CAF50;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .content {
      padding: 30px;
      text-align: left;
      color: #333;
    }
    .content h2 {
      margin-top: 0;
    }
    .footer {
      background-color: #eeeeee;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #777;
    }
    @media only screen and (max-width: 600px) {
      .content, .header, .footer {
        padding: 20px;
      }
    }
  </style>
</head>
<body>

  <div class="email-container">
    <div class="header">
      <h1>Payment Successful</h1>
    </div>

    <div class="content">
      <h2>Hi ${customerName},</h2>
      <p>Thank you for your payment! We're happy to confirm that we've received your payment of <strong>$${amount}</strong>.</p>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
      <p><strong>Date:</strong> ${transactionDate}</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Thank you for your business!</p>
      <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} ${
    process.env.APP_NAME
  }. All rights reserved.
    </div>
  </div>

</body>
</html>

  `;
}
