# ads-cli
Athletic Director Simulator with nodejs on cli


## How to
to run the game on your cli,  after having had run `npm install`:
```
npm run start
```


once you are in a new game, type: `> help` to have a list of commands:

```
DATE: 29-07-2020
----------------------------------------------------
Fame : [---------------------------------------] 0%
----------------------------------------------------


> help
commands:
   next, n : advance time
   read news
   read news INDEX: read the news at INDEX
   messages:
       messages read
       messages reply
       messages list
   db:
       teams: show the teams
       stats: show the stats
       league: 
           db league table: show the league table
           db league scorers: show the league scorers
           db league fixtures: show the league fixtures
           db league results: show the league results
> db teams
TEAMS

╔═══╤═══════════════════════════╤═════════╗
║ # │ Name                      │ Colours ║
╟───┼───────────────────────────┼─────────╢
║ 1 │ Juve-Savona               │ ██      ║
╟───┼───────────────────────────┼─────────╢
║ 2 │ Taranto                   │ ██      ║
╟───┼───────────────────────────┼─────────╢
║ 3 │ Atletico Cava de' Tirreni │ ██      ║
╟───┼───────────────────────────┼─────────╢
║ 4 │ Sanremo Football          │ ██      ║
╚═══╧═══════════════════════════╧═════════╝
> 
```