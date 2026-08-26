const products = [
 {id:1,trade:"Lumber & Framing",dept:"Structural Connectors",maker:"Simpson Strong-Tie",sku:"PRO-SWP-H2.5A-BX100",name:"Simpson Strong-Tie H2.5A 18-Gauge Galvanized Hurricane Tie / Rafter Clip (Box of 100)",desc:"Engineered structural seismic and high-wind rafter-to-top-plate structural connectors. G-90 galvanized for corrosion resistance.",specs:["ICC-ES ESR-2613","Florida Building Code FL10444","Forklift Required"],price:49,unit:"Box of 100",save:"48%",pack:48,img:"assets/simpson-hurricane.jpg"},
 {id:2,trade:"Lumber & Framing",dept:"Fasteners",maker:"GRK Fasteners Pro",sku:"PRO-GRK-R4-50LB",name:"GRK R4 Multi-Purpose Star-Drive Framing Screws #9 x 3-1/8” (50 lb Contractor Pail)",desc:"Climate-coated self-tapping structural screws with countersinking head. Eliminates pre-drilling in treated lumber, hardwood, and composite.",specs:["ICC-ES ESR-3201","ACQ Pressure Treated Approved"],price:139,unit:"50 lb Bucket",save:"43%",pack:36,img:"assets/grk-screws.jpg"},
 {id:3,trade:"Roofing & Siding",dept:"Roofing",maker:"GAF Commercial Building Products",sku:"PRO-GAF-HDZ-PAL",name:"GAF Timberline HDZ LayerLock High-Definition Architectural Shingles (Charcoal)",desc:"North America's #1 selling architectural shingle with LayerLock technology, StrikeZone nailing area, and 25-year algae protection.",specs:["UL 790 Class A Fire","ASTM D3018 Class F","Forklift Required"],price:25.4,unit:"Bundle / 33.3 sq ft",save:"46%",pack:39,img:"assets/gaf-shingles.jpg"},
 {id:4,trade:"Paint & Waterproofing",dept:"Waterproofing",maker:"Custom Building Products Pro",sku:"PRO-CUS-REDGARD-35G",name:"Custom Building Products RedGard Liquid Waterproofing & Crack Prevention Membrane – 3.5 Gal",desc:"Ready-to-use elastomeric membrane for interior/exterior tile and stone installations. Creates a continuous waterproof barrier.",specs:["ANSI A118.10","ANSI A118.12"],price:98.5,unit:"3.5 Gallon Pail",save:"43%",pack:36,img:"assets/redgard-membrane.jpg"},
 {id:5,trade:"Lumber & Framing",dept:"Framing Lumber",maker:"Weyerhaeuser",sku:"PRO-LUM-2X4-10",name:"2” x 4” x 104-5/8” Premium Douglas Fir Precision Stud",desc:"Kiln-dried Douglas Fir framing stud, precision end-trimmed for 9-foot ceilings. Exceptional dimensional stability.",specs:["SFI Certified","MiPA Graded","Forklift Required"],price:3.42,unit:"Piece",save:"49%",pack:294,img:"assets/douglas-fir.jpg"},
 {id:6,trade:"Lumber & Framing",dept:"Structural Engineered Wood",maker:"Boise Cascade Versa-Lam",sku:"PRO-LVL-175118-40",name:"1-3/4” x 11-7/8” x 24 ft Engineered LVL Structural Beam (2.0E)",desc:"High-strength laminated veneer lumber header and beam for long-span applications, engineered to reduce twisting and bowing.",specs:["ICC-ES ESR-1040","APA Certified","Forklift Required"],price:104,unit:"Beam / 24 ft",save:"38%",pack:16,img:"assets/lvl-beam.jpg"},
 {id:7,trade:"Concrete & Masonry",dept:"Concrete",maker:"Lehigh Hanson ProMix",sku:"PRO-CON-PTR94-PLT",name:"Portland Cement Type I/II – 94 lb Commercial Bag",desc:"Basic structural ingredient for concrete, mortar, stucco, and grout. Meets ASTM C150 standard specifications.",specs:["ASTM C150 Type I/II","AASHTO M85","Forklift Required"],price:11.25,unit:"94 lb Bag",save:"30%",pack:35,img:"assets/cement.jpg"},
 {id:8,trade:"Concrete & Masonry",dept:"Masonry",maker:"Oldcastle Architectural",sku:"PRO-CMU-8816-PAL",name:"8” x 8” x 16” Standard Hollow Core Concrete Masonry Unit (CMU)",desc:"Precision load-bearing standard concrete masonry block for commercial foundations, retaining walls, fire barriers, and structural work.",specs:["ASTM C90 Load Bearing","UL 2-Hour Fire Rated","Forklift Required"],price:1.98,unit:"Block",save:"51%",pack:90,img:"assets/cmu-block.jpg"}
];

