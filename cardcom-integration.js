// CardCom Payment Integration for CRM

class CardComPayment {
    constructor(config) {
        // Validate required credentials
        if (!config.terminalNumber || !config.apiName) {
            throw new Error('Missing required CardCom credentials');
        }

        this.config = {
            terminalNumber: config.terminalNumber,
            apiName: config.apiName,
            apiUrl: 'https://secure.cardcom.solutions/api/v11/LowProfile/Create',
            successUrl: config.successUrl || `${window.location.origin}/payment-success`,
            failureUrl: config.failureUrl || `${window.location.origin}/payment-failure`
        };
        this.modalId = 'cardcomPaymentModal';
        this.iframeId = 'cardcomPaymentIframe';
        this.init();
    }

    init() {
        this.createPaymentButton();
        this.createModal();
    }

    createPaymentButton() {
        const button = document.createElement('button');
        button.innerHTML = 'בצע עסקה';
        button.className = 'cardcom-payment-button';
        button.onclick = () => this.showPaymentModal();

        // Add button to the customer card
        const targetElement = document.querySelector('.customer-card-actions');
        if (targetElement) {
            targetElement.appendChild(button);
        }
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = this.modalId;
        modal.className = 'cardcom-modal';
        modal.innerHTML = `
            <div class="cardcom-modal-content">
                <span class="close">&times;</span>
                <h2>פרטי העסקה</h2>
                <form id="paymentForm">
                    <div class="form-group">
                        <label for="amount">סכום לתשלום:</label>
                        <input type="number" id="amount" required min="1" step="0.01">
                    </div>
                    <div class="form-group">
                        <label for="productName">שם המוצר/שירות:</label>
                        <input type="text" id="productName" required>
                    </div>
                    <div class="form-group">
                        <label for="customerName">שם הלקוח:</label>
                        <input type="text" id="customerName" required>
                    </div>
                    <div class="form-group">
                        <label for="customerEmail">אימייל:</label>
                        <input type="email" id="customerEmail" required>
                    </div>
                    <button type="submit">המשך לתשלום</button>
                </form>
                <div id="${this.iframeId}-container" style="display: none;">
                    <iframe id="${this.iframeId}" width="100%" height="600px" frameborder="0"></iframe>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => this.hidePaymentModal();

        const form = modal.querySelector('#paymentForm');
        form.onsubmit = (e) => this.handlePaymentSubmit(e);

        // Add modal styles
        this.addStyles();
    }

    addStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .cardcom-payment-button {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
            }

            .cardcom-modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.4);
            }

            .cardcom-modal-content {
                background-color: #fefefe;
                margin: 10% auto;
                padding: 20px;
                border: 1px solid #888;
                width: 90%;
                max-width: 500px;
                border-radius: 8px;
                direction: rtl;
            }

            .close {
                color: #aaa;
                float: left;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }

            .close:hover {
                color: #000;
            }

            .form-group {
                margin-bottom: 15px;
            }

            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }

            .form-group input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }

            .form-group input:focus {
                border-color: #4CAF50;
                outline: none;
                box-shadow: 0 0 3px rgba(74, 175, 80, 0.3);
            }

            button[type="submit"] {
                background-color: #4CAF50;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                width: 100%;
                margin-top: 10px;
            }

            button[type="submit"]:hover {
                background-color: #45a049;
            }
        `;
        document.head.appendChild(styles);
    }

    showPaymentModal() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    hidePaymentModal() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.style.display = 'none';
            // Reset iframe container and form
            const iframeContainer = document.getElementById(`${this.iframeId}-container`);
            const form = modal.querySelector('#paymentForm');
            if (iframeContainer) {
                iframeContainer.style.display = 'none';
                const iframe = document.getElementById(this.iframeId);
                if (iframe) iframe.src = '';
            }
            if (form) {
                form.style.display = 'block';
                form.reset();
            }
        }
    }

    async handlePaymentSubmit(e) {
        e.preventDefault();
        
        console.log('Form submitted');

        const amount = document.getElementById('amount').value;
        const productName = document.getElementById('productName').value;
        const customerName = document.getElementById('customerName').value;
        const customerEmail = document.getElementById('customerEmail').value;

        console.log('Payment details:', { amount, productName, customerName, customerEmail });

        try {
            const paymentUrl = await this.createPaymentLink({
                amount: parseFloat(amount),
                productName: productName,
                customerName: customerName,
                customerEmail: customerEmail
            });

            if (paymentUrl) {
                console.log('Payment URL received:', paymentUrl);
                this.showPaymentIframe(paymentUrl);
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            alert('אירעה שגיאה ביצירת התשלום. אנא נסה שנית.');
        }
    }

    async createPaymentLink(paymentDetails) {
        console.log('Creating payment link with details:', paymentDetails);

        const response = await fetch(this.config.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                TerminalNumber: this.config.terminalNumber,
                APIName: this.config.apiName,
                Amount: paymentDetails.amount,
                Description: paymentDetails.productName,
                CustomerEmail: paymentDetails.customerEmail,
                CustomerName: paymentDetails.customerName,
                SuccessRedirectUrl: this.config.successUrl,
                FailedRedirectUrl: this.config.failureUrl,
                Language: 'he'
            })
        });

        console.log('API response status:', response.status);

        if (!response.ok) {
            throw new Error('Failed to create payment link');
        }

        const data = await response.json();
        console.log('API response data:', data);

        return data.Url;
    }

    showPaymentIframe(url) {
        const form = document.getElementById('paymentForm');
        const iframeContainer = document.getElementById(`${this.iframeId}-container`);
        const iframe = document.getElementById(this.iframeId);

        if (form && iframeContainer && iframe) {
            form.style.display = 'none';
            iframeContainer.style.display = 'block';
            iframe.src = url;
        }
    }
}

// Initialize the payment integration
const cardcomPayment = new CardComPayment({
    terminalNumber: '154042',
    apiName: '4eh4Cel12HyLaPn6sN2t',
    successUrl: `${window.location.origin}/payment-success`,
    failureUrl: `${window.location.origin}/payment-failure`
});
