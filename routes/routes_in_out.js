const express = require('express');
const routerio = express.Router();

routerio.get("/bons", (req, res) => {
	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			connection.query('SELECT * FROM `bn_entrer`', [], (erreur, bneresultat)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					//res.status(200).render('product', { bneresultat });
					//res.status(200).render('inout', { bneresultat, message : req.flash('message') });
                    connection.query('SELECT * FROM `bn_sortir` JOIN `clients` WHERE  bn_sortir.id_cli= clients.id_cli', [], (erreur, bnsresultat)=> {
                        if (erreur) {
                            console.log(erreur);
                        } else {
                            //res.status(200).render('product', { bnsresultat });
                            //res.status(200).render('inout', { bneresultat, bnsresultat, message : req.flash('message') });
                            connection.query('SELECT id_cli,nom_cli,prenom_cli FROM `clients`', [], (erreur, cbxresultat)=> {
                                if (erreur) {
                                    console.log(erreur);
                                } else {
                                    //res.status(200).render('product', { bnsresultat });
                                    //console.log(cbxresultat, bneresultat, bnsresultat);
                                    //console.log(bneresultat);
                                    res.status(200).render('inout', { cbxresultat, bneresultat, bnsresultat, message : req.flash('message') });
                                }
                            });
                        }
                    });
				}
			});//''
		}
	});
});

routerio.post("/bnenter/add", (req, res) => {
	//req.body must call a middleware
	//console.log(req.body);
	let id = req.body.id === "" ? null : req.body.id;
	let numbne = req.body.numerobne;
	//let idcli = req.body.categorie;
	let databne = req.body.datebne;
	//let current_timestamp = Date().toString();
	//let adrs = req.body.Description;

	let reqSQL = id === null 
		? 'INSERT INTO `bn_entrer` (`bne_id`, `num_bne`, `date_bne`) VALUES (?, ?, ?)'
		: 'UPDATE bn_entrer SET num_bne = ?, date_bne = ? WHERE bne_id = ?';

	let donnees = id === null ? [null, numbne,databne] : [numbne,databne,id];
	
	
	//let redirectat = id === null ? '/stockentrer?bneid='+resultat.insertId : '/stockentrer?bneid='+id;
	

	let notification = id === null ? 'insertion de bon d\'entrer avec succés' : 'modification de bon d\'entrer avec succés';

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
					//console.log(resultat.insertId);
					//console.log(resultat);
					let redirectat = id === null ? '/stockentrer?bneid='+resultat.insertId : '/stockentrer?bneid='+id;
					req.flash('message', notification); //call for the message : in flash
					//res.status(300).redirect('/bons');
					res.status(300).redirect(redirectat);
					//res.status(300).redirect('/stockentrer?bneid='+insertId);
				}
			});//''
		}
	});

});

routerio.delete('/bnenter/delete/:id', (req, res) => {
	let id = req.params.id;
	req.getConnection((erreur, connection) => {
		if (erreur) {
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			connection.query(
				'DELETE FROM bn_entrer WHERE bne_id = ?',
				[id],
				(erreur, resultat) => {
					if (erreur) {
						console.log(erreur);
					} else {
						connection.query('DELETE FROM stock_entrer WHERE stock_entrer.bne_id = ?', [id]);
						req.flash('message', 'supression de de bon d\'entrer avec succès'); //call for the message : in flash
						res.status(200).json({routeRacine : '/bons'});
					}
				})
		}
	})
});


//sortir 
/***
 * 
 * 
 */
/*
routerio.get("/bnenter", (req, res) => {
	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			connection.query('SELECT * FROM `bn_sortir` JOIN `clients` WHERE  bn_sortir.id_cli= clients.id_cli', [], (erreur, bnsresultat)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					//res.status(200).render('product', { bnsresultat });
					res.status(200).render('inout', { bnsresultat, message : req.flash('message') });
				}
			});//''
		}
	});
});
*/
routerio.post("/bnsortir/add", (req, res) => {
	//req.body must call a middleware
	//console.log(req.body);
	let id = req.body.id === "" ? null : req.body.id;
	let numbns = req.body.numerobns;
	let idcli = req.body.idclient;
	let databns = req.body.datebns;
	//let current_timestamp = Date().toString();
	//let adrs = req.body.Description;

	let reqSQL = id === null 
		? 'INSERT INTO `bn_sortir` (`bns_id`, `num_bns`, `id_cli`, `date_bns`) VALUES (?, ?, ?, ?)'
		: 'UPDATE bn_sortir SET num_bns = ?, id_cli = ?, date_bns = ? WHERE bns_id = ?';

	let donnees = id === null ? [null, numbns,idcli,databns] : [numbns,idcli,databns,id];

	let redirectat = id === null ? '/stocksortir?bnsid='+resultat.insertId : '/stocksortir?bnsid='+id;

	let notification = id === null ? 'insertion de bon de sortir avec succés' : 'modificationde bon de sortir avec succés';

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
					//res.status(300).redirect('/bons');
					res.status(300).redirect(redirectat);
				}
			});//''
		}
	});

});

routerio.delete('/bnsortir/delete/:id', (req, res) => {
	let id = req.params.id;
	req.getConnection((erreur, connection) => {
		if (erreur) {
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			connection.query(
				'DELETE FROM bn_sortir WHERE bns_id = ?',
				[id],
				(erreur, resultat) => {
					if (erreur) {
						console.log(erreur);
					} else {
						connection.query('DELETE FROM stock_sortir WHERE stock_sortir.bns_id = ?', [id]);
						req.flash('message', 'supression de bon de sortir avec succès'); //call for the message : in flash
						res.status(200).json({routeRacine : '/bons'});
					}
				})
		}
	})
});




module.exports = routerio;

