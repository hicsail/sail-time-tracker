const sqlite3 = require('sqlite3').verbose();
const postgres = require('postgres');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
require('dotenv').config({ path: '../.env' });

// Specify the path to your SQLite database file
const dbPath = `${process.env.OLDDB_PATH}`;
const sql = postgres(`${process.env.NEWDB_PATH}`);

// Create a new SQLite database instance
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

let employeeMapList = [];
let employeeMap = new Map();

let projectMapList = [];
let projectMap = new Map();

const readOldEmployeeData = (employees) => {
  if (employees && employees.length > 0) {
    employees.forEach((employee) => {
      if (!employeeMap.get(employee.id)) {
        let newEmployeeId = uuidv4();
        employeeMap.set(employee.id, newEmployeeId);
        employeeMapList.push({ oldEmployeeId: employee.id, newEmployeeId: newEmployeeId });
      }
    });

    insertEmployees(employees);
  }
};

const readOldProjectData = (projects) => {
  if (projects && projects.length > 0) {
    projects.forEach((project) => {
      if (!projectMap.get(project.id)) {
        let newProjectId = uuidv4();
        projectMap.set(project.id, newProjectId);
        projectMapList.push({ oldProjectId: project.id, newProjectId: newProjectId });
      }
    });

    insertProjects(projects);
  }
};

const readEmployeeIdMapData = (employees) => {
  // retrieve employee data from file
  if (employees && employees.length > 0) {
    employees.forEach((employee) => {
      if (!employeeMap.get(employee.oldEmployeeId)) {
        employeeMap.set(employee.oldEmployeeId, employee.newEmployeeId);
        employeeMapList.push({ oldEmployeeId: employee.oldEmployeeId, newEmployeeId: employee.newEmployeeId });
      }
    });
  }
};

const readProjectIdMapData = (projects) => {
  if (projects && projects.length > 0) {
    projects.forEach((project) => {
      if (!projectMap.get(project.oldProjectId)) {
        projectMap.set(project.oldProjectId, project.newProjectId);
        projectMapList.push({ oldProjectId: project.oldProjectId, newProjectId: project.newProjectId });
      }
    });
  }
};

const insertEmployees = (employees) => {
  employees.forEach(async (employee, index) => {
    const newEmployee = {
      id: employeeMap.get(employee.id),
      email: `employee${index}@bu.edu`,
      name: employee.name,
      status: `${employee.archive ? 'Inactive' : 'Active'}`
    };

    await sql`
      INSERT INTO "Employee" ("id", "email", "name", "status")
      VALUES (${newEmployee.id}, ${newEmployee.email}, ${newEmployee.name}, ${newEmployee.status})
      ON CONFLICT DO NOTHING
    `;
  });
};

const insertProjects = (projects) => {
  projects.forEach(async (project) => {
    // inserting projects excludes sick, vacation, development project
    if (project.id !== 'sick' && project.id !== 'vacation' && project.name !== 'Development') {
      let newProject = {
        id: projectMap.get(project.id),
        name: project.name,
        description: project.name,
        status: `${project.archive ? 'Inactive' : 'Active'}`,
        isBillable: true
      };

      try {
        await sql`
          INSERT INTO "Project" ("id", "name", "description", "status", "isBillable")
          VALUES (${newProject.id}, ${newProject.name}, ${newProject.description}, ${newProject.status}, ${newProject.isBillable})
        `;
      } catch (e) {
        await sql`
          INSERT INTO "Project" ("id", "name", "description", "status", "isBillable")
          VALUES (${newProject.id}, ${newProject.name + '2'}, ${newProject.description}, ${newProject.status}, ${newProject.isBillable})
          ON CONFLICT DO NOTHING
        `;
      }
    }
  });
};

// Perform database operations
db.serialize(() => {
  /**
   * retrieve employee id map
   * {oldEmployeeId: string, newEmployeeId: string}
   * from employee.json
   */
  try {
    const data = fs.readFileSync('./employee.json', 'utf-8');
    readEmployeeIdMapData(JSON.parse(data));
  } catch (e) {
    console.log(e.message);
  }

  /**
   * retrieve project id map
   * {oldProjectId: string, newProjectId: string}
   * from employee.json
   */
  try {
    const data = fs.readFileSync('./project.json', 'utf-8');
    readProjectIdMapData(JSON.parse(data));
  } catch (e) {
    console.log(e.message);
  }

  /**
   * retrieve old employee data
   * id, name, archive
   * from emloyees.json
   */
  try {
    const data = fs.readFileSync('./employees.json', 'utf-8');
    readOldEmployeeData(JSON.parse(data));
  } catch (e) {
    console.log(e.message);
  }

  /**
   * retrieve old project data
   * id, name, archive
   * from projects.json
   */
  try {
    const data = fs.readFileSync('./projects.json', 'utf-8');
    readOldProjectData(JSON.parse(data));
  } catch (e) {
    console.log(e.message);
  }

  // select all hours from old database
  db.all('SELECT * FROM hours', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    // insert record into new database
    rows.forEach(async (row) => {
      if (row.project_id !== 'sick' && row.project_id !== 'vacation') {
        // if record is belong to Development, add its hours to Indirect
        if (row.project_id === 1000) {
          try {
            await sql`
              UPDATE "Record"
              SET hours = hours + ${row.hours}
              WHERE "date" = ${row.date} AND "employeeId" = ${employeeMap.get(row.employee_id)} AND "projectId" = ${projectMap.get(0)}
            `;
          } catch (e) {
            console.log(e.message);
          }
        } else {
          const date = new Date(row.date).setUTCHours(4, 0, 0, 0);

          try {
            await sql`
              INSERT INTO "Record" ("date", "employeeId", "projectId", "hours")
              VALUES (${date}, ${employeeMap.get(row.employee_id)}, ${projectMap.get(row.project_id)}, ${row.hours})
              ON CONFLICT DO NOTHING
            `;
          } catch (e) {
            console.log(e.message);
          }
        }
      }
    });
  });

  // write employee id map to a file
  fs.writeFile('./employee.json', JSON.stringify(employeeMapList), (err) => {
    if (!err) {
      console.log('done');
    }
  });

  // write project id map to a file
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
