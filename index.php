<?php
session_start();
require __DIR__ . "/../../../private/kanban/create-user.php";
if (!isset($_SESSION['user_id'])) {
    header('Location: /projects/kanban/public/login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Kanban Board</title>
  <link rel="stylesheet" href="/projects/kanban/css/style.css" />
</head>
<body>
  <header>
    <h1>Board</h1>
    <p class="subtitle">Drag cards between columns</p>
    <a class="disconnect-btn" href="/projects/kanban/public/disconnect.php">Disconnect</a>
  </header>

  <main>
    <section class="board" id="board">
      <div class="column" data-col="todo">
        <div class="col-header">
          <span class="col-dot dot-todo"></span>
          <h2>To Do</h2>
          <span class="col-count">0</span>
        </div>
        <div class="cards" id="col-todo"></div>
        <button class="add-btn" data-col="todo">+ Add card</button>
      </div>

      <div class="column" data-col="inprogress">
        <div class="col-header">
          <span class="col-dot dot-inprogress"></span>
          <h2>In Progress</h2>
          <span class="col-count">0</span>
        </div>
        <div class="cards" id="col-inprogress"></div>
        <button class="add-btn" data-col="inprogress">+ Add card</button>
      </div>

      <div class="column" data-col="done">
        <div class="col-header">
          <span class="col-dot dot-done"></span>
          <h2>Done</h2>
          <span class="col-count">0</span>
        </div>
        <div class="cards" id="col-done"></div>
        <button class="add-btn" data-col="done">+ Add card</button>
      </div>
    </section>
    <?php 
    if ($_SESSION['type'] == "admin") {
    ?>
    <section id="Administration">
      <div class="administration-board">
        <h2>Administration</h2>
        <p class="subtitle">Create new users</p>
      </div>
      <div class="admin-container">
        <div class="create-user">
          <form action="index.php" method="POST">
              <input type="text" name="username" id="username" placeholder="Username" required>
              <input type="password" name="password" id="password" placeholder="Password" required>
              <input type="email" name="email" id="email" placeholder="Email" required>
              <button class="create-user-btn" type="submit">Add user</button>
          </form>
        </div>

        <table class="display-users">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Type</th>
          </tr>
          <?php
          $users = require __DIR__ . "/public/get-users.php"; 
          foreach ($users as $key => $value) {
          ?>
            <tr>
              <td><?php echo $value['username']; ?></td>
              <td><?php echo $value['email']; ?></td>
              <td><?php echo $value['type']; ?></td>
            </tr>
          <?php
          }
          ?>
        </table>
      </div>
    </section>
    <?php
    }
    ?>
    
  </main>

  <!-- Add card modal -->
  <div class="modal-overlay" id="modal-overlay">
    <div class="modal">
      <h3>New card</h3>
      <input type="text" id="card-input" placeholder="What needs to be done?" maxlength="80" />
      <div class="tag-row">
        <span class="tag-label">Tag:</span>
        <button class="tag-btn active" data-tag="none" style="--tag:#4a4a6a">None</button>
        <button class="tag-btn" data-tag="design" style="--tag:#7c6af7">Design</button>
        <button class="tag-btn" data-tag="dev" style="--tag:#3ecfcf">Dev</button>
        <button class="tag-btn" data-tag="bug" style="--tag:#f76a6a">Bug</button>
      </div>
      <div class="modal-actions">
        <button id="modal-cancel">Cancel</button>
        <button id="modal-confirm">Add</button>
      </div>
    </div>
  </div>

  <script>const currentUser = <?= json_encode($_SESSION['username'] ?? '') ?>;</script>
  <script src="/projects/kanban/js/jquery-4.0.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
  <script src="/projects/kanban/js/main.js"></script>
</body>
</html>