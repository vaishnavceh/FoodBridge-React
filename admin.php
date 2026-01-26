<?php
include 'config.php';

// Strict Admin Gatekeeper
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Location: login.php');
    exit;
}

// --- ADMINISTRATIVE LOGIC ---
// 1. Reset Mission
if (isset($_GET['reset_mission'])) {
    $id = intval($_GET['reset_mission']);
    $conn->query("UPDATE donations SET status = 'available', volunteer_id = NULL WHERE id = $id");
    header("Location: admin.php?msg=mission_reset"); exit;
}

// 2. Delete User (Works for Donor, NGO, or Volunteer)
if (isset($_GET['delete_user'])) {
    $id = intval($_GET['delete_user']);
    // Extra safety: don't delete yourself
    if($id != $_SESSION['user_id']) {
        $conn->query("DELETE FROM users WHERE id = $id");
        header("Location: admin.php?msg=user_deleted"); exit;
    }
}

// 3. Delete Donation/Listing
if (isset($_GET['delete_donation'])) {
    $id = intval($_GET['delete_donation']);
    $conn->query("DELETE FROM donations WHERE id = $id");
    header("Location: admin.php?msg=donation_removed"); exit;
}

// --- DATA AGGREGATION ---
$total_users = $conn->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
$role_counts = $conn->query("SELECT role, COUNT(*) as count FROM users GROUP BY role");
$status_counts = $conn->query("SELECT status, COUNT(*) as count FROM donations GROUP BY status");

// Fetch Role-Specific Databases
$donors = $conn->query("SELECT * FROM users WHERE role = 'donor'");
$ngos = $conn->query("SELECT * FROM users WHERE role = 'ngo'");
$volunteers = $conn->query("SELECT * FROM users WHERE role = 'volunteer'");

// Fetch Logistics
$logistics_query = "SELECT d.*, u1.username as donor_name, u2.username as volunteer_name
                    FROM donations d
                    LEFT JOIN users u1 ON d.user_id = u1.id
                    LEFT JOIN users u2 ON d.volunteer_id = u2.id
                    ORDER BY d.created_at DESC";
