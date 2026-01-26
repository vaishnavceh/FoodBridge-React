<?php
include 'config.php';
session_start();

if (!isset($_SESSION['user_id']) || !isset($_GET['id'])) {
    header('Location: browse.php'); exit;
}

$donation_id = $_GET['id'];
$user_id = $_SESSION['user_id'];

// ATOMIC UPDATE: Check status = 'available' within the update to ensure concurrency safety
$stmt = $conn->prepare("UPDATE donations SET status = 'claimed', claimed_by = ? WHERE id = ? AND status = 'available'");
$stmt->bind_param("ii", $user_id, $donation_id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    header('Location: browse.php?res=secured');
} else {
    // If affected_rows is 0, it means someone else already changed the status to 'claimed'
    header('Location: browse.php?res=already_taken');
}
$stmt->close();
?>