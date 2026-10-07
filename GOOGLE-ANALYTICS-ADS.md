# Préparation Google Analytics et Google Ads — On Débarrasse

## État actuel
Toutes les pages sont préparées, mais le suivi est désactivé. Aucun script Google, identifiant GA4/Ads, cookie, stockage, requête réseau ou envoi de données n’a été ajouté. Aucun événement n’est mis en attente. Le design et les textes visibles sont inchangés.

## Plan de mesure
| Action | Événement prévu | Déclenchement | Rôle conseillé |
|---|---|---|---|
| Clic « Obtenir une soumission » | `quote_cta_click` | Clic du bouton, emplacement identifié | Secondaire : intention, pas une demande reçue |
| Envoi réel du formulaire | `generate_lead` | Réponse de succès du futur serveur d’envoi | Principale : demande reçue |
| Clic téléphonique | `phone_click` | Clic sur un futur lien `tel:` | Secondaire : ne prouve pas un appel abouti |
| Demande de rendez-vous | `appointment_request` | Confirmation réelle du futur service de réservation | Principale si cet objectif est retenu |
| Paiement | `purchase` | Confirmation réelle du futur prestataire de paiement | Principale : paiement confirmé |

Le téléphone reste à renseigner : aucun faux numéro ou lien téléphonique n’est créé. Les fonctionnalités de rendez-vous et paiement n’existent pas encore : seuls leurs points d’intégration sont préparés.

## Points d’intégration
- Les boutons de soumission portent `data-od-track="quote_cta_click"` et `data-od-location`.
- Le formulaire porte `data-od-mode="demo"`. Son bouton de démonstration ne déclenche pas `generate_lead`.
- La page de confirmation ne déclenche aucun événement à son chargement.
- L’API locale `window.OnDebarrasseMeasurement` expose `formSuccess`, `appointmentSuccess` et `paymentSuccess`. Elle est désactivée et retourne `false` sans transmettre de données.
- Les événements de succès nécessitent `success: true`, `demo: false` et un `event_id` opaque sans données personnelles. Le futur code serveur doit confirmer le succès ; l’API navigateur n’est pas une preuve en soi.
- Le paiement exige aussi un montant réellement payé et `currency: "CAD"`. Ne pas utiliser les tarifs indicatifs comme revenu.
- Les identifiants permettent une déduplication en mémoire sur une même page. Une déduplication durable et entre rechargements reste à implémenter côté serveur, notamment pour les demandes et rendez-vous. Utiliser un identifiant de transaction stable pour les paiements.

## Paramètres autorisés
`page_key`, `cta_location`, et pour un paiement confirmé uniquement : `transaction_id`, `value`, `currency`.
Ne jamais envoyer nom, téléphone, courriel, adresse, message, photos, noms de fichiers, URLs contenant des données personnelles ou données de formulaire. Les conversions améliorées ne sont pas préparées ni autorisées.

## Activation future — travail distinct, non réalisé
1. Fournir le domaine de production et les identifiants Google après approbation.
2. Choisir une seule voie de mesure (balises directes ou gestionnaire de balises) pour éviter les doublons.
3. Mettre en place la gestion du consentement adaptée et la politique de confidentialité ; aucune transmission avant le consentement requis.
4. Créer l’adaptateur actuellement nul et remplacer la fonction de consentement actuellement toujours fausse. Garder le suivi désactivé jusqu’à validation.
5. Connecter les points de succès aux véritables retours serveur, jamais à un clic ou à une simple redirection.
6. Configurer les événements clés GA4 et les conversions Ads : choisir import GA4 OU conversion Ads directe pour une même action, pas deux conversions principales en doublon.
7. Vérifier les paramètres de confidentialité et la politique CSP lors de l’intégration ; le formulaire bloque actuellement les connexions externes.
8. Tester consentement refusé/accepté, erreur d’envoi, formulaire démo, succès, double clic, rechargement, réservation et paiement échoué/réussi. Le refus, les erreurs et la démonstration ne doivent pas produire de conversion réelle.

Aucun résultat de conversion ni retour publicitaire ne peut être garanti par cette préparation.
