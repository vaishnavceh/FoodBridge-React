<?php
include 'config.php';

$error = "";
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT id, password, role FROM users WHERE username = ? AND role = 'admin'");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($id, $stored_password, $role);
    
    if ($stmt->fetch() && $password === $stored_password) {
        $_SESSION['user_id'] = $id;
        $_SESSION['role'] = $role;
        $_SESSION['username'] = $username; 
        header('Location: admin.php');
        exit;
    } else {
        $error = "Access Denied: Admin credentials invalid.";
    }
}
?>
<!DOCTYPE html>
<html lang="en" class="carbon">
<head>
    <meta charset="UTF-8">
    <title>Admin Access | FoodBridge</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="templatemo-daynight-style.css">
    <style>
        body.carbon { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #050505; }
        .admin-box { 
            background: rgba(20, 20, 20, 0.8); backdrop-filter: blur(20px);
            border: 1px solid rgba(251, 191, 36, 0.3); padding: 50px;
            border-radius: 32px; width: 400px; text-align: center;
        }
        .admin-input {
            width: 100%; background: #000; border: 1px solid #333;
            padding: 15px; border-radius: 12px; color: #fff; margin-bottom: 15px;
        }
        .admin-input:focus { border-color: #fbbf24; outline: none; }
    </style>
</head>
<body class="carbon">
    <div class="admin-box">
        <span class="material-icons" style="font-size: 50px; color: #fbbf24; margin-bottom: 20px;">security</span>
        <h2 style="color: #fff; margin-bottom: 30px;">Staff Portal</h2>
        <?php if($error) echo "<p style='color:#ef4444; font-size:13px; margin-bottom:15px;'>$error</p>"; ?>
        <form method="POST">
            <input type="text" name="username" class="admin-input" placeholder="Admin ID" required>
            <input type="password" name="password" class="admin-input" placeholder="Secure Key" required>
            <button type="submit" style="width:100%; padding:15px; background:#fbbf24; border:none; border-radius:12px; font-weight:800; cursor:pointer;">AUTHORIZE ACCESS</button>
        </form>
        <p style="margin-top:20px;"><a href="login.php" style="color:#555; font-size:12px; text-decoration:none;">Return to Public Login</a></p>
    </div>
</body>
</html>