<?php
include 'config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] === 'donor') { header('Location: dashboard.php'); exit; }
$user_id = $_SESSION['user_id'];

if (isset($_POST['post_request'])) {
    $item = $_POST['item']; $qty = $_POST['qty']; $map = $_POST['map_link']; $phone = $_POST['phone']; $urgency = $_POST['urgency'];
    $stmt = $conn->prepare("INSERT INTO requests (ngo_id, item_needed, quantity_needed, map_link, contact_number, urgency, status) VALUES (?,?,?,?,?,?,'open')");
    $stmt->bind_param("isssss", $user_id, $item, $qty, $map, $phone, $urgency);
    $stmt->execute();
    header("Location: my_requests.php"); exit;
}

$requests = $conn->query("SELECT r.*, u.username as donor FROM requests r LEFT JOIN users u ON r.fulfilled_by = u.id WHERE r.ngo_id = $user_id ORDER BY r.created_at DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Broadcast Need</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        body { background: #030712; color: #fff; font-family: sans-serif; padding: 40px; }
        .command-bar { background: #0f172a; padding: 15px; border-radius: 20px; display: flex; gap: 10px; margin-bottom: 40px; border: 1px solid rgba(255,255,255,0.1); }
        input, select { background: #1e293b; border: none; padding: 12px; color: #fff; border-radius: 12px; flex: 1; }
        .btn-gps { background: #10b981; color: #000; border: none; padding: 0 20px; border-radius: 12px; font-weight: 800; cursor: pointer; }
        .row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; background: rgba(255,255,255,0.02); padding: 20px; border-radius: 15px; margin-bottom: 10px; align-items: center; }
    </style>
</head>
<body>
    <h1>Signal <span style="color:#10b981">Broadcast</span></h1>
    <form method="POST" class="command-bar">
        <input type="text" name="item" placeholder="Item needed" required>
        <input type="text" name="qty" placeholder="Qty" style="max-width:80px">
        <input type="tel" name="phone" placeholder="Contact Phone" required>
        <input type="hidden" name="map_link" id="map_link" required>
        <button type="button" class="btn-gps" onclick="getLocation()"><i class="material-icons">my_location</i></button>
        <select name="urgency"><option>Low</option><option selected>Medium</option><option>High</option></select>
        <button type="submit" name="post_request" class="btn-gps" style="background:#fff">SEND</button>
    </form>

    <?php while($r = $requests->fetch_assoc()): ?>
    <div class="row">
        <div><strong><?php echo $r['item_needed']; ?></strong><br><small><?php echo $r['contact_number']; ?></small></div>
        <div>Qty: <?php echo $r['quantity_needed']; ?></div>
        <div style="color:#10b981"><?php echo strtoupper($r['urgency']); ?></div>
        <div style="text-align:right"><?php echo ($r['status']=='fulfilled') ? "FIXED BY ".$r['donor'] : "📡 ALIVE"; ?></div>
    </div>
    <?php endwhile; ?>

    <script>
        function getLocation() {
            navigator.geolocation.getCurrentPosition((p) => {
                document.getElementById('map_link').value = `https://www.google.com/maps?q=${p.coords.latitude},${p.coords.longitude}`;
                alert("GPS Coordinates Locked!");
            });
        }
    </script>
</body>
</html>