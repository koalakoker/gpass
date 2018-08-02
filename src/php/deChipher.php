<?php

include_once "criptoFunc.php";
include_once "passDB_cript.php";

$password = $_POST["chipher_password"];

echo '  $Server =   "' . deChipher($Server) . '"<br>';
echo '  $Username = "' . deChipher($Username) . '"<br>';
echo '  $PW = "'       . deChipher($PW) . '"<br>';
echo '  $DB = "'       . deChipher($DB) . '"<br>';
?>