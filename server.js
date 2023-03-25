// cyclic: https://lazy-pear-codfish-hem.cyclic.app/
// github: https://github.com/Ramanpreet114/Web-test.git

const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const app = express();
const exphbs = require('express-handlebars');

const Sequelize = require("sequelize");




const HTTP_PORT = process.env.PORT || 8080;


function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}



const sequelize = new Sequelize("ojntptrf", "ojntptrf", "ov4tr4yZAflsgFj8kaexUpfwOxsvz18t", {
    host: "hansken.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});







let usersTable = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true 
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },

    
},{
    createdAt: false, 
    updatedAt: false 
});


// Load styles from public folder
app.use(express.static("./public/"));

// Define a custom Handlebars helper function to format dates
const hbs = exphbs.create({
    helpers: {
        formatDate: function (date) {
            if (date) {
              return date.toLocaleDateString();
            } else {
              return "";
            }
          }
        },
    extname: ".hbs"
});

// Register handlebars as the rendering engine for views
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");


// Use body-parser middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the HTML form
app.get('/update-user', (req, res) => {


    usersTable.findOne({
        where: { id: req.query.id }
    }).then(data => {
        res.render('edit', { users: data, layout: false });
    });

});

// Update user data in database
app.post('/update-user', (req, res) => {


    usersTable.update({
       
        name: req.body.name,
        email: req.body.email
    }, {
        where: { id: req.body.id }
    }).then(() => {
        console.log("successfully updated name: " + req.body.id);
        res.redirect("/"); 
    });
});

// Delete user data in database
app.get('/delete-user', (req, res) => {


    usersTable.destroy({
        where: { id: req.query.id }
    }).then(() => {
        console.log("Deleted user: " + req.query.id);
        res.redirect("/"); 
    });


});

// Handle form submission
app.post('/insert-user', (req, res) => {
    usersTable.create({
        name: req.body.name,
        email: req.body.email
        
        }).then(() => {
        console.log("created a new user");
        res.redirect("/");
    });
});


app.get('/', (req, res) => {
    
    usersTable.findAll({
        attributes1: ["name"],
        attributes2: ["email"]

    }).then((data) => {

        res.render("index", {
            data: data,
            layout: false 
        });
    });
});


// synchronize the database before we start the server
sequelize.sync().then(() => {
    // start the server to listen on HTTP_PORT
    app.listen(HTTP_PORT, onHttpStart);
});