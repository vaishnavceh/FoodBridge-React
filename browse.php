<?php
include 'config.php';
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role'], ['ngo', 'volunteer'])) {
    header('Location: login.php'); exit;
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

// Optimized Query: Fetches only what's relevant and sorts by urgency
$query = "SELECT d.*, u.username AS donor_name 
          FROM donations d 
          JOIN users u ON d.user_id = u.id 
          WHERE d.expiry > NOW() 
          AND (d.status = 'available' OR d.claimed_by = ?)
          ORDER BY (d.claimed_by = ?) DESC, d.expiry ASC";

$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $user_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Satellite Feed | FoodBridge</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        :root { --accent: <?php echo ($role == 'volunteer') ? '#f472b6' : '#38bdf8'; ?>; --bg: #030712; --card: #0f172a; }
        body { background: var(--bg); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; }
        .feed-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px; max-width: 1200px; margin: 0 auto; }
        .mission-card { background: var(--card); border-radius: 24px; border: 1px solid rgba(255,255,255,0.08); padding: 25px; position: relative; transition: 0.3s; }
        .mission-card.mine { border-color: #10b981; box-shadow: 0 0 20px rgba(16, 185, 129, 0.1); }
        .decay-bar { width: 100%; height: 5px; background: rgba(255,255,255,0.1); border-radius: 10px; margin: 15px 0; overflow: hidden; }
        .decay-fill { height: 100%; background: var(--accent); }
        .btn-action { width: 100%; background: var(--accent); color: #000; border: none; padding: 14px; border-radius: 12px; font-weight: 800; cursor: pointer; margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;}
        .btn-action.claimed { background: #10b981; color: #fff; cursor: default; }
        .badge { font-size: 10px; font-weight: 800; color: var(--accent); text-transform: uppercase; }
    </style>
</head>
<body>

<div style="max-width:1200px; margin: 0 auto 40px; display: flex; justify-content: space-between; align-items: center;">
    <h1>Live <span style="color:var(--accent);">Broadcasts</span></h1>
    <div style="background:rgba(255,255,255,0.05); padding:10px 20px; border-radius:12px; border:1px solid var(--accent); color:var(--accent); font-weight:800; font-size:12px;">
        <?php echo strtoupper($role); ?> COMMAND
    </div>
</div>

<div class="feed-grid">
    <?php while($row = $result->fetch_assoc()): 
        $is_mine = ($row['claimed_by'] == $user_id);
        $rem = strtotime($row['expiry']) - time();
        $perc = max(0, min(100, ($rem / 86400) * 100));
    ?>
    <div class="mission-card <?php echo $is_mine ? 'mine' : ''; ?>">
        <span class="badge"><?php echo htmlspecialchars($row['donor_name']); ?></span>
        <h3 style="margin:8px 0;"><?php echo htmlspecialchars($row['food_type']); ?></h3>
        
        <div style="font-size:13px; color:#94a3b8; display:flex; gap:15px; margin-bottom:15px;">
            <span><i class="material-icons" style="font-size:14px;">inventory</i> <?php echo $row['quantity']; ?></span>
            <span><i class="material-icons" style="font-size:14px;">timer</i> <?php echo floor($rem/3600); ?>h left</span>
        </div>

        <div class="decay-bar"><div class="decay-fill" style="width:<?php echo $perc; ?>%;"></div></div>

        <?php if($row['status'] == 'available'): ?>
            <button class="btn-action" onclick="location.href='claim_process.php?id=<?php echo $row['id']; ?>'">
                <i class="material-icons">radar</i> RESERVE FOR PICKUP
            </button>
        <?php else: ?>
            <button class="btn-action claimed"><i class="material-icons">task_alt</i> MISSION SECURED</button>
            <a href="<?php echo $row['location']; ?>" target="_blank" class="btn-action" style="background:#fff; color:#000;">
                <i class="material-icons">near_me</i> OPEN NAVIGATION
            </a>
        <?php endif; ?>
    </div>
    <?php endwhile; ?>
</div>

</body>
</html>