const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const admin = require('firebase-admin');

const app = express();
admin.initializeApp();

var alphaNumeric = '^[a-zA-Z0-9 .\'?!,-]*$';
const length = 50;

app.get("/", async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection("users").get();
        const users = [];
        snapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                data: doc.data()
            }
            )
        })
        res.status(200).send(JSON.stringify({ db: users, code: 200, message: "Succesful GET" }));
    }
    catch (error) {
        res.status(500).send({ "code": 500, "message": "Unable to retrieve user database" });
    }
});

app.get("/:id", async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection('users').doc(req.params.id).get();
        const userId = snapshot.id;
        const userData = snapshot.data();
        res.status(200).send(JSON.stringify({ data: userData, code: 200, message: "Succesful GET" }));
    }
    catch (error) {
        res.status(500).send({ "code": 500, "message": "Unable to retrieve user from database" });
    }
});


app.post('/', async (req, res) => {
    const user = req.body;
    try {
        if (!user || !user.fname || !user.lname || !user.age) {
            res.status(400).send({ "code": 400, "message": "Missing Field" });
        }
        else if (!user.fname.match(alphaNumeric) || !user.lname.match(alphaNumeric)) {
            res.status(400).send({ "code": 400, "message": "Not Valid Input" });
        }
        else if (user.fname.length > 50 || user.lname.length > 50) {
            res.status(400).send({ "code": 400, "message": "Too Long" });
        }
        else {
            const data = { "fname": user.fname, "lname": user.lname, "age": user.age }

            await admin.firestore().collection('users').add(data);
            res.status(201).send({ "code": 201, "message": "Added User to Database" });
        }
    }
    catch (error) {
        res.status(500).send({ "code": 500, "message": "Unable to add user to database" });
    }

});

app.put('/:id', async (req, res) => {
    const user = req.body;
    try {
        if (!user || !user.fname || !user.lname || !user.age) {
            res.status(400).send({ "code": 400, "message": "Missing Field" });
        }
        else if (!user.fname.match(alphaNumeric) || !user.lname.match(alphaNumeric)) {
            res.status(400).send({ "code": 400, "message": "Not Valid Input" });
        }
        else if (user.fname.length > 50 || user.lname.length > 50) {
            res.status(400).send({ "code": 400, "message": "Too Long" });
        }
        else {
            const data = { "fname": user.fname, "lname": user.lname, "age": user.age }
            await admin.firestore().collection('users').doc(req.params.id).update(data);
            res.status(201).send({ "code": 201, "message": "Updated User in Database" });
        }
    }
    catch (error) {
        res.status(500).send({ "code": 500, "message": "Unable to Update User" });
    }
});


app.delete('/:id', async (req, res) => {
    try {
        await admin.firestore().collection('users').doc(req.params.id).delete();
        res.status(200).send({ "code": 200, "message": "Succesful Deletion" });
    }
    catch (error) {
        res.status(500).send({ "code": 500, "message": "Unable to delete user to database" });
    }
});


exports.user = functions.https.onRequest(app);


exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
