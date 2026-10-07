# On Débarrasse — Automatisations de communication client

## État de la préparation
Les cinq messages et leurs règles de déclenchement sont prêts à intégrer. Aucun envoi, fournisseur de courriel/SMS ou tâche programmée n’est activé. Le site et l’interface de gestion ne sont pas modifiés. Le formulaire et les confirmations de démonstration ne doivent déclencher aucun message réel.

Hypothèse : courriel comme canal de départ. Les textes courts peuvent être adaptés au SMS lors d’une intégration distincte, avec les permissions et mentions appropriées. Ne pas envoyer simultanément sur plusieurs canaux par défaut.

## 1. Confirmation de demande
**Déclencheur :** demande réellement reçue et enregistrée côté serveur, une seule fois par demande.

**Objet :** Votre demande de débarras est reçue

**Message :**
> Bonjour {{prenom}}, nous avons reçu votre demande de débarras. Nous allons l’examiner et vous contacter rapidement pour confirmer la suite. — On Débarrasse

**Règle :** ne pas annoncer une réservation confirmée. Ne pas affirmer que des photos ont été reçues si aucune photo n’a été jointe. Une erreur d’envoi du formulaire ne déclenche pas ce message.

## 2. Confirmation du rendez-vous
**Déclencheur :** vous confirmez manuellement un rendez-vous réel avec une date et une heure finales enregistrées.

**Objet :** Votre rendez-vous avec On Débarrasse

**Message :**
> Bonjour {{prenom}}, votre débarras est confirmé le {{date}} à {{heure}}, à {{adresse_intervention}}. Pour toute modification, répondez à ce message. — On Débarrasse

**Règle :** la date souhaitée et la préférence Matin / Après-midi / Soir ne suffisent pas. Si la date ou l’heure change, envoyer une mise à jour pour la nouvelle version du rendez-vous et remplacer le rappel prévu. Ne pas annoncer qu’un dépôt est payé sans confirmation réelle du paiement.

## 3. Rappel 24 heures avant
**Déclencheur :** 24 heures avant l’heure finale de début du rendez-vous confirmé, calculées à partir de l’instant de début enregistré.

**Objet :** Rappel de votre débarras

**Message :**
> Bonjour {{prenom}}, rappel de votre débarras le {{date}} à {{heure}}. Merci de prévoir l’accès aux objets à retirer. Pour un changement, répondez à ce message. — On Débarrasse

**Règles :**
- Afficher la date et l’heure en fuseau America/Toronto. Calculer l’instant de rappel avec un horodatage précis pour gérer les changements d’heure.
- Juste avant l’envoi, vérifier que le rendez-vous est toujours confirmé et que sa version n’a pas changé.
- Annuler le rappel si le rendez-vous est annulé ou déplacé ; en préparer un nouveau pour la date finale.
- Si le rendez-vous est confirmé moins de 24 heures avant, envoyer uniquement la confirmation, sans rappel rétroactif ou doublon immédiat.
- Ne pas envoyer un rappel devenu obsolète après une panne ; faire remonter le cas à l’entreprise.

## 4. Confirmation après le débarras
**Déclencheur :** vous marquez manuellement l’intervention réelle comme terminée. Ne pas se baser uniquement sur l’heure de fin prévue ou un événement Calendar.

**Objet :** Votre débarras est terminé

**Message :**
> Bonjour {{prenom}}, votre débarras est terminé. Merci de votre confiance envers On Débarrasse. Si vous avez une question, répondez à ce message.

**Règle :** un seul message par intervention terminée. Ne pas affirmer que le solde est réglé ni joindre automatiquement un reçu si ces actions n’ont pas été validées.

## 5. Demande d’avis Google
**Déclencheur proposé :** le lendemain de l’intervention terminée, à 10 h, en heure locale. Ce délai est un réglage proposé, pas une programmation active.

**Objet :** Votre avis sur On Débarrasse

**Message :**
> Bonjour {{prenom}}, merci d’avoir choisi On Débarrasse. Vous pouvez partager votre expérience sur Google : {{lien_avis_google}}. Merci pour votre retour !

**Règles :**
- Renseigner et vérifier le lien officiel de votre fiche Google avant toute activation. Sans lien valide, ne pas envoyer le message.
- Demander un avis honnête à tous les clients éligibles selon la même règle, sans filtrage selon leur satisfaction et sans récompense.
- Ne pas envoyer plusieurs demandes d’avis pour la même intervention ni de relance supplémentaire non demandée.
- Vérifier l’éligibilité de cette communication, les permissions applicables et les mécanismes d’opposition/désabonnement selon le canal avant activation. Ne pas supposer qu’un envoi de formulaire autorise toute communication promotionnelle.

## Variables à renseigner
| Variable | Source réelle nécessaire |
|---|---|
| `prenom` | Nom du client ; si inconnu, remplacer « Bonjour {{prenom}} » par « Bonjour » |
| `date` | Date finale confirmée, format lisible français |
| `heure` | Heure finale confirmée, format 24 h |
| `adresse_intervention` | Adresse de l’intervention validée |
| `lien_avis_google` | Lien officiel d’avis Google fourni par l’entreprise |

Aucune variable non résolue ne doit être envoyée. Échapper les valeurs dans les courriels HTML et utiliser des modèles distincts des données client.

## Préparation technique pour l’intégration future
1. Enregistrer les demandes, rendez-vous et interventions dans une base sécurisée, avec des statuts réels et un indicateur de démonstration.
2. Déclencher les messages après succès de l’écriture côté serveur, jamais au clic du bouton ou au simple affichage d’une page.
3. Prévoir une file de messages avec des états : à préparer, programmé, annulé, envoyé au fournisseur, livré si confirmé par le fournisseur, échec. Une acceptation par le fournisseur ne prouve pas la livraison.
4. Utiliser des clés uniques de déduplication : demande/message, rendez-vous/version/message, intervention/message. Une modification de date doit invalider le rappel de l’ancienne version.
5. Au moment de l’envoi, relire le statut, la version, les coordonnées et les permissions du client. Les clés d’accès restent côté serveur.
6. Enregistrer le résultat et l’identifiant du fournisseur ; limiter les tentatives et signaler les échecs à l’entreprise. Ne pas réexpédier un message dont le résultat est incertain sans vérifier le fournisseur.
7. Garder des journaux minimaux, accessibles uniquement aux personnes autorisées. Ne pas inclure photos, données de carte ou détails inutiles dans les messages et journaux.

## Informations manquantes avant activation
- Fournisseur et canal d’envoi, adresse expéditrice et adresse de réponse surveillée.
- Téléphone professionnel si des SMS sont souhaités.
- Lien d’avis Google officiel.
- Hébergement serveur, base de données et accès administrateur sécurisés.
- Heure finale des rendez-vous, statuts de fin d’intervention et mécanisme d’annulation.
- Politique de confidentialité, permissions et modalités de désabonnement adaptées.

## Vérifications avant mise en service
Tester : formulaire en démonstration, réception réelle, demande en double, absence de photos, date non confirmée, modification de date/heure, annulation, confirmation moins de 24 h avant, changement d’heure, intervention non terminée, variable manquante, lien Google absent, client opposé aux communications, échec et doublon fournisseur.

**Résultat attendu :** seul le bon message part, au bon moment, vers le bon client, après validation des conditions. Cette préparation ne constitue pas un système d’envoi opérationnel.
