<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
    
include_once "passDB_cript.php";
include_once "criptoFunc.php";

$logFile = fopen("../log/email.txt", "a");
if ($logFile) {
  fwrite($logFile, "-----------------------------------------------------------------------------\n");
  fwrite($logFile, date("Y-m-d H:i:s") . "\n");

  fwrite($logFile, "Params:\n");
  foreach ($_GET as $key => $value) {
    fwrite($logFile, "['" . $key . "']='" . $value . "'");
  }
  fwrite($logFile,"\n");
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

$chipher_password = $_GET["chipher_password"];
$user_name = $_GET['user_name'];
$user_password = $_GET['user_password'];

if ($logFile) {
  fwrite($logFile, "*** Received ***\n");
  fwrite($logFile, "UserName = "     . $user_name . "\n");
  fwrite($logFile, "UserPassword = " . $user_password . "\n");
}

$inputList = array('chipher_password' => $chipher_password,'user_name' => $user_name,'user_password' => $user_password );
$outputList = passDecrypt_oneMonth($inputList);

$decryptPass = $outputList['chipher_password'];
$user_name = $outputList['user_name'];
$user_password = $outputList['user_password'];

if ($logFile) {
  fwrite($logFile, "*** Decoded ***\n");
  fwrite($logFile, "UserName = "     . $user_name . "\n");
  fwrite($logFile, "UserPassword = " . $user_password . "\n");
}

$decryptPass = hashPass($decryptPass);
$user_password = hashPass($user_password);

if ($logFile) {
  fwrite($logFile, "*** Hash ***\n");
  fwrite($logFile, "UserPassword = " . $user_password . "\n");
}

$Server   = deChipher($Server,  $decryptPass);
$Username = deChipher($Username,$decryptPass);
$PW       = deChipher($PW,      $decryptPass);
$DB       = deChipher($DB,      $decryptPass);

if ($Server == "")
{
  die('{
      "error"  : "Wrong decrypt key. Access denied!",
      "logged" : false
    }');
}

$answer = '{
  "txt"         : "Login done.",
  "logged"      : true
}'; 
echo($answer);

$to = 'koalakoker@gmail.com';
$subject = 'Birthday Reminders for August';

$message = '
<html>
<head>
  <title>Invitation to GPass service</title>
</head>
<body>
  <p>GPass admins invite you to join to the service. Click the following link you will admit to use GPass</p>
  <a href="' . $_GET["returnurl"] . '">link</a>
</body>
</html> 
';

// To send HTML mail, the Content-type header must be set
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=iso-8859-1';

// Additional headers
$headers[] = 'To: Koala <koalakoker@gmail.com>';
$headers[] = 'From: GPass Admin <admin@koalakoker.com>';

// Mail it
mail($to, $subject, $message, implode("\r\n", $headers));

$emailFile = fopen("../log/email.html", "w");
if ($emailFile) {
  fwrite($emailFile, $message);
  fclose($emailFile);
}

if ($logFile) {
  fwrite($logFile, "Answer = " . $answer . "\n");
  fwrite($logFile, "#############################################################################\n");
  fclose($logFile);
}

?>