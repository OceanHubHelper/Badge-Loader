const express = require("express")
const fs = require("fs")
const path = require("path")
const db = require("./database")

const app = express()

app.use(express.static(path.join(__dirname, "../dashboard")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../dashboard/index.html"))
})

app.get("/load", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
    const executor = req.headers["executor"] || "Unknown"

    const time = new Date().toISOString()

    db.run(
        "INSERT INTO executions (ip, executor, time) VALUES (?, ?, ?)",
        [ip, executor, time]
    )

    const script = fs.readFileSync(
        path.join(__dirname, "../scripts/main.lua"),
        "utf8"
    )

    res.send(script)
})

app.get("/api/stats", (req, res) => {
    db.all("SELECT * FROM executions", (err, rows) => {
        if (err) {
            res.json({ error: true })
            return
        }

        res.json({
            total: rows.length,
            logs: rows.slice(-50)
        })
    })
})

app.listen(3000, () => {
    console.log("Badge Loader running on port 3000")
})
