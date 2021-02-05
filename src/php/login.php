<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
    
include_once "passDB_cript.php";
include_once "criptoFunc.php";

$logFile = fopen("../log/login.txt", "w");
if ($logFile) {
  fwrite($logFile, date("Y-m-d H:i:s") . "\n");
}

if (!isset($_GET["chipher_password"]))
{
  if ($logFile) {
    fwrite($logFile, "Missing chipher_password!");
    fclose($logFile);
  }
  die('{
    "error": "Missing chipher_password!",
    "logged"      : false
}');
}

$upw = $_GET["chipher_password"];

if ($upw == "logout")
{
  session_unset();
  session_destroy();
  die ('{ "error": "Session destroyed"}');
}

if (isset($_SESSION['decryptPass'])) {
  $prevSession = '"prevSession" : "' . $_SESSION["decryptPass"] . '",';
}
else {
  $prevSession ='';
}

$decryptPass = passDecrypt($upw);
$decryptPass = hashPass($decryptPass);

if ($logFile) {
  fwrite($logFile,'upw:' . $upw . "\n");
  fwrite($logFile,'decryptPass:' . $decryptPass . "\n");
}

$_SESSION['decryptPass'] = $decryptPass;

$Server   = deChipher($Server,  $decryptPass);
$Username = deChipher($Username,$decryptPass);
$PW       = deChipher($PW,      $decryptPass);
$DB       = deChipher($DB,      $decryptPass);

if ($logFile) {
  fwrite($logFile, 'server:'   . $Server . "\n");
  fwrite($logFile, 'username:' . $Username . "\n");
  fwrite($logFile, 'password:' . $PW . "\n");
  fwrite($logFile, 'database:' . $DB . "\n");
}

if ($Server == "")
{
  session_unset();
  session_destroy();
  die('{
      "error"  : "Wrong decrypt key. Access denied!",
      "logged" : false
    }');
}

echo('{' .
  $prevSession . '  
  "txt"         : "Login done. ' . $_SESSION["decryptPass"].'",
  "logged"      : true,
  "encrypted"   : "' . $_SESSION["decryptPass"] . '"
}');

if ($logFile) {
  fclose($logFile);
}
?>