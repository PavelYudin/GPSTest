const express = require('express');
const router = require('./routes/users');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json()); // для распознования  входящего объекта запроса как json

app.use("/user",router);

app.use(function(req, res, next){ // если в программе не предусмотрен такой url
    res.status(404);
    res.json({message: "not found"});   
})
  
const server = app.listen(PORT, () => {  
    console.log('The server is listening on port ' + server.address().port);
})