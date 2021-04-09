<?php
require '../login/cookies.php';
require '../error.php';
require $_SERVER['doc_path'] . '/src/loader.php';

use api\Response;

if (!isset($_COOKIE[$IS_LOGGED_IN])) {

  Response::unauthorised_error();
  return;
}

load_env();

switch ($_SERVER['REQUEST_METHOD']) {

  case 'GET':
    require('get_infections.php');
    get_infections();
    break;
  case 'POST':
    require('report_infection.php');
    report_infection();
    break;
  default:
    Response::unsupported_error();
    break;
}