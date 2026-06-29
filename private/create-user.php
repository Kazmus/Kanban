<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require __DIR__ . "/functions.php";
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $email = $_POST['email'] ?? '';

    $user = checkLogin($username, $password);
    if ($user) {
        $error = "Invalid username or password";
    } else { 
        addUser($username, $password);
        exit;
    }
}