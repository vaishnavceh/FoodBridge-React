<?php
include 'config.php';
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'donor') { header('Location: login.php'); exit; }
$result = $conn->query("SELECT * FROM donations WHERE user_id = ".$_SESSION['user_id']." ORDER BY created_at DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Donation History | FoodBridge</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        body { background: #030712; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; }
        .history-card { background: rgba(30, 41, 59, 0.4); border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th { background: rgba(255,255,255,0.03); padding: 15px; color: #38bdf8; text-align: left; font-size: 11px; }
        td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .btn-print { background: #fff; color: #000; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; }
        #bill-slip { display: none; }
        @media print { body * { visibility: hidden; } #bill-slip, #bill-slip * { visibility: visible; } #bill-slip { display: block !important; position: absolute; left:0; top:0; width:100%; background:#fff; color:#000; padding:40px; } }
    </style>
</head>
<body>
    <h1 style="font-weight: 800;">My <span style="color:#38bdf8;">Donations</span></h1>
    <div class="history-card">
        <table>
            <thead><tr><th>DATE</th><th>ITEM</th><th>QTY</th><th>ACTION</th></tr></thead>
            <tbody>
                <?php while($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?php echo date('d M Y', strtotime($row['created_at'])); ?></td>
                    <td><?php echo $row['food_type']; ?></td>
                    <td><?php echo $row['quantity']; ?></td>
                    <td><button class="btn-print" onclick="printOld('<?php echo addslashes($row['food_type']); ?>','<?php echo $row['quantity']; ?>','<?php echo $row['location']; ?>','FB-<?php echo strtotime($row['created_at']); ?>')">REPRINT SLIP</button></td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>

    <div id="bill-slip">
        <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:15px;">
            <img src="https://i.ibb.co/XZck7V4z/erasebg-transformed-16.png" style="width:200px;">
            <h2>DONATION CERTIFICATE</h2>
        </div>
        <div style="margin-top:30px; font-size:18px;">
            <p><strong>DONOR:</strong> <?php echo $_SESSION['username']; ?></p>
            <p><strong>TX ID:</strong> <span id="b_id"></span></p>
            <p><strong>ITEM:</strong> <span id="b_food"></span></p>
            <p><strong>QTY:</strong> <span id="b_qty"></span></p>
            <p><strong>GPS:</strong> <br><span id="b_loc" style="font-size:11px;"></span></p>
        </div>
        <div style="margin-top:50px; display:flex; justify-content:space-between; align-items:flex-end;">
            <div><div style="color:#10b981; font-weight:800;">✔ DIGITALLY SIGNED</div></div>
            <div style="text-align:center;"><img src="https://i.ibb.co/Mk68p900/erasebg-transformed-17.png" style="width:130px;"></div>
        </div>
    </div>

    <script>
        function printOld(f, q, l, id) {
            document.getElementById('b_food').innerText = f;
            document.getElementById('b_qty').innerText = q;
            document.getElementById('b_loc').innerText = l;
            document.getElementById('b_id').innerText = id;
            window.print();
        }
    </script>
</body>
</html>