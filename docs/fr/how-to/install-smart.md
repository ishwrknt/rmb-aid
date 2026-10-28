---
title: 'Comment installer SMART'
description: Guide étape par étape pour installer SMART dans votre projet
sidebar:
  order: 1
---

Utilisez la commande `npx smart-agentic install` pour configurer SMART dans votre projet avec votre choix de modules et d'outils d'IA.

Le nom du package publié sur npm est `smart-agentic`. `smart` existe comme alias de commande, mais pour une nouvelle installation via `npx`, utilisez `smart-agentic`.

Si vous souhaitez utiliser un installateur non interactif et fournir toutes les options d'installation en ligne de commande, consultez [ce guide](./non-interactive-installation.md).

## Quand l'utiliser

- Démarrer un nouveau projet avec SMART
- Ajouter SMART à une base de code existante
- Mettre à jour une installation SMART existante

:::note[Prérequis]

- **Node.js** 20+ (requis pour l'installateur)
- **Git** (recommandé)
- **Outil d'IA** (Claude Code, Cursor, ou similaire)
  :::

## Étapes

### 1. Lancer l'installateur

```bash
npx smart-agentic install
```

:::tip[Vous voulez la dernière version préliminaire ?]
Utilisez le dist-tag `next` :

```bash
npx smart-agentic@next install
```

Cela vous permet d'obtenir les nouvelles modifications plus tôt, avec un risque plus élevé de changements que l'installation par défaut.
:::

:::tip[Version de développement]
Pour installer la dernière version depuis la branche main (peut être instable) :

```bash
npx github:smart-code-org/SMART install
```

:::

### 2. Choisir l'emplacement d'installation

L'installateur vous demandera où installer les fichiers SMART :

- Répertoire courant (recommandé pour les nouveaux projets si vous avez créé le répertoire vous-même et l'exécutez depuis ce répertoire)
- Chemin personnalisé

### 3. Sélectionner vos outils d'IA

Choisissez les outils d'IA que vous utilisez :

- Claude Code
- Cursor
- Autres

Chaque outil a sa propre façon d'intégrer les skills. L'installateur crée de petits fichiers de prompt pour activer les workflows et les agents — il les place simplement là où votre outil s'attend à les trouver.

:::note[Activer les skills]
Certaines plateformes nécessitent que les skills soient explicitement activés dans les paramètres avant d'apparaître. Si vous installez SMART et ne voyez pas les skills, vérifiez les paramètres de votre plateforme ou demandez à votre assistant IA comment activer les skills.
:::

### 4. Choisir les modules

L'installateur affiche les modules disponibles. Sélectionnez ceux dont vous avez besoin — la plupart des utilisateurs veulent simplement **méthode SMART** (le module de développement logiciel).

### 5. Suivre les instructions

L'installateur vous guide pour le reste — contenu personnalisé, paramètres, etc.

## Ce que vous obtenez

```text
votre-projet/
├── _rmbaid/
│   ├── smart/            # Vos modules sélectionnés
│   │   └── config.yaml # Paramètres du module (si vous devez les modifier)
│   ├── core/           # Module core requis
│   └── ...
├── _rmbaid-output/       # Artefacts générés
├── .claude/            # Skills Claude Code (si vous utilisez Claude Code)
│   └── skills/
│       ├── smart-help/
│       ├── smart-persona/
│       └── ...
└── .cursor/            # Skills Cursor (si vous utilisez Cursor)
    └── skills/
        └── ...
```

## Vérifier l'installation

Exécutez `smart-help` pour vérifier que tout fonctionne et voir quoi faire ensuite.

**SMART-Help est votre guide intelligent** qui va :

- Confirmer que votre installation fonctionne
- Afficher ce qui est disponible en fonction de vos modules installés
- Recommander votre première étape

Vous pouvez aussi lui poser des questions :

```
smart-help Je viens d'installer, que dois-je faire en premier ?
smart-help Quelles sont mes options pour un projet SaaS ?
```

## Résolution de problèmes

**L'installateur affiche une erreur** — Copiez-collez la sortie dans votre assistant IA et laissez-le résoudre le problème.

**L'installateur a fonctionné mais quelque chose ne fonctionne pas plus tard** — Votre IA a besoin du contexte SMART pour vous aider. Consultez [Comment obtenir des réponses à propos de SMART](./get-answers-about-smart.md) pour savoir comment diriger votre IA vers les bonnes sources.
