var express = require('./node_modules/express/index.js')
var averageAge = require('./mapAgeData.json')
const api = express ();
api.use(express.json());
const PORT = process.env.PORT || 3000;

api.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
api.get("/countyAge", (request, response) => {
   const countyAge  = averageAge;
   
   response.send(countyAge);
});