const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const app = express()

// bodyparser
app.use(bodyparser.urlencoded({extended:true}));

// for static files
app.use(express.static("public"));

// ejs
app.set('view engine','ejs');


// for database
mongoose.connect('mongodb://localhost:27017/todoDB', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to db successfully!!");
});

// creating schema for database
const todoSchema = new mongoose.Schema({
    date : Object,
    work : String,
    isDone : Boolean
});

// todo model
const todos = mongoose.model("todos", todoSchema);

// to get the current date
var get_current_date = function(){
    //current date
    let currentDate = new Date();

    let date = {
        day : currentDate.getDate(),
        month : currentDate.getMonth(),
        year : currentDate.getFullYear()
    }
    return date;
}

// home route
app.get("/",(req,res)=>{

    // creating list of all todos to send to frontend
    // rendering template
    todos.find(function(err, todo_list){
        if(err){
            console.log(err);
        }
        else{
            console.log(todo_list);
             res.render('index' , {date : get_current_date(), allTodos : todo_list});
        }
    });
});



app.post("/",function(req,res){
    let newItem = req.body.newItem;

    if(newItem.length > 0){
    // updating to database
    let my_todo = new todos({
        work : newItem,
        isDone : false,
        date : get_current_date()
    });
    my_todo.save();
    } else{
       console.log("Not updated!!");
    }
    
    res.redirect("/");
});


// route to get all pending todos
app.get("/all_pending_work",function(req,res){
    var pending_todos=[];
    let isFetched=false;

    todos.find(function(err,todo_list){
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log(todo_list)
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

        if(err){
            console.log(err);
        }
        else{
            todo_list.forEach(function(todo){
                if(todo.isDone==false){
                    pending_todos.push(todo);
                    // console.log(todo);
                }
            })
            res.render("all_todos.ejs", {pending_todos : todo_list});
        }
    });
    // console.log("Pending TODO's");
    // console.log(pending_todos);
    // res.render("all_todos.ejs", {pending_todos : pending_todos});
});


// creating server on port 3000
app.listen(3000,()=>{
    console.log("Listening on port 3000!!");
});