<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	
	$conn = new mysqli$Server, $Username, $PW, $DB);
	
	$result = $conn->query("SELECT url, pass, registrationDate, expirationDate FROM gpass");
	
	$outp = "";
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if ($outp != "") {$outp .= ",";}
        $outp .= '{"url":"'            . $rs["url"]              . '",';
        $outp .= '"pass":"'            . $rs["pass"]             . '",';
        $outp .= '"registrationDate":"'. $rs["registrationDate"] . '",';
        $outp .= '"expirationDate":"'  . $rs["expirationDate"]   . '"}';
	}
	$conn->close();
			
	echo($outp);
?>