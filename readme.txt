# Kanban Board

URL : https://mauriziodev.be/projects/kanban/index.php

A simple, self-hosted Kanban board with drag-and-drop cards, user accounts, and an admin panel — built with vanilla PHP, jQuery, and MySQL.

**Stack:** Front-end: JS/jQuery · Back-end: PHP · Database: MySQL

## Features

- 🔐 **User accounts** — login/logout with hashed passwords (`password_hash` / `password_verify`)
- 🗂️ **Three-column board** — To Do, In Progress, Done
- 🖱️ **Drag-and-drop** cards between columns and within a column, powered by [SortableJS](https://github.com/SortableJS/Sortable)
- 🏷️ **Tags** — label cards as Design, Dev, Bug, or None, each with its own color
- ➕ **Add / delete cards** via a modal, with the creating user's name shown on the card
- 👑 **Admin panel** — visible only to users with the `admin` role; create new users and delete existing ones
- 🧾 Card and user data is persisted in MySQL and loaded/saved through a small JSON API

## Project Structure

```
Kanban/
├── index.php              # Main board page (requires login)
├── css/
│   └── style.css          # Styling for board, cards, modal, login page
├── js/
│   ├── main.js             # Board rendering, drag-and-drop, add/delete card logic
│   └── jquery-4.0.0.min.js
├── json/
│   ├── data-cards.php      # GET-style endpoint returning all cards as JSON
│   └── actions.php         # POST endpoint handling add/move/delete-card and delete-user actions
├── public/
│   ├── login.php           # Login form
│   ├── disconnect.php      # Logs the user out
│   └── get-users.php       # Returns all users (used by the admin panel)
└── private/                # Not web-accessible directly; core backend logic
    ├── config.php           # Database credentials (gitignored — you must create this)
    ├── db.php                # Opens the MySQL connection using config.php
    ├── functions.php         # All DB logic: cards, users, login, prepared statements
    ├── auth.php               # Handles login form submission
    └── create-user.php        # Handles admin "add user" form submission
```

## Requirements

- PHP 7.4+ (uses `mysqli`, `password_hash`)
- MySQL / MariaDB
- A web server (Apache/Nginx) with PHP support, or PHP's built-in server for local testing

## Database Setup

Create a database and a `login` table and a `card` table matching what `functions.php` expects:

```sql
CREATE TABLE login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'user'
);

CREATE TABLE card (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    text VARCHAR(80) NOT NULL,
    tag VARCHAR(20) NOT NULL DEFAULT 'none',
    status VARCHAR(20) NOT NULL DEFAULT 'todo',
    FOREIGN KEY (user_id) REFERENCES login(id)
);
```

Create at least one `admin` user manually (via `private/create-user.php` logic, then update their `type` to `admin` in the database) so you can access the admin panel and create further users from the UI.

## Configuration

`private/config.php` is **not committed to the repository** (see `.gitignore`) and must be created manually on each environment:

```php
<?php
$servername = "your-db-host";
$username   = "your-db-username";
$password   = "your-db-password";
$dbname     = "your-db-name";
?>
```

> ⚠️ Never commit this file. Keep real credentials out of version control.

## Running Locally

1. Clone the repository.
2. Create `private/config.php` as described above.
3. Set up the database and tables (see [Database Setup](#database-setup)).
4. Serve the project through a PHP-enabled web server, for example:
   ```bash
   php -S localhost:8000
   ```
5. Visit `http://localhost:8000/public/login.php` and log in.

## Usage

- **Login** with an existing account.
- **Add a card** with the `+ Add card` button in any column, optionally tagging it.
- **Drag cards** between columns to update their status — this is saved automatically.
- **Delete a card** with the ✕ button on the card.
- **Admins** additionally see an Administration panel on the board to create and delete user accounts.

## Security Notes

- Passwords are hashed with `password_hash()` before storage and checked with `password_verify()`.
- All SQL queries use prepared statements (`mysqli_prepare` + `mysqli_stmt_bind_param`) to prevent SQL injection.
- User-supplied data (usernames, emails, card text) is escaped with `htmlspecialchars()` on output to prevent XSS.
- Database credentials are kept out of version control via `.gitignore`.

## Roadmap / Known Limitations

- No CSRF protection on forms yet.
- No email validation on user creation.
- This is a work in progress — see in-app note on the login page.

## License

No license specified yet.