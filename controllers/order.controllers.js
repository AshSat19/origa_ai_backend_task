const logger = require('../logger');

const Order = require('../models/order.model');

exports.addOrder = (req, res, next) => {
    const newOrder = new Order({
        orderId: req.body.orderId,
        userId: req.body.userId,
        subtotal: req.body.subtotal,
        date: req.body.date
    });

    newOrder
    .save()
    .then(savedOrder => {
        logger.info({
            function: 'add_order',
            message: 'Order successfully added'
        });
        res.status(200).jsonp({
            message: 'Order successfully added',
            details: savedOrder
        });
    })
    .catch(error => {
        logger.error({
            function: 'add_order',
            message: 'Order addition failed: ' + error
        });
        res.status(500).jsonp({
            message: 'Internal server error. Please try again.'
        });
    });
};

exports.getOrdersSummary = (req, res, next) => {
    Order
    .find({ userId: req.params.id })
    .then(fetchedOrders => {
        let response = {
            userId: req.locals.userId,
            name: req.locals.name,
            noOfOrders: fetchedOrders.length,
            averageBillValue: 0
        };
        fetchedOrders.forEach(order => {
            response.averageBillValue += order.subtotal;
        });
        response.averageBillValue /= response.noOfOrders;
        logger.info({
            function: 'order_summary_fetched',
            message: 'Order details successfully fetched'
        });
        res.status(200).jsonp(response);
    })
    .catch(error => {
        logger.error({
            function: 'resolve_user_details',
            message: 'Failed to resolve user details: ' + error
        });
        return res.status(500).jsonp({
            message: 'Internal Server Error. Please try again.'
        });
    });
};

exports.getAllOrdersSummary = (req, res, next) => {
    const apiResponse = [];
    const allPromises = [];
    req.locals.users.forEach(user => {
        const orderPromise = new Promise((resolve, reject) => {
            Order
            .find({ userId: user.userId })
            .then(fetchedOrders => {
                if (fetchedOrders) {
                    let userData = {
                        userId: user.userId,
                        name: user.name,
                        noOfOrders: fetchedOrders.length,
                        averageBillValue: 0
                    };
                    fetchedOrders.forEach(order => {
                        userData.averageBillValue += order.subtotal;
                    });
                    userData.averageBillValue /= userData.noOfOrders;
                    apiResponse.push(userData);
                    resolve(userData);
                }
            })
            .catch(error => {
                reject(error);
            });
        });
        allPromises.push(orderPromise);
    });
    
    Promise.all(allPromises)
    .then(() => {
        logger.info({
            function: 'fetch_all_orders_summary',
            message: 'All Order details successfully fetched'
        });
        res.status(200).jsonp(apiResponse);
    })
    .catch(err => {
        logger.error({
            function: 'fetch_all_orders_summary',
            message: 'Failed to resolve user details: ' + err
        });
        return res.status(500).jsonp({
            message: 'Internal Server Error. Please try again.'
        });
    })
};

exports.fetchOrderCounts = (req, res, next) => {
    const allPromises = [];
    req.locals.users.forEach(user => {
        const orderPromise = new Promise((resolve, reject) => {
            Order
            .find({ userId: user.userId })
            .then(fetchedOrders => {
                if (fetchedOrders) {
                    user.noOfOrders += fetchedOrders.length;
                    resolve(true);
                }
            })
            .catch(error => {
                reject(error);
            });
        });
        allPromises.push(orderPromise);
    });
    
    Promise.all(allPromises)
    .then(() => {
        logger.info({
            function: 'fetch_all_orders_count',
            message: 'All Order counts successfully fetched'
        });
        next();
    })
    .catch(err => {
        logger.error({
            function: 'fetch_all_orders_summary',
            message: 'Failed to resolve user details: ' + err
        });
        return res.status(500).jsonp({
            message: 'Internal Server Error. Please try again.'
        });
    });
};
