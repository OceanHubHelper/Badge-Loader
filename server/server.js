const express = require("express")
const fs = require("fs")
const path = require("path")
const db = require("./database")

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const app = express()

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

console.log("IP:", ip)

const executor = req.headers["executor"] || "Unknown"

const time = new Date().toLocaleString("en-US", {
    timeZone: "America/Phoenix",
    hour12: true
})

let country="Unknown"
let city="Unknown"
let isp="Unknown"

try{
const geo = await fetch(`https://ipwho.is/${ip}`)
const data = await geo.json()

console.log("GEO:", data)

if(data.success){
country = data.country
city = data.city
isp = data.connection?.isp || "Unknown"
}
}catch(e){
console.log("Geo error:", e)
}

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

console.log("USERID:", userid)

if(!userid){
res.send("no userid")
return
}

let username="Unknown"

try{
const r = await fetch(`https://users.roblox.com/v1/users/${userid}`)
const data = await r.json()

console.log("ROBLOX:", data)

if(data && data.name){
username = data.name
}
}catch(e){
console.log("Roblox error:", e)
}

db.run(
"UPDATE executions SET username=? WHERE id=(SELECT MAX(id) FROM executions)",
[username]
)

res.send("ok")

})


// DASHBOARD
app.get("/dashboard/owner",(req,res)=>{

db.all("SELECT * FROM executions",(err,rows)=>{

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
<style>
body{background:#020617;color:white;font-family:Arial;padding:40px}
table{width:100%;border-collapse:collapse}
td,th{border:1px solid #334155;padding:10px}
th{background:#0f172a}
</style>
</head>

<body>

<h1>Dashboard</h1>
<p>Total: ${rows.length}</p>

<table>
<tr>
<th>User</th>
<th>IP</th>
<th>Country</th>
<th>City</th>
<th>ISP</th>
<th>Time</th>
</tr>

${logs}

</table>

<script>
setInterval(()=>location.reload(),5000)
</script>

</body>
</html>
`)
})

})

app.listen(3000,()=>console.log("Running"))
