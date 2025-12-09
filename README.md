# Dark Search

A modern, glassmorphism-styled search directory website built with Node.js, Express, and MySQL.

## 🚀 Features

*   **Modern UI**: Premium "Glassmorphism" design with dark mode aesthetics.
*   **Search Functionality**: Real-time search to find websites by name or description.
*   **Add Websites**: Modal interface to easily add new websites to the directory.
*   **Database Integration**: Websites are stored in a MySQL database.
*   **Duplicate Prevention**: URLs are used as unique identifiers, preventing duplicates.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js**: [Download & Install Node.js](https://nodejs.org/)
2.  **MySQL Server**: You can use **XAMPP**, WAMP, or any standalone MySQL installation.

## 📦 Installation

1.  **Open your terminal** (Command Prompt, PowerShell, or VS Code Terminal).
2.  Navigate to the project directory:
    ```bash
    cd "c:/xampp/htdocs/Dark search"
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
    This will install `express`, `mysql2`, and `body-parser`.

## 🗄️ Database Setup

### Option A: Automatic Setup (Recommended)
1.  Ensure your **MySQL Server** (XAMPP) is running.
2.  Start the Node.js server (see below).
3.   The server will automatically create the database `dark_search_db` and the `websites` table if they don't exist.

### Option B: Manual Setup
If automatic creation fails or you prefer manual control:
1.  Open **phpMyAdmin** (e.g., `http://localhost/phpmyadmin`).
2.  Import the provided SQL file:
    *   Click **Import**.
    *   Select the file: `database.sql` from the project folder.
    *   Click **Go**.

## 🚀 How to Run

1.  **Start MySQL**: Open XAMPP and click "Start" next to MySQL.
2.  **Start the Node.js Server**:
    Run the following command in your terminal:
    ```bash
    node server.js
    ```
    *You should see: "Server running at http://localhost:3000"*

3.  **Access the Website**:
    Open your browser and go to:
    [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

*   `public/`: Contains frontend files (HTML, CSS, JS).
    *   `index.html`: Main page structure.
    *   `style.css`: All styling and visual effects.
    *   `script.js`: Frontend logic (API calls, UI interactions).
*   `server.js`: Main backend entry point. Handles server setup, database connection, and API routes.
*   `database.sql`: SQL script for manual database import.

## ⚠️ Troubleshooting

*   **Error: ECONNREFUSED**: This means the Node.js server cannot connect to MySQL. Make sure XAMPP 'MySQL' module is **Running**.
*   **Duplicate Entry Error**: The system prevents adding the same URL twice.
