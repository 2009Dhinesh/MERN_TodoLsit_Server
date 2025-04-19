// create express

const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cors());

const port =3002;

// new array 

// var todos = [];

// connection mongo DB

mongoose.connect('mongodb://localhost:27017/Todo').then(()=>console.log("DB connected..."));

// create schema

const todoSchema = new mongoose.Schema({
    title: {
        required : true,
        type : String,
    },
    description : String
});
const todoModel = mongoose.model('todo' , todoSchema)


// create a new item

app.post('/todos' , async (req , res) => {
    const { title , description } = req.body;

    // const newTodo ={
    //     id : todos.length + 1 ,
    //     title ,
    //     description
    // }
    // todos.push(newTodo);
    // console.log(todos);

    try {
        const newTodo = new todoModel({
            title , 
            description
        })
        newTodo.save()
        await res.status(200).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
});

app.get('/todos' , async (req , res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
})

// updata item in todo

app.put('/todos/:id' , async (req , res) => {
    try {
        const { title , description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {
                title,
                description
            },
            // return updata item 
            {
                new : true
            }
        );

        if(!updatedTodo){
            res.status(404).json({
                message : "Todo not found"
            });
        }
        res.json(updatedTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
});


// delete todo item

app.delete("/todos/:id" , async(req ,res) => {
    
    try {
        const id = req.params.id ;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
});

app.listen(port , ()=>console.log(`server run on http://localhost:${port}`));