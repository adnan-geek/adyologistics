<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json"); // init the session 
session_start();

// Include the database connection
$mysqli = include('../config/database.php');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jsonInput = file_get_contents('php://input');
    $data = json_decode($jsonInput, true);
    $username = $data['username'];
    $password = $data['password'];

    // Prepare and execute the query
    $stmt = $mysqli->prepare("SELECT id, password FROM admin WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->store_result();
    $testpass = password_hash($password,PASSWORD_BCRYPT);
    // Check if any row exists with given username
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();
       
        // Verify the password
        if (password_verify($password, $hashed_password)) {
            // User exists and password is correct
            $_SESSION['admin_id'] = $id;
            $response = ['success' => true];
        } else {
            // Invalid password
            global $testpass;
            $response = ['success' => false, 'message' => $hashed_password , 'userclearpass' => $password , 'usespass' => $testpass];
        } 
    } else {
        // User does not exist
        $response = ['success' => false, 'message' => 'Invalid credentials'];
    }

    $stmt->close();
    $mysqli->close();

    // Output response
    echo json_encode($response);
}
?>
