# world-of-airports

## Running the app
Both server and client needs to be running.
Prerequisite: Node (8+) installed

### Run Server:
In a terminal window:
1. `cd server`
2. `npm install`
3. `npm run start`
Keep terminal open.

### Run client:
In new terminal window
1. `cd client`
2. `npm install`
3. `npm run start`
4. open localhost:3000 in browser

#### What would I improve (if I have more time)
- add validation to next page query (now I just validate if they are there, but assume the client uses the returned query data)
- add tests for React client
- use docker to ensure environment prerequisites and making easier to run

#### What would I do differently if it's not a coding test
- using an external library for geo logic (distance, etc)
- using `BigInt` or other packages to handle big numbers and floating point precision problems in JS
- or using another language (Python?)
- or just using Geospatial query with Cloudant
