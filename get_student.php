<?php
header('Content-Type: application/json');
require_once 'config/db_connection.php';

try {
    if (!isset($_GET['id'])) {
        throw new Exception('No ID provided');
    }

    $id = $_GET['id'];
    $query = "SELECT * FROM students WHERE id = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $id);

    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception(mysqli_error($conn));
    }

    $result = mysqli_stmt_get_result($stmt);
    $student = mysqli_fetch_assoc($result);

    if (!$student) {
        throw new Exception('Student not found');
    }

    echo json_encode($student);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

mysqli_close($conn);
?>