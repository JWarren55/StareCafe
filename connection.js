const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rateCafe'
});

connection.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

const rawData = fs.readFileSync("./data/menu.json");
const data = JSON.parse(rawData);

data.forEach(menu => {
  connection.query(
    "INSERT INTO menu (foodid, name, nutrientid, image, occurrence, mealType) VALUES (?, ?, NULL, ?, ?, ?)",
    [menu.foodid, menu.name, menu.nutrientid, menu.image, menu.occurrence, menu.mealType],
    (err, results) => {
      if (err) throw err;
      console.log(`Inserted user: ${data}`);
    }
  );
});

connection.end();
