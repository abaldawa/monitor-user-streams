# monitor-user-streams
A REST server written in Node.js to allow user to only watch 3 concurrent streams

## npm dependencies
### main dependencies
1. express
2. chalk -> could have easily avoided it but used it to highlight messages on console  
3. winston

### Dev dependencies
1. Mocha
2. Chai
3. Supertest

## How to run
### Docker container (Prerequisite -> docker must be installed )
I have written a docker file so build and run docker image as below:
1. docker build -t <user_name>/monitor-user-stream .
2. docker run -p <port number of your choice>:3000 -d <user_name>/monitor-user-stream
  
### Run without docker (Prerequisite -> node 11.7 must be installed)
1. git clone the project
2. cd monitor-user-streams
3. npm i
4. To run integration and unit tests execute "npm run test" (18 tests written)
5. To run application execute "npm start"

#### For simpilicity I have used in-memory DB in a json file with 3 predefined user ID's (@see server/datababse/mock_db/inMemoryDb.json)

Once server is up and running there are 2 REST endpoints as below:
## 1] POST /canWatch/:userId (where user ID can be '5c45c32f58cf65b0e40c1f7f')

This ENDPOINT checks whether the user with userId can watch a video stream. If number of concurrent streams
for this user is <= 3 then the user can watch else the user cannot watch.

Example response output is: 

```javascript
{
     canWatch: <Boolean>, 
     message: <String (incase of error message will exist)>
}

HTTP status codes = "200, 403 (for exceeding limit) 404, 400 (no user id passed) or 500"
```
  
## 2] POST /stopWatching/:userId (where user ID can be '5c45c32f58cf65b0e40c1f7f')
This endpoint reduces the count of concurrent videos, the user with userId is watching, by 1.
Example response output is: 

```javascript
{
   userId: <String>,
   noOfStreams: <Number>
}

HTTP status codes = "200, 404, 400 (no user id passed) or 500"
```

## Scalability
1. For simpilicity I have used in-memory DB in a json file
2. In real world application there would be a separate DB so we can scale the REST service vertically using node.js clustering so that it can utilise all the cores of the server CPU it is hosted on and wont die in case of uncaught exception.
3. For horizontal scaling AWS lambda or fixed multiple EC2 instances behind loadbalancer can be used.
4. So the combination of node.js clustering and AWS Lambda/ Multiple EC2 could scale the REST service. 
