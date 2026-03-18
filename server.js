const express = require("express")
const fs = require("fs")

const app = express()

let executions = 0

app.get("/", (req, res) => {
    res.send("Badge Loader API Running")
})

app.get("/badge-loader", (req, res) => {
    executions++

    console.log("Badge Loader Executions:", executions)

    const script = fs.readFileSync("./script.lua", "utf8")
    res.send(script)
})

app.get("/stats", (req, res) => {
    res.send("Badge Loader Total Executions: " + executions)
})

app.listen(3000, () => {
    console.log("Badge Loader server running")
})
