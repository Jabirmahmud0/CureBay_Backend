"use strict";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
// Get payments for a specific seller
const getSellerPayments = async (req, res) => {
    try {
        const { sellerId } = req.params;
        // Validate sellerId
        if (!sellerId) {
            return res.status(400).json({ error: 'Seller ID is required' });
        }
        console.log('Fetching payments for sellerId:', sellerId);
        console.log('Authenticated user:', req.user);
        // Authorization check: Ensure the authenticated user is the seller or an admin
        if (req.user.role !== 'admin' && req.user._id.toString() !== sellerId) {
            console.log('Authorization failed. User role:', req.user.role, 'User ID:', req.user._id, 'Requested sellerId:', sellerId);
            return res.status(403).json({ error: 'Access denied. You can only view your own payments.' });
        }
        // Find payments for the specified seller
        const payments = await Payment.find({ sellerId })
            .sort({ createdAt: -1 });
        console.log('Found', payments.length, 'payments for seller', sellerId);
        res.json({ payments });
    }
    catch (err) {
        console.error('Error fetching seller payments:', err);
        res.status(500).json({ error: 'Failed to fetch payments', details: err.message });
    }
};
// Get all payments (admin only)
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('orderId', 'totalAmount status')
            .populate('sellerId', 'name email')
            .sort({ createdAt: -1 });
        res.json({ payments });
    }
    catch (err) {
        console.error('Error fetching all payments:', err);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};
// Create a Stripe payment intent
const createPaymentIntent = async (req, res) => {
    try {
        const { orderId, amount, currency, customerEmail } = req.body;
        // Validate required fields
        if (!orderId || !amount || !currency) {
            return res.status(400).json({ error: 'Missing required fields: orderId, amount, and currency are required' });
        }
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency,
            metadata: {
                orderId: orderId
            },
            receipt_email: customerEmail || undefined
        });
        res.send({
            clientSecret: paymentIntent.client_secret
        });
    }
    catch (err) {
        console.error('Error creating payment intent:', err);
        res.status(500).json({ error: err.message });
    }
};
// Confirm a payment
const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId, orderId } = req.body;
        // Validate required fields
        if (!paymentIntentId || !orderId) {
            return res.status(400).json({ error: 'Missing required fields: paymentIntentId and orderId are required' });
        }
        // Retrieve the payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        // Check if the payment was successful
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ error: 'Payment not successful' });
        }
        // Get the order to find the seller
        const Order = require('../models/Order');
        const Medicine = require('../models/Medicine');
        const order = await Order.findById(orderId).populate({
            path: 'items.medicine',
            select: 'seller'
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Extract sellerId from the first item's medicine (assuming all items are from the same seller)
        const sellerId = order.items[0]?.medicine?.seller;
        if (!sellerId) {
            return res.status(400).json({ error: 'Seller not found for this order' });
        }
        // Create a payment record in our database
        const paymentRecord = new Payment({
            orderId: orderId,
            paymentIntentId: paymentIntentId,
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency,
            status: 'succeeded',
            paymentMethod: paymentIntent.payment_method_types[0],
            cardBrand: paymentIntent.charges?.data[0]?.payment_method_details?.card?.brand,
            cardLast4: paymentIntent.charges?.data[0]?.payment_method_details?.card?.last4,
            sellerId: sellerId
        });
        await paymentRecord.save();
        res.json(paymentRecord);
    }
    catch (err) {
        console.error('Error confirming payment:', err);
        res.status(500).json({ error: err.message });
    }
};
module.exports = {
    getSellerPayments,
    getAllPayments,
    createPaymentIntent,
    confirmPayment
};
