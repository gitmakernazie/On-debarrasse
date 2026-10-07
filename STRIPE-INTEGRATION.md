# Dépôts après confirmation — préparation Stripe

## État actuel
L’interface de gestion ajoute un montant de dépôt en CAD par client planifié. La préparation du dépôt est désactivée tant que le rendez-vous n’est pas confirmé dans la démonstration. Le montant n’est pas prédéfini. Aucun paiement réel, aucune collecte de carte, aucune requête Stripe, aucun lien envoyé, aucune clé et aucune session Checkout ne sont créés. Les brouillons restent en mémoire et disparaissent au rechargement.

Les autres fonctionnalités ne changent pas. Les pages publiques ne sont pas modifiées. « Confirmé — démo » ne constitue pas une confirmation de production. Le système existant n’enregistre pas encore de date/heure finale ni de rendez-vous côté serveur.

## Flux prévu en production
1. L’administrateur authentifié examine la demande et confirme un rendez-vous avec date et heure finales dans la base de données.
2. Il saisit le montant du dépôt et valide la demande de paiement.
3. Le serveur vérifie ses droits, le statut confirmé et l’absence de dépôt déjà payé, puis crée une session Stripe Checkout hébergée.
4. Le lien est transmis au client par un canal à intégrer séparément. Aucune invitation de paiement ne doit partir sur un simple clic de démonstration.
5. Stripe collecte les données de carte. Elles ne passent jamais par le site ni ses journaux.
6. Le serveur reçoit un webhook Stripe dont la signature est vérifiée, rapproche le paiement avec le dépôt puis marque celui-ci payé uniquement après confirmation effective.
7. Une redirection vers une page de réussite n’est jamais une preuve de paiement.

## Contrat serveur proposé — non implémenté
POST /api/admin/appointments/{appointment_id}/deposit-checkout
Authentification administrateur et protection CSRF requises. Entrée : identifiant du rendez-vous et montant souhaité en cents entiers CAD. Le serveur fixe la devise, valide les limites métier et persiste le montant avant l’appel Stripe ; ne jamais faire confiance à un montant fourni par le client public.

Réponse : identifiant opaque du dépôt, identifiant de session et URL Checkout validée. Une clé d’idempotence stable par dépôt/version évite les doubles créations. Refuser toute création pour un rendez-vous non confirmé, annulé ou un dépôt déjà payé.

POST /api/stripe/webhook
Recevoir le corps brut et vérifier la signature avec le secret webhook. Dédupliquer les identifiants d’événement dans la base. Pour Checkout, contrôler le statut de paiement, le montant, la devise et les identifiants rapprochés ; gérer les moyens de paiement asynchrones, les échecs et l’expiration. Ne pas marquer payé si payment_status n’est pas paid.

## États à persister
Rendez-vous : en attente / confirmé / annulé.
Dépôt : brouillon / demandé / payé / expiré / annulé / remboursé.
Stocker appointment_id, deposit_id, montant en cents, devise CAD, checkout_session_id, payment_intent_id, statut et horodatages. Une modification de date/heure ou de montant doit être examinée manuellement et traitée côté serveur ; ne pas réutiliser silencieusement un ancien lien.

## Configuration à fournir plus tard
Hébergement serveur, base de données, authentification administrateur, clés Stripe test puis production, secret webhook et domaine HTTPS. Garder les secrets côté serveur uniquement. Définir les règles de dépôt, annulation, remboursement et taxes avant publication ; aucune règle n’a été inventée ici.

Le module de mesure existant reste désactivé. Un éventuel événement purchase doit correspondre au dépôt réellement encaissé, avec un identifiant de transaction stable, pas au montant total estimé du débarras ; éviter de compter deux fois un même paiement.

## Tests avant activation
Rendez-vous non confirmé, accès administrateur refusé, montant invalide, double clic, session expirée, paiement refusé, paiement asynchrone, webhook falsifié/dupliqué, modification du rendez-vous et remboursement. Tester d’abord dans l’environnement Stripe test.

Documentation officielle à consulter lors de l’implémentation :
- https://docs.stripe.com/payments/checkout
- https://docs.stripe.com/webhooks
- https://docs.stripe.com/api/idempotent_requests