let cart = JSON.parse(localStorage.getItem("buildproCart")||"[]");
let rfq = [];
let activeCat = "all";
let b2b = true;

const money = n => "$"+Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const grid = document.getElementById("productGrid");

function filteredProducts(){
  const q=(document.getElementById("search").value||"").trim().toLowerCase();
  const trade=document.getElementById("tradeFilter").value;
  return products.filter(p=>{
    const matchesCat=activeCat==="all"||p.trade===activeCat;
    const matchesTrade=trade==="all"||p.trade===trade;
    const hay=[p.name,p.sku,p.maker,p.dept,p.trade,...p.specs].join(" ").toLowerCase();
    return matchesCat&&matchesTrade&&(!q||hay.includes(q));
  });
}
function render(){
  const list=filteredProducts();
  document.getElementById("foundCount").textContent=`${list.length} Products Found`;
  grid.innerHTML=list.map(p=>card(p)).join("");
  document.querySelectorAll(".add").forEach(b=>b.onclick=()=>addToCart(+b.dataset.id));
  document.querySelectorAll(".rfq").forEach(b=>b.onclick=()=>addToRfq(+b.dataset.id));
  document.querySelectorAll(".qty button").forEach(b=>b.onclick=()=>{
    const id=+b.dataset.id, delta=+b.dataset.delta, span=b.parentElement.querySelector("span");
    span.textContent=Math.max(1,+span.textContent+delta);
  });
  document.querySelectorAll(".pack button").forEach(b=>b.onclick=()=>{
    b.parentElement.querySelectorAll("button").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    const qty=b.closest(".card").querySelector(".qty span");
    qty.textContent=b.dataset.qty;
  });
}
function card(p){
  const price=b2b?p.price:Math.round(p.price*1.25*100)/100;
  const tier1=price*1.22,tier2=price*1.12;
  return `<article class="card">
    <div class="photo"><img src="${p.img}" alt=""><span class="pill">${p.trade}</span><span class="stock">● In Stock: ${(p.pack * 10).toLocaleString()} Units</span></div>
    <div class="body">
      <div class="maker"><span>${p.maker}</span><span class="sku">${p.sku}</span></div>
      <div class="title">${p.name}</div><div class="desc">${p.desc}</div>
      <div class="specs">${p.specs.map(s=>`<span class="spec ${s.includes("Forklift")?"warn":""}">${s}</span>`).join("")}</div>
      <div class="price-row"><div><div class="price-label">${b2b?"CONTRACTOR WHOLESALE":"RETAIL PRICE"}</div><span class="price">${money(price)}</span> <span class="unit">/ ${p.unit}</span></div><span class="save">Save up to ${p.save}</span></div>
      <div class="tiers"><div class="tier"><span>Single</span><span>${money(tier1)}</span></div><div class="tier"><span>Master Case / Lot</span><span>${money(tier2)}</span></div><div class="tier active"><span>Full ${b2b?"Pallet":"Case"} (${p.pack})</span><span>${money(price)}</span></div></div>
      <div class="pack"><button class="active" data-qty="${p.pack}">1 Pallet (${p.pack})</button><button data-qty="${p.pack*3}">3 Pallets (${p.pack*3})</button></div>
      <div class="buy-row"><div class="qty"><button data-id="${p.id}" data-delta="-1">−</button><span>${p.pack}</span><button data-id="${p.id}" data-delta="1">+</button></div><button class="add" data-id="${p.id}">🛒 Add (${p.pack}) — ${money(price*p.pack)}</button></div>
      <button class="rfq" data-id="${p.id}">▣ Add ${p.pack} units to Project RFQ Bid</button>
    </div></article>`;
}
function save(){localStorage.setItem("buildproCart",JSON.stringify(cart));}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  const cardEl=[...document.querySelectorAll(".card")].find(x=>x.querySelector(`.add[data-id="${id}"]`));
  const qty=cardEl?+cardEl.querySelector(".qty span").textContent:p.pack;
  const item=cart.find(x=>x.id===id);
  if(item)item.qty+=qty;else cart.push({id,qty});
  save();updateCart();toast(`${qty} × ${p.name.slice(0,42)} added to cart`);
}
function addToRfq(id){
  if(!rfq.includes(id))rfq.push(id);
  document.getElementById("rfqCount").textContent=rfq.length;
  openRfq();toast("Product added to RFQ");
}
function updateCart(){
  const total=cart.reduce((s,i)=>s+i.qty*products.find(p=>p.id===i.id).price,0);
  document.getElementById("cartTotal").textContent=money(total);
  document.getElementById("subtotal").textContent=money(total);
  document.getElementById("freight").textContent=total?money(Math.max(0,total*.04)):"$0.00";
  document.getElementById("grandTotal").textContent=money(total+Math.max(0,total*.04));
  document.getElementById("cartList").innerHTML=cart.length?cart.map(i=>{
    const p=products.find(x=>x.id===i.id);
    return `<div class="cart-item"><img class="cart-thumb" src="${p.img}"><div><h4>${p.name.slice(0,70)}</h4><small>${i.qty} × ${money(p.price)}</small></div><button class="close" onclick="removeItem(${p.id})">✕</button></div>`;
  }).join(""):`<div style="padding:35px 5px;color:#8f8980;text-align:center">Your cart is empty.</div>`;
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);save();updateCart();toast("Item removed")}
function openCart(){document.getElementById("drawer").classList.add("open");document.getElementById("backdrop").classList.add("open")}
function closeCart(){document.getElementById("drawer").classList.remove("open");document.getElementById("backdrop").classList.remove("open")}
function openRfq(){document.getElementById("rfqModal").classList.add("open")}
function closeRfq(){document.getElementById("rfqModal").classList.remove("open")}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),2200)}

