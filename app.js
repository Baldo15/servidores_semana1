const express = require('express');
const bodyParser = require('body-parser');
const employeesData = require('./path/to/employees.json');

const app = express();
const port = 8000;
app.use(bodyParser.json());
//ruta 1
app.get('/api/employees', (req, res) => {
    const page = req.query.page;
    const user = req.query.user;
    const badge = req.query.badges;
    if ((page === '' || page === undefined) && (user === '' || user === undefined) && (badge === '' || badge === undefined)) {
        // ruta 1
        res.json(employeesData);
    }
    if (page != undefined || page != '') {
        // rutas 2 y 3
        const startIndex = 2 * (page - 1);
        const endIndex = startIndex + 1;
        const paginatedEmployees = employeesData.slice(startIndex, endIndex + 1);
        res.json(paginatedEmployees);
    }
    //ruta 5
    if (user == "true") {
        app.get('/api/employees', (req, res) => {
            const user = req.query.user;
            if (user === 'true') {
                const userEmployees = employeesData.filter((employee) =>
                    employee.privileges === 'user'
                );
                res.json(userEmployees);
            } else {
                res.json(employeesData);
            }
        });
    }
    // ruta 7
    if (badge != undefined || badge != '') {
        app.get('/api/employees', (req, res) => {
            const badge = req.query.badges;
            if (badge) {
                const employeesWithBadge = employeesData.filter((employee) =>
                    employee.badges.includes(badge)
                );
                res.json(employeesWithBadge);
            } else {
                // En caso de que no se especifique el parámetro 'badges', devuelve todos los empleados.
                res.json(employeesData);
            }
        });
    }
});
// ruta 4
app.get('/api/employees/oldest', (req, res) => {
    const oldestEmployee = employeesData.reduce((prev, current) =>
        prev.age > current.age ? prev : current
    );
    res.json(oldestEmployee);
});

// ruta 6
app.post('/api/employees', (req, res) => {
    const newEmployee = req.body;
    if (!isValidEmployee(newEmployee)) {
        return res.status(400).json({ code: 'bad_request' });
    }

    employeesData.push(newEmployee);
    res.status(201).json(newEmployee);
});

//ruta 8
app.get('/api/employees/:name', (req, res) => {
    const nameToFind = req.params.name;
    const employee = employeesData.find((e) => e.name === nameToFind);
    if (!employee) {
        return res.status(404).json({ code: 'not_found' });
    }
    res.json(employee);
});

function isValidEmployee(employee) {
    if (!employee || typeof employee !== 'object') {
        return false;
    }
    if (
        typeof employee.name !== 'string' ||
        typeof employee.age !== 'number' ||
        typeof employee.privileges !== 'string'
    ) {
        return false;
    }
    if (employee.phone) {
        if (
            typeof employee.phone.personal !== 'string' ||
            typeof employee.phone.work !== 'string' ||
            typeof employee.phone.ext !== 'string'
        ) {
            return false;
        }
    }
    if (employee.favorites) {
        if (
            typeof employee.favorites.artist !== 'string' ||
            typeof employee.favorites.food !== 'string'
        ) {
            return false;
        }
    }
    if (employee.finished && !Array.isArray(employee.finished)) {
        return false;
    }
    if (employee.badges && !Array.isArray(employee.badges)) {
        return false;
    }
    if (employee.points && !Array.isArray(employee.points)) {
        return false;
    }
    return true;
}

app.listen(port, () => {
    console.log(`Servidor API escuchando en http://localhost:${port}`);
});
