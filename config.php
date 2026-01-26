<?php
// Database configuration
$host = 'localhost';
$db = 'food_donation';
$user = 'root';
$pass = ''; // Default for XAMPP

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Start session for authentication
session_start();
?>