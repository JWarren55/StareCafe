const fs = require("fs-extra");
const path = require("path");
const mysql = require("mysql2/promise");

// ============= MYSQL CONNECTION =============
const pool = mysql.createPool({
    host: "10.255.255.254",
    user: "root",
    password: "password",
    database: "rateCafe",
});

// ============= SQL QUERIES =============
const INSERT_LOCATION = `
INSERT IGNORE INTO location (locationId, name)
VALUES (?, ?);
`;

const INSERT_MENU = `
INSERT IGNORE INTO menu (foodid, name, nutrientid, image, occurrence, mealType)
VALUES (?, ?, NULL, ?, ?, ?);
`;

const INSERT_NUTRITION = `
INSERT IGNORE INTO nutrition (nutritionid, foodid, calories, allergens, dietaryTags)
VALUES (?, ?, ?, ?, ?);
`;

// ============= HELPERS =============
async function getJsonFiles(dir) {
    const files = await fs.readdir(dir);
    return files
        .filter(f => f.endsWith(".json"))
        .map(f => path.join(dir, f));
}

// ============= MAIN IMPORT LOGIC =============
async function processFile(filepath) {
    console.log(`Processing ${filepath}`);
    const raw = await fs.readFile(filepath, "utf8");
    const data = JSON.parse(raw);

    const conn = await pool.getConnection();

    try {
        const locationId = data.locationId;
        const date = data.date;
        const mealType = data.period.name;

        // insert location
        await conn.execute(INSERT_LOCATION, [locationId, null]);

        // Loop categories → items
        for (const category of data.period.categories) {
            for (const item of category.items) {

                const foodId = item.mrn;
                const name = item.name;
                const image = item.remoteFileName || null;

                // Insert into menu
                await conn.execute(INSERT_MENU, [
                    foodId,
                    name,
                    image,
                    date,
                    mealType
                ]);

                // Nutrition table data
                const calories = item.calories || null;
                const allergens = JSON.stringify(item.customAllergens || []);
                const dietaryTags = JSON.stringify(item.filters?.map(f => f.name) || []);

                // Insert nutrition
                await conn.execute(INSERT_NUTRITION, [
                    foodId,
                    foodId,
                    calories,
                    allergens,
                    dietaryTags
                ]);
            }
        }

        console.log(`Imported ${filepath}`);
        
    } catch (err) {
        console.error(`Error importing ${filepath}:`, err);
    } finally {
        conn.release();
    }
}

// ============= RUN IMPORT =============
async function run() {
    // const folder = path.join(__dirname, "data");
    // const files = await getJsonFiles(folder);

    // console.log(`Found ${files.length} JSON files.`);

    // for (const file of files) {
    //     await processFile(file);
    // }

    await processFile("data/menu.json");

    console.log("Import complete");
    process.exit();
}

run();
