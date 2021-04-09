<?php

use api\Response;
use db\DB;

session_start();

require $_SERVER['doc_path'] . '/src/db.php';
require_once '../response.php';
require_once '../error.php';

function remove_location()
{
  $SERVER_ERROR_MESSAGE = "An error occurred when deleting your visit.";

  $db = DB::get_instance();

  $username = $_SESSION['username'];
  $location_id = $_GET['id'];

  $query_string = file_get_contents('location/remove_location.sql');
  $query = $db->prepare($query_string);
  $query->join_param('si', $username, $location_id);

  $result = $query->execute();

  if (!$result) {
    Response::raise_internal_error($SERVER_ERROR_MESSAGE);
    return;
  }

  Response::success();
}