"use strict";

const express = require("express");
const logger = require("./utils/logger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cookieParser());
const exphbs = require("express-handlebars");
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(fileUpload());
app.engine(
    ".hbs",
    exphbs({
      extname: ".hbs",
      defaultLayout: "main",
      helpers: {
        // Determine correct text to use in relation to the number of assessments recorded
        checkAssessmentCount: function(count) {
          if (count === 1)
            return "1 assessment";
          return count + " assessments";
        },
        // Default to the current gender when entering the Profile Settings page
        checkGender: function(gender) {
          let string1, string2, string3;
          if (gender === "M")
            string1 = "<option value=\"M\" selected>Male</option>";
          else
            string1 = "<option value=\"M\" >Male</option>";

          if (gender === "F")
            string2 = "<option value=\"F\" selected>Female</option>";
          else
            string2 = "<option value=\"F\" >Female</option>";

          if (gender === "Unspecified")
            string3 = "<option value=\"Unspecified\" selected>Unspecified</option>";
          else
            string3 = "<option value=\"Unspecified\" >Unspecified</option>";
          return string1 + string2 + string3;
        },
        // Assign the correct icon to the Goals entries
        checkGoalStatus: function(status) {
          let string = '';
          if (status === "Open")
            string = "<i class=\"big blue cogs icon\"></i>";
          if (status === "Achieved")
            string = "<i class=\"big green check icon\"></i>";
          if (status === "Missed")
            string = "<i class=\"big red times icon\"></i>";
          return string;
        },
        // Assign the correct icon to the Goals entries
        checkAssessmentStatus: function(trend) {
          let string = '';
          if (trend === "Up")
            string = "<i class=\"arrow up icon red big\"></i>";
          if (trend === "Down")
            string = "<i class=\"arrow down icon green big\"></i>";
          if (trend === "Equal")
            string = "<i class=\"arrows alternate horizontal icon big\"></i>";
          return string;
        },
        randomEncouragement: function() {
          const phrases = ["Good job!","You can do this!","You got this!","Feel the burn!","Awesome effort!",
          "There is no stopping you!","Maximum effort!","No pain, no gain!", "Think of that summer bod!",
          "Almost at target!"]

          return phrases[Math.floor(Math.random() * 10)];
        }
      }
    })
);
app.set("view engine", ".hbs");

const routes = require("./routes");
app.use("/", routes);

const listener = app.listen(process.env.PORT || 4000, function () {
  logger.info(`ICT Skills Assignment 1 started on port ${listener.address().port}`);
});
