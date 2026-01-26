<?php
include 'config.php';
session_start();

if (isset($_GET['id']) && isset($_SESSION['user_id'])) {
    $id = intval($_GET['id']);
    $user_id = $_SESSION['user_id'];

    // Update status to 'pending' so it stays on the volunteer's board
    $stmt = $conn->prepare("UPDATE donations SET volunteer_id = ?, status = 'pending' WHERE id = ? AND status = 'available'");
    $stmt->bind_param("ii", $user_id, $id);
    
    if ($stmt->execute()) {
        header("Location: volunteer_tasks.php?msg=claimed");
    } else {
        echo "Error: " . $conn->error;
    }
}
?>