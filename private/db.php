<?php
$servername = "91.234.194.126";
$username = "cp2627794p11_admin";
$password = "zFPxM,MT[{CgYD7O";
$dbname = "cp2627794p11_kanban";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

return $conn;
