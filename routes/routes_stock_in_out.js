const express = require('express');
const routeren = express.Router();

routeren.get("/stockentrer", (req, res) => {
	const idbne = req.query.bneid;
  	////const nom = req.query.nom;
	console.log(idbne);
	if(idbne != null) {
		req.getConnection((erreur, connection)=> {
			if(erreur){
				console.log(erreur);
				res.status(500).render('pages/error', {erreur});
			} else {
				connection.query('SELECT * FROM stock_entrer JOIN bn_entrer JOIN produits WHERE stock_entrer.bne_id = bn_entrer.bne_id AND stock_entrer.id_prod = produits.id_prod AND stock_entrer.bne_id=?', [idbne], (erreur, allresultat)=> {
					if (erreur) {
						console.log(erreur);
					} else {
						//res.status(200).render('product', { bneresultat });
						//res.status(200).render('inout', { bneresultat, message : req.flash('message') });
						connection.query('SELECT * FROM `produits`', [], (erreur, cbxproresultat)=> {
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
										//console.log(allresultat);
										//console.log(allresultat[1].bne_id);
										connection.query('SELECT * FROM `bn_entrer` WHERE bn_entrer.bne_id=?', [idbne], (erreur, bnttresult)=> {
											if (erreur) {
												console.log(erreur);
											} else {
												//res.status(200).render('product', { bnsresultat });
												//console.log(cbxresultat, bneresultat, bnsresultat);
												//console.log(allresultat);
												//console.log(allresultat[1].bne_id);
												res.status(200).render('stock_in', { allresultat, cbxproresultat, idbne, bnttresult, message : req.flash('message') });
											}
										})
									}
								});
							}
						});
					}
				});//''
			}
		});
	} else {
		console.log('ok zlh');
		res.status(200).render('stock_in', { hello: 'haha' });
	}
	
});

routeren.post("/stockentrer/add", (req, res) => {
	//req.body must call a middleware
	//console.log(req.body);
	let id = req.body.id === "" ? null : req.body.id;
	let bneid = req.body.id_bne;
	let idprod = req.body.prodid;
	let dateent = req.body.dateent;
	let qteprod = req.body.qte;
	let montant = req.body.montant;
	// id_bne: id_bne, prodid: produitval, qte: qte, montant: montant, date: date, montanttotal: montanttotal
	//let current_timestamp = Date().toString();
	//let adrs = req.body.Description;

	let reqSQL = id === null 
		? 'INSERT INTO `stock_entrer` (`id_ent`, `bne_id`, `id_prod`, `qte_ent`, `montant`, `date_ent`) VALUES (?, ?, ?, ?, ?, ?)'
		: 'UPDATE stock_entrer SET bne_id = ?, id_prod = ?, qte_ent = ?, montant, date_ent = ? WHERE id_ent = ?';

	let donnees = id === null ? [null, bneid,idprod,qteprod,montant,dateent] : [bneid,idprod,qteprod,montant,dateent,id];

	let notification = id === null ? 'insertion de produit avec succés' : 'modification de produit avec succés';

	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			//connection.query('INSERT INTO `produits` (`id_cli`, `nom_cli`, `prenom_cli`, `tel_cli`, `adresse`) VALUES (?, ?, ?, ?, ?)', [null, nomcli,prenomcli,telcli,adrs], (erreur, resultat)=> {
			connection.query(reqSQL, donnees, (erreur, data)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					//req.flash('message', notification); //call for the message : in flash
					//res.status(300).redirect('/produits');
					//UPDATE `produits` SET `quantite` = '0' WHERE `produits`.`id_prod` = 1;
					//UPDATE `produits` SET `quantite` = `produits`.`quantite`+5 WHERE `produits`.`id_prod` = 1;
					console.log(data);
					//connection.query('UPDATE produits SET quantite = ? WHERE id_prod = ?', [qteprod,idprod]);
					connection.query('UPDATE `bn_entrer` SET `montant_total` = `bn_entrer`.`montant_total`+? WHERE `bn_entrer`.`bne_id` = ?', [montant,bneid]);
					connection.query('UPDATE `produits` SET `quantite` = `produits`.`quantite`+?,`produits`.`date_updated`=? WHERE `produits`.`id_prod` = ?', [qteprod,null,idprod]);
					connection.query('SELECT * FROM stock_entrer JOIN bn_entrer JOIN produits WHERE stock_entrer.bne_id = bn_entrer.bne_id AND stock_entrer.id_prod = produits.id_prod AND stock_entrer.bne_id=?', [bneid],  (erreur, data)=> {
						if (erreur) {
							console.log(erreur);
						} else {
							//res.status(200).render('product', { bnsresultat });
							//console.log(cbxresultat, bneresultat, bnsresultat);
							res.json({
								data:data
							});
						}
					});
				}
			});//''
		}
	});

});
/*
routeren.delete('/stockentrer/delete/:id', (req, res) => {
	let id = req.params.id;
	req.getConnection((erreur, connection) => {
		if (erreur) {
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			connection.query(
				'DELETE FROM stock_entrer WHERE id_ent = ?',
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
});*/

