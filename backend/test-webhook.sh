#!/bin/bash

# Test Midtrans Webhook
# This simulates a webhook notification from Midtrans

echo "Testing Midtrans Webhook..."
echo ""

# Sample webhook payload (settlement status)
curl -X POST https://api.satutangan.my.id/api/webhooks/midtrans \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_time": "2025-11-13 10:00:00",
    "transaction_status": "settlement",
    "transaction_id": "test-123456",
    "status_message": "midtrans payment notification",
    "status_code": "200",
    "signature_key": "test-signature",
    "payment_type": "qris",
    "order_id": "DONATION-1762994630997-09580454",
    "merchant_id": "test-merchant",
    "gross_amount": "10000000.00",
    "fraud_status": "accept",
    "currency": "IDR"
  }'

echo ""
echo ""
echo "Done! Check backend logs and database to see if status updated."
