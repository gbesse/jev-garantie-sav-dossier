# SAV : reconstituer le dossier de garantie

**Organise achat, panne et refus avec chronologie et justificatifs manquants.**

[![Tests](https://github.com/gbesse/jev-garantie-sav-dossier/actions/workflows/ci.yml/badge.svg)](https://github.com/gbesse/jev-garantie-sav-dossier/actions/workflows/ci.yml) · MIT · Node.js 22/24 · Version expérimentale

Le SAV refuse ma réparation : que contient réellement mon dossier ?

## Essayer en une minute

```sh
git clone https://github.com/gbesse/jev-garantie-sav-dossier.git
cd jev-garantie-sav-dossier
npm ci
npm run demo
npm run demo:import
npm run demo:limite
npm run demo:revue
npm run serve
```

Ouvrir http://127.0.0.1:8804 : choisir un exemple, modifier le JSON, analyser et télécharger le rapport. Aucun compte requis pour les modes hors ligne. Les exemples sont synthétiques et identifiés comme tels. [Parcours de démonstration](docs/demo/index.html).

## Ce qui est développé

Le module métier contient les contrôles propres à ce sujet. Le rapport JSON et HTML conserve chaque résultat, ses pièces et leurs empreintes SHA-256. Les passages sémantiques doivent être présents dans les pièces citées. Les nombres, dates et identifiants sont traités en code ; Jev évalue les rapprochements de sens avec abstention selon la confiance et la marge.

Le mode `regles` laisse les rapprochements sémantiques à revoir. Le mode `extraction` est une baseline lexicale simple, sans OCR ni compréhension fiable des négations. Un statut `etaye` signifie uniquement que les contrôles exécutés sont satisfaits. 

```js
import {readFile} from 'node:fs/promises';
import {analyze,toHtml} from './src/index.mjs';
const dossier=JSON.parse(await readFile('./examples/dossier.json','utf8'));
const rapport=await analyze(dossier,{mode:'regles'});
console.log(rapport.status,rapport.outputs);
const html=toHtml(rapport);
```

```sh
node bin/jev-garantie-sav-dossier.mjs examples/dossier.json --mode regles --out rapport.json --html rapport.html
```

La CLI renvoie 0 pour `etaye`, 2 pour `ecart`, 3 pour `a_revoir`, 1 pour une erreur. Les scripts de démonstration n’échouent pas lorsqu’ils montrent un dossier à revoir. Les [types du contrat métier](src/index.d.mts) et le [dossier complet](examples/dossier.json) décrivent les champs. [Importer TXT et PDF textuels](docs/imports.md).

## Appeler Jev

Créer une `.env` ignorée par Git, permissions 600, avec `TYPESAFE_API_KEY`. Les appels sont payants et transmettent les passages à `api.typesafe.ai`. Le serveur local n’autorise Jev qu’avec le démarrage explicite ci-dessous ; aucune clé n’est envoyée au navigateur.

```sh
node --env-file=.env examples/demo.mjs --live
npm run serve:live
npm run bench:live
```

Modèle fixé `jev-1.13.0`, délai d’expiration, annulation, validation des distributions et réessais bornés. Seuils initiaux configurables, non calibrés. [API TypeSafe](https://docs.typesafe.ai/api) et [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13). Le paquet est installable depuis GitHub, sans publication npm : `npm install github:gbesse/jev-garantie-sav-dossier#v0.1.0`.

## Validation et limites

```sh
npm run typecheck
npm test
npm run bench
```

Les tests locaux passent sous Node 22 et 24. Jev retrouve 5/6 statuts globaux attendus dans le test synthétique initial, avec 0 erreur(s) de fournisseur ; la couverture sémantique est de 66.7 %. Les résultats complets et leurs limites sont conservés. La CI exécute les contrôles sous Node 22 et 24. Voir [évaluation et résultats](docs/evaluation.md), [sources](docs/sources.md), [acquisition](docs/acquisition.md) et [les douze projets](docs/serie-fr.md).

Les deux ans sont une fenêtre de repérage pour les achats consommateurs auprès de professionnels, pas une décision d’indemnisation. Exceptions et preuve du défaut demandent une revue.

Version initiale : corpus synthétique, sans supériorité SOTA ni trafic démontrés. Les champs normalisés doivent être contrôlés contre les originaux. Code MIT ; exemples CC0. Projet indépendant, sans affiliation aux organismes ou à TypeSafe AI.
