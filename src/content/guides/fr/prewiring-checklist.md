---
title: 'La checklist de pré-câblage : quoi mettre dans les murs tant qu’ils sont ouverts'
description: 'Un câble coûte des centimes pendant le chantier et une fortune après. La liste définitive à remettre à votre électricien avant les plaques.'
order: 2
minutes: 9
---

Il existe une asymétrie brutale dans la construction : une liaison Cat6a coûte quelques euros dans un mur ouvert et plusieurs centaines à travers un mur fini. Le sans-fil progresse, mais un câble reste plus rapide, plus fiable, plus sûr, et totalement silencieux sur le spectre radio. Cette checklist, c'est ce que les gens expérimentés regrettent de ne pas avoir spécifié — imprimez-la, adaptez-la, donnez-la à votre électricien.

## Câblage réseau

- **Deux prises RJ45 par pièce habitable**, à hauteur de bureau/TV. Vous en utiliserez une et bénirez la seconde.
- **Une prise par emplacement TV/multimédia** — box, consoles et téléviseurs préfèrent tous le filaire.
- **Une prise à chaque angle de plafond destiné aux points d'accès Wi-Fi** — le plafond du couloir central de chaque étage est l'emplacement classique. C'est la liaison la plus rentable de la maison.
- **Une prise à chaque emplacement de caméra et de sonnette**, angles extérieurs compris. Les caméras PoE battent les caméras à batterie sur tous les plans qui comptent.
- **Toutes les liaisons convergent vers un seul point** (topologie en étoile) — le local technique. Pas de chaînage.
- **Cat6a minimum.** Le surcoût face au Cat6 est dérisoire comparé à la main-d'œuvre.

## Détails électriques qui décident de vos options futures

- **Un neutre dans chaque boîte d'interrupteur.** La plupart des micromodules s'alimentent par le neutre. Sans lui, vos options se réduisent à une poignée de variateurs sans neutre.
- **Des boîtes profondes (50 mm et plus) partout.** Un module se loge *derrière* l'interrupteur ; les boîtes plates transforment chaque pose en combat.
- **L'alimentation à chaque fenêtre** (angle supérieur) pour de futurs volets ou stores motorisés — même si vous n'achetez pas les moteurs tout de suite.
- **L'alimentation à chaque emplacement extérieur de caméra/PA.** Le PoE couvre l'essentiel, mais la gaine ne coûte rien maintenant.
- **Quelques sorties au plafond** — capteurs de présence et points d'accès veulent du courant là où il n'y a pas de luminaire.

## Les gaines : votre machine à remonter le temps

Quel que soit le câble vainqueur en 2040, vous pourrez le tirer plus tard — s'il existe un chemin.

- **Surdimensionnez les gaines** d'une taille au-delà du nécessaire.
- **Laissez une aiguille de tirage dans chaque gaine.**
- **Des gaines vides du local technique vers :** chaque étage, les combles, le garage et deux points extérieurs. C'est l'assurance la moins chère de votre vie.

## Le local technique

Un demi-placard suffit, mais il lui faut :

- Un **espace ventilé pour une petite baie** : panneau de brassage, switch (PoE), routeur, le hub domotique, un NVR si vous êtes caméra-intensif, et un petit onduleur.
- **Toutes les liaisons réseau terminées ici**, sur un panneau de brassage étiqueté.
- **Deux circuits électriques dédiés** — un pour la baie, un de réserve.
- Si possible, le **tableau électrique adjacent** — le compteur d'énergie et l'éventuel matériel KNX y vivent.

## Si vous partez sur KNX

Décidez *avant* de figer le plan électrique : KNX signifie un câble bus vert vers chaque poste de commande, chaque point d'actionneur et le tableau — avec une topologie différente (les charges remontent au tableau). Ajouter KNX après coup équivaut à recâbler ; l'ajouter pendant le chantier est un surcoût modéré. Demandez deux devis d'intégrateurs tôt.

## La version en une phrase

De l'Ethernet partout, du neutre partout, du courant aux fenêtres, des gaines surdimensionnées avec aiguilles, un local technique — tout cela est ennuyeux, invisible, et le meilleur argent dépensé de toute la maison.
