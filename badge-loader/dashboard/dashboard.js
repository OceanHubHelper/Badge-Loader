async function loadStats(){

const res = await fetch("/api/stats")
const data = await res.json()

document.getElementById("total").innerText = data.total

const logs = document.getElementById("logs")
logs.innerHTML = ""

data.logs.reverse().forEach(log=>{
const row = document.createElement("tr")

row.innerHTML =
`<td>${log.ip}</td>
<td>${log.executor}</td>
<td>${log.time}</td>`

logs.appendChild(row)
})

}

loadStats()
setInterval(loadStats,5000)
