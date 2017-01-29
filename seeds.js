var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Indiana hills",
        image: "http://www.hdwallpapers.in/walls/hawaii_islands_waterfall-wide.jpg",
        description: "Cool breezy, and sometimes warm ,eventually hot and cold during nights and mild rainfall during mornings"
    },
    {
        name: "Seatle love",
        image: "http://www.hdwallpapers.in/walls/earthworks-wide.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centurie"
    },
    {
        name: "Explore california",
        image: "http://www.hdwallpapers.in/walls/rocky_shore_sunset_5k-wide.jpg",
        description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of (The Extremes of Good and Evil)"
    },
    {
        name: "Explore california",
        image: "http://www.hdwallpapers.in/walls/hot_air_balloon_reflections-wide.jpg",
        description: "This year it became over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of (The Extremes of Good and Evil)"
    }
];

function seedDB(){
    // Campground.remove({}, function (err){
    //     if(err){
    //         console.log(err);
    //     }
        // console.log("removed");
        // data.forEach(function(camps){
        //     Campground.create(camps, function(err, campground){
        //         if(err){
        //             console.log(err);
        //         }
        //         else{
        //             console.log("added");
        //             Comment.create({
        //                 text: "This is so beautiful,please come visit here and witness th e greatest ever campground discovered till date to your amusement",
        //                 author: "Skay"
        //             }, function (err, comment){
        //                 if(err){
        //                     console.log(err);
        //                 }
        //                 else{
        //                     campground.comments.push(comment);
        //                     campground.save();
        //                 }
        //             });
        //         }
        //     });
        // });
    // });
}

module.exports = seedDB;