<?php
header('Content-Type: application/json');
require_once 'config/db_connection.php';

$nis = $_POST['nis'];
$name = $_POST['name'];
$class = $_POST['class'];
$major = $_POST['major'];
$gender = $_POST['gender'];
$address = $_POST['address'];

$query = "INSERT INTO students (nis, name, class, major, gender, address) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "ssssss", $nis, $name, $class, $major, $gender, $address);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => mysqli_error($conn)]);
}

mysqli_close($conn);
?>