<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow these methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow headers
header("Content-Type: application/json; charset=UTF-8"); // Ensure JSON response format


// Include database connection
include('../config/database.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET request - Fetch all shipments
    $sql = "SELECT * FROM shipments";
    $result = $conn->query($sql);

    $shipments = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $shipments[] = $row;
        }
    }

    echo json_encode($shipments);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle POST request - Insert a new shipment
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate input
    if (
        isset($data['sender'], $data['receiver'], $data['status'], $data['shippingDate'], 
              $data['expectedDelivery'], $data['location'], 
              $data['weight'], $data['dimensions'], $data['shippingCost'], 
              $data['paymentStatus'], $data['deliveryType'], $data['contact'], 
              $data['deliveryAttempts'])
    ) {
        // Prepare SQL statement
        //  generate the tracking number 
        // Function to generate tracking number
                function generateTrackingNumber($conn) {
                    // Get the latest shipment ID (this ensures uniqueness based on shipment order)
                    $sql = "SELECT MAX(id) AS last_id FROM shipments";
                    $id_result = $conn->query($sql);
                    $last_id = 0; // Default value in case the table is empty

                    if ($id_result && $row = $id_result->fetch_assoc()) {
                        $last_id = $row['last_id'] ?: 0; // If NULL, set to 0
                    }

                    // Increment the ID for the new shipment
                    $new_id = $last_id + 1;

                    // Format the new tracking number
                    $prefix = "TRK";
                    $id_part = str_pad($new_id, 6, "0", STR_PAD_LEFT); // Padded to 6 digits
                    $date_part = date("Ymd"); // Current date in YYYYMMDD format

                    // Combine to form the full tracking number
                    $tracking_number = $prefix . $id_part . $date_part;

                    return $tracking_number;
                }

        $data['trackingNumber'] = generateTrackingNumber($conn);
        $query = "INSERT INTO shipments (sender, receiver, status, shippingDate, expectedDelivery, location, trackingNumber, weight, dimensions, shippingCost, paymentStatus, deliveryType, contact, deliveryAttempts) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
       
       $stmt = $conn->prepare($query);
        // Bind parameters
        $stmt->bind_param(
            "ssssssssssssss", 
            $data['sender'], $data['receiver'], $data['status'], $data['shippingDate'], 
            $data['expectedDelivery'], $data['location'], $data['trackingNumber'], 
            $data['weight'], $data['dimensions'], $data['shippingCost'], 
            $data['paymentStatus'], $data['deliveryType'], $data['contact'], 
            $data['deliveryAttempts']
        );
       
        // Execute statement
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Shipment added successfully.']);
        } else {
            echo json_encode(['error' => 'Failed to add shipment: ' . $stmt->error]);
        }

        $stmt->close();
    } else {
        // Handle missing fields
        echo json_encode(['error' => 'Missing required fields.']);
    }
}

// Close the database connection
$conn->close();
?>
