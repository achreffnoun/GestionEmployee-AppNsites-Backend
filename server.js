const express = require('express');
const app = express();

var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projet1-78355.firebaseio.com"
});


app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Add user
app.post('/create', async (req,res) => {
    try{
        const id = req.body.email;
        const userJson = {
            email: req.body.email,
            nom: req.body.nom,
            prenom : req.body.prenom
        };
        //const response = await db.collection('users').add(userJson); //(Si vous voulez un ID auto-generated)
        const response = db.collection("users").doc(id).set(userJson);
        res.send(response);
    }catch (error) {
        res.send(error);
    }
});
//get All users
app.get('/users', async (req,res)=>{
    try {
        const usersRef = db.collection("users");
        const reponse = await usersRef.get();
        let responseArr = [];
        reponse.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    } catch (error) {
        res.send(error)
    }
})
//Get user by ID
app.get('/users/:id', async (req,res)=>{
    try {
        const userRef = db.collection("users").doc(req.params.id);
        const reponse = await userRef.get();
        res.send(reponse.data());
    } catch (error) {
        res.send(error)
    } 
});
//Update user
app.post('/user',async (req,res)=>{
    try {
        const id=req.body.email;
        const newnom = req.body.nom;
        const newprenom = req.body.prenom
        const userRef = await db.collection("users").doc(id).update({
            nom: newnom,
            prenom: newprenom
        });
        const reponse = await userRef.get();
        res.send(reponse.data());
    } catch (error) {
        res.send(error)
    }
});
//Delete user
app.delete('/user/:id', async (req,res)=>{
    try {
        const reponse = await db.collection("users").doc(req.params.id).delete();
        res.send(reponse);
    } catch (error) {
        res.send(error)
    }
})

const db = admin.firestore();

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
});
