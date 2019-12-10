# world-of-airports

run server:
npm install
npm run start

Run client:
cd client
npm install
npm run start
open browser on localhost:3000

node needed (8+ ?);

TODO:
- fix tests (AirportModelWrapper mock???, others to update)
- integration tests? (testing results against real data?)
- clean up
- offset precision (now ceil, but need +10% - ceil doesn't add enough overhead if result close to next is integer)
- move client folder
- update npm commands (one for add)
- TS to react?
- clean up react
- types for classes