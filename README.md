# Beyond All Reason Live Services
Provides various web services for the RTS game [Beyond All Reason](TODO).

## Services

### Replays
Actively scans, parses and stores data from .sdfz replay files. Frontend served at **/replays**. Uses:

- [sdfz-demo-parser](TODO)
- [sqlite3](TODO)

### Battles
Monitors current battles and displays them in realtime at **/battles**. Uses:

- [sluts](TODO)

### Leaderboards
Serves a list of top players on the server, rated by their Truekill in various gametypes, at **/leaderboards**. Uses:

- [sldbts](TODO)

### Profiles
Serves player info pages, displaying various game data and statistics at **/players/#userId**.

### Maps
Actively scans, parses and stores data from .smf map files. Frontend served at **/maps**.

- [sqlite3](TODO)

### API
TODO

## Installation and Usage
`git clone blahblah`

`npm i`

`npm start`