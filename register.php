<?php
include 'config.php';

$message = ""; 
$message_type = ""; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $role = $_POST['role'];
    $location = trim($_POST['location']);

    // 1. Validation: Ensure passwords match
    if ($password !== $confirm_password) {
        $message = "Passwords do not match.";
        $message_type = "danger";
    } else {
        // 2. Check for existing user
        $check = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $check->bind_param("ss", $username, $email);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            $message = "Username or Email already registered.";
            $message_type = "danger";
        } else {
            // 3. Insert user using PLAIN TEXT password
            $stmt = $conn->prepare("INSERT INTO users (username, password, email, role, location) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $username, $password, $email, $role, $location);

            if ($stmt->execute()) {
                $message = "Registration successful! Redirecting to login...";
                $message_type = "success";
                // Redirect after 2 seconds to the login page
                header("refresh:2;url=login.php");
            } else {
                $message = "Registration failed. Please try again.";
                $message_type = "danger";
            }
            $stmt->close();
        }
        $check->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en" class="carbon">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Join FoodBridge | Secure Registration</title>
    
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="templatemo-daynight-style.css">
    
    <style>
        :root {
            --card-width: 550px;
        }

        body.carbon {
            background: #0a0a0a; /* Pure black base */
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            overflow-x: hidden;
        }

        /* Ambient Background Glows */
        .glow {
            position: fixed;
            width: 400px;
            height: 400px;
            background: var(--accent-light);
            filter: blur(120px);
            border-radius: 50%;
            z-index: -1;
            opacity: 0.4;
        }

        .auth-container {
            width: 100%;
            max-width: var(--card-width);
            padding: 20px;
            box-sizing: border-box;
        }

        .register-card {
            background: rgba(31, 31, 31, 0.8); /* Semi-transparent */
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 25px;
        }

        .full-width { grid-column: span 2; }

        .input-wrapper {
            position: relative;
        }

        .input-wrapper .material-icons {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            font-size: 20px;
            pointer-events: none;
            transition: var(--transition);
        }

        .input-wrapper input, .input-wrapper select {
            width: 100%;
            background: rgba(0, 0, 0, 0.2) !important;
            border: 1px solid var(--border-color);
            padding: 14px 14px 14px 48px !important;
            border-radius: 12px;
            color: #fff;
            font-size: 15px;
            transition: all 0.3s ease;
        }

        .input-wrapper input:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 4px var(--accent-light);
            background: rgba(0, 0, 0, 0.4) !important;
        }

        .input-wrapper input:focus + .material-icons {
            color: var(--accent);
        }

        .register-btn {
            width: 100%;
            background: var(--accent);
            color: #000;
            border: none;
            padding: 16px;
            border-radius: 14px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 30px;
            transition: var(--transition);
        }

        .register-btn:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
            box-shadow: 0 10px 20px rgba(56, 189, 248, 0.3);
        }

        /* Mobile Fix */
        @media (max-width: 500px) {
            .form-grid { grid-template-columns: 1fr; }
            .full-width { grid-column: span 1; }
            .register-card { padding: 25px; }
        }
    </style>
</head>
<body class="carbon">
    <div class="glow" style="top: -10%; right: -10%;"></div>
    <div class="glow" style="bottom: -10%; left: -10%; background: #22c55e22;"></div>

    <div class="auth-container">
        <div class="register-card">
            <header style="text-align: center;">
                <div style="display: inline-flex; padding: 12px; background: var(--accent-light); border-radius: 16px; margin-bottom: 15px;">
                    <span class="material-icons" style="color: var(--accent); font-size: 32px;">how_to_reg</span>
                </div>
                <h1 style="font-size: 24px; margin-bottom: 8px; color: #fff;">Create Account</h1>
                <p style="color: var(--text-secondary); font-size: 14px;">Be a hero, join the FoodBridge community.</p>
            </header>

            <?php if($message): ?>
                <div class="alert" style="background: rgba(<?php echo $message_type == 'success' ? '34, 197, 94' : '239, 68, 68'; ?>, 0.1); color: var(--<?php echo $message_type == 'success' ? 'success' : 'danger'; ?>); padding: 12px; border-radius: 10px; margin-top: 20px; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                    <span class="material-icons" style="font-size: 18px;">
                        <?php echo $message_type == 'success' ? 'check_circle' : 'error_outline'; ?>
                    </span> 
                    <?php echo $message; ?>
                </div>
            <?php endif; ?>

            <form action="register.php" method="POST">
                <div class="form-grid">
                    <div class="input-wrapper">
                        <span class="material-icons">person_outline</span>
                        <input type="text" name="username" placeholder="Username" required>
                    </div>

                    <div class="input-wrapper">
                        <span class="material-icons">mail_outline</span>
                        <input type="email" name="email" placeholder="Email" required>
                    </div>

                    <div class="input-wrapper full-width">
                        <span class="material-icons">assignment_ind</span>
                        <select name="role" required>
                            <option value="" disabled selected>Choose your role</option>
                            <option value="donor">Food Donor</option>
                            <option value="ngo">NGO Recipient</option>
                            <option value="volunteer">Volunteer Delivery</option>
                        </select>
                    </div>

                    <div class="input-wrapper full-width">
                        <span class="material-icons">map</span>
                        <input type="text" name="location" placeholder="Your City / Area" required>
                    </div>

                    <div class="input-wrapper">
                        <span class="material-icons">lock_outline</span>
                        <input type="password" name="password" placeholder="Password" required>
                    </div>

                    <div class="input-wrapper">
                        <span class="material-icons">shield</span>
                        <input type="password" name="confirm_password" placeholder="Confirm" required>
                    </div>
                </div>

                <button type="submit" class="register-btn">
                    Register Account <span class="material-icons">arrow_forward</span>
                </button>
            </form>

            <footer style="margin-top: 30px; text-align: center; font-size: 14px;">
                <span style="color: var(--text-secondary);">Already have an account?</span>
                <a href="login.php" style="color: var(--accent); text-decoration: none; font-weight: 600; margin-left: 5px;">Sign In</a>
            </footer>
        </div>
    </div>

    <script src="templatemo-daynight-script.js"></script>
</body>
</html>