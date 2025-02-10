<?php
header('Content-Type: application/json');
require_once 'config/db_connection.php';

try {
    // Check if all required fields are present
    $required_fields = ['id', 'nis', 'name', 'class', 'major', 'gender', 'address'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Prepare the update statement
    $query = "UPDATE students SET 
              nis = ?, 
              name = ?, 
              class = ?, 
              major = ?, 
              gender = ?, 
              address = ? 
              WHERE id = ?";

    $stmt = mysqli_prepare($conn, $query);

    if (!$stmt) {
        throw new Exception(mysqli_error($conn));
    }

    // Bind parameters
    mysqli_stmt_bind_param(
        $stmt,
        "ssssssi",
        $_POST['nis'],
        $_POST['name'],
        $_POST['class'],
        $_POST['major'],
        $_POST['gender'],
        $_POST['address'],
        $_POST['id']
    );

    // Execute the statement
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception(mysqli_error($conn));
    }

    // Check if any rows were affected
    if (mysqli_affected_rows($conn) === 0) {
        throw new Exception("No changes were made or student not found");
    }

    echo json_encode([
        'success' => true,
        'message' => 'Student updated successfully'
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