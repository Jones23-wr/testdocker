const express = require('express');
const routerp = express.Router();

routerp.get("/produits", (req, res) => {
	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			connection.query('SELECT *, DATE(date_updated) AS datea FROM produits', [], (erreur, resultat)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					//res.status(200).render('product', { resultat });
					res.status(200).render('product', { resultat, message : req.flash('message') });
				}
			});//''
		}
	});
});

routerp.post("/produits/add", (req, res) => {
	//req.body must call a middleware
	//console.log(req.body);
	let id = req.body.id === "" ? null : req.body.id;
	let nomrprod = req.body.nom;
	let catprod = req.body.categorie;
	let qteprod = req.body.quantite;
	let prixprod = req.body.prix;
	//let current_timestamp = Date().toString();
	//let adrs = req.body.Description;

	let reqSQL = id === null 
		? 'INSERT INTO `produits` (`id_prod`, `nom_prod`, `cat_prod`, `quantite`, `prix`, `date_updated`) VALUES (?, ?, ?, ?, ?, ?)'
		: 'UPDATE produits SET nom_prod = ?, cat_prod = ?, quantite = ?, `prix` = ?, date_updated = ? WHERE id_prod = ?';

	let donnees = id === null ? [null, nomrprod,catprod,qteprod,prixprod,null] : [nomrprod,catprod,qteprod,prixprod,null,id];

	let notification = id === null ? 'insertion de produit avec succés' : 'modification de produit avec succés';

	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			//connection.query('INSERT INTO `produits` (`id_cli`, `nom_cli`, `prenom_cli`, `tel_cli`, `adresse`) VALUES (?, ?, ?, ?, ?)', [null, nomcli,prenomcli,telcli,adrs], (erreur, resultat)=> {
			connection.query(reqSQL, donnees, (erreur, resultat)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					req.flash('message', notification); //call for the message : in flash
					res.status(300).redirect('/produits');
				}
			});//''
		}
	});

});

routerp.delete('/produits/delete/:id', (req, res) => {
	let id = req.params.id;
	req.getConnection((erreur, connection) => {
		if (erreur) {
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			connection.query(
				'DELETE FROM produits WHERE id_prod = ?',
				[id],
				(erreur, resultat) => {
					if (erreur) {
						console.log(erreur);
					} else {
						req.flash('message', 'supression de produits avec succès'); //call for the message : in flash
						res.status(200).json({routeRacine : '/produits'});
					}
				})
		}
	})
});

module.exports = routerp;

