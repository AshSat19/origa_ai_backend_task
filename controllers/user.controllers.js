const logger = require('../logger');

const User = require('../models/user.model');

exports.addUser = (req, res, next) => {
    const newUser = new User({
        userId: req.body.userId,
        name: req.body.name
    });

    newUser
    .save()
    .then(savedUser => {
        logger.info({
            function: 'add_user',
            message: 'User successfully added'
        });
        res.status(200).jsonp({
            message: 'User successfully added',
            details: savedUser
        });
    })
    .catch(error => {
        logger.error({
            function: 'add_user',
            message: 'User addition failed: ' + error
        });
        res.status(500).jsonp({
            message: 'Internal server error. Please try again.'
        });
    });
};

exports.resolveUserDetails = (req, res, next) => {
    req.locals = {};
    User
    .findOne({ userId: req.params.id })
    .then(fetchedUser => {
        req.locals.userId = req.params.id;
        req.locals.name = fetchedUser.name;
        logger.info({
            function: 'resolve_user_details',
            message: 'User details successfully resolved'
        });
        next();
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

exports.resolveAllUserDetails = (req, res, next) => {
    req.locals = {};
    req.locals.users = [];
    User
    .find()
    .then(fetchedUsers => {
        fetchedUsers.forEach(user => {
            req.locals.users.push({
                _id: user._id,
                userId: user.userId,
                name: user.name,
                noOfOrders: 0
            });
        });
        logger.info({
            function: 'resolve_all_user_details',
            message: 'User details successfully resolved'
        });
        next();
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

exports.updateOrderCount = (req, res, next) => {
    const allPromises = [];
    req.locals.users.forEach(user => {
        const orderPromise = new Promise((resolve, reject) => {
            const updatedUser = new User({
                _id: user._id,
                name: user.name,
                no_of_orders: user.noOfOrders
            });
        
            User
            .updateOne({ _id: user._id }, updatedUser)
            .then(result => {
                logger.info({
                    function: 'update_order_count',
                    message: 'Order count successfully updated'
                });
                resolve(result);
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
            function: 'update_order_count',
            message: 'All Order counts successfully fetched'
        });
        res.status(200).jsonp({ 
            success: true,
            message: 'Successfully updated'
        });
    })
    .catch(err => {
        logger.error({
            function: 'update_order_count',
            message: 'Failed to resolve order counts: ' + err
        });
        return res.status(500).jsonp({
            message: 'Internal Server Error. Please try again.'
        });
    });
};
