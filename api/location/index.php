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
  case 'GET':
    require('get_locations.php');
    get_locations();
    break;

  case 'POST':
    require('add_location.php');
    add_location();
    break;

  case 'DELETE':
    require('remove_location.php');
    remove_location();
    break;

  default:
    Response::raise_unsupported_method_error();
    break;
}