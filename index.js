const express = require("express");

const app = express();

const multer = require("multer");

const upload = multer();

const fs = require("fs");
const bodyParser = require('body-parser');

app.use(bodyParser.json());


app.get("/UploadForm.html", (req, res) => {

    res.sendFile(__dirname + "/" + "UploadForm.html");

})

app.get("/notes/:nname", (req, res) => {

    var noteName = req.params.nname;

    fs.readFile("./notes.json", (err, data) => {

        if (err && err.code === "ENOENT") {

            console.log("File not found.");

            res.send();
        }

        else if (err) {

            console.error(err);
        }

        else {

            try {

                var fileData = JSON.parse(data);

                var n = fileData.filter(it => it.note_name === noteName);

                if (n.length !== 0) {

                    res.status(200).send(n[0].note);

                }

                else {

                    res.status(404).send('Note not found');

                }

            }

            catch (exception) {

                console.error(exception);

            }

        }


    })

})

app.get("/notes", (req, res) => {

    var fileData;

    fs.readFile("./notes.json", (err, data) => {

        if (err && err.code === "ENOENT") {

            console.log("File not found.");

            res.send();

        }

        else if (err) {

            console.error(err);

        }

        else {

            try {

                fileData = JSON.parse(data);

            }

            catch (exception) {

                console.error(exception);

            }

        }

        res.send(fileData);

    })

})

app.post("/upload", upload.none(), (req, res, next) => {

    response = {

        note_name: req.body.note_name,

        note: req.body.note

    }

    obj = JSON.stringify(response);

    fs.readFile("./notes.json", (err, data) => {

        if (err && err.code === "ENOENT") {

            return fs.writeFile("./notes.json", JSON.stringify([response]), error => console.error);

        }

        else if (err) {

            console.error(err);

        }

        else {

            try {

                const fileData = JSON.parse(data);

                var n = fileData.filter(it => it.note_name === req.body.note_name);

                if (n.length !== 0) {

                    res.status(400).send('Note already present');

                }

                else {

                    fileData.push(response);

                    fs.writeFile("./notes.json", JSON.stringify(fileData), error => console.error);

                    res.status(201).send(JSON.stringify(response));

                }

            }

            catch (exception) {

                console.error(exception);

            }

        }

    })


})



app.put("/notes/:nname", (req, res) => {

    var noteName = req.params.nname;

    var noteText = req.body.note;

    fs.readFile("./notes.json", (err, data) => {

        if (err && err.code === "ENOENT") {

            console.log("File not found.");

            res.send();

        }

        else if (err) {

            console.error(err);

        }

        else {

            try {

                var fileData = JSON.parse(data);

                var n = fileData.filter(it => it.note_name === noteName);

                if (n.length !== 0) {

                    n[0].note = noteText;

                    fs.writeFile("./notes.json", JSON.stringify(fileData), error => console.error);

                    res.status(200).send(n[0].note);

                }

                else {

                    res.status(404).send('Note not found');

                }

            }

            catch (exception) {

                console.error(exception);

            }

        }

        res.send();

    })


})



app.delete("/notes/:nname", upload.none(), (req, res, next) => {

    var noteName = req.params.nname;

    fs.readFile("./notes.json", (err, data) => {

        if (err && err.code === "ENOENT") {

            console.log("File not found.");

            res.send();

        }

        else if (err) {

            console.error(err);

        }

        else {

            try {

                var fileData = JSON.parse(data);


                var n = fileData.filter(it => it.note_name === noteName);


                if (n.length !== 0) {

                    var j = 0;

                    fileData.forEach(note => {

                        j = j + 1;

                        if (note.note_name == noteName) {

                            fileData.splice((j - 1), 1)

                        }

                    })

                    fs.writeFile("./notes.json", JSON.stringify(fileData), error => console.error);

                    console.log("File changed ");

                    res.status(200).send(fileData);

                }

                else {

                    res.status(404).send('Note not found');

                }

            }

            catch (exception) {

                console.error(exception);

            }

        }

        res.send();

    })


})

app.listen(8000);



