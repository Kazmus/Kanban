<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require __DIR__ . "/functions.php";
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $user = checkLogin($username, $password);
    if ($user) {
        $_SESSION['user_id']  = $user['id'];
        $_SESSION['username'] = $user['username'];
        header('Location: /projects/kanban/index.php');
        exit;
    } else {
        $error = "Invalid username or password";
    }
}