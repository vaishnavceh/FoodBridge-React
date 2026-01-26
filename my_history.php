<?php
include 'config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'volunteer') {
    header('Location: login.php');
    exit;
}

$user_id = $_SESSION['user_id'];

// Logic: Fetch donations where this volunteer was the one who fulfilled/transported it
// Note: You may need a 'volunteer_id' column in your donations table for this.
$query = "SELECT d.*, u.username as donor_name 
          FROM donations d 
          JOIN users u ON d.user_id = u.id 
          WHERE d.volunteer_id = ? 
          AND d.status = 'completed' 
          ORDER BY d.updated_at DESC";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Service History | FoodBridge</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="templatemo-daynight-style.css">
    <style>
        :root { --accent: #f59e0b; --bg: #030712; }
        body { background: var(--bg); color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; }
        .history-table { width: 100%; border-collapse: collapse; margin-top: 30px; background: rgba(255,255,255,0.02); border-radius: 15px; overflow: hidden; }
        .history-table th { text-align: left; padding: 20px; background: rgba(255,255,255,0.05); color: var(--accent); }
        .history-table td { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .status-pill { background: #10b981; color: #000; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; }
    </style>
</head>
<body>
    <div style="max-width: 1000px; margin: 0 auto;">
        <header style="display: flex; justify-content: space-between; align-items: center;">
            <h1 style="margin:0;">Service <span style="color:var(--accent)">History</span></h1>
            <a href="dashboard.php" style="color:#fff; text-decoration:none;">Back to Dashboard</a>
        </header>

        <table class="history-table">
            <thead>
                <tr>
                    <th>Mission Date</th>
                    <th>Item</th>
                    <th>Donor</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($result->num_rows > 0): ?>
                    <?php while($row = $result->fetch_assoc()): ?>
                        <tr>
                            <td><?php echo date('d M Y', strtotime($row['updated_at'])); ?></td>
                            <td><strong><?php echo htmlspecialchars($row['food_type']); ?></strong></td>
                            <td><?php echo htmlspecialchars($row['donor_name']); ?></td>
                            <td><span class="status-pill">COMPLETED</span></td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="4" style="text-align:center; color:#64748b;">You haven't completed any missions yet.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</body>
</html>