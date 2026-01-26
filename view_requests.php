<?php
include 'config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'donor') { 
    header('Location: dashboard.php'); 
    exit; 
}

$user_id = $_SESSION['user_id'];
$donor_name = $_SESSION['username'];

// Handle Acceptance of NGO Request
if (isset($_GET['fulfill_id'])) {
    $id = mysqli_real_escape_string($conn, $_GET['fulfill_id']);
    
    // 1. Fetch details about the NGO request first
    $req_check = $conn->query("SELECT r.*, u.username as ngo_name FROM requests r JOIN users u ON r.ngo_id = u.id WHERE r.id = $id");
    $req_data = $req_check->fetch_assoc();

    if ($req_data && $req_data['status'] == 'open') {
        $item = $req_data['item_needed'];
        $qty = $req_data['quantity_needed'];
        $destination = $req_data['map_link'];
        $ngo_name = $req_data['ngo_name'];
        $contact = $req_data['contact_number'];

        // 2. Mark the NGO request as fulfilled in the requests table
        $conn->query("UPDATE requests SET status='fulfilled', fulfilled_by=$user_id, updated_at=NOW() WHERE id=$id");

        // 3. Create a Delivery Mission for Volunteers in the donations table
        // We set the location as the NGO's destination so the volunteer knows where to take it
        $mission_desc = "DELIVERY: $item to $ngo_name";
        
        $stmt = $conn->prepare("INSERT INTO donations (user_id, food_type, quantity, location, phone, status, created_at) VALUES (?, ?, ?, ?, ?, 'available', NOW())");
        $stmt->bind_param("issss", $user_id, $mission_desc, $qty, $destination, $contact);
        
        if ($stmt->execute()) {
            header("Location: view_requests.php?success=1"); 
            exit;
        } else {
            die("Mission Broadcast Error: " . $conn->error);
        }
    }
}

$open = $conn->query("SELECT r.*, u.username as ngo FROM requests r JOIN users u ON r.ngo_id = u.id WHERE r.status='open'");
$mine = $conn->query("SELECT r.*, u.username as ngo FROM requests r JOIN users u ON r.ngo_id = u.id WHERE r.status='fulfilled' AND r.fulfilled_by=$user_id");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>NGO Missions | FoodBridge</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        :root { --accent: #38bdf8; --bg: #030712; --card: #0f172a; --success: #10b981; }
        body { background: var(--bg); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .card { background: var(--card); border: 1px solid rgba(255,255,255,0.1); padding: 25px; border-radius: 24px; position: relative; transition: 0.3s; }
        .card.active { border-color: var(--success); background: rgba(16, 185, 129, 0.05); }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 13px; margin-top: 15px; border: none; cursor: pointer; }
        .btn-call { background: var(--success); color: #000; }
        .btn-map { background: #fff; color: #000; }
        .btn-fulfill { background: var(--accent); color: #000; width: 100%; justify-content: center; }
        .badge { background: rgba(56, 189, 248, 0.2); color: var(--accent); padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .success-msg { background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success); color: var(--success); padding: 15px; border-radius: 12px; margin-bottom: 30px; }
    </style>
</head>
<body>

    <div style="max-width: 1100px; margin: 0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
            <h1>Mission <span style="color:var(--accent)">Center</span></h1>
            <a href="dashboard.php" style="color:#94a3b8; text-decoration:none;">&larr; Back to Base</a>
        </div>

        <?php if(isset($_GET['success'])): ?>
            <div class="success-msg">
                <i class="material-icons" style="vertical-align:middle;">check_circle</i> 
                Mission Accepted! A delivery request has been broadcasted to all active Volunteers.
            </div>
        <?php endif; ?>

        <?php if($mine->num_rows > 0): ?>
        <h3 style="color:var(--success); display:flex; align-items:center; gap:10px;">
            <i class="material-icons">task_alt</i> Accepted by You
        </h3>
        <div class="grid" style="margin-bottom: 50px;">
            <?php while($r = $mine->fetch_assoc()): ?>
                <div class="card active">
                    <span class="badge" style="color:var(--success); border:1px solid var(--success); background:none;">Routing to Volunteer</span>
                    <h2 style="margin: 15px 0 5px 0;"><?php echo $r['item_needed']; ?></h2>
                    <p style="color:#94a3b8; margin-top:0;">For: <strong><?php echo $r['ngo']; ?></strong></p>
                    <div style="display:flex; gap:10px;">
                        <a href="tel:<?php echo $r['contact_number']; ?>" class="btn btn-call"><i class="material-icons">phone</i> CALL NGO</a>
                        <a href="<?php echo $r['map_link']; ?>" target="_blank" class="btn btn-map"><i class="material-icons">near_me</i> DESTINATION</a>
                    </div>
                </div>
            <?php endwhile; ?>
        </div>
        <?php endif; ?>

        <h3 style="display:flex; align-items:center; gap:10px; color:#94a3b8;">
            <i class="material-icons">sensors</i> Available NGO Signals
        </h3>
        <div class="grid">
            <?php if($open->num_rows > 0): ?>
                <?php while($r = $open->fetch_assoc()): ?>
                    <div class="card">
                        <span class="badge">Open Request</span>
                        <h2 style="margin: 15px 0 5px 0;"><?php echo $r['item_needed']; ?></h2>
                        <p style="color:#94a3b8; margin:0 0 15px 0;">NGO: <?php echo $r['ngo']; ?></p>
                        
                        <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:12px; font-size:14px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                <span style="color:#64748b;">Quantity:</span>
                                <span><?php echo $r['quantity_needed']; ?></span>
                            </div>
                            <div style="display:flex; justify-content:space-between;">
                                <span style="color:#64748b;">Urgency:</span>
                                <span style="color:<?php echo ($r['urgency'] == 'High') ? '#ef4444' : '#f59e0b'; ?>"><?php echo $r['urgency']; ?></span>
                            </div>
                        </div>

                        <a href="view_requests.php?fulfill_id=<?php echo $r['id']; ?>" 
                           class="btn btn-fulfill" 
                           onclick="return confirm('Accepting this will notify volunteers to pick up the food from you and deliver it to the NGO. Proceed?')">
                           ACCEPT MISSION
                        </a>
                    </div>
                <?php endwhile; ?>
            <?php else: ?>
                <p style="color:#475569;">No active NGO signals detected in your area.</p>
            <?php endif; ?>
        </div>
    </div>

</body>
</html>