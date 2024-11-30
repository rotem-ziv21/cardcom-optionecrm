// קוד להטמעה ב-CRM
(function() {
    // טעינת הסקריפט מהשרת
    function loadCardcomScript() {
        const script = document.createElement('script');
        script.src = 'https://optione-cardcom.netlify.app/cardcom-integration.js';
        script.async = true;
        script.onload = function() {
            // אתחול רכיב התשלום לאחר טעינת הסקריפט
            initializeCardcomPayment();
        };
        document.head.appendChild(script);
    }

    // פונקציית אתחול רכיב התשלום
    function initializeCardcomPayment() {
        const cardcomPayment = new CardComPayment({
            terminalNumber: '154042',
            apiName: '4eh4Cel12HyLaPn6sN2t',
            successUrl: 'https://optione-cardcom.netlify.app/payment-success',
            failureUrl: 'https://optione-cardcom.netlify.app/payment-failure'
        });
    }

    // הוספת סגנונות נדרשים
    const styles = document.createElement('style');
    styles.textContent = `
        .customer-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        }
        .customer-card-actions {
            margin-top: 20px;
        }
    `;
    document.head.appendChild(styles);

    // יצירת האלמנט המכיל
    const container = document.createElement('div');
    container.className = 'customer-card';
    container.innerHTML = '<div class="customer-card-actions"></div>';
    
    // הוספת האלמנט למקום הרצוי ב-CRM
    // שנה את ה-selector הזה למקום שבו אתה רוצה שהכפתור יופיע
    const targetElement = document.querySelector('#YOUR_TARGET_ELEMENT_ID');
    if (targetElement) {
        targetElement.appendChild(container);
        // טעינת הסקריפט
        loadCardcomScript();
    }
})();
