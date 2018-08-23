const express = require("express");
const bodyParser = require("body-parser");
const mongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
  
const app = express();
const jsonParser = bodyParser.json();
const url = "mongodb://localhost:27017/usersdb";
  
app.use(express.static(__dirname + "/public"));
// получение списка данных
app.get("/api/users", function(req, res){

    mongoClient.connect(url, function(err, client){
        client.db("usersdb").collection("users").find({}).toArray(function(err, users){
            res.send(users)
            client.close();
        });
    });
});

// получение одного пользователя по id
app.get("/api/users/:id", function(req, res){
       
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, client){
    // находим пользователя по id
        client.db("usersdb").collection("users").findOne({_id: id}, function(err, user){
              
            if(err) return res.status(400).send();
            
            // отправляем пользователя
            res.send(user);
            client.close();
        });
    });
});
// получение отправленных данных
app.post("/api/users", jsonParser, function (req, res) {
      
    if(!req.body) return res.sendStatus(400);
      
    var userName = req.body.name;
    var userLogin = req.body.login;
    var userPassword = req.body.password;
    var userDateBirth = req.body.datebirth;
    var userDateEmploy = req.body.dateemploy;
    var userInn = req.body.inn;
    var userSalary = req.body.salary;
    var userPhone = req.body.phone;
    var userEmail = req.body.email;
    var user = {name: userName, login: userLogin, password: userPassword, datebirth: userDateBirth, dateemploy: userDateEmploy, inn: userInn, salary: userSalary, phone: userPhone, email: userEmail};
      
    mongoClient.connect(url, function(err, client){
        client.db("usersdb").collection("users").insertOne(user, function(err, result){
              
            if(err) return res.status(400).send();
              
            res.send(user);
            client.close();
        });
    });
});
 // удаление пользователя по id  
app.delete("/api/users/:id", function(req, res){
       
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, client){
        client.db("usersdb").collection("users").findOneAndDelete({_id: id}, function(err, result){
              
            if(err) return res.status(400).send();
              
            var user = result.value;
            res.send(user);
            client.close();
        });
    });
});
// изменение пользователя  
app.put("/api/users", jsonParser, function(req, res){
       
    if(!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var userName = req.body.name;
    var userLogin = req.body.login;
    var userPassword = req.body.password;
    var userDateBirth = req.body.datebirth;
    var userDateEmploy = req.body.dateemploy;
    var userInn = req.body.inn;
    var userSalary = req.body.salary;
    var userPhone = req.body.phone;
    var userEmail = req.body.email;
      
    mongoClient.connect(url, function(err, client){
        client.db("usersdb").collection("users").findOneAndUpdate({_id: id}, { $set: {name: userName, login: userLogin, password: userPassword, datebirth: userDateBirth, dateemploy: userDateEmploy, inn: userInn, salary: userSalary, phone: userPhone, email: userEmail}},
             {returnOriginal: false },function(err, result){
              
            if(err) return res.status(400).send();
              
            var user = result.value;
            res.send(user);
            client.close();
        });
    });
});
   
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});