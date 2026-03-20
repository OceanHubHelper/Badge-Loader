const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./data.db")

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS executions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT,
            executor TEXT,
            time TEXT,
            country TEXT,
            city TEXT,
            isp TEXT,
            username TEXT
        )
    `)
})

module.exports = db
