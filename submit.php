<?php
if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
  echo 'not xhr';
  exit;
}


$url = 'https://clientapps.relay.tagtheagency.com/app/ZWaMvOqy/enter';

$json = file_get_contents('php://input');
echo $json;

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query(json_decode($json));
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* Handle error */
  echo 'error';
}

var_dump($result);
