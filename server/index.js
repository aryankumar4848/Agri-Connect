const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const client = require('prom-client');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Cart = require('./models/cart');
const User = require('./models/User');
const Seller = require('./models/seller');
const authRoutes = require('./routes/authRoutes');

const app = express(); // <-- Move this up before using 'app'

// ---- Logging Setup ----
const isVercelRuntime = process.env.VERCEL === '1';
if (!isVercelRuntime) {
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
  }
  const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('combined'));
}

app.use(cors());
app.use(express.json());

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
    : null;

// ---- Prometheus Metrics Setup ----
const register = new client.Registry();
client.collectDefaultMetrics({ register });
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// ---- MongoDB Connection (non-blocking in local/dev) ----
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  mongoose
    .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
      console.error('MongoDB connection failed. Continuing without DB:', err.message);
    });
} else {
  console.warn('MONGO_URI not set. Starting API without database connection.');
}

// ---- Basic Route ----
app.get('/', (req, res) => {
  res.send('Farmers Portal API');
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// ---- Auth and Other Routes (Mounting authRoutes) ----
app.use(authRoutes);

app.post('/payments/razorpay/create-link', async (req, res) => {
  if (process.env.MOCK_RAZORPAY === 'true') {
    const referenceId = req.body.referenceId || `agri_${Date.now()}`;
    const mockPaymentLinkId = `plink_mock_${Date.now()}`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Create the mock callback URL that Razorpay would normally redirect to
    const mockCallbackUrl = `${frontendUrl}/transaction?razorpay_payment_id=pay_mock_${Date.now()}&razorpay_payment_link_id=${mockPaymentLinkId}&razorpay_payment_link_reference_id=${referenceId}&razorpay_payment_link_status=paid&razorpay_signature=mock_signature`;

    return res.json({
      provider: 'razorpay',
      paymentLinkId: mockPaymentLinkId,
      shortUrl: mockCallbackUrl, // We send them directly to the success callback
      status: 'created',
      referenceId,
    });
  }

  if (!razorpay) {
    return res.status(400).json({
      message: 'Razorpay is not configured on the server. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
    });
  }

  try {
    const amount = Number(req.body.amount);
    const currency = String(req.body.currency || 'INR').toUpperCase();
    const customerName = req.body.customerName || 'AgriConnect Customer';
    const customerEmail = req.body.customerEmail || '';
    const customerPhone = req.body.customerPhone || '';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const referenceId = req.body.referenceId || `agri_${Date.now()}`;

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number.' });
    }

    const amountInSmallestUnit = Math.round(amount * 100);
    const paymentLink = await razorpay.paymentLink.create({
      amount: amountInSmallestUnit,
      currency,
      accept_partial: false,
      description: 'AgriConnect Cart Checkout',
      reference_id: referenceId,
      customer: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      notify: {
        sms: Boolean(customerPhone),
        email: Boolean(customerEmail),
      },
      callback_url: `${frontendUrl}/transaction`,
      callback_method: 'get',
    });

    return res.json({
      provider: 'razorpay',
      paymentLinkId: paymentLink.id,
      shortUrl: paymentLink.short_url,
      status: paymentLink.status,
      referenceId,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create Razorpay payment link.',
      error: error.message,
    });
  }
});

app.get('/payments/razorpay/verify-link-signature', (req, res) => {
  try {
    const {
      razorpay_payment_link_id,
      razorpay_payment_link_reference_id,
      razorpay_payment_link_status,
      razorpay_payment_id,
      razorpay_signature,
    } = req.query;

    if (process.env.MOCK_RAZORPAY === 'true') {
      return res.json({
        success: true,
        provider: 'razorpay',
        paymentId: razorpay_payment_id,
        paymentLinkId: razorpay_payment_link_id,
        paymentStatus: razorpay_payment_link_status,
        referenceId: razorpay_payment_link_reference_id || '',
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(400).json({
        message: 'Razorpay verification secret missing on server.',
      });
    }

    if (
      !razorpay_payment_link_id ||
      !razorpay_payment_link_status ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({ success: false, message: 'Missing Razorpay callback parameters.' });
    }

    const body = `${razorpay_payment_link_id}|${razorpay_payment_link_reference_id || ''}|${razorpay_payment_link_status}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid Razorpay signature.' });
    }

    return res.json({
      success: true,
      provider: 'razorpay',
      paymentId: razorpay_payment_id,
      paymentLinkId: razorpay_payment_link_id,
      paymentStatus: razorpay_payment_link_status,
      referenceId: razorpay_payment_link_reference_id || '',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Verification failed', error: error.message });
  }
});

if (!isVercelRuntime) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
