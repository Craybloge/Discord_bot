# Craybot
Il s'agit d'un bot que j'ai développé d'abord pour le fun et découvrir nodejs et les API. Je compte petit à petit rajouter des fonctionnalités utiles.

N'hésitez pas à me proposer si vous avez des idées / des conseils.  
Ajoutez moi sur discord: Craybloge#0001
## Les commandes fonctionnelles:
- /gif +thème facultatif
- /info user
- /info server
- /ping + @user
- /salut

## les commandes à tester:
- /song play, skip, stop

## les commandes à dev:
- /poll
- /meteo + ville + date
- /lol + des options

---

## la commande weather (en cours):

### reste à implémenter:
- les subcommand pour choisir now, hourly, daily
- la durée de la prévision
- un choix de langue?
### liens utiles:
- https://openweathermap.org/api/one-call-api
- https://www.npmjs.com/package/node-geocoder (pour transformer le nom d'une ville en latitude longitude)

---

## la commande song play/skip/stop
- tout est à refaire car avec la version 13 de discordjs la gestion des voice channel a complètement changé
- voir guide ici: https://discordjs.guide/voice/voice-connections.html

---

## la commande poll:
- choix entre 2, 3, 4 et plus si possible options
- on sélectionne l'option en cliquant sur un bouton
- une fois le choix fait tout les boutons deviennent grisés et apparait le bouton changer de choix
- le résultat du sondage apparait dans un embed et les barres de pourcentages sont faite avec des images de différentes tailles (au minimum une tout les 10% + une à 25, 33, 66 et 75)
- on peut mettre une seule image par embed donc je pense utiliser un [canvas](https://www.npmjs.com/package/canvas) (si on utilise un canvas on doit pouvoir choisir la taille exacte des barres de pourcentages)
### bonus:
- ajouter l'option de cocher plusieurs option lors de la création du sondage
- ajouter une durée du sondage