routeren.post("/stockentrer/delete", (req, res) => {
	let bneid = req.query.bneid;
	//req.body must call a middleware
	//console.log(req.body);
	//let id = req.body.id === "" ? null : req.body.id;
	let ident = req.body.ident;
	let bneidd = req.body.bneid;
	let idpro = req.body.idpro;
	let qtedel = req.body.qteent;
	let montantdel = req.body.montant;
	// id_bne: id_bne, prodid: produitval, qte: qte, montant: montant, date: date, montanttotal: montanttotal
	//let current_timestamp = Date().toString();
	//let adrs = req.body.Description;

	//let reqSQL = 'DELETE FROM stock_entrer WHERE id_ent = ?'
	let reqSQL = 'DELETE FROM stock_entrer WHERE `stock_entrer`.`id_ent` = ?'

	console.log('ident = '+ident+' bne_id = '+bneid +' bnedd ='+bneidd);

	let donnees = [ident];

	//let notification = id === null ? 'insertion de produit avec succés' : 'modification de produit avec succés';

	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			//connection.query('INSERT INTO `produits` (`id_cli`, `nom_cli`, `prenom_cli`, `tel_cli`, `adresse`) VALUES (?, ?, ?, ?, ?)', [null, nomcli,prenomcli,telcli,adrs], (erreur, resultat)=> {
			connection.query(reqSQL, donnees, (erreur, result)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					//req.flash('message', notification); //call for the message : in flash
					//res.status(300).redirect('/produits');
					console.log(result);
					connection.query('UPDATE `bn_entrer` SET `montant_total` = `bn_entrer`.`montant_total`-? WHERE `bn_entrer`.`bne_id` = ?', [montantdel,bneidd]);
					connection.query('UPDATE `produits` SET `quantite` = `produits`.`quantite`-?,`produits`.`date_updated`=? WHERE `produits`.`id_prod` = ?', [qtedel,null,idpro]);
					connection.query('SELECT * FROM stock_entrer JOIN bn_entrer JOIN produits WHERE stock_entrer.bne_id = bn_entrer.bne_id AND stock_entrer.id_prod = produits.id_prod AND stock_entrer.bne_id=?', [bneidd],  (erreur, data)=> {
						if (erreur) {
							console.log(erreur);
						} else {
							//res.status(200).render('product', { bnsresultat });
							//console.log(cbxresultat, bneresultat, bnsresultat);
							res.json({
								data:data
							});
						}
					});
				}
			});//''
		}
	});

});


routeren.post("/getvalueprod", (req, res) => {
	let selectValue = req.body.selectValue;

	let reqSQL = 'SELECT * FROM produits WHERE id_prod = ?'

	//console.log('ident = '+ident+' bne_id = '+bneid +' bnedd ='+bneidd);
	console.log(selectValue)

	let donnees = [selectValue];

	//let notification = id === null ? 'insertion de produit avec succés' : 'modification de produit avec succés';

	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			//connection.query('INSERT INTO `produits` (`id_cli`, `nom_cli`, `prenom_cli`, `tel_cli`, `adresse`) VALUES (?, ?, ?, ?, ?)', [null, nomcli,prenomcli,telcli,adrs], (erreur, resultat)=> {
			connection.query(reqSQL, donnees, (erreur, result)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					//allresultat[1].bne_id
					//console.log(allresultat[1].bne_id);
					console.log(result[0].prix);
					res.json({
						data:result[0].prix,
						qtestock:result[0].quantite
					});
				}
			});//''
		}
	});

});

//SELECT * FROM stock_sortir JOIN bn_sortir JOIN produits WHERE stock_sortir.bns_id = bn_sortir.bns_id AND stock_sortir.id_prod = produits.id_prod AND stock_sortir.bns_id=3
//DELETE FROM stock_sortir WHERE `stock_sortir`.`id_srt` = 1
//INSERT INTO `stock_sortir` (`id_srt`, `bns_id`, `id_prod`, `qte_srt`, `date_srt`) VALUES (NULL, '3', '2', '10', '2023-03-27');


/**
 * 
 * 
 * for bn sortir
 */


///sortir

