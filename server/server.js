const express = require("express")
const fs = require("fs")
const path = require("path")
const db = require("./database")

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const app = express()

// PUBLIC LOADER
app.get("/load", async (req,res)=>{

const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
const executor = req.headers["executor"] || "Unknown"

// CLEAN MST TIME
const time = new Date().toLocaleString("en-US", {
    timeZone: "America/Phoenix",
    hour12: true
})

let country="Unknown"
let city="Unknown"
let isp="Unknown"

try{
const geo = await fetch(`http://ip-api.com/json/${ip}`)
const data = await geo.json()

country = data.country || "Unknown"
city = data.city || "Unknown"
isp = data.isp || "Unknown"
}catch{}

// insert log FIRST (username will update after)
db.run(
"INSERT INTO executions (ip, executor, time, country, city, isp, username) VALUES (?, ?, ?, ?, ?, ?, ?)",
[ip, executor, time, country, city, isp, "Loading..."]
)

const script = fs.readFileSync(
path.join(__dirname,"../scripts/main.lua"),
"utf8"
)

res.send(script)

})


// ROBLOX USERNAME LOGGER
app.get("/log", async (req,res)=>{

const userid = req.query.userid || "Unknown"

let username = "Unknown"

try{
const response = await fetch(`https://users.roblox.com/v1/users/${userid}`)
const data = await response.json()
username = data.name || "Unknown"
}catch{}

// update latest execution
db.run(
"UPDATE executions SET username=? WHERE id=(SELECT MAX(id) FROM executions)",
[username]
)

res.send("ok")

})


// OWNER DASHBOARD
app.get("/dashboard/owner",(req,res)=>{

db.all("SELECT * FROM executions",(err,rows)=>{

if(err){
res.send("Database error")
return
}

let logsHTML=""

rows.slice(-50).reverse().forEach(log=>{

logsHTML+=`
<tr>
<td>${log.username || "Loading..."}</td>
<td>${log.ip}</td>
<td>${log.country}</td>
<td>${log.city}</td>
<td>${log.isp}</td>
<td>${log.time}</td>
</tr>
`

})

res.send(`
<html>

<head>

<title>Badge Loader Dashboard</title>

<style>

body{
background:#020617;
color:white;
font-family:Arial;
padding:40px;
}

h1{
color:#38bdf8;
}

.card{
background:#1e293b;
padding:20px;
border-radius:10px;
margin-bottom:25px;
}

table{
width:100%;
border-collapse:collapse;
}

td,th{
border:1px solid #334155;
padding:10px;
}

th{
background:#0f172a;
}

.loaderbox{
background:#0f172a;
padding:10px;
border-radius:6px;
font-family:monospace;
margin-top:10px;
word-break:break-all;
}

button{
padding:10px 18px;
border:none;
border-radius:6px;
background:#38bdf8;
color:black;
cursor:pointer;
margin-top:10px;
}

</style>

</head>

<body>

<h1>Badge Loader Dashboard</h1>

<div class="card">
<h2>Total Executions</h2>
${rows.length}
</div>


<div class="card">

<h2>Loader Script</h2>

<div class="loaderbox" id="loadertext">
loadstring(game:HttpGet("https://badge-loader-production.up.railway.app/load"))()
</div>

<button onclick="copyLoader()">Copy Loader</button>

</div>


<div class="card">

<h2>Recent Executions</h2>

<table>

<tr>
<th>Username</th>
<th>IP</th>
<th>Country</th>
<th>City</th>
<th>ISP</th>
<th>Time</th>
</tr>

${logsHTML}

</table>

</div>


<script>

function copyLoader(){
const text='loadstring(game:HttpGet("https://badge-loader-production.up.railway.app/load"))()'
navigator.clipboard.writeText(text)
alert("Copied!")
}

// auto refresh (live feel)
setInterval(()=>{
location.reload()
},5000)

</script>

</body>

</html>
`)

})

})


app.listen(3000,()=>{
console.log("Badge Loader running")
})
