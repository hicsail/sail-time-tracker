const sqlite3 = require('sqlite3').verbose();
const postgres = require('postgres');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Specify the path to your SQLite database file
const dbPath = './timetracker.db';
// const sql = postgres('postgres://cxyue:@localhost:5432/postgres');
const sql = postgres('postgres://chenxinyue:@localhost:5432/postgres');

// Create a new SQLite database instance
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Perform database operations
db.serialize(() => {
  let employeeMapList = [];
  let employeeMap = new Map();

  let projectMapList = [];
  let projectMap = new Map();

  // retrieve employee data from file
  try {
    const data = fs.readFileSync('./employee.json', 'utf-8');
    if (data && data.length > 0) {
      let employeeList = JSON.parse(data);

      employeeList.forEach((employee) => {
        if (!employeeMap.get(employee.oldEmployeeId)) {
          employeeMap.set(employee.oldEmployeeId, employee.newEmployeeId);
          employeeMapList.push({ oldEmployeeId: employee.oldEmployeeId, newEmployeeId: employee.newEmployeeId });
        }
      });
    }
  } catch (e) {
    console.log(e.message);
  }

  // retrieve project data from file
  try {
    const data = fs.readFileSync('./project.json', 'utf-8');
    if (data && data.length > 0) {
      let projectList = JSON.parse(data);

      projectList.forEach((project) => {
        if (!projectMap.get(project.oldProjectId)) {
          projectMap.set(project.oldProjectId, project.newProjectId);
          projectMapList.push({ oldProjectId: project.oldProjectId, newProjectId: project.newProjectId });
        }
      });
    }
    // const result = employeeMapList.filter((d) => !dataMap.get(d.oldEmployeeId));
  } catch (e) {
    console.log(e.message);
  }

  // Retrieve all records from hours table
  db.all('SELECT * FROM hours', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    // Process the retrieved hours rows
    rows.forEach(async (row, index) => {
      let { id, rate, ...result } = row;

      if (!employeeMap.get(result.employee_id)) {
        let newEmployeeId = uuidv4();
        employeeMap.set(result.employee_id, newEmployeeId);
        employeeMapList.push({ oldEmployeeId: result.employee_id, newEmployeeId: newEmployeeId });
      }

      if (!projectMap.get(result.project_id)) {
        let newProjectId = uuidv4();
        projectMap.set(result.project_id, newProjectId);
        projectMapList.push({ oldProjectId: result.project_id, newProjectId: newProjectId });
      }
    });
  });

  // insert employees into new database
  employeeMapList.forEach(async (employee, index) => {
    const newEmployee = {
      id: employeeMap.get(employee.oldEmployeeId),
      email: `employee${index}@bu.edu`,
      name: `Employee ${index}`,
      rate: 65,
      status: 'Active'
    };

    await sql`
        INSERT INTO "Employee" ("id", "email", "name", "rate", "status")
        VALUES (${newEmployee.id}, ${newEmployee.email}, ${newEmployee.name}, ${newEmployee.rate}, ${newEmployee.status})
        ON CONFLICT DO NOTHING
      `;
  });

  // insert projects into new database
  projectMapList.forEach(async (project, index) => {
    if (project.oldProjectId !== 'sick' || project.oldProjectId !== 'vacation') {
      let newProject = {
        id: projectMap.get(project.oldProjectId),
        name: `Project ${index}`,
        description: `Project ${index} Description`,
        status: 'Active',
        isBillable: true
      };

      await sql`
          INSERT INTO "Project" ("id", "name", "description", "status", "isBillable")
          VALUES (${newProject.id}, ${newProject.name}, ${newProject.description}, ${newProject.status}, ${newProject.isBillable})
          ON CONFLICT DO NOTHING
        `;
    }
  });

  db.all('SELECT * FROM hours', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    // insert record into new database

    rows.forEach(async (row) => {
      await sql`
        INSERT INTO "Record" ("date", "employeeId", "projectId", "hours")
        VALUES (${new Date(row.date)}, ${employeeMap.get(row.employee_id)}, ${projectMap.get(row.project_id)}, ${row.hours})
        ON CONFLICT DO NOTHING
      `;
    });
  });

  // write employee map to a file
  fs.writeFile('./employee.json', JSON.stringify(employeeMapList), (err) => {
    if (!err) {
      console.log('done');
    }
  });

  // write project map to a file
  fs.writeFile('./project.json', JSON.stringify(projectMapList), (err) => {
    if (!err) {
      console.log('done');
    }
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Closed the SQLite database connection.');
});
