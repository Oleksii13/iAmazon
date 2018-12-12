const MYSQL = require("mysql");
const INQUIRER = require("inquirer");

let con = MYSQL.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "tanakan13",
    database: "iAmazon"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + con.threadId + "\n");
});

INQUIRER
    .prompt([
        {
            type: "list",
            name: "name",
            choices: ["View Product Sales by Department", "Create New Department"],
    }
])