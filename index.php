<?php 
include 'config.php';

// --- REAL-TIME DATA FETCHING ---
$delivered_query = $conn->query("SELECT COUNT(*) FROM donations WHERE status = 'completed'");
$total_delivered = $delivered_query ? $delivered_query->fetch_row()[0] : 0;

$ngo_query = $conn->query("SELECT COUNT(*) FROM users WHERE role = 'ngo'");
$total_ngos = $ngo_query ? $ngo_query->fetch_row()[0] : 0;

$vol_query = $conn->query("SELECT COUNT(*) FROM users WHERE role = 'volunteer'");
$total_volunteers = $vol_query ? $vol_query->fetch_row()[0] : 0;

$isLoggedIn = isset($_SESSION['user_id']);
?>
<!DOCTYPE html>
<html lang="en" class="carbon">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FoodBridge | Zero Waste, Zero Hunger</title>
    <link rel="stylesheet" href="templatemo-daynight-style.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        :root { --accent: #f59e0b; --accent-light: rgba(245, 158, 11, 0.1); --bg-dark: #030712; --card-bg: rgba(31, 31, 31, 0.6); }
        body { padding-top: 80px; background: var(--bg-dark); color: #fff; font-family: 'Inter', sans-serif; }
        .hero-section { position: relative; padding: 160px 0 100px; text-align: center; overflow: hidden; }
        .btn-main { padding: 16px 40px; border-radius: 14px; background: var(--accent); color: #000; text-decoration: none; font-weight: 700; display: inline-block; transition: 0.3s; border: none; }
        .btn-outline { padding:16px 40px; color:#fff; text-decoration:none; font-weight:600; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; transition: 0.3s; }
        .btn-outline:hover { background: rgba(255,255,255,0.05); border-color: var(--accent); }
        .glass-card { background: var(--card-bg); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 28px; padding: 40px; transition: 0.4s; }
        .stat-item h2 { color: var(--accent); font-size: 2.5rem; margin:0; }
    </style>
</head>
<body>

    <nav class="top-nav" style="background: rgba(15,15,15,0.85); backdrop-filter: blur(12px); position: fixed; top:0; width:100%; z-index:1000; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <div style="max-width: 1240px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 15px 20px;">
            <a href="index.php" style="text-decoration: none; display: flex; align-items: center; gap: 10px;">
                <div style="background: var(--accent); color: #000; padding: 6px; border-radius: 10px;"><span class="material-icons">diversity_1</span></div>
                <span style="font-weight: 800; font-size: 1.5rem; color:#fff;">FoodBridge</span>
            </a>
            <div style="display: flex; align-items: center; gap: 20px;">
                <?php if($isLoggedIn): ?>
                    <a href="dashboard.php" style="color:#94a3b8; text-decoration:none; font-weight:600;">Dashboard</a>
                    <a href="logout.php" class="btn-main" style="padding: 10px 20px;">Sign Out</a>
                <?php else: ?>
                    <a href="login.php" style="color:#fff; text-decoration:none; font-weight:600;">Login</a>
                    <a href="register.php" class="btn-main" style="padding: 10px 20px;">Join Movement</a>
                <?php endif; ?>
            </div>
        </div>
    </nav>

    <main>
        <section class="hero-section">
            <div class="container" style="max-width: 1100px; margin: 0 auto; padding: 0 20px;">
                <h1 style="font-size: clamp(2.5rem, 6vw, 4.5rem); line-height:1.1;">Bridging Waste and <span style="color: var(--accent);">Want.</span></h1>
                <p style="color: #94a3b8; font-size: 1.25rem; margin: 20px auto 40px; max-width: 700px;">Real-time surplus food redistribution tracking.</p>
                
                <div style="display: flex; justify-content: center; gap: 20px;">
                    <a href="register.php" class="btn-main">Start Donating Now</a>
                    <a href="learn_more.php" class="btn-outline">Learn How it Works</a>
                </div>

                <div style="display: flex; justify-content: center; gap: 60px; margin-top: 80px; flex-wrap: wrap;">
                    <div class="stat-item"><h2><?php echo number_format($total_delivered); ?></h2><p>Meals Delivered</p></div>
                    <div class="stat-item"><h2><?php echo number_format($total_ngos); ?></h2><p>Partner NGOs</p></div>
                    <div class="stat-item"><h2><?php echo number_format($total_volunteers); ?></h2><p>Volunteers</p></div>
                </div>
            </div>
        </section>

        

        <section id="roles" style="padding: 80px 0; background: #070b14;">
            <div class="container" style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; padding: 0 20px;">
                <div class="glass-card">
                    <span class="material-icons" style="color:var(--accent); font-size: 40px;">restaurant</span>
                    <h3>Donors</h3>
                    <p>List surplus food in seconds.</p>
                    <a href="learn_more.php#donors" style="color:var(--accent); text-decoration:none;">Details &rarr;</a>
                </div>
                <div class="glass-card">
                    <span class="material-icons" style="color:var(--accent); font-size: 40px;">handshake</span>
                    <h3>NGOs</h3>
                    <p>Claim food for your community.</p>
                    <a href="learn_more.php#ngos" style="color:var(--accent); text-decoration:none;">Details &rarr;</a>
                </div>
                <div class="glass-card">
                    <span class="material-icons" style="color:var(--accent); font-size: 40px;">local_shipping</span>
                    <h3>Volunteers</h3>
                    <p>Deliver the hope.</p>
                    <a href="learn_more.php#volunteers" style="color:var(--accent); text-decoration:none;">Details &rarr;</a>
                </div>
            </div>
        </section>
    </main>

    <footer style="padding: 60px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
        <div style="display: flex; justify-content: center; gap: 25px; margin-bottom: 20px;">
            <a href="learn_more.php" style="color: #64748b; text-decoration: none;">How it Works</a>
            <a href="admin_login.php" style="color: #64748b; text-decoration: none;">Admin Portal</a>
        </div>
        <p style="color: #1e293b;">&copy; 2026 FoodBridge Platform</p>
    </footer>

</body>
</html>