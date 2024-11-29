# CardCom CRM Payment Integration

This integration allows for seamless payment processing directly within your CRM system using CardCom's payment gateway.

## Features

- Add a "Perform Payment" button to customer cards
- Modal window for entering payment details
- Direct integration with CardCom's payment API
- Embedded payment page using iframe
- Transaction tracking in customer records

## Setup

1. Configure your CardCom credentials:
   - Terminal Number
   - API Name
   - Success/Failure URLs

2. Add the script to your CRM:
   - Upload `cardcom-integration.js` to your CRM's custom scripts section
   - Initialize the payment integration with your configuration:

```javascript
const cardcomPayment = new CardComPayment({
    terminalNumber: 'YOUR_TERMINAL_NUMBER',
    apiName: 'YOUR_API_NAME',
    successUrl: 'YOUR_SUCCESS_URL',
    failureUrl: 'YOUR_FAILURE_URL'
});
```

3. Customize the appearance:
   - The script includes default styling which can be modified in the `addStyles` method
   - Adjust the button placement by modifying the selector in `createPaymentButton`

## Usage

1. The "Perform Payment" button will appear in customer cards
2. Clicking the button opens a modal for payment details
3. After entering details, the payment page appears in an iframe
4. Transaction details are saved to the customer's record upon completion

## Security Notes

- API credentials should be stored securely
- All communication with CardCom's API is done over HTTPS
- Input validation is performed before submission

## Error Handling

The integration includes comprehensive error handling:
- API communication errors
- Input validation
- Payment processing failures

## Support

For technical support or questions about the integration, please contact your system administrator or CardCom support.
