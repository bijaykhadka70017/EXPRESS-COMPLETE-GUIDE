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

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user; // Attaching the user to the request object
            next();
        })
        .catch(err => console.log(err));
});

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
sequelize.sync()
    .then(result => {
        return User.findByPk(1)
        // console.log(result); // Returns a complex setup metadata object
    })
    .then(user => {
        if (!user) {
            return User.create({ name: "max", email: "test@gmail.com" })
        }
        return user;
    })
    .then(user => {
        console.log(user);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
