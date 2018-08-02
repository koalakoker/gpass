<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	
    $conn = new mysqli($Server, $Username, $PW, $DB);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
	
    $result = $conn->query("CREATE TABLE gpass (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
        url VARCHAR(30) NOT NULL,
        pass VARCHAR(30) NOT NULL,
        registrationDate VARCHAR(30) NOT NULL,
        expirationDate VARCHAR(30) NOT NULL
    )
    ");

    if ($result === TRUE) {
        echo "Table created successfully";
    } else {
        echo "Error creating table: " . $conn->error;
    }
	
	$conn->close();
?>