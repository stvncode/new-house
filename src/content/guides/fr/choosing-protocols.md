---
title: 'Zigbee, Z-Wave, Thread, Wi-Fi ou KNX : choisir ses protocoles'
description: 'Le choix du protocole façonne chaque achat de la décennie à venir. Voici comment y réfléchir sans le brouillard marketing.'
order: 1
minutes: 8
---

Première chose à intégrer : **vous ne choisirez pas un seul protocole**. Toute vraie maison connectée est un mélange. L'objectif est de choisir un protocole maillé *principal* pour la myriade d'appareils bon marché, de décider ce que vos murs transporteront s'ils sont ouverts, et de savoir quelles exceptions méritent d'exister.

## Les candidats, un paragraphe honnête chacun

**Zigbee** est le choix pragmatique par défaut. Un choix d'appareils énorme (IKEA, Aqara, Philips Hue, Sonoff et des centaines d'autres), les prix les plus bas, une excellente autonomie des piles, et un maillage qui se renforce à chaque appareil sur secteur ajouté. Sa faiblesse : des appairages parfois capricieux et une qualité variable selon les marques — atténués par un bon coordinateur unique et des appareils bien supportés.

**Z-Wave** échange le choix et le prix contre une interopérabilité certifiée. Chaque appareil Z-Wave passe une certification, le chiffrement est obligatoire dans les versions récentes, et sa bande sub-GHz traverse mieux les murs sans jamais gêner votre Wi-Fi. Il brille pour la sécurité — serrures, sirènes, capteurs périmétriques — là où « ça marche, toujours » compte plus qu'économiser 10 €.

**Thread** est le maillage le plus récent, bâti sur IP de bout en bout, avec Matter comme couche de compatibilité au-dessus. Techniquement excellent : rapide, économe, auto-réparant, et les border routers apparaissent partout. Le hic : l'écosystème mûrit encore — le choix est plus mince et Matter expose moins de fonctions que les intégrations natives. Achetez Thread à prix comparable ; ne reconstruisez pas tout autour pour l'instant.

**Le Wi-Fi** est fait pour la bande passante, pas pour les capteurs. Caméras, enceintes, écrans : oui. Cinquante capteurs à pile : non — ils encombreront vos points d'accès, videront leurs piles, et les moins chers exigent souvent le cloud du fabricant. Bonne règle : chaque appareil Wi-Fi doit mériter sa place.

**KNX** est un animal à part : un bus filaire standardisé depuis plus de 30 ans, multi-fabricants, installé par des professionnels certifiés. Éclairage, volets et chauffage fonctionnent sans pile, sans appairage, sans serveur. C'est plusieurs fois plus cher à l'installation et les modifications relèvent de l'électricien, mais il survivra à tous les standards sans fil de cette page. Il n'a de sens qu'en construction neuve ou grosse rénovation.

## La décision, compressée

1. **Murs ouverts + budget au-delà de ~8 k€ + envie d'installer-et-oublier ?** Faites chiffrer KNX pour le socle (éclairage, volets, chauffage), et posez Home Assistant plus un maillage sans fil par-dessus pour les capteurs et tout ce que KNX ne fait pas.
2. **Tous les autres :** Zigbee comme colonne vertébrale pour capteurs, boutons, ampoules et modules. Ajoutez du Z-Wave ponctuellement pour serrures et sécurité. Laissez entrer Thread/Matter à mesure que les prix s'alignent.
3. **Le Wi-Fi uniquement pour le haut débit** — et préférez les appareils à API locale (ou fonctionnant en local avec Home Assistant).

## Les erreurs à éviter

- **Acheter un « kit de démarrage » par marque.** Le verrouillage d'écosystème, c'est finir avec cinq applis et cinq hubs. Achetez des appareils, pas des écosystèmes ; laissez votre hub les unifier.
- **Choisir le protocole appareil par appareil, sur un coup de tête.** Chaque protocole ajouté est une radio de plus, un mode de panne de plus, une chose de plus à apprendre. Deux maillages (un principal, un pour les exceptions) suffisent largement.
- **Oublier que le maillage a besoin de routeurs.** Zigbee et Thread routent via les appareils sur secteur. Une maison avec uniquement des capteurs à pile n'a pas de maillage — parsemez prises connectées et micromodules pour bâtir le squelette.
- **Parier toute la maison sur les promesses de Matter.** Achetez pour ce qui marche aujourd'hui ; la compatibilité future est un bonus, pas un plan.
