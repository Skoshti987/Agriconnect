<?php
// AgriConnect Production Authentication Handler
session_start();

$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
$dbname = getenv('DB_NAME') ?: 'agriconnect';

$conn = @mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . mysqli_connect_error()
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'login';
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $role = trim($_POST['role'] ?? 'buyer');

    if ($action === 'login') {
        $stmt = mysqli_prepare($conn, "SELECT id, username, password_hash, role, full_name FROM users WHERE username = ? OR email = ?");
        mysqli_stmt_bind_param($stmt, "ss", $username, $username);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($row = mysqli_fetch_assoc($result)) {
            if (password_verify($password, $row['password_hash'])) {
                if ($row['role'] !== $role) {
                    echo json_encode(['success' => false, 'message' => "Access denied. Account is registered as {$row['role']}."]);
                    exit;
                }
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['username'] = $row['username'];
                $_SESSION['role'] = $row['role'];

                $redirect = $row['role'] === 'seller' ? 'seller_home/Seller_page.html' : 'buyer_home/buyerHome.html';
                echo json_encode(['success' => true, 'redirect' => $redirect, 'user' => $row]);
                exit;
            }
        }
        echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
        exit;
    }
}
?>