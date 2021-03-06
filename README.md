# world-of-airports

## Running the app
Using Docker (needs to be installed) or Node (8+ needs to be installed)

### Using Docker
1. Run `docker-compose up` in terminal
2. Open `localhost:3000` in browser 

### Using locally installed Node
Both server and client needs to be running.
Prerequisite: Node (8+) installed

#### Run Server:
In a terminal window:
1. `cd server`
2. `npm install`
3. `npm run build`
3. `npm run start` <br />
Keep terminal open.

#### Run client:
In new terminal window
1. `cd client`
2. `npm install`
3. `npm run start`
4. Open `localhost:3000` in browser

## Notes
Using a React client for a small coding task like this might be an overkill.
But it would make more sense in production, because of the virtual DOM (good performance with updating long lists),
and using the same test runner (Jest comes bundled with `create-react-app`) makes the testing easier.

### What would I improve (if I have more time)
- add validation to next page query (now I just validate if they are there, but assume the client uses the returned query data)
- add tests for React client

### What would I do differently if it's not a coding test
- using an external library for geo logic (distance, etc)
- using `BigInt` or other packages to handle big numbers and floating point precision problems in JS
- or using another language (Python?)
- or just using Geospatial query with Cloudant
