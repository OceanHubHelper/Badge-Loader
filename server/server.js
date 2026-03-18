const express = require("express")
const fs = require("fs")
const path = require("path")
const db = require("./database")

const app = express()

// serve dashboard files
app.use(express.static(path.join(__dirname, "../dashboard")))

// homepage dashboard
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../dashboard/index.html"))
})

// loader endpoint
app.get("/load", (req, res) => {

    const ip =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "unknown"

    const executor = req.headers["executor"] || "Unknown"
    const time = new Date().toISOString()

    // log execution
    db.run(
        "INSERT INTO executions (ip, executor, time) VALUES (?, ?, ?)",
        [ip, executor, time]
    )

    // read the real script
    const script = fs.readFileSync(
        path.join(__dirname, "../scripts/main.lua"),
        "utf8"
    )

    // encode script so people can't easily see it
    const encoded = Buffer.from(script).toString("base64")

    // send protected loader
    res.send(`
local encoded="${encoded}"
local decoded=game:GetService("HttpService"):Base64Decode(encoded)
loadstring(decoded)()
`)
})

// analytics API
app.get("/api/stats", (req, res) => {

    db.all("SELECT * FROM executions", (err, rows) => {

        if (err) {
            res.json({error:true})
            return
        }

        res.json({
            total: rows.length,
            logs: rows.slice(-50)
        })
    })
})

// start server
app.listen(3000, () => {
    console.log("Badge Loader running on port 3000")
})
