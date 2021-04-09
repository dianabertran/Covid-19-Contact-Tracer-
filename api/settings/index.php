<?php

require $_SERVER['doc_path'] . '/src/loader.php';
require '../login/cookies.php';
require '../error.php';

use api\Response;

if (!isset($_COOKIE[$IS_LOGGED_IN])) {
  Response::raise_unauthorized_error();
  return;
}

load_env();

switch ($_SERVER['REQUEST_METHOD']) {
  case 'POST':
    require('save_settings.php');
    save_settings();
    break;

  default:
    Response::raise_unsupported_method_error();
    break;
}