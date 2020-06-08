const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');
const logger = require('./logger');

const port = process.env.PORT || 3000;

const app = express();

// Route dependencies
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');

// DB Connection
mongoose.connect(config.get('MONGO_URI'), 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        logger.info({
            function: 'mongoose_connect',
            message: 'DB connection successful'
        });
    })
    .catch((err) => {
        logger.error({
            function: 'mongoose_connect',
            message: 'DB connection failed: ' + err    
        });
    }
);


// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);

// Invalid route
app.use((req, res) => {
    logger.error({ 
        message: 'Route ' + req.path + ' not found' 
    });
    res.status(404).jsonp({ 
        errorMessage: 'Route not found: ' + req.path 
    });
});

app.listen(port, () => {
    logger.info({
        function: 'app_start',
        message: 'Backend server is listening on port ' + port
    });
});
