# origa.ai Backend Task

Technologies used: Node.js, Exoress.js, MongoDb with Mongoose

API Base URL: `https://aqueous-caverns-13006.herokuapp.com/api/`

### API Endpoints
- **POST**: `user/add-user`
  
  Add a new user

- **POST**: `orders/add-order`
  
  Add a new order

- **GET**: `orders/get-orders-summary/:id`
  
  Fetch order details for an individual user. ':id' is the userId for the user

- **GET**: `orders/get-all-orders-summary`
  
  Fetch order details for all users

- **PUT**: `orders/update-order-count`
  
  Update no.of orders for all users
