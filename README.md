# Beyond All Reason Live Services
Provides various web services for the RTS game [Beyond All Reason](https://www.beyondallreason.info/).

## Services

### Replays
Actively scans, parses and stores data from BAR replay files. Frontend served at **/replays**.

### Maps
Actively scans, parses and stores data from BAR map files. Frontend served at **/maps**.

### Battles
Monitors current battles and displays them in realtime at **/battles**.

### Profiles
Serves player info pages, displaying various game data and statistics at **/players/#userId**.

### Leaderboards
Serves a list of top players on the server, rated by their TrueSkill in various gametypes at **/leaderboards**.

## Data
![DB Schema](./src/data-processor/db-schema.svg)

## Dependencies
- [sdfz-demo-parser](https://www.npmjs.com/package/sdfz-demo-parser) - Parser for Spring demo files
- [spring-map-parser](https://www.npmjs.com/package/spring-map-parser) - Parser for Spring map files
- [sldbts](https://www.npmjs.com/package/sldbts) - SLDB XMLRPC client for grabbing leaderboard data
- [sluts](https://www.npmjs.com/package/sluts) - Uberserver client for getting live lobby data
- [pg](https://www.npmjs.com/package/pg) - PostgreSQL
- [sequelize](https://www.npmjs.com/package/sequelize) - Database ORM for interacting with the PostgreSQL db
- [express](https://www.npmjs.com/package/express) - Web server framework
- [vue](https://www.npmjs.com/package/vue) - Reactive DOM views

## API
TODO

## Installation and Usage
`npm i`

`npm run data-processor`

`npm start`
