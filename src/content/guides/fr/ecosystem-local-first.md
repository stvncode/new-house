---
title: 'Local d’abord : pourquoi votre maison doit fonctionner sans internet'
description: 'Les clouds ferment, les abonnements apparaissent, les serveurs tombent. Comment bâtir une maison qui ne répond qu’à vous — et où se situe Home Assistant.'
order: 4
minutes: 6
---

Voici un test à appliquer à chaque appareil connecté que vous envisagez : **débranchez internet — fonctionne-t-il encore ?** Si la réponse est non, vous ne possédez pas une maison connectée ; vous en louez une, au bon vouloir du budget serveurs d'une entreprise.

## Pourquoi le contrôle local est la colline à défendre

- **Longévité.** Les cimetières domotiques débordent d'appareils dépendants du cloud devenus presse-papiers quand le fabricant a pivoté, été racheté, ou ajouté un abonnement. Un appareil local fonctionne jusqu'à la mort du matériel.
- **Fiabilité.** Vos lumières ne devraient dépendre ni de votre FAI ni d'un datacenter sur un autre continent. Les automatisations locales s'exécutent en millisecondes, à chaque fois, internet ou pas.
- **Vie privée.** Capteurs de présence, caméras et serrures produisent les données les plus intimes d'un foyer. Le local d'abord signifie que ces données restent physiquement chez vous.
- **Vitesse.** Mouvement-vers-lumière via un aller-retour cloud, c'est un lag visible ; en local, c'est instantané. Vous sentez la différence chaque jour.

## Le centre pratique : Home Assistant

Home Assistant est la plus grande plateforme domotique open source, et c'est la pièce qui fait d'une maison multi-marques et multi-protocoles un seul système cohérent. Il tourne sur votre propre matériel, parle Zigbee, Z-Wave, Thread/Matter, KNX et environ trois mille autres intégrations, et garde automatisations, tableaux de bord et historique entièrement en local.

Le matériel selon votre profil :

- **Vous voulez juste que ça marche :** Home Assistant Green — une box prête à brancher. Ajoutez une clé USB Zigbee ou Z-Wave au besoin.
- **À l'aise avec la technique :** un mini-PC (n'importe quelle machine récente classe N100) offre des années de marge pour l'enregistrement caméra, les assistants vocaux et les add-ons.
- **Locataire ou en exploration :** un Raspberry Pi est un bon début ; vous migrerez toute l'installation plus tard avec une simple sauvegarde.

## Acheter « local d'abord » sans devenir moine

Pas besoin de pureté idéologique — il faut un défaut avec des exceptions justifiées :

- **Par défaut :** les appareils sur protocoles ouverts (Zigbee, Z-Wave, Thread, KNX) sont locaux par construction. Cela couvre capteurs, éclairage, interrupteurs, vannes, serrures.
- **Exceptions justifiées :** certaines catégories sont réellement meilleures avec du cloud — assistants vocaux à bonne reconnaissance, certains robots aspirateurs, données météo. Gardez-les hors des chemins critiques : la maison doit fonctionner pleinement quand ils sont hors ligne.
- **Vérifiez avant d'acheter :** la page d'intégration Home Assistant d'un appareil dit s'il est local ou cloud. Deux minutes de lecture épargnent des années de regrets.

## Concrètement, à l'achat

1. Choisissez d'abord le hub (Home Assistant sur le matériel de votre profil).
2. Préférez les appareils à intégration locale — ceux sur protocole le sont automatiquement.
3. Refusez les appareils exigeant un compte pour un simple marche/arrêt.
4. Considérez tout ce qui est verrouillé par abonnement comme un signal d'alarme, sauf valeur écrasante.

La récompense arrive sans bruit : internet tombe un soir et tout — lumières, chauffage, automatisations de présence — continue simplement de fonctionner. Voilà ce que ça fait de posséder l'intelligence de sa maison.
