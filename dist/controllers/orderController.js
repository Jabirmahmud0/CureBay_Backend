"use strict";
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
// Create a new order
async function createOrder(req, res) {
    try {
        const { userId, items, shippingAddress, totalAmount, currency, coupon } = req.body;
        // Validate required fields
        if (!userId || !items || !shippingAddress || !totalAmount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Validate items
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items array is required and cannot be empty' });
        }
        // Validate each item has required fields
        for (const item of items) {
            if (!item.medicineId || !item.quantity) {
                return res.status(400).json({ error: 'Each item must have medicineId and quantity' });
            }
        }
        // Create the order
        const orderData = {
            user: userId,
            items: items.map(item => ({
                medicine: item.medicineId,
                quantity: item.quantity,
                price: item.price || 0 // Price will be populated from medicine data
            })),
            totalAmount,
            shippingAddress,
            coupon: coupon ? {
                code: coupon.code,
                discountAmount: coupon.discountAmount
            } : undefined
        };
        const order = new Order(orderData);
        await order.save();
        // Populate the order with user and medicine details
        await order.populate('user', 'name email');
        await order.populate('items.medicine', 'name price');
        res.status(201).json(order);
    }
    catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: err.message });
    }
}
// Get all orders (admin only)
async function getOrders(req, res) {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.medicine', 'name price')
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: err.message });
    }
}
// Get specific order (admin only)
async function getOrderById(req, res) {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.medicine', 'name price');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    }
    catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: err.message });
    }
}
module.exports = {
    createOrder,
    getOrders,
    getOrderById
};
