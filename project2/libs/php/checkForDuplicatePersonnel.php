<?php
// Include necessary files and establish the database connection
include('config.php');
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    // Handle DB connection error
    echo json_encode([
        'status' => ['name' => 'failure', 'message' => 'Database connection failed'],
        'data' => ['exists' => false]
    ]);
    exit;
}

// Get data from the request
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];

// Check for duplicate personnel
$query = $conn->prepare('SELECT * FROM personnel WHERE firstName = ? AND lastName = ? AND email = ?');
$query->bind_param('sss', $firstName, $lastName, $email);
$query->execute();
$result = $query->get_result();

// Check if any personnel record matches
if ($result->num_rows > 0) {
    // Duplicate found
    echo json_encode([
        'status' => ['name' => 'ok', 'message' => 'Duplicate found'],
        'data' => ['exists' => true]
    ]);
} else {
    // No duplicate found
    echo json_encode([
        'status' => ['name' => 'ok', 'message' => 'No duplicates'],
        'data' => ['exists' => false]
    ]);
}

$conn->close();
?>
