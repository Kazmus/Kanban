<?php
session_start();
$_SESSION['user_id']  = null;
$_SESSION['username'] = null;
header('Location: /projects/kanban/public/login.php');