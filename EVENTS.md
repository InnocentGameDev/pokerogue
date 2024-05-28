Current "Events" Implementation Roadmap:

Phase 0: Exploration phase
1) Find whatever the hell in the code "moves" the player from floor to floor (ie what in the code ends one shop and starts the next fight)
2) Find/learn what constitutes an entire battle.

Phase 1: Modifying the framework that decides between static floors and wild/trainer encounters
3) Copy / paste the battle stage as a basis for working on Events.
4) Force floor 3 to always be our custom "battle-stage", which I'll name event.
5) Force floor 3's event to always be a Cosmog battle.

Phase 2: Creating the first Event -- and exiting from it.
6) Remove battle features one by one until only player sprite, Cosmog and menu remains.
7) Instead of a fight, prompt a dialogue from Cosmog, who offers you a Masterball, if you like it (or any other placeholder text).
8) "Fight" option should be "Accept". "Ball" option should be "Refuse".
9) "Pokémon" and "Run" options should not show.
10) "Accept" rewards you the masterball and ends the Event. "Refuse" simply ends it.
11) Move Cosmog's dialogue to be a box to the left of his sprite -- where the HP bars of enemies would be.
12) Move "Accept and "Refuse" options so that they are in box that takes mostly the lower side of the UI, and is divided by four even if only two options are present.
13) Create a "Response" phase, where Cosmog would say something after you've either accepted or refused, before the Event exits.

By this point, we have something that is a non-battle, where player is doing something else than just hitting spacebar to continue (he can make one of two choices). We have also set WHEN this non-battle event happens. Now, I imagine I can start taking out the constants, like the fact that Cosmog is the sprite that needs to show, or the floor where this happens.