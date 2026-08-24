<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require __DIR__ . "/functions.php";
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $email = $_POST['email'] ?? '';

    $user = checkUsername($username);
    if ($user) {
        $error = "Username already exists";
        echo $error;
    } else { 
        $password = password_hash($password, PASSWORD_DEFAULT);
        addUser($username, $password, $email);
        header('Location: /projects/kanban/index.php');
    }
}