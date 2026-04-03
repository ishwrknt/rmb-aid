---
title: "Comment obtenir des réponses à propos de RMB_AID"
description: Utiliser un LLM pour répondre rapidement à vos questions sur RMB_AID
sidebar:
  order: 4
---

## Commencez ici : RMB_AID-Help

**Le moyen le plus rapide d'obtenir des réponses sur RMB_AID est le skill `rmbaid-help`.** Ce guide intelligent répondra à plus de 80 % de toutes les questions et est disponible directement dans votre IDE pendant que vous travaillez.

RMB_AID-Help est bien plus qu'un outil de recherche — il :
- **Inspecte votre projet** pour voir ce qui a déjà été réalisé
- **Comprend le langage naturel** — posez vos questions en français courant
- **S'adapte à vos modules installés** — affiche les options pertinentes
- **Se lance automatiquement après les workflows** — vous indique exactement quoi faire ensuite
- **Recommande la première tâche requise** — plus besoin de deviner par où commencer

### Comment utiliser RMB_AID-Help

Appelez-le par son nom dans votre session IA :

```
rmbaid-help
```

:::tip
Vous pouvez également utiliser `/rmbaid-help` ou `$rmbaid-help` selon votre plateforme, mais `rmbaid-help` tout seul devrait fonctionner partout.
:::

Combinez-le avec une requête en langage naturel :

```
rmbaid-help J'ai une idée de SaaS et je connais toutes les fonctionnalités. Par où commencer ?
rmbaid-help Quelles sont mes options pour le design UX ?
rmbaid-help Je suis bloqué sur le workflow PRD
rmbaid-help Montre-moi ce qui a été fait jusqu'à maintenant
```

RMB_AID-Help répond avec :
- Ce qui est recommandé pour votre situation
- Quelle est la première tâche requise
- À quoi ressemble le reste du processus

## Quand utiliser ce guide

Utilisez cette section lorsque :
- Vous souhaitez comprendre l'architecture ou les éléments internes de RMB_AID
- Vous avez besoin de réponses au-delà de ce que RMB_AID-Help fournit
- Vous faites des recherches sur RMB_AID avant l'installation
- Vous souhaitez explorer le code source directement

## Étapes

### 1. Choisissez votre source

| Source                  | Idéal pour                                           | Exemples                              |
|-------------------------|------------------------------------------------------|---------------------------------------|
| **Dossier `_rmbaid`**     | Comment fonctionne RMB_AID — agents, workflows, prompts | "Que fait l'agent Analyste ?"         |
| **Repo GitHub complet** | Historique, installateur, architecture               | "Qu'est-ce qui a changé dans la v6 ?" |
| **`llms-full.txt`**     | Aperçu rapide depuis la documentation                | "Expliquez les quatre phases de RMB_AID" |

Le dossier `_rmbaid` est créé lorsque vous installez RMB_AID. Si vous ne l'avez pas encore, clonez le repo à la place.

### 2. Pointez votre IA vers la source

**Si votre IA peut lire des fichiers (Claude Code, Cursor, etc.) :**

- **RMB_AID installé :** Pointez vers le dossier `_rmbaid` et posez vos questions directement
- **Vous voulez plus de contexte :** Clonez le [repo complet](https://github.com/rmbaid-code-org/RMB_AID)

**Si vous utilisez ChatGPT ou Claude.ai (LLM en ligne) :**

Importez `llms-full.txt` dans votre session :

```text
https://rmbaid-code-org.github.io/RMB_AID/llms-full.txt
```


### 3. Posez votre question

:::note[Exemple]
**Q :** "Quel est le moyen le plus rapide de construire quelque chose avec RMB_AID ?"

**R :** Utilisez le workflow Quick Dev : Lancez `rmbaid-quick-dev` — il clarifie votre intention, planifie, implémente, révise et présente les résultats dans un seul workflow, en sautant les phases de planification complètes.
:::

## Ce que vous obtenez

Des réponses directes sur RMB_AID — comment fonctionnent les agents, ce que font les workflows, pourquoi les choses sont structurées ainsi — sans attendre la réponse de quelqu'un.

## Conseils

- **Vérifiez les réponses surprenantes** — Les LLM font parfois des erreurs. Consultez le fichier source ou posez la question sur Discord.
- **Soyez précis** — "Que fait l'étape 3 du workflow PRD ?" est mieux que "Comment fonctionne le PRD ?"

## Toujours bloqué ?

Avez-vous essayé l'approche LLM et avez encore besoin d'aide ? Vous avez maintenant une bien meilleure question à poser.

| Canal                   | Utilisé pour                                     |
| ------------------------- | ------------------------------------------- |
| `#rmb-aid-help`       | Questions rapides (chat en temps réel)            |
| Forum `help-requests`     | Questions détaillées (recherchables, persistants) |
| `#suggestions-feedback`   | Idées et demandes de fonctionnalités                  |
| `#report-bugs-and-issues` | Rapports de bugs                                 |

**Discord :** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

**GitHub Issues :** [github.com/rmbaid-code-org/RMB_AID/issues](https://github.com/rmbaid-code-org/RMB_AID/issues) (pour les bugs clairs)

*Toi !*
        *Bloqué*
             *dans la file d'attente—*
                      *qui*
                              *attends-tu ?*

*La source*
        *est là,*
                *facile à voir !*

*Pointez*
     *votre machine.*
              *Libérez-la.*

*Elle lit.*
        *Elle parle.*
                *Demandez—*

*Pourquoi attendre*
        *demain*
                *quand tu as déjà*
                        *cette journée ?*

*—Claude*