$logistics_result = $conn->query($logistics_query);
?>
<!DOCTYPE html>
<html lang="en" class="carbon">
<head>
    <meta charset="UTF-8">
    <title>Admin Command | FoodBridge</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="templatemo-daynight-style.css">
    <style>
        :root { --accent: #f59e0b; --bg: #030712; --card: rgba(255,255,255,0.03); --border: rgba(255,255,255,0.08); }
        body { background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; display: flex; margin: 0; }
        
        .sidebar { width: 260px; height: 100vh; background: #070b14; border-right: 1px solid var(--border); position: fixed; padding: 30px 20px; display: flex; flex-direction: column; }
        .main-content { margin-left: 260px; padding: 40px; width: calc(100% - 260px); }
        
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; color: #64748b; text-decoration: none; border-radius: 12px; margin-bottom: 5px; transition: 0.3s; }
        .nav-item:hover, .nav-item.active { background: var(--card); color: var(--accent); }
        .nav-item.logout { margin-top: auto; color: #ef4444; }

        .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
        .chart-card { background: var(--card); border: 1px solid var(--border); padding: 25px; border-radius: 20px; margin-bottom: 20px; }
        
        /* Bar Graph Styles */
        .bar-row { margin-bottom: 15px; }
        .bar-label { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px; color: #94a3b8; }
        .bar-bg { background: rgba(255,255,255,0.05); height: 6px; border-radius: 10px; }
        .bar-fill { height: 100%; background: var(--accent); border-radius: 10px; transition: 1s; }

        /* Table Styles */
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { text-align: left; color: #475569; padding: 12px; border-bottom: 1px solid var(--border); font-size: 10px; text-transform: uppercase; }
        td { padding: 12px; border-bottom: 1px solid var(--border); }
        
        .status-tag { padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid currentColor; }
        .available { color: #f59e0b; } .pending { color: #38bdf8; } .completed { color: #10b981; }
        
        .action-btn { background: none; border: none; cursor: pointer; color: #475569; transition: 0.2s; }
        .action-btn:hover { color: #ef4444; }

        .role-section-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; }
    </style>
</head>
<body>

    <div class="sidebar">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:40px; padding-left:10px;">
            <span class="material-icons" style="color:var(--accent)">shield</span>
            <span style="font-weight:800; letter-spacing:1px;">ADMIN UI</span>
        </div>
        <a href="admin.php" class="nav-item active"><i class="material-icons">dashboard</i> Dashboard</a>
        <a href="index.php" class="nav-item"><i class="material-icons">visibility</i> View Website</a>
        <a href="logout.php" class="nav-item logout"><i class="material-icons">power_settings_new</i> <strong>LOGOUT</strong></a>
    </div>

    <div class="main-content">
        <header style="margin-bottom: 30px;">
            <h1 style="margin:0;">Command <span style="color:var(--accent);">Center</span></h1>
            <p style="color:#64748b;">Real-time system analytics and database management</p>
        </header>

        <div class="analytics-grid">
            <div class="chart-card">
                <h3><i class="material-icons" style="vertical-align:bottom; font-size:20px;">groups</i> User Distribution</h3>
                <div style="margin-top:20px;">
                    <?php while($r = $role_counts->fetch_assoc()): 
                        $pct = ($total_users > 0) ? ($r['count'] / $total_users) * 100 : 0; ?>
                    <div class="bar-row">
                        <div class="bar-label"><span><?php echo strtoupper($r['role']); ?></span> <span><?php echo $r['count']; ?></span></div>
                        <div class="bar-bg"><div class="bar-fill" style="width: <?php echo $pct; ?>%;"></div></div>
                    </div>
                    <?php endwhile; ?>
                </div>
            </div>

            <div class="chart-card">
                <h3><i class="material-icons" style="vertical-align:bottom; font-size:20px;">show_chart</i> Donation Lifecycle</h3>
                
                <div style="margin-top:20px;">
                    <?php 
                    $total_d = 0; $status_data = [];
                    while($s = $status_counts->fetch_assoc()) { $status_data[] = $s; $total_d += $s['count']; }
                    foreach($status_data as $s): 
                        $pct = ($total_d > 0) ? ($s['count'] / $total_d) * 100 : 0; ?>
                    <div class="bar-row">
                        <div class="bar-label"><span><?php echo strtoupper($s['status']); ?></span> <span><?php echo $s['count']; ?></span></div>
                        <div class="bar-bg"><div class="bar-fill" style="width: <?php echo $pct; ?>%; background: #38bdf8;"></div></div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <div class="chart-card">
            <h3><i class="material-icons" style="vertical-align:bottom; font-size:20px;">sync_alt</i> Live Logistics Tracker</h3>
            <table style="margin-top:15px;">
                <thead>
                    <tr><th>Food Item</th><th>Donor</th><th>Volunteer</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    <?php while($row = $logistics_result->fetch_assoc()): ?>
                    <tr>
                        <td><strong><?php echo htmlspecialchars($row['food_type']); ?></strong></td>
                        <td><?php echo htmlspecialchars($row['donor_name']); ?></td>
                        <td><?php echo $row['volunteer_name'] ?? '<span style="color:#475569;">Unassigned</span>'; ?></td>
                        <td><span class="status-tag <?php echo $row['status']; ?>"><?php echo $row['status']; ?></span></td>
                        <td>
                            <?php if($row['status'] == 'pending'): ?>
                                <a href="admin.php?reset_mission=<?php echo $row['id']; ?>" class="action-btn" title="Reset to Available" style="color:var(--accent);"><i class="material-icons">restart_alt</i></a>
                            <?php endif; ?>
                            <a href="admin.php?delete_donation=<?php echo $row['id']; ?>" class="action-btn" onclick="return confirm('Remove listing?')"><i class="material-icons">delete</i></a>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>

        <div class="role-section-grid">
            <?php 
            $sections = [
                ['title' => 'Donors', 'data' => $donors, 'icon' => 'storefront'],
                ['title' => 'NGOs', 'data' => $ngos, 'icon' => 'apartment'],
                ['title' => 'Volunteers', 'data' => $volunteers, 'icon' => 'moped']
            ];
            foreach($sections as $sec): 
            ?>
            <div class="chart-card">
                <h3 style="font-size:1rem;"><i class="material-icons" style="font-size:18px; color:var(--accent);"><?php echo $sec['icon']; ?></i> <?php echo $sec['title']; ?></h3>
                <div style="max-height: 250px; overflow-y: auto; margin-top:15px;">
                    <table>
                        <thead><tr><th>User</th><th>Email</th><th>Action</th></tr></thead>
                        <tbody>
                            <?php while($u = $sec['data']->fetch_assoc()): ?>
                            <tr>
                                <td><strong><?php echo htmlspecialchars($u['username']); ?></strong></td>
                                <td style="color:#64748b; font-size:11px;"><?php echo htmlspecialchars($u['email']); ?></td>
                                <td>
                                    <a href="admin.php?delete_user=<?php echo $u['id']; ?>" class="action-btn" onclick="return confirm('Block and delete this user?')">
                                        <i class="material-icons" style="font-size:16px;">person_remove</i>
                                    </a>
                                </td>
                            </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</body>
</html>