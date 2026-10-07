# On Débarrasse — Dossier complet

## Ouvrir le projet
Décompressez le dossier complet, puis ouvrez `index.html` dans votre navigateur pour consulter le site. Ouvrez séparément `gestion/gestion.html` pour consulter la démonstration de gestion. Conservez tous les fichiers dans leur organisation actuelle.

## Contenu
- `index.html` : accueil, services, tarifs, fonctionnement, secteurs desservis et FAQ.
- `contact.html` : coordonnées à compléter, secteurs et accès à la soumission.
- `soumission.html` : formulaire, photos locales, date souhaitée et préférence Matin / Après-midi / Soir.
- `confirmation.html` : aperçu de confirmation, clairement identifié comme démonstration.
- `assets/logo.png` : logo original ; également intégré dans les pages pour éviter un lien d’image cassé.
- `gestion/gestion.html` : gestion de journée avec clients fictifs, regroupement par secteur et date, volume/durée, ordre des interventions et préparation de dépôts.
- `documentation/GOOGLE-ANALYTICS-ADS.md` : événements et conditions d’activation du suivi.
- `documentation/STRIPE-INTEGRATION.md` : préparation des dépôts après confirmation et contrat serveur proposé.
- `documentation/AUTOMATISATIONS-CLIENTS.md` : cinq messages clients et règles de déclenchement.

## Fonctionnement actuel
Les pages sont consultables localement. Le menu et les liens entre pages fonctionnent. Le formulaire permet de tester la saisie et les aperçus de photos, mais ne transmet aucune demande. La date et la plage horaire sont des préférences à confirmer, pas des réservations automatiques.

La gestion utilise des clients fictifs et conserve ses modifications uniquement en mémoire jusqu’au rechargement. Le bouton de confirmation de journée et les demandes de dépôt sont des simulations. Les dépôts n’ont pas de lien Stripe et ne sont pas payables.

Les balises SEO sont préparées ; les pages de soumission/confirmation de démonstration sont exclues de l’indexation. Le suivi Analytics/Ads est désactivé.

## Ce qui n’est pas opérationnel
- Aucun serveur, base de données, stockage de demandes ou authentification administrateur.
- Aucun envoi de courriel/SMS ni automatisation active.
- Aucun encaissement Stripe.
- Aucune synchronisation du site avec Google Calendar. L’autorisation Calendar accordée dans la conversation ne constitue pas une connexion du site.
- Aucun calcul d’itinéraire réel ni optimisation automatique des tournées.
- Aucune réception réelle confirmée par la page de confirmation.

## Avant publication et activation
1. Renseigner téléphone, courriel, heures de service et mentions légales.
2. Fournir le domaine de production et finaliser les URL canoniques et la confidentialité.
3. Installer un serveur sécurisé, une base de données et une authentification pour la gestion ; ne pas exposer la gestion comme un espace administrateur opérationnel sans contrôle d’accès.
4. Connecter la réception réelle des demandes, puis la validation manuelle de la date et de l’heure finales.
5. Intégrer Calendar, Stripe et l’envoi des messages selon les documents, avec les secrets côté serveur et les confirmations de succès réelles.
6. Fournir le lien officiel d’avis Google et configurer les permissions d’envoi.
7. Activer la mesure seulement après validation du consentement, de la confidentialité et des événements réels.

Ce dossier rassemble les livrables préparés, pas un service de réservation et de paiement déjà déployé.
