<?php
if(empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
  http_response_code(405);
  exit;
}


$url = 'https://clientapps.relay.tagtheagency.com/app/ZWaMvOqy/enter';

if (!isset($_POST['email']) || empty($_POST['email'])) {
  $_POST['email'] = 'not_visible';
}

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($_POST)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* Handle error */
  http_response_code(500);
} else {
  header('Content-Type: application/json');
  echo '{"content":"submitted"}';
}
