const express = require("express")
const fs = require("fs")
const path = require("path")
const db = require("./database")

const app = express()

// SCRIPT LOADER (users use this)
app.get("/load",(req,res)=>{

const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
const executor = req.headers["executor"] || "Unknown"
const time = new Date().toISOString()

db.run(
"INSERT INTO executions (ip, executor, time) VALUES (?, ?, ?)",
[ip, executor, time]
)

const script = fs.readFileSync(
path.join(__dirname,"../scripts/main.lua"),
"utf8"
)

res.send(script)

})



// OWNER DASHBOARD
app.get("/owner/2",(req,res)=>{

res.send(`
<html>

<head>

<title>Badge Loader Owner</title>

<style>

body{
background:#020617;
color:white;
font-family:Arial;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
}

.box{
background:#1e293b;
padding:40px;
border-radius:12px;
text-align:center;
width:400px;
box-shadow:0 0 30px rgba(0,0,0,0.5);
}

h1{
color:#38bdf8;
}

button{
padding:12px 20px;
border:none;
border-radius:8px;
background:#38bdf8;
color:black;
font-weight:bold;
cursor:pointer;
margin-top:20px;
width:100%;
}

</style>

</head>

<body>

<div class="box">

<h1>Badge Loader</h1>

<p>Owner Dashboard</p>

<button onclick="window.location='/stats'">
Open Analytics
</button>

</div>

</body>

</html>
`)

})




// STATS PAGE
app.get("/stats",(req,res)=>{

db.all("SELECT * FROM executions",(err,rows)=>{

if(err){
res.send("Database error")
return
}

let logsHTML=""

rows.slice(-50).reverse().forEach(log=>{

logsHTML+=`
<tr>
<td>${log.ip}</td>
<td>${log.executor}</td>
<td>${log.time}</td>
</tr>
`

})

res.send(`

<html>

<head>

<title>Badge Loader Stats</title>

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
margin-bottom:30px;
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

button{
padding:10px 18px;
border:none;
border-radius:6px;
background:#38bdf8;
color:black;
cursor:pointer;
margin-bottom:20px;
}

</style>

</head>

<body>

<button onclick="window.location='/owner/2'">
Back to Owner Panel
</button>

<h1>Badge Loader Analytics</h1>

<div class="card">
Total Executions: ${rows.length}
</div>

<div class="card">

<h2>Recent Executions</h2>

<table>

<tr>
<th>IP</th>
<th>Executor</th>
<th>Time</th>
</tr>

${logsHTML}

</table>

</div>

</body>

</html>

`)

})

})



app.listen(3000,()=>{
console.log("Badge Loader running")
})
