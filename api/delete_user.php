<?php
header('Content-Type: application/json');
require_once '../config/db_connection.php';

try {
    // Check if ID was provided
    if (!isset($_POST['id']) || empty($_POST['id'])) {
        throw new Exception("No ID provided");
    }

    $id = (int) $_POST['id'];

    // Prepare delete statement
    $query = "DELETE FROM users WHERE id = ?";
    $stmt = mysqli_prepare($conn, $query);

    if (!$stmt) {
        throw new Exception(mysqli_error($conn));
    }

    // Bind parameter
    mysqli_stmt_bind_param($stmt, "i", $id);

    // Execute the statement
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception(mysqli_error($conn));
    }

    // Check if any rows were affected
    if (mysqli_affected_rows($conn) === 0) {
        throw new Exception("User not found");
    }

    echo json_encode([
        'success' => true,
        'message' => 'User deleted successfully'
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
    mysqli_close($conn);
}