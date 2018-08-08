<?php
function strToHex($string){
    $hex = '';
    for ($i=0; $i<strlen($string); $i++){
        $ord = ord($string[$i]);
        $hexCode = dechex($ord);
        $hex .= substr('0'.$hexCode, -2);
    }
    return strToUpper($hex);
}
function hexToStr($hex){
    $string='';
    for ($i=0; $i < strlen($hex)-1; $i+=2){
        $string .= chr(hexdec($hex[$i].$hex[$i+1]));
    }
    return $string;
}

function chipher($plaintext, $password){
    $method = 'aes-256-cbc';
    
    // Must be exact 32 chars (256 bit)
    $password = substr(hash('sha256', $password, true), 0, 32);

    // IV must be exact 16 chars (128 bit)
    $iv = "8DCB7300E8BCA8E5";
    
    return strToHex(openssl_encrypt($plaintext, $method, $password, OPENSSL_RAW_DATA, $iv));
}

function deChipher($encrypted, $password) {
    $method = 'aes-256-cbc';
    
    // Must be exact 32 chars (256 bit)
    $password = substr(hash('sha256', $password, true), 0, 32);

    // IV must be exact 16 chars (128 bit)
    $iv = "8DCB7300E8BCA8E5";

    return openssl_decrypt(hexToStr($encrypted), $method, $password, OPENSSL_RAW_DATA, $iv);
}

function hashPass($password)
{
    $method = 'sha256';
    return strToHex(substr(hash($method, $password, true), 0, 32));
}
?>