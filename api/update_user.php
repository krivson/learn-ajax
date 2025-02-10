<?php
header('Content-Type: application/json');
require_once '../config/db_connection.php';

try {
    // Check if all required fields are present
    $required_fields = ['id', 'name', 'email', 'phone', 'city'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty($_POST[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Sanitize and validate input
    $id = (int) $_POST['id'];
    $name = trim(mysqli_real_escape_string($conn, $_POST['name']));
    $email = trim(mysqli_real_escape_string($conn, $_POST['email']));
    $phone = trim(mysqli_real_escape_string($conn, $_POST['phone']));
    $city = trim(mysqli_real_escape_string($conn, $_POST['city']));

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // Check if email exists for other users
    $check_query = "SELECT id FROM users WHERE email = ? AND id != ?";
    $check_stmt = mysqli_prepare($conn, $check_query);
    mysqli_stmt_bind_param($check_stmt, "si", $email, $id);
    mysqli_stmt_execute($check_stmt);
    $result = mysqli_stmt_get_result($check_stmt);

    if (mysqli_num_rows($result) > 0) {
        throw new Exception("Email already exists for another user");
    }

    // Prepare the update statement
    $query = "UPDATE users SET 
              name = ?, 
              email = ?, 
              phone = ?, 
              city = ?,
              updated_at = NOW()
              WHERE id = ?";

    $stmt = mysqli_prepare($conn, $query);

    if (!$stmt) {
        throw new Exception(mysqli_error($conn));
    }

    // Bind parameters
    mysqli_stmt_bind_param(
        $stmt,
        "ssssi",
        $name,
        $email,
        $phone,
        $city,
        $id
    );

    // Execute the statement
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception(mysqli_error($conn));
    }

    // Check if any rows were affected
    if (mysqli_affected_rows($conn) === 0) {
        throw new Exception("No changes were made or user not found");
    }

    echo json_encode([
        'success' => true,
        'message' => 'User updated successfully'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) {
        mysqli_stmt_close($stmt);
    }
    if (isset($check_stmt)) {
        mysqli_stmt_close($check_stmt);
    }
    mysqli_close($conn);
}