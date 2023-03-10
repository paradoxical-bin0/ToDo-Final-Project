
// module.exports = "Hello World!";
module.exports.date = date;

module.exports.day = day;

function day () {
    var today = new Date();
        
    var options = {
        weekday: "long"
    };

    var day = today.toLocaleDateString("en-US", options);

    return day;
}


function date (){
    var today = new Date();
        
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US", options);

    return day;
}

// var currentDay = today.getDay();
    // var day = "";
    // ---------------------------------------
    // if(currentDay === 6 || currentDay === 0)
    // {
    //     day = "Weekend";
    //     //res.sendFile(__dirname + "/index.html");
    // }
    // else
    // {
    //     day = "Weekday";
    //     //res.sendFile(__dirname + "/index.html");
    // }