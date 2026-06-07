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


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Sync all defined models to the database
sequelize.sync()
    .then(result => {
        // console.log(result); // Returns a complex setup metadata object
        app.listen(3000);    // Only start the server if the DB sync succeeds
    })
    .catch(err => {
        console.log(err);
    });
