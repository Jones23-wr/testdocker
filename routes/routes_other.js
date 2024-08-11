const express = require('express');
const routero = express.Router();

routero.get("/accueil", (req, res) => {
	req.getConnection((erreur, connection)=> {
		if(erreur){
			console.log(erreur);
			res.status(500).render('pages/error', {erreur});
		} else {
            connection.query('SELECT COUNT(*) as clients FROM clients', [], (erreur, cliresultat)=> {
				if (erreur) {
					console.log(erreur);
				} else {
                    connection.query('SELECT COUNT(*) as produits FROM produits', [], (erreur, proresultat)=> {
                        if (erreur) {
                            console.log(erreur);
                        } else {
                            connection.query('SELECT COUNT(*) as bn_entrer FROM bn_entrer', [], (erreur, bneresultat)=> {
                                if (erreur) {
                                    console.log(erreur);
                                } else {
                                    connection.query('SELECT COUNT(*) as bn_sortir FROM bn_sortir', [], (erreur, bnsresultat)=> {
                                        if (erreur) {
                                            console.log(erreur);
                                        } else {
                                            connection.query('SELECT COUNT(*) as qte FROM produits WHERE quantite != 0', [], (erreur, prresultat)=> {
                                                if (erreur) {
                                                    console.log(erreur);
                                                } else {
                                                    //console.log(prresultat);
                                                    //console.log(cliresultat);
                                                    //res.status(200).render('customer', { resultat });
                                                    res.status(200).render('home', { cliresultat, proresultat, bneresultat, bnsresultat, prresultat, message : req.flash('message')  });
                                                }
                                            });//''
                                        }
                                    });
                                }
                            });
                        }
                    });
				}
			});
		}
	});
});
/*
routero.post("/clients/add", (req, res) => {
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

routero.delete('/clients/delete/:id', (req, res) => {
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
*/

routero.get("/facturebon", (req, res) => {
	const idbne = req.query.azazeeazutyezyttyajhlahzljhqsuypapzeuioazupiua;
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
												res.status(200).render('facture_bon', { allresultat, cbxproresultat, idbne, bnttresult, message : req.flash('message') });
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
		res.status(200).render('stock_in', { hello: 'haha' });
	}	
});




routero.get("/facture", (req, res) => {
	const idbns = req.query.ertszazeeazutyezyttyajhlahzljhqsuypapzeuioupiua;
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
												res.status(200).render('facture', { allresultat, cbxproresultat, idbns, btnnsresult, cbxcliresultat, message : req.flash('message') });
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


module.exports = routero;

