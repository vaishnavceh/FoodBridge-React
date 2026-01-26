<?php
include 'config.php';
if (!isset($_SESSION['user_id']) || ($_SESSION['role'] != 'ngo' && $_SESSION['role'] != 'volunteer')) {
    header('Location: login.php');
    exit;
}

if (isset($_GET['donation_id'])) {
    $donation_id = $_GET['donation_id'];
    $requester_id = $_SESSION['user_id'];

    // Insert request
    $stmt = $conn->prepare("INSERT INTO requests (donation_id, requester_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $donation_id, $requester_id);
    $stmt->execute();
    $stmt->close();

    // Update donation status
    $update_stmt = $conn->prepare("UPDATE donations SET status = 'requested' WHERE id = ?");
    $update_stmt->bind_param("i", $donation_id);
    $update_stmt->execute();
    $update_stmt->close();

    header('Location: dashboard.php');
    exit;
} else {
    echo "<p>Invalid request.</p>";
}
?>