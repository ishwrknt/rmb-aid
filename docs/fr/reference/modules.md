---
title: Modules Officiels
description: Modules additionnels pour créer des agents personnalisés, de l'intelligence créative, du développement de jeux et des tests
sidebar:
  order: 4
---

RMB_AID s'étend via des modules officiels que vous sélectionnez lors de l'installation. Ces modules additionnels fournissent des agents, des workflows et des tâches spécialisés pour des domaines spécifiques, au-delà du noyau intégré et de RMB_AID (suite Agile).

:::tip[Installer des Modules]
Exécutez `npx rmb-aid install` et sélectionnez les modules souhaités. L'installateur gère automatiquement le téléchargement, la configuration et l'intégration IDE.
:::

## RMB_AID Builder

Créez des agents personnalisés, des workflows et des modules spécifiques à un domaine avec une assistance guidée. RMB_AID Builder est le méta-module pour étendre le framework lui-même.

- **Code :** `bmb`
- **npm :** [`rmbaid-builder`](https://www.npmjs.com/package/rmbaid-builder)
- **GitHub :** [rmbaid-code-org/rmbaid-builder](https://github.com/rmbaid-code-org/rmbaid-builder)

**Fournit :**

- Agent Builder — créez des agents IA spécialisés avec une expertise et un accès aux outils personnalisés
- Workflow Builder — concevez des processus structurés avec des étapes et des points de décision
- Module Builder — empaquetez des agents et des workflows dans des modules partageables et publiables
- Configuration interactive avec support de configuration YAML et publication npm

## Creative Intelligence Suite

Outils basés sur l'IA pour la créativité structurée, l'idéation et l'innovation pendant le développement en phase amont. La suite fournit plusieurs agents qui facilitent le brainstorming, le design thinking et la résolution de problèmes en utilisant des cadres éprouvés.

- **Code :** `cis`
- **npm :** [`rmbaid-creative-intelligence-suite`](https://www.npmjs.com/package/rmbaid-creative-intelligence-suite)
- **GitHub :** [rmbaid-code-org/rmbaid-module-creative-intelligence-suite](https://github.com/rmbaid-code-org/rmbaid-module-creative-intelligence-suite)

**Fournit :**

- Agents Innovation Strategist, Design Thinking Coach et Brainstorming Coach
- Problem Solver et Creative Problem Solver pour la pensée systématique et latérale
- Storyteller et Presentation Master pour les récits et les présentations
- Cadres d'idéation incluant SCAMPER[^1], Brainstorming inversé et reformulation de problèmes

## Game Dev Studio

Workflows de développement de jeux structurés adaptés pour Unity, Unreal, Godot et moteurs personnalisés. Supporte le prototypage rapide via Quick Dev et la production à grande échelle avec des sprints propulsés par epics.

- **Code :** `gds`
- **npm :** [`rmbaid-game-dev-studio`](https://www.npmjs.com/package/rmbaid-game-dev-studio)
- **GitHub :** [rmbaid-code-org/rmbaid-module-game-dev-studio](https://github.com/rmbaid-code-org/rmbaid-module-game-dev-studio)

**Fournit :**

- Workflow de génération de Document de Design de Jeu (GDD[^3])
- Mode Quick Dev pour le prototypage rapide
- Support de design narratif pour les personnages, dialogues et construction de monde
- Couverture de plus de 21 types de jeux avec des conseils d'architecture spécifiques au moteur

## Test Architect (TEA)

Stratégie de test de niveau entreprise, conseils d'automatisation et décisions de porte de release via un agent expert et neuf workflows structurés. TEA va bien au-delà du workflow QA intégré avec une priorisation basée sur les risques et une traçabilité des exigences.

- **Code :** `tea`
- **npm :** [`rmb-aid-test-architecture-enterprise`](https://www.npmjs.com/package/rmb-aid-test-architecture-enterprise)
- **GitHub :** [rmbaid-code-org/rmb-aid-test-architecture-enterprise](https://github.com/rmbaid-code-org/rmb-aid-test-architecture-enterprise)

**Fournit :**

- Agent Murat (Master Test Architect and Quality Advisor)
- Workflows pour la conception de tests, ATDD, l'automatisation, la revue de tests et la traçabilité
- Évaluation NFR[^2], configuration CI et scaffolding de framework
- Priorisation P0-P3 avec Playwright Utils et intégrations MCP optionnelles

## Modules Communautaires

Les modules communautaires et une marketplace de modules sont à venir. Consultez l'[organisation GitHub RMB_AID](https://github.com/rmbaid-code-org) pour les mises à jour.

## Glossaire

[^1]: SCAMPER : acronyme anglais pour une technique de créativité structurée (Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse) qui permet d'explorer systématiquement les modifications possibles d'un produit ou d'une idée pour générer des innovations.
[^2]: NFR (Non-Functional Requirement) : exigence décrivant les contraintes de qualité du système (performance, sécurité, fiabilité, ergonomie) plutôt que ses fonctionnalités.
[^3]: GDD (Game Design Document) : document de conception de jeu qui décrit en détail les mécaniques, l'univers, les personnages, les niveaux et tous les aspects du jeu à développer.
