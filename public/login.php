<?php
session_start();
require __DIR__ . "/../../../../private/kanban/auth.php";
if (isset($_SESSION['user_id'])) {
    header('Location: /projects/kanban/public/index.php');
    exit;
}
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Kanban Board Login</title>
    <link rel="stylesheet" href="/projects/kanban/css/style.css" />
</head>

<body>
    <header>
        <h1>Board</h1>
        <p class="subtitle">Login</p>
        <p>Front-end : JS/Jquery - Back-end : PHP - DB : MySQL</p>
        <p>No AI was used</p>
        <p><a style="text-decoration: none; color: white;" href="https://github.com/Kazmus/Kanban/" target="_blank">GitHub Repository</a></p>
    </header>
    <main class="login-board">
        <div class="login">
            <p>This is a work in progress</p>
            <p>For visitors use username : visitor and password : 1234</p>
            <h2>Login</h2>
            <form action="login.php" method="POST">
                <input type="text" name="username" id="username" placeholder="Username" required>
                <input type="password" name="password" id="password" placeholder="Password" required>
                <button class="login-btn" type="submit">Login</button>
            </form>
        </div>
    </main>
</body>
</html>