<?php
include 'config.php';
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FoodBridge | Documentation</title>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">

<style>
:root{
--accent:#f59e0b;
--bg:#030712;
--card:#0f172a;
--muted:#94a3b8;
--blue:#3b82f6;
--green:#10b981;
}

*{box-sizing:border-box;}

body{
margin:0;
background:var(--bg);
color:#fff;
font-family:'Plus Jakarta Sans',sans-serif;
}

/* NAV */
nav{
position:fixed;
top:0;
width:100%;
background:rgba(3,7,18,0.9);
backdrop-filter:blur(10px);
border-bottom:1px solid rgba(255,255,255,0.05);
z-index:100;
}

.nav-wrap{
max-width:1200px;
margin:auto;
padding:15px 25px;
display:flex;
justify-content:space-between;
align-items:center;
}

.brand{
display:flex;
gap:10px;
align-items:center;
font-size:1.4rem;
font-weight:800;
}

.brand i{
background:var(--accent);
color:#000;
padding:6px;
border-radius:8px;
}

.nav-link{
color:var(--muted);
text-decoration:none;
font-weight:600;
}

/* MAIN */
.container{
max-width:1100px;
margin:120px auto 40px;
padding:0 25px;
}

section{
margin-bottom:90px;
border-bottom:1px solid rgba(255,255,255,0.05);
padding-bottom:60px;
}

/* HERO */
.hero{
text-align:center;
padding:80px 20px;
background:linear-gradient(135deg,rgba(245,158,11,0.15),transparent);
border-radius:30px;
}

.hero h1{
font-size:3rem;
margin:15px 0;
}

.hero p{
color:var(--muted);
max-width:600px;
margin:auto;
}

/* GRID */
.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
gap:25px;
margin-top:35px;
}

/* CARD */
.card{
background:var(--card);
padding:30px;
border-radius:22px;
border:1px solid rgba(255,255,255,0.05);
transition:0.3s;
position:relative;
overflow:hidden;
}

.card::after{
content:"";
position:absolute;
inset:0;
background:linear-gradient(120deg,transparent,rgba(245,158,11,0.08));
opacity:0;
transition:0.3s;
}

.card:hover::after{opacity:1;}
.card:hover{transform:translateY(-6px);border-color:var(--accent);}

.card i{
font-size:2rem;
color:var(--accent);
}

/* STATS */
.stats{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
gap:25px;
margin-top:40px;
}

.stat{
background:linear-gradient(135deg,#020617,#0f172a);
padding:30px;
border-radius:22px;
text-align:center;
border:1px solid rgba(255,255,255,0.05);
}

.stat h2{
font-size:2.2rem;
color:var(--accent);
margin:10px 0;
}

/* PROGRESS */
.progress{
height:8px;
border-radius:10px;
background:#020617;
overflow:hidden;
margin-top:10px;
}

.progress span{
display:block;
height:100%;
background:var(--accent);
}

/* TEAM */
.team{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:25px;
margin-top:40px;
}

.member{
background:#1e293b;
padding:30px;
border-radius:22px;
text-align:center;
border:1px solid rgba(255,255,255,0.05);
transition:0.3s;
}

.member:hover{transform:translateY(-6px);border-color:var(--accent);}

.avatar{
width:75px;
height:75px;
border-radius:50%;
margin:0 auto 15px;
display:flex;
align-items:center;
justify-content:center;
font-weight:800;
font-size:1.4rem;
color:#fff;
background:linear-gradient(135deg,#f59e0b,#d97706);
}

/* ROADMAP */
.timeline{
border-left:3px solid var(--accent);
padding-left:25px;
margin-top:30px;
}

.node{
margin-bottom:25px;
position:relative;
}

.node::before{
content:"";
width:14px;
height:14px;
border-radius:50%;
background:var(--accent);
position:absolute;
left:-33px;
top:5px;
}

/* FOOTER */
footer{
text-align:center;
color:var(--muted);
font-size:0.8rem;
padding:40px 0;
}

</style>
</head>
<body>

<nav>
<div class="nav-wrap">
<div class="brand"><i class="material-icons">diversity_1</i> FoodBridge</div>
<a href="index.php" class="nav-link">Back</a>
</div>
</nav>

<div class="container">

<!-- HERO -->
<section class="hero">
<span style="color:var(--accent);letter-spacing:3px;">PLATFORM MANIFESTO</span>
<h1>Zero Waste. Zero Hunger.</h1>
<p>Real-time logistics platform transforming food surplus into social impact.</p>
</section>

<!-- EXECUTIVE SUMMARY -->
<section>
<h2><i class="material-icons">summarize</i> Executive Summary</h2>
<div class="card">
<p>FoodBridge is a high-performance logistics ecosystem that solves the last-mile problem in food redistribution using real-time coordination and data-driven workflows.</p>
</div>
</section>

<!-- TRIAD MODEL -->
<section>
<h2><i class="material-icons">hub</i> Triad Model</h2>
<div class="grid">
<div class="card"><i class="material-icons">restaurant</i><h3>Donors</h3><p>Upload surplus food with expiry and location.</p></div>
<div class="card"><i class="material-icons">local_shipping</i><h3>Volunteers</h3><p>Claim missions and deliver food.</p></div>
<div class="card"><i class="material-icons">handshake</i><h3>NGOs</h3><p>Post requirements and receive supplies.</p></div>
</div>
</section>

<!-- IMPACT STATS -->
<section>
<h2><i class="material-icons">insights</i> Impact Analytics</h2>
<div class="stats">
<div class="stat"><i class="material-icons">restaurant_menu</i><h2>10K+</h2><p>Meals Delivered</p></div>
<div class="stat"><i class="material-icons">group</i><h2>500+</h2><p>Volunteers</p></div>
<div class="stat"><i class="material-icons">business</i><h2>300+</h2><p>Donors</p></div>
<div class="stat"><i class="material-icons">home_work</i><h2>150+</h2><p>NGOs</p></div>
</div>
</section>

<!-- SDG PROGRESS -->
<section>
<h2><i class="material-icons">public</i> SDG Progress</h2>

<div class="card">
<h4>Zero Hunger</h4>
<div class="progress"><span style="width:85%"></span></div>

<h4>Responsible Consumption</h4>
<div class="progress"><span style="width:78%"></span></div>

<h4>Climate Action</h4>
<div class="progress"><span style="width:65%"></span></div>
</div>
</section>

<!-- DEVELOPMENT ROADMAP -->
<section>
<h2><i class="material-icons">timeline</i> Development Roadmap</h2>
<div class="timeline">
<div class="node"><h4>v1.0</h4><p>Core registration & donations</p></div>
<div class="node"><h4>v1.1</h4><p>Mission board & tracking</p></div>
<div class="node"><h4>v1.2</h4><p>Carbon UI redesign</p></div>
<div class="node"><h4>v1.3</h4><p>Documentation hub</p></div>
<div class="node"><h4>v1.4</h4><p>Maps & verification</p></div>
</div>
</section>

<!-- ARCHITECTURE -->
<section>
<h2><i class="material-icons">architecture</i> System Architecture</h2>
<div class="grid">
<div class="card"><i class="material-icons">dns</i><h3>PHP 8</h3></div>
<div class="card"><i class="material-icons">storage</i><h3>MySQL</h3></div>
<div class="card"><