const express = require("express")
const fs = require("fs")
const path = require("path")
const db = require("./database")

const app = express()

// PUBLIC SCRIPT LOADER
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
<td>${log.ip}</td>
<td>${log.executor}</td>
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

<h1>Badge Loader Owner Dashboard</h1>

<div class="card">
<h2>Total Executions</h2>
${rows.length}
</div>


<div class="card">

<h2>Loader Script</h2>

<p>Copy this loader to distribute your script</p>

<div class="loaderbox" id="loadertext">
loadstring(game:HttpGet("https://badge-loader-production.up.railway.app/load"))()
</div>

<button onclick="copyLoader()">Copy Loader</button>

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


<script>

function copyLoader(){

const text =
'loadstring(game:HttpGet("https://badge-loader-production.up.railway.app/load"))()'

navigator.clipboard.writeText(text)

alert("Loader copied!")

}

// auto refresh every 5 seconds for live executions
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
