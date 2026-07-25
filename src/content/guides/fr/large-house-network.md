---
title: 'Couvrir une grande maison : Wi-Fi, maillages et physique des murs'
description: 'Au-delà de 200 m² ou de deux niveaux, la couverture ne va plus de soi. Comment concevoir un réseau et des maillages radio qui marchent partout.'
order: 3
minutes: 7
---

La plupart des conseils domotiques sont écrits pour des appartements. Dans une grande maison — disons 200 m² et plus, plusieurs niveaux, parfois de la pierre épaisse ou des planchers béton ferraillé — trois systèmes exigent une conception délibérée : votre Wi-Fi, vos maillages basse consommation (Zigbee/Thread), et l'alimentation physique des appareils.

## Wi-Fi : des points d'accès, pas des répéteurs

Un seul routeur dans un coin d'une grande maison, c'est la garantie de zones mortes. Les solutions, de la pire à la meilleure :

1. **Répéteurs sans fil / kits « mesh » en mode répéteur** — débit divisé par deux à chaque saut et bascules capricieuses. À éviter.
2. **Kits mesh avec backhaul dédié** — acceptables dans l'existant, quand câbler est impossible.
3. **Plusieurs points d'accès filaires** — la bonne réponse partout où un câble peut passer. Deux ou trois PA au plafond, chacun alimenté en Ethernet, un seul SSID, alimentés en PoE depuis le local technique. L'itinérance fonctionne, le débit reste entier, et chaque PA gère un nombre raisonnable de clients.

Ordre de grandeur : un PA couvre confortablement ~120–150 m² d'un même niveau en construction classique. La maçonnerie épaisse réduit fortement ce chiffre ; un plancher en béton armé impose généralement un PA par niveau, minimum.

## Zigbee et Thread : concevez le squelette

Ces maillages routent **uniquement via les appareils sur secteur** — les capteurs à pile sont des feuilles, pas des relais. L'échec classique en grande maison : un coordinateur dans le bureau, trente capteurs à pile, et des pertes mystérieuses à l'autre bout. Il n'y a jamais eu de maillage ; juste une radio surmenée.

- Prévoyez **2 à 4 appareils toujours alimentés par niveau** (prises connectées, micromodules, capteurs sur secteur). Ce sont vos routeurs.
- **Les planchers sont l'ennemi.** Chauffage au sol, isolants aluminisés et ferraillage peuvent isoler presque totalement les niveaux — assurez des routeurs à chaque étage, et réfléchissez à l'emplacement physique du coordinateur (central, pas dans la baie du sous-sol — ou optez pour un coordinateur réseau déporté).
- **Ne scindez pas les maillages sans raison.** Un réseau Zigbee fort bat deux réseaux faibles.
- Tableaux métalliques et baies sont des cages de Faraday — si le hub vit au local technique, sortez l'antenne Zigbee/Thread de la baie ou déportez le coordinateur en Ethernet, au centre de la maison.

## Le sub-GHz pour les recoins têtus

Le Z-Wave (868 MHz en Europe) traverse mieux les murs que les protocoles 2,4 GHz — utile pour le garage indépendant, le capteur de la porte de cave, le portail au fond. C'est aussi là que quelques bons appareils Wi-Fi (qui profitent de votre couverture PA désormais excellente) peuvent être la réponse pragmatique.

## Comptez vos appareils honnêtement

Une grande maison accumule vite : une installation sérieuse atteint 80 à 150 appareils sans forcer. Ce n'est pas un problème — un réseau Zigbee tourne très bien à plusieurs centaines avec assez de routeurs — mais cela change la question du hub : donnez à Home Assistant du vrai matériel (classe mini-PC plutôt que la plus petite carte SD), et branchez-le sur l'onduleur.

## La checklist

- Un PA filaire par ~130 m² et par niveau ; au plafond ; SSID unique.
- Switch PoE au local technique alimentant PA et caméras.
- 2–4 routeurs de maillage (appareils sur secteur) par niveau, à chaque niveau.
- Coordinateur central ou déporté en réseau — jamais dans une baie métallique.
- Sub-GHz (Z-Wave) ou bon Wi-Fi pour dépendances et recoins têtus.
- Hub sur du vrai matériel, sur onduleur, relié au réseau en filaire.
