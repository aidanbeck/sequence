A daily number puzzle by Aidan & Carter Beck.

# Requirements

UI
* Revamp Operations Display
* Pop-Up Box HTML & CSS
* Tutorial Box
* Submission Box: Triggered by letting go of finished sequence.
* Results Box
* Change font & colors
* Fix display of multi-character numbers

Gameplay
* Bigger board on Saturdays.
* Lose if you divide by zero.

Leaderboard
* SQL "solves" Table
* SQL "players" Table
* Localstorage uuid
* Cloudflare Worker API
    * Recieves score & uuid
    * If uuid is blank, generate a player record and send the uuid to the user.
    * If the score exists, don't bother authenticating it.
    * If the score doesn't exist, request moves list.
    * Player sends lists of moves, which is authenticated in worker.
    * Add solve to leaderboard
    * Return solve's place in comparison to other solves.

Sound
* Sound for hitting Start.
* Sound on add, multiply, divide. Cool if variants make a melody.
* Reverse sounds for taking moves back (Reversed).
* Sounds for multiplying on a big number (Good).
* Sounds for multiplying on a small number (Bad).
* Sounds for dividing on a small number (Good).
* Sounds for dividing on a big number (Devastating).
* "Humming" sound for completing the circuit, before letting go.
* Sound for letting go when complete, opening the submission box.
* Sound for hitting "Keep Trying".
* Sound for hitting "Submit". Variants for Third, Second, First.
* Sound for hitting "Share".
* Sound design is open ended, but I like the idea of it feeling satisfying and "Zen". Take inspiration from dialed.gg.