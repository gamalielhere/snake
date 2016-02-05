#SNAKE GAME  
</br>
</br>
![SNAKE PHOTO](http://i.imgur.com/bJZMrbL.png)

SNAKE is a classic game where you play as the snake and you feed yourself with the food that randomly pops around the board. My variation of the game speeds up the snake the more food you eat.  
</br>
</br>
###TECHNOLOGY
* HTML
* CSS
* Javascript/jQuery
* Firebase
</br>
</br>

###FUNCTIONALITY
* Created snake as an array to make it easier to add length into it.
* Set up the board with canvas
* Move snake inside the canvas by removing one piece of the tail and moving it to the head repeatedly.
* Direct the snake by arrow keys using event.which to distinguish which key is being used.
* <del>Stores high scores in local storages. [See MDN docs for more info](https://developer.mozilla.org/en-US/docs/Web/API/Storage) </del>  
Never mind that. Jim helped me out and introduced me to Firebase data bases so the high scores are stored in a server and can be beaten by anyone currently playing.
</br>
</br>

### INSTRUCTIONS
* Move snake with your arrow keys.
* Collect as much food as you can.
* **DON'T DIE**

</br>
</br>
###DESIGN APPROACH
My design approach is basically reviving a retro game. I used "Press Start 2P" as font to add that 8-bit old classic game look.
![SNAKE WIREFRAME](http://i.imgur.com/Yckp5UY.jpg)
####Basically like any game, it starts out with a home page: 
![HOME PAGE](http://i.imgur.com/yKt7Yp7.jpg)
####Goes to the game and lets you play:
![SNAKE PHOTO](http://i.imgur.com/bJZMrbL.png)
####Until you die: 
![DEAD SCREEN](http://i.imgur.com/aMsXWpH.jpg)
</br>
</br>

### USER STORIES
All of my user stories can be found in my [Trello boards](https://trello.com/b/TTtZgl3z)

#CODE
[The code can be found here](https://github.com/gamalielhere/projects/tree/master/project_1/snake)  

[And the hosted game site can be found here](http://gamalielhere.github.io/snake/)

#NOTE:
Hosted repo and the game's code repo are different. I stored the game locally under 3 directories. Trying to keep it tidy so I have to make another repo for the game to be hosted on its own folder.

#BUGS:
* Jerry Lee found one that kills the snake when you press the buttons too fast.