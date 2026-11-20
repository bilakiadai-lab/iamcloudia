# Réception automatique des inscriptions

À la fin d'un test de positionnement ou d'une demande de tarif groupe, le site envoie le code résultat à un petit script Google (Apps Script). Ce script vérifie le code et ajoute une ligne dans le fichier Google Sheets **« Centre Cloud & IA – Réception des inscriptions »** :

- onglet **Candidats** : un test de positionnement par ligne ;
- onglet **Entreprises** : une demande de tarif groupe par ligne.

L'interface de suivi des inscriptions importe ensuite ces lignes (bouton « Synchroniser »). Le candidat peut toujours envoyer son code par WhatsApp : c'est la solution de secours si l'envoi automatique échoue.

## Installation (une seule fois, 10 minutes)

1. Ouvrir le fichier Google Sheets « Centre Cloud & IA – Réception des inscriptions ».
2. Menu **Extensions › Apps Script**. Un éditeur s'ouvre avec un fichier `Code.gs`.
3. Remplacer tout son contenu par celui de [`apps-script/Code.gs`](apps-script/Code.gs), puis **Enregistrer** (icône disquette).
4. **Déployer › Nouveau déploiement**.
   - Type (roue dentée) : **Application Web**.
   - Description : `Réception inscriptions`.
   - Exécuter en tant que : **Moi**.
   - Qui a accès : **Tout le monde**. Le site public doit pouvoir envoyer ; le script n'accepte que des codes valides produits par le site.
5. Cliquer **Déployer**, puis **Autoriser l'accès** avec le compte Google propriétaire du fichier. Google affiche « Cette application n'a pas été validée » : cliquer **Paramètres avancés › Accéder à … (non sécurisé)**. C'est normal pour un script personnel.
6. Copier l'**URL de l'application Web** (elle se termine par `/exec`).
7. Coller cette URL dans `INSCRIPTIONS_URL`, en haut du script de `site/test-positionnement.html` et de `site/demande-entreprise.html`, ou la transmettre pour que la modification soit faite par pull request.

Vérification : ouvrir l'URL `/exec` dans un navigateur doit afficher `{"ok":true,"service":"inscriptions"}`.

## Modifier le script plus tard

Après une modification de `Code.gs` : **Déployer › Gérer les déploiements › modifier (crayon) › Version : Nouvelle version › Déployer**. L'URL reste la même.

## Source des inscriptions

Un lien vers le site avec `?src=…` (par exemple `https://…/?src=aviro-linkedin`) remplit la colonne **Source** de l'onglet Candidats, même si le visiteur passe par la page d'accueil avant de faire le test.

## Données personnelles

- Le formulaire de test et le formulaire entreprises demandent le consentement avant tout envoi.
- Le fichier ne doit être partagé qu'avec les personnes chargées des inscriptions (IAM et Aviro).
- Ne pas changer l'ordre ni les en-têtes des colonnes : le script et l'interface de suivi s'appuient dessus.
