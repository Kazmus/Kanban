<?php
require __DIR__ . "/../../../../private/kanban/functions.php";
header('Content-Type: application/json');
echo json_encode(getCards());