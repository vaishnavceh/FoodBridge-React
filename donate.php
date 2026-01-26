<?php
include 'config.php';
// Added session_start() to ensure access to $_SESSION
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'donor') {
    header('Location: login.php'); exit;
}

$status = "";
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = $_SESSION['user_id'];
    $food_type = trim($_POST['food_type']);
    $quantity = trim($_POST['quantity']);
    // New phone field
    $phone = trim($_POST['phone']); 
    $expiry = $_POST['expiry'];
    $freshness = $_POST['freshness'];
    $location = trim($_POST['location']); 
    $from = $_POST['availability_from']; 
    $to = $_POST['availability_to'];

    // Updated SQL: Added 'phone' column
    $stmt = $conn->prepare("INSERT INTO donations (user_id, food_type, phone, quantity, expiry, freshness, location, map_link, availability_from, availability_to, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')");
    $stmt->bind_param("isssssssss", $user_id, $food_type, $phone, $quantity, $expiry, $freshness, $location, $location, $from, $to);
    
    if ($stmt->execute()) { $status = "success"; }
    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Broadcast Donation | FoodBridge</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        :root { --accent: #38bdf8; --bg: #030712; --card: #0f172a; }
        body { background: var(--bg); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; overflow-x: hidden; }
        .main-content { max-width: 900px; margin: 40px auto; padding: 0 20px; }
        
        .map-wrapper { 
            height: 350px; width: 100%; border-radius: 24px; overflow: hidden; 
            margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.1); position: relative;
        }
        #map { height: 100%; width: 100%; }
        .map-overlay { position: absolute; top: 15px; right: 15px; z-index: 1000; }
        .btn-gps { background: var(--accent); color: #000; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; }

        .form-card { background: var(--card); padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); }
        .section-title { font-size: 11px; color: var(--accent); text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 25px; display: block; border-left: 3px solid var(--accent); padding-left: 10px; }
        
        .grid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .input-box { margin-bottom: 25px; }
        .input-box label { display: block; font-size: 13px; color: #94a3b8; margin-bottom: 10px; font-weight: 500; }
        
        .input-field { 
            width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
            padding: 14px 18px; color: #fff; border-radius: 12px; box-sizing: border-box; font-size: 15px;
            transition: 0.3s;
        }
        .input-field:focus { outline: none; border-color: var(--accent); background: rgba(56, 189, 248, 0.05); }

        .btn-broadcast { 
            width: 100%; background: var(--accent); color: #000; padding: 20px; 
            border-radius: 14px; border: none; font-size: 16px; font-weight: 800; 
            cursor: pointer; transition: 0.3s; margin-top: 10px;
        }
        .btn-broadcast:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(56, 189, 248, 0.3); }

        .success-banner { background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 20px; border-radius: 16px; margin-bottom: 30px; display: flex; align-items: center; justify-content: space-between; }

        #bill-slip { display: none; }
        @media print { .main-content { display: none; } #bill-slip { display: block !important; padding: 50px; color: #000; background: #fff; } }
    </style>
</head>
<body>

    <div class="main-content">
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 36px; margin: 0;">Broadcast <span style="color:var(--accent);">Donation</span></h1>
            <p style="color:#94a3b8;">Select location and provide food details for the network.</p>
        </div>

        <?php if($status === 'success'): ?>
            <div class="success-banner">
                <div>
                    <h4 style="margin: 0; color: #10b981;">BROADCAST LIVE</h4>
                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #cbd5e1;">Your digital certificate is ready for printing.</p>
                </div>
                <button onclick="preparePrint()" style="background:#fff; border:none; padding:10px 20px; border-radius:10px; font-weight:800; cursor:pointer;">PRINT SLIP</button>
            </div>
        <?php endif; ?>

        <div class="map-wrapper">
            <div class="map-overlay">
                <button class="btn-gps" onclick="syncGPS()"><span class="material-icons">my_location</span> SYNC GPS</button>
            </div>
            <div id="map"></div>
        </div>

        <div class="form-card">
            <form method="POST" onsubmit="saveTempData()">
                <span class="section-title">Food Information</span>
                <div class="input-box">
                    <label>Item Description</label>
                    <input type="text" name="food_type" id="i_food" class="input-field" placeholder="e.g. 20 Packets of Biryani" required>
                </div>

                <div class="grid-row">
                    <div class="input-box">
                        <label>Total Quantity</label>
                        <input type="text" name="quantity" id="i_qty" class="input-field" placeholder="e.g. 10 KG" required>
                    </div>
                    <div class="input-box">
                        <label>Condition</label>
                        <select name="freshness" class="input-field">
                            <option>Freshly Cooked</option>
                            <option>Packaged / Sealed</option>
                        </select>
                    </div>
                </div>

                <span class="section-title">Logistics & Contact</span>
                
                <div class="input-box">
                    <label>Contact Number (For Volunteer Coordination)</label>
                    <input type="tel" name="phone" id="i_phone" class="input-field" placeholder="e.g. +91 98765 43210" required>
                </div>

                <div class="input-box">
                    <label>Generated GPS Navigation Link</label>
                    <input type="text" name="location" id="i_loc" class="input-field" readonly style="color:var(--accent);" placeholder="Click on the map above to set location" required>
                </div>

                <div class="input-box">
                    <label>Food Expiry Deadline</label>
                    <input type="datetime-local" name="expiry" class="input-field" required>
                </div>

                <div class="grid-row">
                    <div class="input-box">
                        <label>Availability From</label>
                        <input type="datetime-local" name="availability_from" class="input-field" required>
                    </div>
                    <div class="input-box">
                        <label>Availability To</label>
                        <input type="datetime-local" name="availability_to" class="input-field" required>
                    </div>
                </div>

                <button type="submit" class="btn-broadcast">INITIATE NETWORK BROADCAST</button>
            </form>
        </div>
    </div>

    <div id="bill-slip">
        <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:15px;">
            <h2>DONATION CERTIFICATE</h2>
        </div>
        <div style="margin-top:30px; font-size:18px;">
            <p><strong>DONOR:</strong> <?php echo $_SESSION['username']; ?></p>
            <p><strong>CONTACT:</strong> <span id="b_phone"></span></p>
            <p><strong>TX ID:</strong> <span id="b_id"></span></p>
            <p><strong>ITEM:</strong> <span id="b_food"></span></p>
            <p><strong>QTY:</strong> <span id="b_qty"></span></p>
            <p><strong>GPS:</strong> <br><span id="b_loc" style="font-size:11px;"></span></p>
        </div>
        <div style="margin-top:50px; display:flex; justify-content:space-between; align-items:flex-end;">
            <div><div style="color:#10b981; font-weight:800;">✔ DIGITALLY SIGNED</div></div>
        </div>
    </div>

    <script>
        var map = L.map('map', {zoomControl: false}).setView([9.2644, 76.5133], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
        var marker;

        map.on('click', function(e) {
            if (marker) map.removeLayer(marker);
            marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
            // Fixed the backtick string interpolation in your JS
            document.getElementById('i_loc').value = `https://www.google.com/maps?q=${e.latlng.lat},${e.latlng.lng}`;
        });

        function syncGPS() {
            navigator.geolocation.getCurrentPosition(p => {
                const lt = p.coords.latitude, lg = p.coords.longitude;
                map.flyTo([lt, lg], 17);
                if (marker) map.removeLayer(marker);
                marker = L.marker([lt, lg]).addTo(map);
                document.getElementById('i_loc').value = `https://www.google.com/maps?q=${lt},${lg}`;
            });
        }

        function saveTempData() {
            localStorage.setItem('f', document.getElementById('i_food').value);
            localStorage.setItem('q', document.getElementById('i_qty').value);
            localStorage.setItem('p', document.getElementById('i_phone').value); // Store phone
            localStorage.setItem('l', document.getElementById('i_loc').value);
            localStorage.setItem('id', 'FB-'+Date.now());
        }

        function preparePrint() {
            document.getElementById('b_food').innerText = localStorage.getItem('f');
            document.getElementById('b_qty').innerText = localStorage.getItem('q');
            document.getElementById('b_phone').innerText = localStorage.getItem('p'); // Display phone
            document.getElementById('b_loc').innerText = localStorage.getItem('l');
            document.getElementById('b_id').innerText = localStorage.getItem('id');
            window.print();
        }
    </script>
</body>
</html>