const express = require("express");
const bodyParser = require("body-parser");
const request = require("request")
const https = require("https")
const dotenv = require('dotenv').config()
const app = express();   
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const url = "https://us21.api.mailchimp.com/3.0/lists/48f46ce5a5"
    const options = {
        method: "POST",
        auth: `amishk:${process.env.Private_key}`
    }
    const data = {
        members: [
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }]
    };
    // console.log(data.members[0].email_address)
    const jsonData = JSON.stringify(data);
    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            // console.log(JSON.parse(data) )
        })
        console.log(response.statusCode)
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
    });
    request.write(jsonData);
    request.end();
});
app.post("/failure", (req, res) => {
    res.redirect("/")
})
app.listen(process.env.PORT || 3000, () => {
    console.log("listining at http://127.0.0.1:3000")
})                   



// list id:48f46ce5a5