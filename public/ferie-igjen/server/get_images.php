<?php

$files = array();

$dir = opendir('images');
while ($file = readdir($dir)) {
    if ($file == '.' || $file == '..') {
        continue;
    }

    $files[] = $file;
}

$http_origin = $_SERVER['HTTP_ORIGIN'];
// if ($http_origin == "http://localhost:8080" || $http_origin == "http://helgeh.github.io")
// {  
//     header("Access-Control-Allow-Origin: $http_origin");
// }
// header('Access-Control-Allow-Origin: http://localhost:8080', false);
header('Access-Control-Allow-Origin: https://helgeh.github.io', false);

header('Content-type: application/json');
echo json_encode($files);