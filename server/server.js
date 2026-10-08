const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app=express();

app.use (cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error: ", error);
    });

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.listen(5000, () => {
    console.log("Server running on port 5000")
});

app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.post("/students", async (req, res) => {
    const {name, course, age} = req.body;
    const addStudent = new Student({name,course,age});
    await addStudent.save();
    res.json(addStudent);
});

app.put("/students/:id", async (req, res) => {
    const {id} = req.params;
    const {name, course, age} = req.body;
    const editStudent = await Student.findByIdAndUpdate(id, {name,course,age}, {new: true} );
    res.json(editStudent);
});

app.delete("/students/:id", async (req, res) => {
    const {id} = req.params;
    await Student.findByIdAndDelete(id);
    res.json({message:"Student deleted"});
});