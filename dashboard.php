<?php
include 'config.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) { 
    header('Location: login.php'); 
    exit; 
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];
$username = $_SESSION['username'];

// Stats Logic
$active_donations = $conn->query("SELECT COUNT(*) as total FROM donations WHERE status = 'available'")->fetch_assoc()['total'];
$open_requests = $conn->query("SELECT COUNT(*) as total FROM requests WHERE status = 'open'")->fetch_assoc()['total'];

// NGO Alert Logic: Only run for NGOs
$alerts = [];
if ($role === 'ngo') {
    $stmt = $conn->prepare("SELECT r.item_needed, u.username FROM requests r JOIN users u ON r.fulfilled_by = u.id WHERE r.ngo_id = ? AND r.status = 'fulfilled' AND r.updated_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $alert_res = $stmt->get_result();
    while($row = $alert_res->fetch_assoc()) { 
        $alerts[] = $row; 
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Command Center | FoodBridge</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="templatemo-daynight-style.css">
    <style>
        :root { 
            /* Color logic: Blue for Donor, Green for NGO, Amber for Volunteer */
            --accent: <?php 
                if($role === 'donor') echo '#38bdf8'; 
                elseif($role === 'ngo') echo '#10b981'; 
                else echo '#f59e0b'; 
            ?>; 
            --bg: #030712; 
        }
        body { background: var(--bg); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dash-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        
        .alert-box { 
            background: rgba(16, 185, 129, 0.1); 
            border: 1px solid var(--accent); 
            padding: 18px 25px; 
            border-radius: 20px; 
            margin-bottom: 30px; 
            display: flex; 
            align-items: center; 
            gap: 15px; 
            animation: fadeIn 0.5s ease;
        }
        
        .grid-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        
        .glass-card { 
            background: rgba(255,255,255,0.02); 
            border: 1px solid rgba(255,255,255,0.08); 
            border-radius: 28px; padding: 30px; 
            text-decoration: none; color: #fff; 
            transition: 0.3s;
            display: flex; flex-direction: column;
        }
        .glass-card:hover { transform: translateY(-5px); border-color: var(--accent); background: rgba(255,255,255,0.04); }
        .glass-card * { pointer-events: none; }

        .icon-box { 
            width: 50px; height: 50px; 
            background: rgba(255,255,255,0.05); 
            color: var(--accent); 
            border-radius: 12px; 
            display: flex; align-items: center; justify-content: center; 
            margin-bottom: 20px; 
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
    </style>
</head>
<body>
    <div class="dash-container">
        <?php if($role === 'ngo' && !empty($alerts)): ?>
            <?php foreach($alerts as $alert): ?>
                <div class="alert-box">
                    <i class="material-icons" style="color:var(--accent); animation: pulse 2s infinite;">contact_phone</i>
                    <span>
                        <strong>INCOMING:</strong> <?php echo htmlspecialchars($alert['username']); ?> is fulfilling 
                        <strong><?php echo htmlspecialchars($alert['item_needed']); ?></strong>.
                    </span>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>

        <header style="margin-bottom: 50px;">
            <h1 style="font-size: 2.5rem; font-weight: 800; margin: 0;">System <span style="color:var(--accent)">Access</span></h1>
            <p style="color: #64748b;">Role: <strong style="color:var(--accent)"><?php echo strtoupper($role); ?></strong> | User: <strong><?php echo htmlspecialchars($username); ?></strong></p>
        </header>

        <div class="grid-cards">
            
            <?php if($role === 'donor'): ?>
                <a href="donate.php" class="glass-card">
                    <div class="icon-box"><i class="material-icons">add_circle</i></div>
                    <h3>Broadcast Food</h3>
                    <p style="color:#94a3b8">Signal surplus food availability to the network.</p>
                </a>
                <a href="view_requests.php" class="glass-card">
                    <div class="icon-box"><i class="material-icons">campaign</i></div>
                    <h3>NGO Needs</h3>
                    <p style="color:#94a3b8">Intercept and fulfill urgent NGO resource signals.</p>
                </a>

            <?php elseif($role === 'ngo'): ?>
                <a href="browse.php" class="glass-card">
                    <div class="icon-box"><i class="material-icons">sensors</i></div>
                    <h3>Satellite Feed</h3>
                    <p style="color:#94a3b8">View live food donations available for pickup.</p>
                </a>
                <a href="my_requests.php" class="glass-card">
                    <div class="icon-box"><i class="material-icons">post_add</i></div>
                    <h3>Broadcast Need</h3>
                    <p style="color:#94a3b8">Create a GPS-tagged request for specific items.</p>
                </a>

            <?php else: ?>
                <a href="volunteer_tasks.php" class="glass-card">
                    <div class="icon-box"><i class="material-icons">assignment_turned_in</i></div>
                    <h3>Mission Board</h3>
                    <p style="color:#94a3b8">View and accept available transport missions.</p>
                </a>
                <a href="my_history.php" class="glass-card">
                    <div class="icon-box"><i class="material-icons">history</i></div>
                    <h3>Service History</h3>
                    <p style="color:#94a3b8">Review your completed deliveries and impact stats.</p>
                </a>
            <?php endif; ?>
            
            <a href="logout.php" class="glass-card" style="border-color: rgba(239,68,68,0.2)">
                <div class="icon-box" style="color:#ef4444"><i class="material-icons">power_settings_new</i></div>
                <h3>Terminate</h3>
                <p style="color:#94a3b8">Securely exit the system.</p>
            </a>
        </div>
    </div>
</body>
</html>