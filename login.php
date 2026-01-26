<?php
include 'config.php';

$error = "";

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    // Updated Query: Allowing 'donor', 'ngo', and 'volunteer'
    // excluding 'admin' as they have a separate portal
    $stmt = $conn->prepare("SELECT id, password, role FROM users WHERE username = ? AND role IN ('donor', 'ngo', 'volunteer')");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $stored_password, $role);
        $stmt->fetch();

        // Use password_verify if you've hashed them, 
        // or keep direct comparison if using plain text (not recommended for production)
        if ($password === $stored_password || password_verify($password, $stored_password)) {
            $_SESSION['user_id'] = $id;
            $_SESSION['role'] = $role;
            $_SESSION['username'] = $username; 
            
            header('Location: dashboard.php');
            exit;
        } else {
            $error = "Invalid credentials. Please try again.";
        }
    } else {
        $error = "Access denied or account does not exist.";
    }
    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="en" class="carbon">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Login | FoodBridge</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="templatemo-daynight-style.css">
    <style>
        body.carbon { background: #0a0a0a; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .ambient-glow { position: fixed; width: 500px; height: 500px; background: rgba(56, 189, 248, 0.1); filter: blur(140px); border-radius: 50%; z-index: -1; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.3; }
        .login-card { width: 100%; max-width: 420px; background: rgba(30, 30, 30, 0.7); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 28px; padding: 50px 40px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
        .input-wrapper { position: relative; margin-bottom: 20px; }
        .input-wrapper .material-icons { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 20px; }
        .input-wrapper input { width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255,255,255,0.1); padding: 16px 16px 16px 48px; border-radius: 14px; color: #fff; font-size: 16px; outline: none; transition: 0.3s; }
        .input-wrapper input:focus { border-color: #38bdf8; box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1); }
        .login-btn { width: 100%; background: #38bdf8; color: #000; border: none; padding: 16px; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 25px; transition: 0.3s; }
        .login-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(56, 189, 248, 0.3); }
        .error-msg { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 12px; border-radius: 10px; font-size: 14px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
    </style>
</head>
<body class="carbon">
    <div class="ambient-glow"></div>
    <div class="login-card">
        <header style="text-align: center; margin-bottom: 35px;">
            <div style="display: inline-flex; padding: 14px; background: rgba(56, 189, 248, 0.1); border-radius: 18px; margin-bottom: 20px;">
                <span class="material-icons" style="color: #38bdf8; font-size: 36px;">vpn_key</span>
            </div>
            <h1 style="font-size: 26px; color: #fff; margin: 0;">System Login</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">NGO | Donor | Volunteer Access</p>
        </header>

        <?php if($error): ?>
            <div class="error-msg">
                <span class="material-icons" style="font-size: 18px;">error_outline</span>
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <form action="login.php" method="POST">
            <div class="input-wrapper">
                <span class="material-icons">person</span>
                <input type="text" name="username" placeholder="Username" required>
            </div>
            <div class="input-wrapper">
                <span class="material-icons">lock</span>
                <input type="password" name="password" placeholder="Password" required>
            </div>
            <button type="submit" class="login-btn">
                Authorize <span class="material-icons">arrow_forward</span>
            </button>
        </form>

        <footer style="margin-top: 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 25px;">
            <p style="color: #64748b; font-size: 14px;">
                Need an account? <a href="register.php" style="color: #38bdf8; text-decoration: none; font-weight: 600;">Register Here</a>
            </p>
            <a href="admin_login.php" style="color: rgba(255,255,255,0.2); font-size: 10px; text-decoration: none; text-transform: uppercase; margin-top: 15px; display: block;">Administrative Portal</a>
        </footer>
    </div>
</body>
</html>