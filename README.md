# Centre d'excellence Cloud & IA – site de l'offre

Site statique de l'offre de formation certifiante AWS du Centre d'excellence Cloud & IA d'IAM, en partenariat avec Aviro.

## Contenu

| Fichier | Page |
| --- | --- |
| `site/index.html` | Page d'accueil : l'offre, le programme, les tarifs, la FAQ |
| `site/test-positionnement.html` | Tests de positionnement Cloud Foundations (`#cloud`) et AI Foundations (`#ai`) |
| `site/demande-entreprise.html` | Formulaire de demande de tarif groupe pour les entreprises |

Chaque page est autonome : styles, scripts et logos sont intégrés au fichier. Il n'y a rien à installer ni à compiler.

## Mise en ligne sur Render

Le fichier `render.yaml` décrit le site. Deux façons de le créer :

- **Blueprint** : Render › New › Blueprint, choisir ce dépôt. Render lit `render.yaml`.
- **À la main** : Render › New › Static Site, choisir ce dépôt, mettre `echo ok` comme commande de build, et indiquer `site` comme dossier de publication.

Chaque modification poussée sur la branche `main` redéploie le site automatiquement.

## Domaine personnalisé (Squarespace Domains)

Dans Render : Settings › Custom Domains › ajouter le domaine. Puis dans Squarespace › Domaines › DNS › enregistrements personnalisés :

| Adresse | Type | Hôte | Valeur |
| --- | --- | --- | --- |
| Sous-domaine (ex. `formation.votredomaine.com`) | CNAME | `formation` | `iam-cloud-ia.onrender.com` (l'adresse Render du site) |
| Domaine nu | A | `@` | `216.24.57.1` |

Supprimer les éventuels enregistrements AAAA sur le même hôte. Render active le HTTPS automatiquement une fois le DNS vérifié.

## Mettre à jour le site

Modifier le fichier HTML concerné (directement sur GitHub avec le crayon « Edit », ou en local), puis enregistrer un commit sur `main`. Le site est à jour en une à deux minutes.

## Données des candidats

Le site n'enregistre aucune donnée. Les tests et le formulaire entreprises produisent un code que le candidat ou l'entreprise envoie à IAM ; ce code est saisi dans le suivi des inscriptions, qui reste privé.