routeren.get("/stocksortir", (req, res) => {
	const idbns = req.query.bnsid;
  	////const nom = req.query.nom;
	console.log(idbns);
	if(idbns != null) {
		req.getConnection((erreur, connection)=> {
			if(erreur){
				console.log(erreur);
				res.status(500).render('pages/error', {erreur});
			} else {
				//connection.query('SELECT * FROM stock_sortir JOIN bn_sortir JOIN produits WHERE stock_sortir.bns_id = bn_sortir.bns_id AND stock_sortir.id_prod = produits.id_prod AND stock_sortir.bns_id=?', [idbns], (erreur, allresultat)=> {
				connection.query('SELECT * FROM stock_sortir JOIN bn_sortir JOIN clients JOIN produits WHERE stock_sortir.bns_id = bn_sortir.bns_id AND bn_sortir.id_cli = clients.id_cli AND stock_sortir.id_prod = produits.id_prod AND stock_sortir.bns_id=?', [idbns], (erreur, allresultat)=> {
					if (erreur) {
						console.log(erreur);
					} else {
						//res.status(200).render('product', { bneresultat });
						//res.status(200).render('inout', { bneresultat, message : req.flash('message') });
						connection.query('SELECT * FROM `produits`', [], (erreur, cbxproresultat)=> {
							if (erreur) {
								console.log(erreur);
							} else {
								//res.status(200).render('product', { bnsresultat });
								//res.status(200).render('inout', { bneresultat, bnsresultat, message : req.flash('message') });
								connection.query('SELECT id_cli,nom_cli,prenom_cli FROM `clients`', [], (erreur, cbxcliresultat)=> {
									if (erreur) {
										console.log(erreur);
									} else {
										//res.status(200).render('product', { bnsresultat });
										//console.log(cbxresultat, bneresultat, bnsresultat);
										//console.log(allresultat);
										//console.log(allresultat[1].bne_id);
										connection.query('SELECT * FROM `bn_sortir` WHERE bn_sortir.bns_id=?', [idbns], (erreur, btnnsresult)=> {
											if (erreur) {
												console.log(erreur);
											} else {
												//res.status(200).render('product', { bnsresultat });
												//console.log(cbxresultat, bneresultat, bnsresultat);
												//console.log(allresultat);
												//console.log(allresultat[1].bne_id);
												res.status(200).render('stock_out', { allresultat, cbxproresultat, idbns, btnnsresult, cbxcliresultat, message : req.flash('message') });
											}
										});
									}
								});
							}
						});
					}
				});//''
			}
		});
	} else {
		console.log('ok zlh');
		res.status(200).render('hello', { hello: 'haha' });
	}
	
});

routeren.post("/stocksortir/add", (req, res) => {
	//req.body must call a middleware
	//console.log(req.body);
	let id = req.body.id === "" ? null : req.body.id;
	let bnsid = req.body.id_bns;
	let idprod = req.body.prodid;
	let datesrt = req.body.datesrt;
	let qteprod = req.body.qte;
	let montant = req.body.montant;
	// id_bns: id_bns, prodid: produitval, qte: qte, montant: montant, date: date, montanttotal: montanttotal
	//let current_timestamp = Date().toString();
	//let adrs = req.body.Description;

	let reqSQL = id === null 
		? 'INSERT INTO `stock_sortir` (`id_srt`, `bns_id`, `id_prod`, `qte_srt`, `montant`, `date_srt`) VALUES (?, ?, ?, ?, ?, ?)'
		: 'UPDATE stock_sortir SET bns_id = ?, id_prod = ?, qte_srt = ?, montant, date_srt = ? WHERE id_srt = ?';

	let donnees = id === null ? [null, bnsid,idprod,qteprod,montant,datesrt] : [bnsid,idprod,qteprod,montant,datesrt,id];

	let notification = id === null ? 'insertion de produit avec succés' : 'modification de produit avec succés';

	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			//connection.query('INSERT INTO `produits` (`id_cli`, `nom_cli`, `prenom_cli`, `tel_cli`, `adresse`) VALUES (?, ?, ?, ?, ?)', [null, nomcli,prenomcli,telcli,adrs], (erreur, resultat)=> {
			connection.query(reqSQL, donnees, (erreur, data)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					//req.flash('message', notification); //call for the message : in flash
					//res.status(300).redirect('/produits');
					//UPDATE `produits` SET `quantite` = '0' WHERE `produits`.`id_prod` = 1;
					//UPDATE `produits` SET `quantite` = `produits`.`quantite`+5 WHERE `produits`.`id_prod` = 1;
					console.log(data);
					//connection.query('UPDATE produits SET quantite = ? WHERE id_prod = ?', [qteprod,idprod]);
					connection.query('UPDATE `bn_sortir` SET `montant_total` = `bn_sortir`.`montant_total`+? WHERE `bn_sortir`.`bns_id` = ?', [montant,bnsid]);
					connection.query('UPDATE `produits` SET `quantite` = `produits`.`quantite`-?,`produits`.`date_updated`=? WHERE `produits`.`id_prod` = ?', [qteprod,null,idprod]);
					connection.query('SELECT * FROM stock_sortir JOIN bn_sortir JOIN clients JOIN produits WHERE stock_sortir.bns_id = bn_sortir.bns_id AND bn_sortir.id_cli = clients.id_cli AND stock_sortir.id_prod = produits.id_prod AND stock_sortir.bns_id=?', [bnsid],  (erreur, data)=> {
						if (erreur) {
							console.log(erreur);
						} else {
							//res.status(200).render('product', { bnsresultat });
							//console.log(cbxresultat, bneresultat, bnsresultat);
							res.json({
								data:data
							});
						}
					});
				}
			});//''
		}
	});

});


