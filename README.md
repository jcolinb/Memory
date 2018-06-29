## Memory

### Gameplay

Press start to begin.
Touch or click on any two tiles to reveal their icon.
Choose matching tiles in a turn to keep them flipped.
Match the whole board to win!
Your rating is based on the number of turns, the timer is for your edification.

### dev notes

The flow of gameplay is controlled using Promises. To avoid unresolved Promises left hanging, I have omitted the restart button
during gameplay. Since there is a timer and rating system per game, I do not believe that forcing a game to be finished is a 
problem. The only solution I could come up with involved reloading the page, which is non-ideal. there is a 'Play Again' option 
in the congratulations modal which allows for a new game.
