console.log("hello chris")

const mysql = require("mysql");
const inquirer = require("inquirer");
// ​
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Ju800926",
  database: "employee_tracker_db",
});
// ​
connection.connect(function (err) {
  if (err) throw err;
  // runSearch();
  // TODO: prompt the user for their next action.
  console.log("connected as id " + connection.threadId + "\n");
    runinit();
});

function runinit() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        
        // * Add departments, roles, employees

        // * View departments, roles, employees
      
        // * Update employee roles
        
        "Add New Employee",
        "Add New Role",
        "Add New Department",
        "View All Department",
        "View All Role",
        "View All Employee",
        "Update Employee Role"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "Add New Employee":
        addEmployee();
        break;

      case "Add New Role":
        addRole();
        break;

      case "Add New Department":
        addDepartment();
        break;

      case "View All Role":
        viewRole();
        break;

      case "View All Employee":
        viewEmployees();
        break;

      case "View All Department":
        viewDepartments();
        break;  

      case "Update Employee Role":
        updateEmployeeRole();
        break;

      }
      
    });
}


  // Build a command-line application that at a minimum allows the user to:
  // -----------Add departments, roles, employees
  function addDepartment(){
    console.log("add departments")
    inquirer
    .prompt([
      {
      name: "deparmentName",
      type: "input",
      message: "What is the name of the department?"
    }]

    ).then(function(answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.deparmentName
        },
        function(err) {
          if (err) throw err;
          console.log("Your department was created successfully!");
          // re-prompt the user for if they want to bid or post
          runinit();
      });
    });
  }

  function addRole(){
    console.log("add role")
    inquirer
    .prompt([
      {
      name: "title",
      type: "input",
      message: "What is the title of the role?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary of the role?"
    }]
    // ,
    // {
    //   name: "EmployeeRole",
    //   type: "List",
    //   message: "What is the employee's role?",
    //   choice: ["sales","customer service","manager"]
    // }
    
    ).then(function(answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.title,
          salary: parseInt(answer.salary)
        },
        function(err) {
          if (err) throw err;
          console.log("Your role was created successfully!");
          // re-prompt the user for if they want to bid or post
          runinit();
      });
    });

  }
  function addEmployee(){
    console.log("add Employee")
    inquirer
    .prompt([
      {
      name: "EmployeeFirstName",
      type: "input",
      message: "What is the first name of employee?"
    },
    {
      name: "EmployeeLastName",
      type: "input",
      message: "What is the last name of employee?"
    }]
    // ,
    // {
    //   name: "EmployeeRole",
    //   type: "List",
    //   message: "What is the employee's role?",
    //   choice: ["sales","customer service","manager"]
    // }
    
    ).then(function(answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.EmployeeFirstName,
          last_name: answer.EmployeeLastName
        },
        function(err) {
          if (err) throw err;
          console.log("Your employee was created successfully!");
          // re-prompt the user for if they want to bid or post
          runinit();
      });
    });
}
// -----------View departments, roles, employees

  function viewDepartments(){
    console.log("view departments")
    connection.query("SELECT * FROM department", (err,res) =>{
      if (err) throw err;
      console.table(res);
      runinit();
    });
  }
  function viewRole(){
    connection.query("SELECT * FROM role", (err,res) =>{
      if (err) throw err;
      console.table(res);
      runinit();
     });
    }

  function viewEmployees(){
    console.log("view Employees")
   connection.query("SELECT * FROM employee", (err,res) =>{
      if (err) throw err;
      console.table(res);
      runinit();
     });
    }
  
// ----------- Update employee roles

function updateEmployeeRole() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM employee", function(err, results) {
    if (err) throw err;
    console.table(results)
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].id);
            }
            return choiceArray;
          },
          message: "which employee do you want to update?"
        },
        {
          name: "roleUpdate",
          type: "input",
          message: "Enter the new role_id"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].id === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.roleUpdate !=="") {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: answer.roleUpdate
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Update was successfully!");
              runinit();
            }
          );
        }
        else {
          console.log("Update was unsuccessfully!");
          runinit();
        }
      });
  });
}


// -----------------------------------------


  