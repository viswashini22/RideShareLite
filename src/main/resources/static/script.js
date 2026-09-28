
const API = {
  users: "/api/users",
  rides: "/api/rides",
  requests: "/api/requests"
};

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  bindGlobal();
  const page = document.body.dataset.page;
  if (page === "dashboard") initDashboard();
  if (page === "users") initUsers();
  if (page === "riders") initRiders();
  if (page === "rides") initRides();
  if (page === "requests") initRequests();
});

function setActiveNav(){
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav a").forEach(a=>{
    if(a.dataset.page===page) a.classList.add("active");
  });
}
function bindGlobal(){
  document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.open)));
  document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
  document.querySelectorAll(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show")}));
}
function openModal(id){document.getElementById(id)?.classList.add("show")}
function closeModal(id){document.getElementById(id)?.classList.remove("show")}
function toast(msg,error=false){
  const c=document.getElementById("toastContainer")||document.body.appendChild(Object.assign(document.createElement("div"),{id:"toastContainer",className:"toast-container"}));
  const t=document.createElement("div");t.className="toast"+(error?" error":"");t.textContent=msg;c.appendChild(t);setTimeout(()=>t.remove(),2800);
}
async function api(url, options={}){
  try{
    const res=await fetch(url,{headers:{"Content-Type":"application/json",...(options.headers||{})},...options});
    const text=await res.text();
    let data=null; try{data=text?JSON.parse(text):null}catch{}
    if(!res.ok){
      const msg=data?.message || data?.error || text || `Request failed (${res.status})`;
      throw new Error(msg);
    }
    return data;
  }catch(e){
    console.error(e);
    toast(e.message.includes("Failed to fetch")?"Unable to connect to Spring Boot. Make sure the backend is running.":e.message,true);
    throw e;
  }
}
function initials(name="User"){return name.trim().split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase()}
function fmtDate(v){if(!v)return "-";const d=new Date(v);return d.toLocaleDateString([], {day:"2-digit",month:"short",year:"numeric"})}
function fmtTime(v){if(!v)return "-";return new Date(v).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
function fmtDateTime(v){return `${fmtDate(v)} • ${fmtTime(v)}`}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function badge(s){const x=String(s||"").toLowerCase();return `<span class="badge ${x}">${esc(s||"-")}</span>`}
function empty(container,icon,title,text,button=""){container.innerHTML=`<div class="empty"><div class="empty-icon">${icon}</div><h3>${title}</h3><p>${text}</p>${button}</div>`}

async function initDashboard(){
  try{
    const [users,rides,requests]=await Promise.all([api(API.users),api(API.rides),api(API.requests)]);
    document.getElementById("userCount").textContent=users.length;
    document.getElementById("rideCount").textContent=rides.length;
    document.getElementById("riderCount").textContent=users.filter(u=>u.role==="RIDER").length;
    document.getElementById("requestCount").textContent=requests.length;
    const c=document.getElementById("recentRides");
    if(!rides.length){empty(c,"🚗","No ride offers yet","Create your first ride offer to get started.",`<a class="btn btn-primary" href="rides.html">Create Ride</a>`);return}
    c.innerHTML=rides.slice(0,4).map(r=>`
      <div class="ride-card">
        <div class="ride-avatar">${initials(r.driverName)}</div>
        <div>
          <h4>${esc(r.driverName||"Driver")}</h4>
          <div class="route"><b>${esc(r.origin)}</b><span class="route-line"></span><b>${esc(r.destination)}</b></div>
          <div class="ride-meta"><span>🕐 ${fmtTime(r.departureTime)}</span><span>🪑 ${r.availableSeats} seats</span></div>
        </div>
        ${badge(r.status)}
      </div>`).join("");
  }catch{}
}

async function initUsers(){
  const tbody=document.getElementById("userRows"), search=document.getElementById("userSearch");
  let users=[];
  async function load(){
    tbody.innerHTML=`<tr><td colspan="6" style="text-align:center;padding:35px;color:#8992a5">Loading users...</td></tr>`;
    try{users=await api(API.users); render()}catch{}
  }
  function render(){
    const q=(search.value||"").toLowerCase();
    const list=users.filter(u=>[u.name,u.email,u.phone,u.role].some(x=>String(x).toLowerCase().includes(q)));
    document.getElementById("userTotal").textContent=users.length;
    document.getElementById("driverTotal").textContent=users.filter(x=>x.role==="DRIVER").length;
    document.getElementById("riderTotal").textContent=users.filter(x=>x.role==="RIDER").length;
    if(!list.length){tbody.innerHTML=`<tr><td colspan="6">${`<div class="empty">No users found.</div>`}</td></tr>`;return}
    tbody.innerHTML=list.map(u=>`<tr><td>#${u.id}</td><td><div class="user-cell"><div class="mini-avatar">${initials(u.name)}</div><b>${esc(u.name)}</b></div></td><td>${esc(u.email)}</td><td>${esc(u.phone)}</td><td>${badge(u.role)}</td><td><div class="actions"><button class="action edit" onclick="editUser(${u.id})">Edit</button><button class="action delete" onclick="removeUser(${u.id})">Delete</button></div></td></tr>`).join("");
  }
  search.addEventListener("input",render); window.editUser=id=>{const u=users.find(x=>x.id===id);if(!u)return;fillForm("userForm",u);document.getElementById("userId").value=id;document.getElementById("userModalTitle").textContent="Edit User";openModal("userModal")};
  window.removeUser=async id=>{if(!confirm("Delete this user?"))return;try{await api(`${API.users}/${id}`,{method:"DELETE"});toast("User deleted successfully");load()}catch{}};
  document.getElementById("userForm").addEventListener("submit",async e=>{
    e.preventDefault();const id=document.getElementById("userId").value;
    const body={name:v("userName"),email:v("userEmail"),phone:v("userPhone"),role:v("userRole")};
    try{await api(id?`${API.users}/${id}`:API.users,{method:id?"PUT":"POST",body:JSON.stringify(body)});toast(id?"User updated successfully":"User added successfully");closeModal("userModal");e.target.reset();document.getElementById("userId").value="";load()}catch{}
  });
  load();
}
async function initRiders(){
  const grid=document.getElementById("riderGrid"), form=document.getElementById("riderForm");let users=[];
  async function load(){try{users=await api(API.users);render()}catch{}}
  function render(){const riders=users.filter(u=>u.role==="RIDER");document.getElementById("riderTotal").textContent=riders.length;if(!riders.length){empty(grid,"🧑","No riders yet","Add your first rider to the platform.");return}grid.innerHTML=riders.map(u=>`<div class="panel" style="padding:18px"><div style="display:flex;align-items:center;gap:12px"><div class="avatar">${initials(u.name)}</div><div><b style="font-size:13px">${esc(u.name)}</b><div style="font-size:10px;color:#8992a5;margin-top:4px">${esc(u.email)}</div></div></div><div style="margin:16px 0;font-size:11px;color:#596273">📞 ${esc(u.phone)}</div><div style="display:flex;justify-content:space-between;align-items:center">${badge("RIDER")}<div class="actions"><button class="action edit" onclick="editRider(${u.id})">Edit</button><button class="action delete" onclick="removeRider(${u.id})">Delete</button></div></div></div>`).join("")}
  window.editRider=id=>{const u=users.find(x=>x.id===id);if(!u)return;fillForm("riderForm",u);document.getElementById("riderId").value=id;document.getElementById("riderModalTitle").textContent="Edit Rider";openModal("riderModal")};
  window.removeRider=async id=>{if(!confirm("Delete this rider?"))return;try{await api(`${API.users}/${id}`,{method:"DELETE"});toast("Rider deleted successfully");load()}catch{}};
  form.addEventListener("submit",async e=>{e.preventDefault();const id=v("riderId");const body={name:v("riderName"),email:v("riderEmail"),phone:v("riderPhone"),role:"RIDER"};try{await api(id?`${API.users}/${id}`:API.users,{method:id?"PUT":"POST",body:JSON.stringify(body)});toast(id?"Rider updated successfully":"Rider added successfully");closeModal("riderModal");form.reset();document.getElementById("riderId").value="";load()}catch{}});
  load();
}
async function initRides(){
  const box=document.getElementById("rideGrid"), form=document.getElementById("rideForm");let rides=[],drivers=[];
  async function load(){try{[rides,drivers]=await Promise.all([api(API.rides),api(API.users).then(x=>x.filter(u=>u.role==="DRIVER"))]);render();fillDrivers()}catch{}}
  function render(){document.getElementById("rideTotal").textContent=rides.length;document.getElementById("rideAvail").textContent=rides.filter(r=>r.status==="AVAILABLE").length;document.getElementById("rideFull").textContent=rides.filter(r=>r.status==="FULL").length;document.getElementById("rideDone").textContent=rides.filter(r=>r.status==="COMPLETED").length;if(!rides.length){empty(box,"🚗","No ride offers yet","Create a ride offer to start matching drivers and riders.",`<button class="btn btn-primary" onclick="openModal('rideModal')">Create Ride</button>`);return}box.innerHTML=rides.map(r=>`<div class="panel" style="padding:18px"><div style="display:flex;justify-content:space-between;gap:12px"><div style="display:flex;gap:10px"><div class="ride-avatar">${initials(r.driverName)}</div><div><b style="font-size:13px">${esc(r.driverName||"Driver")}</b><div style="font-size:10px;color:#8992a5;margin-top:4px">${esc(r.driverEmail||"")}</div></div></div>${badge(r.status)}</div><div style="margin:18px 0;padding:14px;background:#f7f9fd;border-radius:12px;display:flex;align-items:center;gap:10px;font-size:12px"><b>${esc(r.origin)}</b><span class="route-line"></span><b>${esc(r.destination)}</b></div><div class="ride-meta"><span>📅 ${fmtDate(r.departureTime)}</span><span>🕐 ${fmtTime(r.departureTime)}</span><span>🪑 ${r.availableSeats} seats</span></div><div style="display:flex;justify-content:flex-end;gap:7px;margin-top:16px"><button class="action edit" onclick="editRide(${r.id})">Edit</button><button class="action delete" onclick="removeRide(${r.id})">Delete</button></div></div>`).join("")}
  function fillDrivers(){document.getElementById("rideDriver").innerHTML=`<option value="">Select driver</option>`+drivers.map(d=>`<option value="${d.id}">${esc(d.name)} — ${esc(d.email)}</option>`).join("")}
  window.editRide=id=>{const r=rides.find(x=>x.id===id);if(!r)return;document.getElementById("rideId").value=id;document.getElementById("rideDriver").value=r.driverId;document.getElementById("rideOrigin").value=r.origin;document.getElementById("rideDestination").value=r.destination;document.getElementById("rideDeparture").value=(r.departureTime||"").slice(0,16);document.getElementById("rideSeats").value=r.availableSeats;document.getElementById("rideStatus").value=r.status;document.getElementById("rideModalTitle").textContent="Edit Ride";openModal("rideModal")};
  window.removeRide=async id=>{if(!confirm("Delete this ride?"))return;try{await api(`${API.rides}/${id}`,{method:"DELETE"});toast("Ride deleted successfully");load()}catch{}};
  form.addEventListener("submit",async e=>{e.preventDefault();const id=v("rideId");const body={driver:{id:Number(v("rideDriver"))},origin:v("rideOrigin"),destination:v("rideDestination"),departureTime:v("rideDeparture"),availableSeats:Number(v("rideSeats")),status:v("rideStatus")};try{await api(id?`${API.rides}/${id}`:API.rides,{method:id?"PUT":"POST",body:JSON.stringify(body)});toast(id?"Ride updated successfully":"Ride created successfully");closeModal("rideModal");form.reset();document.getElementById("rideId").value="";load()}catch{}});
  load();
}
async function initRequests(){
  const tbody=document.getElementById("requestRows"), form=document.getElementById("requestForm");let requests=[],riders=[],rides=[];
  async function load(){try{[requests,riders,rides]=await Promise.all([api(API.requests),api(API.users).then(x=>x.filter(u=>u.role==="RIDER")),api(API.rides)]);render();fillSelects()}catch{}}
  function render(){document.getElementById("reqTotal").textContent=requests.length;document.getElementById("reqPending").textContent=requests.filter(r=>r.status==="PENDING").length;document.getElementById("reqApproved").textContent=requests.filter(r=>r.status==="APPROVED").length;document.getElementById("reqRejected").textContent=requests.filter(r=>r.status==="REJECTED").length;if(!requests.length){tbody.innerHTML=`<tr><td colspan="7"><div class="empty">📋<h3>No requests yet</h3><p>Create a ride request to get started.</p></div></td></tr>`;return}tbody.innerHTML=requests.map(r=>{const rider=r.rider||{},ride=r.ride||{};return `<tr><td>#${r.id}</td><td><div class="user-cell"><div class="mini-avatar">${initials(rider.name)}</div><b>${esc(rider.name||"Rider")}</b></div></td><td>#${ride.id||"-"}</td><td>${esc(ride.origin||"-")} → ${esc(ride.destination||"-")}</td><td>${fmtDateTime(ride.departureTime)}</td><td>${badge(r.status)}</td><td><div class="actions"><button class="action edit" onclick="editRequest(${r.id})">Edit</button><button class="action delete" onclick="removeRequest(${r.id})">Delete</button></div></td></tr>`}).join("")}
  function fillSelects(){document.getElementById("reqRider").innerHTML=`<option value="">Select rider</option>`+riders.map(x=>`<option value="${x.id}">${esc(x.name)} — ${esc(x.email)}</option>`).join("");document.getElementById("reqRide").innerHTML=`<option value="">Select ride</option>`+rides.map(x=>`<option value="${x.id}">#${x.id} ${esc(x.origin)} → ${esc(x.destination)}</option>`).join("")}
  window.editRequest=id=>{const r=requests.find(x=>x.id===id);if(!r)return;document.getElementById("requestId").value=id;document.getElementById("reqRider").value=r.rider?.id||"";document.getElementById("reqRide").value=r.ride?.id||"";document.getElementById("reqStatus").value=r.status;document.getElementById("requestModalTitle").textContent="Edit Request";openModal("requestModal")};
  window.removeRequest=async id=>{if(!confirm("Delete this request?"))return;try{await api(`${API.requests}/${id}`,{method:"DELETE"});toast("Request deleted successfully");load()}catch{}};
  form.addEventListener("submit",async e=>{e.preventDefault();const id=v("requestId"),rideId=Number(v("reqRide"));const body={rider:{id:Number(v("reqRider"))},ride:{id:rideId,availableSeats:1},status:v("reqStatus")};try{await api(id?`${API.requests}/${id}`:API.requests,{method:id?"PUT":"POST",body:JSON.stringify(body)});toast(id?"Request updated successfully":"Request created successfully");closeModal("requestModal");form.reset();document.getElementById("requestId").value="";load()}catch{}});
  load();
}
function v(id){return document.getElementById(id)?.value||""}
function fillForm(formId,obj){
  const f=document.getElementById(formId);
  Object.entries(obj).forEach(([k,val])=>{const el=f.querySelector(`[name="${k}"]`);if(el)el.value=val??""});
}
