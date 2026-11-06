# Journal des versions

Les changements de chaque version du site, du plus récent au plus ancien. Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versions selon [SemVer](https://semver.org/lang/fr/).

## [Non publié]

### Modifié
- Numéro WhatsApp d’IAM pour l’envoi des codes : +221 76 740 99 62. Bouton « Envoyer par WhatsApp » avec le code prérempli, sur le test de positionnement et sur le formulaire entreprises.

## [1.1.1] - 2026-11-05

### Corrigé
- Offre de lancement : la remise de 15 % pour les 20 premiers inscrits est retirée en attendant la validation d’IAM ; les conditions sont communiquées à l’inscription.

## [1.1.0] - 2026-11-04

Calendrier repensé et photos du Centre d’excellence, suite aux retours d’IAM.

### Ajouté
- Calendrier du programme en deux niveaux : frise des 4 phases avec jalons, puis une fiche dépliable par semaine (séance accompagnée, travail en autonomie, résultat attendu, date et horaire). Mention « Séance n » en toutes lettres, sélecteur de parcours toujours visible, bouton « Tout déplier ».
- Six photos fournies par IAM (haut de page, campus, méthode, format des séances, inscription), en WebP, adaptées au téléphone et chargées au fil du défilement.
- Vérifications automatiques à chaque pull request : structure HTML, liens internes, contenu à compléter, affichage sur téléphone et ordinateur, liens externes (informatif).
- Guide de contribution (GitFlow allégé), modèles de pull request et de demande de modification.
- Journal des versions.

### Modifié
- Offre de lancement : 15 % de remise pour les 20 premiers inscrits jusqu’au 20 novembre.
- FAQ : examen en français ou en anglais, au choix.
- Paiement : la mention du numéro marchand est retirée en attendant les informations d’IAM.

## [1.0.0] - 2026-11-02

Première mise en ligne du site du Centre d'excellence Cloud & IA.

### Ajouté
- Page de l'offre : parcours Cloud Foundations et AI Foundations, centre d'examen Pearson VUE d'IAM, avantages et débouchés d'une certification AWS, méthode, programme semaine par semaine, format d'une session de 2 h, tarifs (dont le Pack Excellence), paiement en 1 ou 2 fois par Orange Money ou Wave, offre entreprises, FAQ.
- Tests de positionnement Cloud Foundations et AI Foundations, avec code résultat à transmettre à IAM.
- Formulaire de demande de tarif groupe pour les entreprises, avec code de demande.
- Navigation entre les pages, logos IAM, coordonnées d'IAM et liens vers les sites d'IAM et d'Aviro.
- Déploiement sur Render (site statique et Dockerfile nginx).
