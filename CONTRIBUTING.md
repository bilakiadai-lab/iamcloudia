# Faire évoluer le site

Ce dépôt suit un GitFlow allégé : chaque modification passe par une branche, une pull request, des vérifications automatiques et une validation sur le site de recette avant d'arriver en production.

## Les branches

| Branche | Rôle | Déployée sur |
| --- | --- | --- |
| `main` | Production, toujours stable | Site public |
| `develop` | Intégration du prochain lot | Site de recette (Render, `iam-cloud-ia-recette`) |
| `feature/<sujet>` | Une modification, créée depuis `develop` | — |
| `hotfix/<sujet>` | Correction urgente, créée depuis `main` | Production, puis reportée dans `develop` |

`main` et `develop` sont protégées : on n'y pousse jamais directement, tout passe par une pull request.

## Le circuit d'une modification

1. **Ticket** : ouvrir un ticket « Demande de modification » qui décrit le besoin (qui demande, quelle page, quel texte).
2. **Branche** : créer `feature/<sujet>` depuis `develop`, par exemple `feature/remise-lancement`.
3. **Pull request vers `develop`** : les vérifications automatiques tournent ; relire, puis fusionner.
4. **Recette** : le site de recette se met à jour tout seul ; IAM valide sur cette adresse.
5. **Mise en production** : pull request de `develop` vers `main`, intitulée avec la version (ex. « Version 1.1.0 »). Après fusion, créer l'étiquette de version et la release GitHub, et compléter `CHANGELOG.md`.
6. **Urgence** : `hotfix/<sujet>` depuis `main`, pull request vers `main`, puis pull request de `main` vers `develop` pour ne pas perdre la correction.

## Les vérifications automatiques

Elles tournent à chaque pull request et à chaque fusion sur `develop` et `main` (`.github/workflows/ci.yml`) :

- **Structure HTML** : aucune balise mal fermée ou mal imbriquée.
- **Liens internes** : chaque lien entre les pages et chaque ancre existe.
- **Contenu à compléter** : tout texte entre crochets, comme `[numéro]`, est signalé. C'est un simple avertissement vers `develop`, mais il **bloque** la mise en production vers `main`.
- **Affichage** : chaque page est ouverte sur téléphone (390 px) et sur ordinateur (1280 px) ; elle ne doit pas déborder en largeur ni produire d'erreur JavaScript.
- **Liens externes** : contrôle informatif, non bloquant.

Pour les lancer sur son poste :

```bash
python scripts/check_site.py site
STRICT_PLACEHOLDERS=1 python scripts/check_site.py site   # comme pour une mise en production
npm install --no-save playwright@1.48.2 && npx playwright install chromium
node scripts/mobile_check.mjs site
```

## Messages de commit

Un préfixe indique la nature du changement :

- `feat:` nouvelle rubrique ou fonctionnalité (ex. `feat: ajouter la rubrique débouchés`)
- `content:` texte, prix, dates, coordonnées (ex. `content: remise de lancement de 10 %`)
- `fix:` correction d'un défaut (ex. `fix: lien du test IA`)
- `chore:` outillage, configuration, documentation

## Versions

Numérotation `MAJEUR.MINEUR.CORRECTIF` :

- **Correctif** (`1.0.1`) : correction de texte ou de lien.
- **Mineur** (`1.1.0`) : nouvelle rubrique, nouveau contenu.
- **Majeur** (`2.0.0`) : refonte du site ou nouvelle offre.

Chaque version est décrite dans `CHANGELOG.md`.
