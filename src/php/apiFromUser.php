<?php
include_once "config.php";
include_once "passDB_cript.php";
include_once "criptoFunc.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: x-requested-with, Content-Type, origin, authorization, accept, client-security-token");
header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isConfigForTesting()) {
  $logFile = fopen("../log/apiFromUser.txt", "a");
}

if ($logFile) {
  fwrite($logFile, "-----------------------------------------------------------------------------\n");
  fwrite($logFile, date("Y-m-d H:i:s") . "\n");
  fwrite($logFile, "session decryptPass:". $_SESSION['decryptPass'] . "\n");
  fwrite($logFile, "get chipher_password:"    . $_GET['chipher_password'] . "\n");
}

if (isset($_SESSION['decryptPass'])) {
  $decryptPass = $_SESSION['decryptPass'];
} else {
  if (isset($_GET["chipher_password"])) {
    $decryptPass = $_GET["chipher_password"];
  } else {
    if ($logFile) {
      fwrite($logFile, "Missing decrypt key!");
    }
    die();
  }
}

if (isset($_SESSION['userid'])) {
  $userid = $_SESSION['userid'];
} else {
  if (isset($_GET["userid"])) {
    $userid = $_GET["userid"];
  } else {
    if ($logFile) {
      fwrite($logFile, "Missing userid!");
    }
    die();
  }
}

$Server   = deChipher($Server,  $decryptPass);
$Username = deChipher($Username,$decryptPass);
$PW       = deChipher($PW,      $decryptPass);
$DB       = deChipher($DB,      $decryptPass);

if ($Server == "")
{
  session_unset();
  session_destroy();
  if ($logFile) {
      fwrite($logFile, "Wrong decrypt key. Access denied!");
    }
  die();
}

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);
 
// connect to the mysql database
$link = mysqli_connect($Server, $Username, $PW, $DB);
mysqli_set_charset($link,'utf8');
 
// retrieve the table and key from the path
$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
$key = array_shift($request)+0;

// build the SET part of the SQL command
$set = '';
if ($input)
{
  // escape the columns and values from the input object
  $columns = preg_replace('/[^a-z0-9_]+/i','',array_keys($input));
  $values = array_map(function ($value) use ($link) {
  if ($value===null) return null;
  return mysqli_real_escape_string($link,(string)$value);
  },array_values($input));

  for ($i=0;$i<count($columns);$i++) {
    $set.=($i>0?',':'').'`'.$columns[$i].'`=';
    $set.=($values[$i]===null?'NULL':'"'.$values[$i].'"');
  }
}
 
// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    $sql = "select * from `$table` WHERE userid=" . $userid;
    break;
  case 'PUT':
    $sql = "update `$table` set $set where id=$key";
    break;
  case 'POST':
    $sql = "insert into `$table` set $set"; 
    break;
  case 'DELETE':
    $sql = "delete from `$table` where id=$key"; 
    break;
  default:
    break;
}
 
if ($sql) {

  if ($logFile) {
    fwrite($logFile, "sql:"    . $sql . "\n");
  }

  // excecute SQL statement
  $result = mysqli_query($link,$sql);

  // die if SQL statement failed
  if (!$result) {
    session_unset();
    session_destroy();
    die("MySQL error");
  }
  
  // print results, insert id or affected row count
  $answer = "";

  if ($method == 'GET') {
    if (!$key) {
      $answer .= '[';
    }
    for ($i = 0; $i < mysqli_num_rows($result); $i++) {
      $answer .= ($i > 0 ? ',' : '');
      $answer .= json_encode(mysqli_fetch_object($result));
    }
    if (!$key) {
      $answer .= ']';
    }
  } elseif ($method == 'POST') {
    $answer .= mysqli_insert_id($link);
  } else {
    $answer .= mysqli_affected_rows($link);
  }
  echo($answer);

  if ($logFile) {
    fwrite($logFile, "answer:"    . $answer . "\n");
  } 
  
  // close mysql connection
  mysqli_close($link);
}

if ($logFile) {
  fwrite($logFile, "#############################################################################\n");
  fclose($logFile);
}
?>