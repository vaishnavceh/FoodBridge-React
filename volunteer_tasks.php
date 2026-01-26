<?php
include 'config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'volunteer') {
    header('Location: login.php');
    exit;
}

$user_id = $_SESSION['user_id'];

// Handle "Complete Delivery" action
if (isset($_GET['complete_id'])) {
    $complete_id = intval($_GET['complete_id']);
    $conn->query("UPDATE donations SET status = 'completed' WHERE id = $complete_id AND volunteer_id = $user_id");
    header("Location: volunteer_tasks.php?msg=delivered");
    exit;
}

// 1. Fetch Available Missions (Not claimed)
$query_available = "SELECT d.*, u.username as donor_name 
                    FROM donations d 
                    JOIN users u ON d.user_id = u.id 
                    WHERE d.status = 'available' 
                    ORDER BY d.created_at DESC";
$available_result = $conn->query($query_available);

// 2. Fetch YOUR Active Missions (Claimed but not completed)
$query_active = "SELECT d.*, u.username as donor_name 
                 FROM donations d 
                 JOIN users u ON d.user_id = u.id 
                 WHERE d.status = 'pending' AND d.volunteer_id = $user_id 
                 ORDER BY d.created_at DESC";
$active_result = $conn->query($query_active);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Mission Board | FoodBridge</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        :root { --accent: #f59e0b; --bg: #030712; --card: rgba(255,255,255,0.03); --success: #10b981; }
        body { background: var(--bg); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; }
        .task-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 25px; margin-top: 20px; margin-bottom: 50px; }
        .task-card { background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 25px; transition: 0.3s; position: relative; }
        .task-card.my-task { border-color: var(--success); background: rgba(16, 185, 129, 0.05); }
        .contact-link { display: flex; align-items: center; gap: 8px; color: var(--accent); text-decoration: none; margin-top: 10px; font-size: 14px; font-weight: 600; }
        .btn { display: inline-block; width: 100%; text-align: center; padding: 12px; border-radius: 12px; text-decoration: none; font-weight: 700; margin-top: 20px; transition: 0.3s; border: none; cursor: pointer; }
        .btn-accept { background: var(--accent); color: #000; }
        .btn-complete { background: var(--success); color: #000; }
        .badge { background: rgba(245, 158, 11, 0.2); color: var(--accent); padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        h2 { border-left: 4px solid var(--accent); padding-left: 15px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div style="max-width: 1200px; margin: 0 auto;">
        
        <?php if ($active_result->num_rows > 0): ?>
        <h2 style="border-color: var(--success);">In Progress <span style="color:var(--success)">Missions</span></h2>
        <div class="task-grid">
            <?php while($row = $active_result->fetch_assoc()): ?>
                <div class="task-card my-task">
                    <span class="badge" style="background:var(--success); color:#000;">CLAIMED</span>
                    <h3 style="margin:15px 0 10px 0;"><?php echo htmlspecialchars($row['food_type']); ?></h3>
                    <p style="color:#94a3b8; font-size:14px;"><i class="material-icons" style="font-size:16px; vertical-align:middle;">person</i> Donor: <?php echo htmlspecialchars($row['donor_name']); ?></p>
                    
                    <a href="tel:<?php echo $row['phone']; ?>" class="contact-link"><i class="material-icons">phone</i> <?php echo htmlspecialchars($row['phone']); ?></a>
                    <a href="<?php echo $row['location']; ?>" target="_blank" class="contact-link" style="color: #38bdf8;"><i class="material-icons">near_me</i> GPS Navigation</a>
                    
                    <a href="volunteer_tasks.php?complete_id=<?php echo $row['id']; ?>" class="btn btn-complete" onclick="return confirm('Has the food been delivered successfully?')">
                        MARK AS DELIVERED
                    </a>
                </div>
            <?php endwhile; ?>
        </div>
        <?php endif; ?>

        <h2>Available <span style="color:var(--accent)">Missions</span></h2>
        <div class="task-grid">
            <?php if ($available_result->num_rows > 0): ?>
                <?php while($row = $available_result->fetch_assoc()): ?>
                    <div class="task-card">
                        <span class="badge">Live Signal</span>
                        <h3 style="margin:15px 0 10px 0;"><?php echo htmlspecialchars($row['food_type']); ?></h3>
                        <p style="color:#94a3b8; font-size:14px;"><i class="material-icons" style="font-size:16px; vertical-align:middle;">inventory_2</i> Qty: <?php echo htmlspecialchars($row['quantity']); ?></p>
                        
                        <a href="accept_mission.php?id=<?php echo $row['id']; ?>" class="btn btn-accept" onclick="return confirm('Claim this mission?')">
                            ACCEPT MISSION
                        </a>
                    </div>
                <?php endwhile; ?>
            <?php else: ?>
                <p style="color:#64748b;">No new signals available.</p>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>