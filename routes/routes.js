const express = require('express');
const router = express.Router();

router.get("/clients", (req, res) => {
	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			connection.query('SELECT * FROM clients', [], (erreur, resultat)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					//res.status(200).render('customer', { resultat });
					res.status(200).render('customer', { resultat, message : req.flash('message')  });
				}
			});//''
		}
	});
});

router.post("/clients/add", (req, res) => {
	//req.body must call a middleware
	//console.log(req.body);
	let id = req.body.id === "" ? null : req.body.id;
	let nomcli = req.body.nom;
	let prenomcli = req.body.prenom;
	let telcli = req.body.telephone;
	let adrs = req.body.Description;

	let reqSQL = id === null 
		? 'INSERT INTO `clients` (`id_cli`, `nom_cli`, `prenom_cli`, `tel_cli`, `adresse`) VALUES (?, ?, ?, ?, ?)'
		: 'UPDATE clients SET nom_cli = ?, prenom_cli = ?, tel_cli = ?, adresse = ? WHERE id_cli = ?';

	let donnees = id === null ? [null, nomcli,prenomcli,telcli,adrs] : [nomcli,prenomcli,telcli,adrs,id];

	let notification = id === null ? 'insertion de client avec succés' : 'modification de client avec succés';

	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			//connection.query('INSERT INTO `clients` (`id_cli`, `nom_cli`, `prenom_cli`, `tel_cli`, `adresse`) VALUES (?, ?, ?, ?, ?)', [null, nomcli,prenomcli,telcli,adrs], (erreur, resultat)=> {
			connection.query(reqSQL, donnees, (erreur, resultat)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					req.flash('message', notification); //call for the message : in flash
					res.status(300).redirect('/clients');
				}
			});//''
		}
	});

});

router.delete('/clients/delete/:id', (req, res) => {
	let id = req.params.id;
	req.getConnection((erreur, connection) => {
		if (erreur) {
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			connection.query(
				'DELETE FROM clients WHERE id_cli = ?',
				[id],
				(erreur, resultat) => {
					if (erreur) {
						console.log(erreur);
					} else {
						req.flash('message', 'supression de client avec succés'); //call for the message : in flash
						res.status(200).json({routeRacine : '/clients'});
					}
				})
		}
	})
});

module.exports = router;

