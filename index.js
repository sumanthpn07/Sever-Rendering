const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;
const fs = require("fs");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
var userf = false;

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

// app.get("/", (req, res) => {
//   //res.send("Hell sms o World!");
//   res.sendFile(__dirname + "/index.html");
// });
app.get("/", (req, res) => {
  //res.send("Hell sms o World!");
  if (req.session.is_logged_in) {
    let userid;
    let pass;
    let flag;
    console.log("brfore cond" + req.session.flag);
    // console.log("home");
    // console.log(req.session.username);
    //check for the users
    fs.readFile("./users.txt", function (err, data) {
      if (err) {
        console.log(err);
        return;
      }
      data = JSON.parse(data);
      //search for username if exist if exist then save it to user and
      //note down the user id;
      data.forEach(function (data, index) {
        if (data === req.session.username) {
          userid = index;
          console.log("condition");
          console.log(req.session.username);
          console.log(req.session.password);

          fs.readFile("./pass.txt", function (err, data) {
            if (err) {
              console.log(err);
              return;
            }

            data = JSON.parse(data);
            data.forEach(function (data, index, arr) {
              if (arr[userid] === req.session.password) {
                userf = true;
                console.log("userf is " + userf);
                req.session.flag = true;
                console.log("in cond " + req.session.flag);
              }
            });
            //search for pass for the particular user id;
            // data.forEach();
          });
        }
      });
    });

    const username = req.session.username;

    console.log("after cond" + req.session.flag);

    res.render("home", { name: username });
    // res.redirect("/signup");

    // res.sendFile(__dirname + "/index.html");

    //compare username and password if it matches the value then
    // serve homepage else redirect back to login page with the
    //message password wrong;
  } else res.redirect("/login");
});

app.get("/login", (req, res) => {
  //res.send("Hell sms o World!");
  if (req.session.is_logged_in) {
    res.redirect("/");
  } else res.sendFile(__dirname + "/login.html");
});

app.post("/login", (req, res) => {
  //res.send("Hell sms o World!");
  console.log(req.session);

  if (req.session.is_logged_in) {
    res.redirect("/");
  } else {
    req.session.is_logged_in = true;
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    req.session.flag = false;
    res.redirect("/");
  }

  console.log(req.body);
});

app.post("/signup", (req, res) => {
  //res.send("Hell sms o World!");
  // res.end("hey man this is ho");
  console.log(req.body);
  let users = [];
  let pass = [];
  fs.readFile("./users.txt", function (err, data) {
    data = JSON.parse(data);
    data.push(req.body.username);
    fs.writeFile("./users.txt", JSON.stringify(data), function (err) {
      res.end("its hit");
    });
  });

  fs.readFile("./pass.txt", function (err, data) {
    data = JSON.parse(data);
    data.push(req.body.password);
    console.log(req.body.password);
    fs.writeFile("./pass.txt", JSON.stringify(data), function (err) {
      res.end("its hit");
    });
  });
  res.redirect("/");
});

app.get("/seedata", function (req, res) {
  res.end("hellp");
});

app.get("/logout", function (req, res) {
  req.session.is_logged_in = false;
  console.log("sumanth");
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
