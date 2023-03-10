const express = require("express");
const bodyParser = require("body-parser");
const { render } = require("ejs");
const mongoose = require("mongoose");
const loadash = require("lodash");
const date = require(__dirname + "/date.js");

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB"); ////connecting with db

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Creating Schema
const itemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    }
});

//Creating another Schema for our list
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

//Model
const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

//  Creating a default array for the List collection
const default_item1 = new Item({
    name: "Hey There!"
});
const default_item2 = new Item({
    name: "Welcome :)"
});
const default_array = [default_item1, default_item2];

//Root
app.get("/", function(req, res){

    let todays_date = date.date();

    Item.find().then((items) => {
        res.render("list", {heading: todays_date, task: items});
        //mongoose.connection.close();
    }).catch((err) => {
        console.log(err);
    });
    
});

//About Page
app.get("/about", function(req,res){
    res.render("about");
});

//New  List eg."/College"
app.get("/:new_list", function(req,res){
    const new_title = loadash.capitalize(req.params.new_list);

    List.findOne({name: new_title}).then((found_list) => {
        //list already exists
        res.render("list",{heading: found_list.name, task: found_list.items});
    }).catch(() => {
        //new list 
        const list = new List({
            name: new_title,
            items: default_array
        });
        list.save();
        res.redirect("/" + new_title);
    });
});

//Adding items into the lists
app.post("/", function(req, res){
    let todays_date = date.date();
    let item_name = req.body.newItem;
    let list_name = req.body.button; 

    let item = new Item({
        name: item_name
    });

    if(list_name === todays_date)
    {
        item.save();
        res.redirect("/");
    }
    else
    {
        List.findOne({name: list_name}).then((found_list) => {
            found_list.items.push(item);
            found_list.save();
            res.redirect("/" + list_name);
        }).catch((err) => {
            console.log(err);
        });
    }
    
});

//Deleting items from the lists
app.post("/delete", function(req,res){
    let todays_date = date.date();
    let id = req.body.checkbox;
    let listName = req.body.listName;

    if(listName == todays_date)
    {
        Item.deleteOne({ _id: id}).then(() => {
            console.log("Deleted 1 record!");
            res.redirect("/");
        }).catch((err) => {
            console.log(err);
        });
    }
    else
    {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: id}}})
        .then(() => {
            res.redirect("/" + listName);
        }).catch((err) => {
            console.log(err);
        })
    }
 
});

//Connecting to the port
app.listen(3000, function(){
    console.log("Server started on port 3000.");
});


//$pull ------
//lodash.capitalize ------ 

/*
IN list.ejs
<!-- 
    <% if(heading === "Saturday" || heading === "Sunday") { %>   
        <h1 style="color: blueviolet;">Its a <%= heading %></h1>
    <% } else { %>
        <h1 style="color: aqua;">Its a <%= heading %></h1>
    <% } %> 
    <h1>Its a <%= heading %> </h1>
    <p>Check</p> 
    Scriptlet Tag(<% _JS_ %>) for control flow (use for each JS line) use <%= ___ %> for output 
-->
*/