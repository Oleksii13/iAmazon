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

function printProduct() {
    con.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            console.log("\nID's product is: " + res[i].id);
            console.log("Product's name is: " + res[i].product_name);
            console.log("Department's name is: " + res[i].department_name);
            console.log("Price: " + res[i].price + " $");
            console.log("Quantity: " + res[i].stock_quantity + " units\n");
        }
        con.end();
    });
}

function lowInventory() {
    con.query("SELECT stock_quantity, product_name FROM products", function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            if (parseInt(res[i].stock_quantity) < 20) {
                console.log("The product: " + res[i].product_name + " has " + res[i].stock_quantity + " in stock.");

            }

        }
        con.end();

    });
}

function addInventory() {
    INQUIRER
        .prompt([{
                name: "name",
                message: "Tell me product's ID to add quantity.",
            },
            {
                name: "amount",
                message: "How many do you want to add?",
            }
        ]).then(function (answer) {
            // var amountNew = 0;
            if (parseInt(answer.name) <= 20 && parseInt(answer.name) >= 1) {
                con.query("SELECT stock_quantity, product_name FROM products WHERE id = ?", [parseInt(answer.name)], function (error, result) {
                    if (error) throw result;
                    amountNew = parseInt(parseInt(answer.amount) + result[0].stock_quantity);
                    con.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [amountNew, parseInt(answer.name)], function (err, res) {
                        if (err) throw err;
                        console.log(`In product ${result[0].product_name} were added ${answer.amount} items.`);
                        con.ent();
                    });
                });
            } else {
                console.log("You put wrong ID's number.");
            }
        });
}

function addProduct() {
    INQUIRER
        .prompt([{
                name: "name",
                message: "What the name of product do you want to add?"
            },
            {
                name: "quantity",
                message: "What quantity do you want to order?"
            },
            {
                name: "department",
                message: "In which department this product will be located?"
            },
            {
                name: "price",
                message: "What the price of 1 unit of this product?"
            },
        ]).then(function (answer) {
            if (answer.name != undefined) {
                con.query("INSERT INTO products(product_name, stock_quantity, department_name, price) VALUES(?, ?, ?, ?)", [answer.name, parseInt(answer.quantity), answer.department, parseInt(answer.price)], function (err, res) {
                    console.log(`You have been added new product: ${answer.name} in ${answer.department} department in amount of ${answer.quantity} items with price ${answer.price} $ for each unit. Thank you`)
                });
                con.end();
            } else {
                con.end();
            }
        });
}

INQUIRER
    .prompt([{
        type: "list",
        name: "name",
        message: "Menu: ",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]

    }]).then(function (answer) {
        switch (answer.name) {
            case "View Products for Sale":
                printProduct();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
        }

    })