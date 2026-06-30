<?php 
function connectToDB() {
    $conn = require __DIR__ . "/db.php";
    return $conn;
}

function getCards() {
    $conn = connectToDB();
    $sql = "SELECT card.id, card.text, card.tag, card.status, login.username
            FROM `card`
            JOIN `login` ON card.user_id = login.id";
    $result = mysqli_query($conn, $sql);

    $cards = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $cards[] = $row;
    }
    closeDB($conn);

    return $cards;
}

function addCard(string $text, string $tag, string $status) {
    session_start();
    $user_id = $_SESSION['user_id'];
    $conn = connectToDB();
    $stmt = mysqli_prepare($conn,
        "INSERT INTO `card` (`user_id`, `text`, `tag`, `status`) VALUES (?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "ssss", $user_id, $text, $tag, $status);
    mysqli_stmt_execute($stmt);
    $newId = mysqli_insert_id($conn);
    closeDB($conn);
    return $newId;
}

function moveCard(int $id, string $status) {
    $conn = connectToDB();
    $stmt = mysqli_prepare($conn, "UPDATE `card` SET `status` = ? WHERE `id` = ?");
    mysqli_stmt_bind_param($stmt, "si", $status, $id);
    mysqli_stmt_execute($stmt);
    closeDB($conn);
}

function deleteCard(int $id) {
    $conn = connectToDB();
    $stmt = mysqli_prepare($conn, "DELETE FROM `card` WHERE `id` = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    closeDB($conn);
}

function closeDB(mysqli $conn) {
    mysqli_close($conn);
}

function checkLogin(string $username, string $password) {
    $conn = connectToDB();
    $stmt = mysqli_prepare($conn,
        "SELECT `id`, `username`, `password`, `type` FROM `login` WHERE `username` = ?");
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($result);
    closeDB($conn);

    if (!$user) return false;

    if (password_verify($password, $user['password'])) {
        unset($user['password']);
        return $user;
    }

    return false;
}

function checkUsername(string $username) {
    $conn = connectToDB();
    $stmt = mysqli_prepare($conn,
        "SELECT `id`, `username` FROM `login` WHERE `username` = ?");
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($result);
    closeDB($conn);

    if (!$user) return false;

    return true;
}

function addUser(string $username, string $password, string $email) {
    $defaultType = "user";
    $conn = connectToDB();
    $stmt = mysqli_prepare($conn,
        "INSERT INTO `login` (`username`, `password`, `email`, `type`) VALUES (?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "ssss", $username, $password, $email, $defaultType);
    mysqli_stmt_execute($stmt);
    closeDB($conn);
}

function getUsers() {
    $conn = connectToDB();
    $sql = "SELECT login.id, login.username, login.email, login.type FROM `login`";
    $result = mysqli_query($conn, $sql);

    $users = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = $row;
    }
    closeDB($conn);

    return $users;
}

function deleteUser(string $username) {
    $conn = connectToDB();
    $stmt = mysqli_prepare($conn, "DELETE FROM `login` WHERE `username` = ?");
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    closeDB($conn);
}

function var_dumpj($d, $e = null) {
    echo "<pre><code>";
    if($e == "e") {
        echo $d;
    } else {
        if(is_array($d)) {
        print_r($d);
        } else {
        var_dump($d);
        }      
    }
    echo "</code></pre>";
}