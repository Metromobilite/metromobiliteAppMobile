﻿// *
// Metromobilité is the mobile application of Grenoble Alpes Métropole <http://www.metromobilite.fr/>.
// It provides all the information and services for your travels in Grenoble agglomeration.
// Available for Android, iOs, Windows Phone, it's been developed on Cordova https://cordova.apache.org/.

// Copyright (C) 2013
// Contributors:
//	NB/VT - sully-group - www.sully-group.fr - initialisation and implementation

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
// *

//--------------------------------------//
// global translation
//--------------------------------------//
var lang = {
	momentLocale:'fr',
	pointCarte:'Saisie carte',
	maPosition:'Ma position',
	rafraichir:'Rafraichir',
	rechercheEnCours:'Recherche en cours',
	numeroNonTrouve:"le numéro demandé n'a pas été trouvé",
	OTPlocale:'fr_FR',
	modifChoix: "Modifier votre choix...",
	calculEnCours: "Calcul en cours...",
	trafficFluide: "fluide",
	trafficPerturbe: "perturbé",
	perturbations: "Perturbations",
	aucunePerturbation: "Aucune",
	aucunePerturbation_full: "Aucune perturbation en cours",
	aucunFavoris: "Retrouvez ici vos itinéraires, caméras, places de parking et horaires de prochains passages favoris.",
	aucuneLignesFavorites: "Retrouvez ici vos horaires de prochains passages favoris",
	aucunParkingFavoris: "Retrouvez ici la disponibilité de vos parkings favoris",
	aucuneCamFavorites: "Retrouvez ici vos caméras favorites",
	aucunItiFavoris: "Retrouvez ici vos itinéraires favoris",
	aucuneNotif: "Aucune notification",
	libelleAddresseNonTrouvee: "Adresse non trouvée",
	localisationEvenement: "Localiser sur la carte",
	station: "Station",
	affichageDesCartographie: "Données à afficher",
	affichageDes: "Affichage des ",
	voirSurCarte: " Voir sur la carte",
	messagesEmissionCO2 : { // Message affiché pour l'émission de CO2
		// Pour les trajets à vélo
		'Velo' : "L'émission de CO2 pour ce trajet est quasiment-nulle.<br/>Félicitations, en utilisant ce moyen de déplacement, vous contribuez à une meilleure qualité de l'air.",
		// Pour les trajets piétons
		'Pieton' : "L'émission de CO2 pour ce trajet est nulle.<br/>Félicitations, en utilisant ce moyen de déplacement, vous contribuez à une meilleure qualité de l'air.",
		// Pour les trajets en voiture
		'Voiture' : "Pour ce trajet en voiture non électrique de $4km:<br/>	- vous émettez environ $1g de CO2<br/><br/>Cette émission serait $2quasiment nulle à vélo et de $3g en transport en commun. Utiliser ces modes vous permettrait de contribuer à une meilleure qualité de l'air.",
		// morceau rajouté dans le message pour les trajets en voiture dans la variable $2 si le trajet est inférieur à 3km -->
		'SiTrajetInferieurA3Km' : "nulle pour ce trajet en marche à pied, ",
		// Pour les trajets TC
		'TC' : "Pour ce trajet en transports en commun d'environ $3km, vous émettez :<br/>	- $2g de CO2,<br/>	- mais économisez $1g de CO2 par rapport à la voiture individuelle.<br/>A vélo, cette émission aurait été quasiment nulle.",
		// Pour les trajets TC + Voiture
		'VoitureTC' : "Avec ce trajet multimodal, vous émettez $1g de CO2.<br/>L'utilisation des transports en commun vous permet de réduire l'émission de $2g de C02 par rapport à un trajet réalisé tout en voiture.",
		// Pour les trajets ne correspondant à aucun des cas précédents. Ce message n'apparait éventuellement que pour un cas oublié théoriquement
		'Mixte' : "Le trajet mixte réalisé émet $1g de CO2.;",
		// Pour les trajets en iRoad
		'Voiture partagée' : "Pour ce trajet en voiture partagée électrique l'émission de CO2 est quasiment-nulle.<br/>Félicitations, en utilisant ce moyen de déplacement, vous contribuez à une meilleure qualité de l'air."
	},
	bogusName : "Route sans nom",
	
	horaires :
	{
		direction : "direction: ",
		Direction : "Direction: ",
		choixArret : "Choisissez votre arrêt",
		arret : "Arrêt: ",
		perturbation : "Attention perturbation sur la ligne" ,
		
		fermerBtnClosedatePicker :"fermer",
		btnPreviousdatePicker :"Mois Precedent",
		btnMonthdatePicker 	:"Mois Choisit",
		btnNextdatePicker :"Mois Suivant", 
		
		fermerBtnClosetimepicker:"fermer",		
		btnIncHrtimepicker :"Ajouter Heure",
		btnInCMntimepicker :"Ajouter Minute",		
		showHrtimepicker :"Heure",
		showMntimepicker :"Minute",
		btnDecHrtimepicker :"Diminuer Heure",
		btnDecMntimepicker :"Diminuer Minute"
	
	
	
	
		
	
	
	
	
	
	
	
	
	
	},
	
	iti : {
		Autopartage : "Auto partage",
		Parking : "Parking",
		Metrovelo : "Métrovélo",
		AgenceMetrovelo : "Agences Métrovélo",
		ConsignesMetrovelo : "Consignes Métrovélo",
		AgenceMetromobilite : "Agences Métromobilité",
		Autres : "Autres",
		plusDeDetails: " plus de détails...",
		moinsDeDetails: " moins de détails...",
		Distance : "Distance",
		DenivNeg : "D- ",
		DenivPos : "D+ ",
		tempsStationnement : "Temps de Stationnement",
		minutes : "minutes",
		covoiturage : "Covoiturage",
		reservation : "Ligne sur réservation à certaines heures. En savoir plus :",
		reservationSemaine : "Ligne sur réservation à certaines heures et uniquement la semaine. En savoir plus :",
		lienTag : "Fiche horaire TAG",
		flexo : "Site TAG",
		plusDOption : " Plus d'options",
		moinsDOption : " Moins d'options",


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	 
	
	
//Specifique pour la traduction de js
		itineraire :  "Itineraire",
		stopDepart : "Arrêt ou adresse de départ",
		stopArrivee : "Arrêt ou adresse d'arrivée",
		retour : "Inverser le depart et l'arrivée",
		plusOptions : "Plus d'options",
		apres : 'Après',
		avant : 'Avant',
		calculer : 'Calculer',
		resultatsPrecedent : "Resultats precedent",
		resultats : "Résultats (tri par pertinence)",
		departPrecedent : "Depart Precedent",
		trajetDetail : "Detail de l'itineraire",
		trafic : "Trafic :",
		pieton : "Pieton",
		velo : "Vélo",
		transportCommun : "Transpots en commun",
		teleferique : "Teleferique",
		voiture : "Voiture",
		pmr : "Acces PMR",
		rechercheEnCours : "Recherche En Cours",
		prochainsResultats : "Prochains Resultats",
		prochainsDeparts : "Prochains Departs",
		retourResultats : "Retour aux resultats",
		detail : "Details",
		voirCarte : "Voir sur la carte",
		imprimerCarte : "Imprimer la feuille de route",
		gps : "Trace GPS"	
	},
	
	carteMobile : {
		nbTotVehicule : "Nombre total de véhicules disponibles",
		nbTotPlace : "Nombre total de places de parking disponibles",
		photoStation : "Photo de la station",
		lignesProches : "Ligne(s) à proximité :",
		messageCAM : "Disponible prochainement",
		messageCAMError : "Votre explorateur ne supporte la lecture des vidéos.",
		messagePMV : "Pas de données",
		disponibles : " disponibles : ",
		places : " place(s)",
		velos : " vélo(s)",
		velosdisponibles : " vélo(s) disponible(s)",
		placesdisponibles : " place(s) disponible(s)",
		etatDisponible : "Disponible",
		etatNonDisponible : "Non disponible"
	},
		
	// note: keep these lower case (and uppercase via template / code if needed)
	directions : {
		depart : "Départ",
		southeast : "le sud-est",
		southwest : "le sud-ouest",
		northeast : "le nord-est",
		northwest : "le nord-ouest",
		north : "le nord",
		west : "l'ouest",
		south : "le sud",
		east : "l'est",
		bound : "en direction",
		left : "à gauche",
		right : "à droite",
		slightly_left : "légèrement à gauche",
		slightly_right : "légèrement à droite",
		hard_left : "complètement à gauche",
		hard_right : "complètement à droite",
		'continue' : "continuer sur",
		to_continue : "pour continuer sur",
		becomes : "devenant",
		at : "à",
		on : "sur",
		to : "vers",
		via : "via",
		circle_counterclockwise : "prendre le rond-point",
		circle_clockwise : "prendre le rond-point dans le sens horaire",
		// rather than just being a direction, this should be
		// full-fledged to take just the exit name at the end
		elevator: "prendre l'ascenseur niveau",
		stops : "arrêts"
	},
	// see otp.planner.Templates for use ... these are used on the trip
	// itinerary as well as forms and other places
	instructions : {
		walk : "Marche à pied",
		walk_toward : "Marcher vers",
		walk_verb : "Marcher",
		bike : "Trajet à vélo",
		bike_toward : "Pédaler vers",
		bike_verb : "Pédaler",
		drive : "Conduite",
		drive_toward : "Rouler vers",
		drive_verb : "Rouler",
		move : "Continuer",
		move_toward : "Continuer vers",

		transfer : "correspondance",
		transfers : "correspondances",
		transit_toward : "Prendre Le ",
		transit_towards : "Prendre Les ",
		continue_as : "Continuer comme",
		stay_aboard : "rester à bord",
		step_out : "Descendre à",
		depart : "Départ",
		arrive : "Arrivée",

		start_at : "Départ à",
		end_at : "Arrivée à",
		exit : "Prendre la sortie"
	},
	// see otp.planner.Templates for use -- one output are the itinerary leg
	// headers
	modes : {
		WALK : "Marche à pied",
		BICYCLE : "Vélo",
		CAR : "Voiture",
		TRAM : "Tramway",
		SUBWAY : "Métro",
		RAIL : "Train",
		BUS : "Bus",
		FERRY : "Ferry",
		CABLE_CAR : "Bulles",
		GONDOLA : "Téléphérique",
		FUNICULAR : "Funiculaire"
	},

	ordinal_exit : {
		1 : "(première sortie)",
		2 : "(deuxième sortie)",
		3 : "(troisième sortie)",
		4 : "(quatrième sortie)",
		5 : "(cinquième sortie)",
		6 : "(sixième sortie)",
		7 : "(septième sortie)",
		8 : "(huitième sortie)",
		9 : "(neuvième sortie)",
		10 : "(dixième sortie)"
	},
	detail : {
		detailTrajet : "Détail du trajet",
		fermerDetailTrajet : "Fermer le détail du trajet",
		voieSansNom : "une voie sans nom",
		rondPoint : "au rond point"
	},

	resultatsASupprimer : {
		1 : " sur <strong>Route sans nom</strong>"
	},
	resultatsARemplacer : {
		1 : ""
	},
	alert: [ 	"ATTENTION ! Veuillez préciser vos adresses de départ et d'arrivée !",
				"ATTENTION ! Veuillez saisir une adresse d'arrivée différente de celle de départ !",
				"ATTENTION ! Adresse introuvable...<br/>Merci de bien vouloir saisir une autre adresse...",
				"Attention vous n'avez pas ou plus de connexion internet... cette application peut ne pas fonctionner correctement. Merci de vous reconnecter puis relancer l'application.",
				"Retour de la connexion internet, cette application pourra fonctionner à nouveau correctement.",
				"Veuillez autoriser la réception de notification pour cette application, la relancer puis réessayer",
				"Veuillez renseigner correctement votre identifiant et mot de passe puis réessayer",
				"Echec de l'authentification, merci de vérifier votre abonnement",
				"Abonnement non validé, merci de valider votre abonnement",
				"Le serveur est indisponible, merci recommencer plus tard",
				"Echec, erreur inconnue. veuillez relancer l'application puis réessayer"
	],
	libelleAffiche_1 : "Affiche les ",
	libelleHorairePrec_2 : " horaires précédents",
	libelleHoraireSuivant_2 : " horaires suivants",
	libelleHorairePrec : "&lt;&lt; Précédents",
	libelleHoraireSuiv : "Suivants &gt;&gt;",
	libelleFicheTag : "&nbsp Fiche Horaire TAG format PDF",
	libelleMessageFlexo : "Cette ligne fonctionne sur réservation en heures creuses. Il est nécessaire de réserver jusqu’à 2 heures avant son déplacement, sur le site tag.fr ou en appelant le 04-38-70-38-70",
	libelleMessageFlexo62 : "Cette ligne fonctionne sur réservation la semaine et régulièrement  le samedi. La semaine, il est nécessaire de réserver jusqu’à 2 heures avant son déplacement, sur le site tag.fr ou en appelant le 04-38-70-38-70",
	libelleMessageErreurHoraires : "Suite à un dysfonctionnement nous ne sommes pas en mesure de vous fournir les horaires de cette ligne. Nous vous invitons à consulter les fiches horaires au format PDF ci-dessous.",
	indiceAtmo : [
		"n.c.",
		"Très bon",
		"Très bon",
		"Bon",
		"Bon",
		"Moyen",
		"Médiocre",
		"Médiocre",
		"Mauvais",
		"Très mauvais",
		"Très mauvais"],
	indiceTrafic : [
		"n.c.",
		"Fluide",
		"Ralenti",
		"Embouteillé",
		"Fermé"],
	indiceTC : [
		"n.c.",
		"Service normal",
		"Service perturbé",
		"Service très perturbé",
		"Hors horaire de service"],
	alertHoraire : [ 
			"Impossible de charger les données json, merci de rafraichir votre page.",
			"Aucune destination desservie pour cette ligne jusqu'à la fin de cette journée"],
	aucunHoraireTR : "Pas de passages dans l'immédiat.",
	donneesManquantes : "Données inaccessibles. Reportez-vous aux horaires théoriques",
	horairesTheoriques : " : horaire réel",
	velo : {
			nom_commune : "Commune",
			type_amenagement : "Type d'aménagement"},
	itineraire : {
			dep : "de",
			depart : "départ",
			arrivee : "arrivée",
			arr : "à",
			departAvant : "départ après",
			arriveeApres : "arrivée avant",
			duree : "durée",
			trafic : "trafic",
			emission : "Emission de CO2"},
	erreurPosition : [
		"Erreur lors de la géolocalisation : ",
		"Delai d'attente depassé !",
		"Vous n’avez pas donné la permission",
		"La position n’a pu être déterminée",
		"Merci de vérifier l'activation de votre géelocalisation dans vos paramétrages."

	],
	questionLocaliser : "Activer la localisation ?",
	alerteHorsRectangle : "Vous parraissez trop éloigné de la région Grenobloise, il n'y a pas de donnée décrite dans cette zone",
	pub : {
			text : "Un service de Métromobilité",
			alt : "Cliquez pour vous rendre sur Metrobilite.fr"
	},
	opendata: {
		horairesTheoriquesTAG : {
			desc :"Horaires théoriques du reseau TAG au format GTFS."
		},
		format : {
			GTFS : "Les spécifications du format GTFS sont disponibles en anglais <a href='https://developers.google.com/transit/gtfs/reference' title='Spécifications du format GTFS, en anglais - Nouvelle fenêtre' target='_blank'>ici</a>."
		}
	},
	popup: {
		arret: "Arrêt",
		maintenant: "Maintenant",
		plusTard: "Plus tard",
		non: "Non merci",
		oui: "Oui",
		renseigner: "Merci de renseigner les éléments ci-dessus"
	},
	appMobile: {
		rateMe : "Vous appréciez cette application ? Prenez une minute pour la noter et laisser un commentaire.",
		autour : "Autour de moi",
		AUTOUR : "AUTOUR DE MOI",
		itineraire : "Itineraire",
		itineraires : "Itineraires",
		ITINERAIRE : "ITINERAIRE",
		infoTrafic : "Info trafic",
		trafic: "Trafic",
		TRAFIC: "TRAFIC",
		horaires: "Horaires",
		HORAIRES: "HORAIRES",
		favoris: "Favoris",
		FAVORIS: "FAVORIS",
		parametres: "Paramètres",
		PARAMETRES: "PARAMETRES",
		aPropos: "A propos",
		APROPOS: "A PROPOS",
		alerteSignalement : "Signalement Alerte",
		ATMO: "ATMO",
		Atmo: "Atmo",
		monCompte: "Mon compte",
		MONCOMPTE: "MON COMPTE",
		indiceAtmo:"Indice Atmo",
		agrandir: "Cliquez pour agrandir",
		cartographieAtmo: "Cartographie Atmo",
		annuler: "Annuler",
		supp: "Supp.",
		suppTout: "Supp. tous",
		affiche: "Afficher",
		reseauRoutier: "Réseau routier",
		evenements: "Evènements",
		cameras: "Caméras",
		parking: "Parking",
		parkingRelais: "Parc-relais",
		venteTitres: "Vente de titres",
		pointsServices: "Points Services",
		distributeurs: "Distributeurs",
		depositaires:  "Depositaires",
		arrets: "Arrêts",
		poteaux: "Poteaux",
		tc: "Transports en commun",
		bonjour: "Bonjour,",
		afficher: "Afficher : ",
		derniereMaj: "Dernière mise à jour : ",
		rue: "Rue",
		lieu: "Lieu",
		pmv: "Panneaux à messages variables",
		autostop:"autostop organisé",	
		recharge :"Bornes de Recharges",
		camera: "Caméras de circulation",
		parking: "Parkings",
		PR: "P+R",
		resulatrecherche: "Resultat de recherche",
		signaler: "Pour signaler un évènement à Métromobilité, veuillez renseigner le formulaire ci-dessous et éventuellement prendre une photo.",
		accident: "Accident",
		bouchon: "Bouchon",
		obstacle: "Obstacle",
		autre: "Autre",
		descriptionEvenement: "Description de l'évènement",
		inclurePosition: " Inclure ma position",
		inclurePositionDesc: " Afin de pouvoir inclure votre position, activer le service de localisation puis, appuyer ici.",
		prendrephoto: " Prendre une photo",
		application : "Une application de Grenoble Alpes Métropole",
		creditTechnique:  "Crédits techniques: ",
		mentionsLegales : "Mentions légales",
		creditDonnees : "Crédits de données: ",
		siteWeb : "Site web : ",
		faq : "FAQ : ",
		contact : "Contact : ",
		envoyerMail : " Envoyer un email",
		version : "Version : ",
		serviceSIV : "Pour utiliser ce service, vous devez, au préalable, créer un compte dans la rubrique Mon compte du site ",
		identifiant : "Votre identifiant",
		entrezIdentifiant : "Entrez votre identifiant",
		motDePasse : "Votre mot de passe",
		entrezMotDePasse : "Entrez votre mot de passe",
		valider : "Valider",
		cliquezValider : "En cliquant sur le bouton Valider vos alertes seront redirigées vers ce téléphone.",
		modesilencieux : "en mode silencieux",
		modeSonnerie : "en mode sonnerie",
		modeVibreur : "en mode vibreur",
		nbspArret : " arrets",
		departItineraire : "départ itinéraire",
		arriveeeItineraire : "arrivée itinéraire",
		selectionnezPanneau : "Sélectionnez la ligne dans le panneau de gauche",
		notifications : "Notifications",
		mesAlertes : "Mes alertes",
		placesLibres : "Places Libres: ",
		triParcours : "Tri selon l'ordre du parcours",
		triAlphabetique : "Tri par ordre alphabétique",
		accueil : "Accueil",
		langage : "Langage",
		pagedemarrage : "Page de Démarrage"
	}
};

