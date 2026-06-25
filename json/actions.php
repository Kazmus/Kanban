<?php
require __DIR__ . "/../../../../private/kanban/functions.php";
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

switch ($action) {
    case 'add':
        $id = addCard($data['text'], $data['tag'], $data['status']);
        echo json_encode(['ok' => true, 'id' => $id]);
        break;
    case 'move':
        moveCard($data['id'], $data['status']);
        echo json_encode(['ok' => true]);
        break;
    case 'delete':
        deleteCard($data['id']);
        echo json_encode(['ok' => true]);
        break;
    default:
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'unknown action']);
}