document.getElementById("search").addEventListener("input",render);
document.getElementById("tradeFilter").addEventListener("change",render);
document.querySelectorAll(".cat").forEach(b=>b.onclick=()=>{
  activeCat=b.dataset.cat;document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));b.classList.add("active");
  document.getElementById("tradeFilter").value=activeCat==="all"?"all":activeCat;render();
});
document.getElementById("openCart").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("backdrop").onclick=closeCart;
document.getElementById("rfqTop").onclick=openRfq;document.getElementById("rfqNav").onclick=openRfq;document.getElementById("closeRfq").onclick=closeRfq;document.getElementById("cancelRfq").onclick=closeRfq;
document.getElementById("checkout").onclick=()=>toast("Demo checkout: connect your payment/ERP backend here.");
document.getElementById("submitRfq").onclick=()=>{closeRfq();toast(`RFQ generated for ${rfq.length||"selected"} product(s) — demo mode`);};
function setMode(mode){
  b2b=mode==="b2b";document.getElementById("b2bBtn").classList.toggle("active",b2b);document.getElementById("d2cBtn").classList.toggle("active",!b2b);
  document.getElementById("switchMode").textContent=b2b?"⇄ Switch to D2C Retail Mode":"⇄ Switch to B2B Commercial Pro";
  document.getElementById("locationText").textContent=b2b?"Central Industrial Yard (Dallas, TX)":"Homeowner Pickup — Dallas, TX";
  render();toast(b2b?"B2B wholesale mode active":"D2C retail mode active");
}
document.getElementById("b2bBtn").onclick=()=>setMode("b2b");document.getElementById("d2cBtn").onclick=()=>setMode("d2c");document.getElementById("switchMode").onclick=()=>setMode(b2b?"d2c":"b2b");
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();document.getElementById("search").focus()}if(e.key==="Escape"){closeCart();closeRfq()}});

render();updateCart();
