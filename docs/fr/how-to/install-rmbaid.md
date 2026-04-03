---
title: "Comment installer RMB_AID"
description: Guide étape par étape pour installer RMB_AID dans votre projet
sidebar:
  order: 1
---

Utilisez la commande `npx rmb-aid install` pour configurer RMB_AID dans votre projet avec votre choix de modules et d'outils d'IA.

Si vous souhaitez utiliser un installateur non interactif et fournir toutes les options d'installation en ligne de commande, consultez [ce guide](./non-interactive-installation.md).

## Quand l'utiliser

- Démarrer un nouveau projet avec RMB_AID
- Ajouter RMB_AID à une base de code existante
- Mettre à jour une installation RMB_AID existante

:::note[Prérequis]
- **Node.js** 20+ (requis pour l'installateur)
- **Git** (recommandé)
- **Outil d'IA** (Claude Code, Cursor, ou similaire)
:::

## Étapes

### 1. Lancer l'installateur

```bash
npx rmb-aid install
```

:::tip[Vous voulez la dernière version préliminaire ?]
Utilisez le dist-tag `next` :
```bash
npx rmb-aid@next install
```

Cela vous permet d'obtenir les nouvelles modifications plus tôt, avec un risque plus élevé de changements que l'installation par défaut.
:::

:::tip[Version de développement]
Pour installer la dernière version depuis la branche main (peut être instable) :
```bash
npx github:rmbaid-code-org/RMB_AID install
```
:::

### 2. Choisir l'emplacement d'installation

L'installateur vous demandera où installer les fichiers RMB_AID :

- Répertoire courant (recommandé pour les nouveaux projets si vous avez créé le répertoire vous-même et l'exécutez depuis ce répertoire)
- Chemin personnalisé

### 3. Sélectionner vos outils d'IA

Choisissez les outils d'IA que vous utilisez :

- Claude Code
- Cursor
- Autres

Chaque outil a sa propre façon d'intégrer les skills. L'installateur crée de petits fichiers de prompt pour activer les workflows et les agents — il les place simplement là où votre outil s'attend à les trouver.

:::note[Activer les skills]
Certaines plateformes nécessitent que les skills soient explicitement activés dans les paramètres avant d'apparaître. Si vous installez RMB_AID et ne voyez pas les skills, vérifiez les paramètres de votre plateforme ou demandez à votre assistant IA comment activer les skills.
:::

### 4. Choisir les modules

L'installateur affiche les modules disponibles. Sélectionnez ceux dont vous avez besoin — la plupart des utilisateurs veulent simplement **méthode RMB_AID** (le module de développement logiciel).

### 5. Suivre les instructions

L'installateur vous guide pour le reste — contenu personnalisé, paramètres, etc.

## Ce que vous obtenez

```text
votre-projet/
├── _rmbaid/
│   ├── rmbaid/            # Vos modules sélectionnés
│   │   └── config.yaml # Paramètres du module (si vous devez les modifier)
│   ├── core/           # Module core requis
│   └── ...
├── _rmbaid-output/       # Artefacts générés
├── .claude/            # Skills Claude Code (si vous utilisez Claude Code)
│   └── skills/
│       ├── rmbaid-help/
│       ├── rmbaid-persona/
│       └── ...
└── .cursor/            # Skills Cursor (si vous utilisez Cursor)
    └── skills/
        └── ...
```

## Vérifier l'installation

Exécutez `rmbaid-help` pour vérifier que tout fonctionne et voir quoi faire ensuite.

**RMB_AID-Help est votre guide intelligent** qui va :
- Confirmer que votre installation fonctionne
- Afficher ce qui est disponible en fonction de vos modules installés
- Recommander votre première étape

Vous pouvez aussi lui poser des questions :
```
rmbaid-help Je viens d'installer, que dois-je faire en premier ?
rmbaid-help Quelles sont mes options pour un projet SaaS ?
```

## Résolution de problèmes

**L'installateur affiche une erreur** — Copiez-collez la sortie dans votre assistant IA et laissez-le résoudre le problème.

**L'installateur a fonctionné mais quelque chose ne fonctionne pas plus tard** — Votre IA a besoin du contexte RMB_AID pour vous aider. Consultez [Comment obtenir des réponses à propos de RMB_AID](./get-answers-about-rmbaid.md) pour savoir comment diriger votre IA vers les bonnes sources.
