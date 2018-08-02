<?php

include_once "criptoFunc.php";

$password = $_POST["chipher_password"];

echo '  $Server =   "' . chipher($_POST["server"]) . '";<br>';
echo '  $Username = "' . chipher($_POST["username"]) . '";<br>';
echo '  $PW = "'       . chipher($_POST["password"]) . '";<br>';
echo '  $DB = "'       . chipher($_POST["database"]) . '";<br>';
?>