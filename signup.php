<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $role = $_POST['role'];
    $location = $_POST['location'];

    // Prepared statement to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO users (username, password, email, role, location) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $username, $password, $email, $role, $location);

    if ($stmt->execute()) {
        echo "<p>Signup successful! <a href='login.php'>Login</a></p>";
    } else {
        echo "<p>Error: " . $stmt->error . "</p>";
    }
    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup</title>
    <link rel="stylesheet" href="styles.css">
    <script src="scripts.js"></script>
</head>
<body>
    <div class="container">
        <h2>Signup</h2>
        <form id="signupForm" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <select name="role" required>
                <option value="">Select Role</option>
                <option value="donor">Donor</option>
                <option value="ngo">NGO</option>
                <option value="volunteer">Volunteer</option>
            </select>
            <input type="text" name="location" placeholder="Location (e.g., City)" required>
            <button type="submit">Signup</button>
        </form>
    </div>
</body>
</html>