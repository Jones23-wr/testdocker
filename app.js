const express = require('express');
//const { status } = require('express/lib/response');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const lesroutes = require('./routes/routes');//routes.js
const prodroutes = require('./routes/routes_prod');//routes_prod.js
const enterroutes = require('./routes/routes_in_out');//routes_in_out.js
const routesroutes = require('./routes/routes_stock_in_out');//routes_in_out.js
const otherroutes = require('./routes/routes_other');//routes_in_out.js
const session = require('express-session');
var flush = require('connect-flash');

const optionDB = {
	host : 'localhost',
	user : 'root',
	password : '',
	port: '3306',
	database : 'gestion_stock'
};

const app = express();

//ressources statiques bootstrap
app.use(express.static('public'));

//Extraction des données du formulaire
app.use(express.urlencoded({extended : false}));

//Définition du middleware pur connexion avec db
app.use(myConnection(mysql,optionDB,'pool'));


//Définition du moteur de visualisation affichage
app.set('view engine', 'ejs');
//app.set('views', 'content'); because the views is views

//for session
app.use(session({
	secret: 'secret',
	cookie: { maxAge : 60000 },
	resave:false,
	saveUninitialized: false
}));

app.use(flush());
//middleware for flash message must use the session for that //call in the route

//Définition du routes pour notes
app.use(lesroutes); //call the route
app.use(prodroutes); //call the route
app.use(enterroutes); //call the route
app.use(routesroutes); //call the route
app.use(otherroutes); //call the route
//app.use('/client', lesroutes); //localhost/client/route

app.get("/", (req, res) => {
	const heureConnectee = Date().toString();
	res.status(200).render('index', { heureConnectee });
});
/* 
app.get("/facturebon", (req, res) => {
	res.status(200).render('facture_bon');
});


app.get("/facture", (req, res) => {
	res.status(200).render('facture');
});
 */

app.get("/apropos", (req, res) => {
	res.status(200).render('apropos');
});

/*app.get("/stockentrer", (req, res) => {
	res.status(200).render('stock_in');
});*/

app.use((req, res) => {
	res.status(404).render('pages/notfound');
});

app.listen(3001);
console.log('Attente des requete au port 3001');