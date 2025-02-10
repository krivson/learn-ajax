<?php
header('Content-Type: application/json');
require_once '../config/db_connection.php';

try {
    $query = "SELECT * FROM users ORDER BY created_at DESC";
    $result = mysqli_query($conn, $query);

    if (!$result) {
        throw new Exception(mysqli_error($conn));
    }

    $users = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = $row;
    }

    echo json_encode($users);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

mysqli_close($conn);
?>