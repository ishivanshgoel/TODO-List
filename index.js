const express = require('express')
const bodyparser = require('body-parser')

const app = express()


app.use(bodyparser.urlencoded({extended:true}));

app.set('view engine','ejs');

var todos=[];

app.get("/",(req,res)=>{
    
    // sending current date
    let currentDate = new Date();

    let date = {
        day : currentDate.getDate(),
        month : currentDate.getMonth(),
        year : currentDate.getFullYear()
    }

    // rendering template
    res.render('index' , {date : date, allTodos : todos});

});

app.post("/",function(req,res){
    let newItem = req.body.newItem;
    todos.push(newItem);
    res.redirect("/");
})

app.listen(3000,()=>{
    console.log("Listening on posrt 3000!!");
})