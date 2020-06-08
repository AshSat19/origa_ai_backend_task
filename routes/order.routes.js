const express = require('express');

const userControllers = require('../controllers/user.controllers');
const orderControllers = require('../controllers/order.controllers');

const router = express.Router();

router.post(
    '/add-order', 
    orderControllers.addOrder
);

router.get(
    '/get-orders-summary/:id', 
    userControllers.resolveUserDetails,
    orderControllers.getOrdersSummary
);

router.get(
    '/get-all-orders-summary', 
    userControllers.resolveAllUserDetails,
    orderControllers.getAllOrdersSummary
);

router.put(
    '/update-order-count', 
    userControllers.resolveAllUserDetails,
    orderControllers.fetchOrderCounts,
    userControllers.updateOrderCount
);

module.exports = router;
