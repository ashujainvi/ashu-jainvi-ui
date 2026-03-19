Customer Browser
│
▼
React Frontend (Firebase Hosting)
│
▼
Firebase Cloud Function (createCheckoutSession)
│
▼
Stripe Checkout (Hosted Payment Page)
│
▼
Stripe Webhook → Firebase Cloud Function
│
├── Save order to Firestore
└── Send order to Printful API
│
▼
Printful Fulfillment
│
▼
Printful Webhook → Firebase
│
├── Update Firestore order
└── Send Shipping Email