routeren.post("/stocksortir/delete", (req, res) => {
	let bnsid = req.query.bnsid;
	//req.body must call a middleware
	//console.log(req.body);
	//let id = req.body.id === "" ? null : req.body.id;
	let idsrt = req.body.idsrt;
	let bnsiid = req.body.bnsid;
	let idpro = req.body.idpro;
	let qtedel = req.body.qtesrt;
	let montantdel = req.body.montant;
	// id_bns: id_bns, prodid: produitval, qte: qte, montant: montant, date: date, montanttotal: montanttotal
	//let current_timestamp = Date().toString();
	//let adrs = req.body.Description;

	//let reqSQL = 'DELETE FROM stock_entrer WHERE id_ent = ?'
	let reqSQL = 'DELETE FROM stock_sortir WHERE `stock_sortir`.`id_srt` = ?'

	console.log('idsrt = '+idsrt+' bne_id = '+bnsid +' bnedd ='+bnsiid);

	let donnees = [idsrt];

	//let notification = id === null ? 'insertion de produit avec succés' : 'modification de produit avec succés';

	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			//connection.query('INSERT INTO `produits` (`id_cli`, `nom_cli`, `prenom_cli`, `tel_cli`, `adresse`) VALUES (?, ?, ?, ?, ?)', [null, nomcli,prenomcli,telcli,adrs], (erreur, resultat)=> {
			connection.query(reqSQL, donnees, (erreur, result)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					//req.flash('message', notification); //call for the message : in flash
					//res.status(300).redirect('/produits');
					console.log(result);
					connection.query('UPDATE `bn_sortir` SET `montant_total` = `bn_sortir`.`montant_total`-? WHERE `bn_sortir`.`bns_id` = ?', [montantdel,bnsiid]);
					connection.query('UPDATE `produits` SET `quantite` = `produits`.`quantite`+?,`produits`.`date_updated`=? WHERE `produits`.`id_prod` = ?', [qtedel,null,idpro]);
					connection.query('SELECT * FROM stock_sortir JOIN bn_sortir JOIN clients JOIN produits WHERE stock_sortir.bns_id = bn_sortir.bns_id AND bn_sortir.id_cli = clients.id_cli AND stock_sortir.id_prod = produits.id_prod AND stock_sortir.bns_id=?', [bnsiid],  (erreur, data)=> {
						if (erreur) {
							console.log(erreur);
						} else {
							//res.status(200).render('product', { bnsresultat });
							//console.log(cbxresultat, bneresultat, bnsresultat);
							res.json({
								data:data
							});
						}
					});
				}
			});//''
		}
	});

});


/* routeren.post("/getvalueprod", (req, res) => {
	let selectValue = req.body.selectValue;

	let reqSQL = 'SELECT * FROM produits WHERE id_prod = ?'

	//console.log('ident = '+ident+' bne_id = '+bneid +' bnedd ='+bneidd);
	console.log(selectValue)

	let donnees = [selectValue];

	//let notification = id === null ? 'insertion de produit avec succés' : 'modification de produit avec succés';

	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
			//connection.query('INSERT INTO `produits` (`id_cli`, `nom_cli`, `prenom_cli`, `tel_cli`, `adresse`) VALUES (?, ?, ?, ?, ?)', [null, nomcli,prenomcli,telcli,adrs], (erreur, resultat)=> {
			connection.query(reqSQL, donnees, (erreur, result)=> {
				if (erreur) {
					console.log(erreur);
				} else {
					//allresultat[1].bne_id
					//console.log(allresultat[1].bne_id);
					console.log(result[0].prix);
					res.json({
						data:result[0].prix
					});
				}
			});//''
		}
	});

}); */

module.exports = routeren;

