<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
    
include_once "passDB_cript.php";
include_once "criptoFunc.php";

$logFile = fopen("../log/login.txt", "a");
if ($logFile) {
  fwrite($logFile, "\n\n" . date("Y-m-d H:i:s") . "\n");
}

if (!isset($_GET["chipher_password"]))
{
  if ($logFile) {
    fwrite($logFile, "Missing chipher_password!" . "\n");
    fclose($logFile);
  }
  die('{
    "error": "Missing chipher_password!",
    "logged"      : false
}');
}

if (!isset($_GET["user_name"]))
{
  if ($logFile) {
    fwrite($logFile, "Missing user_name!" . "\n");
    fclose($logFile);
  }
  die('{
    "error": "Missing user_name!",
    "logged"      : false
}');
}

if (!isset($_GET["user_password"]))
{
  if ($logFile) {
    fwrite($logFile, "Missing user_password!" . "\n");
    fclose($logFile);
  }
  die('{
    "error": "Missing user_password!",
    "logged"      : false
}');
}

$upw = $_GET["chipher_password"];
$usrName = $_GET['user_name'];
$usrPass = $_GET['user_password'];

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

if (isset($_SESSION['userName'])) {
  $prevSessionUserName = '"prevSessionUserName" : "' . $_SESSION["userName"] . '",';
}
else {
  $prevSessionUserName ='';
}

if (isset($_SESSION['userPass'])) {
  $prevSessionUserPass = '"prevSessionUserPass" : "' . $_SESSION["userPass"] . '",';
}
else {
  $prevSessionUserPass ='';
}

$decryptPass = passDecrypt($upw);
$decryptPass = hashPass($decryptPass);
$_SESSION['decryptPass'] = $decryptPass;

if ($logFile) {
  fwrite($logFile, "*** Received ***\n");
  fwrite($logFile, "UserName = "     . $usrName . "\n");
  fwrite($logFile, "UserPassword = " . $usrPass . "\n");
}

$usrName = passDecrypt($usrName);
$_SESSION['userName'] = $usrName;

$usrPass = passDecrypt($usrPass);

if ($logFile) {
  fwrite($logFile, "*** Decoded ***\n");
  fwrite($logFile, "UserName = "     . $usrName . "\n");
  fwrite($logFile, "UserPassword = " . $usrPass . "\n");
}

$usrPass = hashPass($usrPass);

if ($logFile) {
  fwrite($logFile, "*** Hash ***\n");
  fwrite($logFile, "UserPassword = " . $usrPass . "\n");
}

$_SESSION['userPass'] = $usrPass;

$Server   = deChipher($Server,  $decryptPass);
$Username = deChipher($Username,$decryptPass);
$PW       = deChipher($PW,      $decryptPass);
$DB       = deChipher($DB,      $decryptPass);

if ($Server == "")
{
  session_unset();
  session_destroy();
  die('{
      "error"  : "Wrong decrypt key. Access denied!",
      "logged" : false
    }');
}

$answer = '{' .
  $prevSession . '
  ' . $prevSessionUserName . '
  ' . $prevSessionUserPassword . '  
  "txt"         : "Login done.",
  "logged"      : true,
  "encrypted"   : "' . $_SESSION["decryptPass"] . '",
  "userName"    : "' . $_SESSION["userName"] . '",
  "userPassword": "' . $_SESSION["userPass"] . '"  
}'; 
echo($answer);

if ($logFile) {
  fwrite($logFile, "Answer = " . $answer . "\n");
  fclose($logFile);
}
?>