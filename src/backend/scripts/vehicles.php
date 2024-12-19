<?php
// Allow cross-origin requests (for your React frontend)
header("Access-Control-Allow-Origin: *");  // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allow all necessary methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow only specific headers
header('Content-Type: application/json'); // Set response type to JSON

// Include the database connection
include('../config/database.php');

// Get the request method
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Handle GET request (fetching data)
if ($requestMethod == 'GET') {
    // SQL query to fetch vehicle data along with driver name from the users table
    $sql = "SELECT v.id AS vehicle_id, v.vehicle_name, v.plate_number, v.next_oil_change, v.vehicle_image,
                   v.max_volume, v.status AS vehicle_status, v.location, 
                   u.name AS driver_name
            FROM vehicles v
            LEFT JOIN users u ON v.driver_id = u.id";

    // Execute the query
    $result = $conn->query($sql);

    // Check if the query was successful and if there are any results
    if ($result->num_rows > 0) {
        $vehicles = [];
        
        // Fetch the data and store it in an array
        while ($row = $result->fetch_assoc()) {
            $vehicles[] = $row;
        }

        // Output data as JSON
        echo json_encode($vehicles);
    } else {
        // If no vehicles were found, return an empty array
        echo json_encode([]);
    }
}
// Handle POST request (adding a new vehicle)
elseif ($requestMethod == 'POST') {
    // Check if an image file was uploaded
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $image = $_FILES['image'];

        // Define the upload directory
        $uploadDir = '../uploads/'; // Ensure this folder is writable

        // Generate a unique file name
        $imageName = time() . '_' . basename($image['name']);
        $imagePath = $uploadDir . $imageName;

        // Move the uploaded image to the folder
        if (move_uploaded_file($image['tmp_name'], $imagePath)) {
            // Get other vehicle details from the POST data
            $data = json_decode(file_get_contents('php://input'), true);

            if (isset($data['vehicle_name'], $data['plate_number'], $data['max_volume'], $data['status'], $data['location'])) {
                $vehicleName = $data['vehicle_name'];
                $plateNumber = $data['plate_number'];
                $maxVolume = $data['max_volume'];
                $status = $data['status'];
                $location = $data['location'];
                $vehicleImage = $imagePath; // Store the image path

                // SQL query to insert new vehicle into the database
                $sql = "INSERT INTO vehicles (vehicle_name, plate_number, vehicle_image, max_volume, status, location) 
                        VALUES (?, ?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ssssss", $vehicleName, $plateNumber, $vehicleImage, $maxVolume, $status, $location);

                if ($stmt->execute()) {
                    echo json_encode(["message" => "Vehicle added successfully"]);
                } else {
                    echo json_encode(["error" => "Failed to add vehicle"]);
                }
            } else {
                echo json_encode(["error" => "Missing required fields"]);
            }
        } else {
            echo json_encode(["error" => "Failed to upload image"]);
        }
    } else {
        echo json_encode(["error" => "No image file uploaded"]);
    }
}
// Handle PUT request (editing a vehicle's status)
elseif ($requestMethod == 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['id'], $data['status'])) {
        $vehicleId = $data['id'];
        $status = $data['status'];

        // SQL query to update vehicle status
        $sql = "UPDATE vehicles SET status = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $vehicleId);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Vehicle updated successfully"]);
        } else {
            echo json_encode(["error" => "Failed to update vehicle"]);
        }
    } else {
        echo json_encode(["error" => "Missing vehicle ID or status"]);
    }
}
// Handle DELETE request (deleting a vehicle)
elseif ($requestMethod == 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['id'])) {
        $vehicleId = $data['id'];

        // SQL query to delete vehicle by ID
        $sql = "DELETE FROM vehicles WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $vehicleId);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Vehicle deleted successfully"]);
        } else {
            echo json_encode(["error" => "Failed to delete vehicle"]);
        }
    } else {
        echo json_encode(["error" => "Missing vehicle ID"]);
    }
}
// If the request method is not supported
else {
    echo json_encode(["error" => "Invalid request method"]);
}

// Close the database connection
mysqli_close($conn);
?>
