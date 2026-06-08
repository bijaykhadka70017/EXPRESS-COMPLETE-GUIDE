const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Direction A: A product belongs to a specific user (Sets up the connection)
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});

// Direction B: The inverse relationship (Clarifies the structural flow)
User.hasMany(Product);

// Sync all defined models to the database
sequelize.sync({ force: true })
    .then(result => {
        // console.log(result); // Returns a complex setup metadata object
        app.listen(3000);    // Only start the server if the DB sync succeeds
    })
    .catch(err => {
        console.log(err);
    });
