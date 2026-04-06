const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

try {
    db.exec("ALTER TABLE registrations ADD COLUMN teamId TEXT UNIQUE");
    console.log("Successfully added teamId column");
} catch (err) {
    console.log("teamId result:", err.message);
}

try {
    db.exec("ALTER TABLE registrations ADD COLUMN membersJSON TEXT");
    console.log("Successfully added membersJSON column");
} catch (err) {
    console.log("membersJSON result:", err.message);
}

db.close();
console.log("Database connection closed gracefully.");
