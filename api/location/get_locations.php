  
<?php
session_start();

require $_SERVER['doc_path'] . '/src/db.php';
require_once '../response.php';
require_once '../error.php';

use api\Response;
use db\DB;

function get_locations()
{
  $SERVER_ERROR_MESSAGE = "An error occurred when fetching locations.";

  $username = $_SESSION['username'];
  $db = DB::get_instance();

  $query_string = file_get_contents('location/get_locations.sql');
  $query = $db->prepare($query_string);
  $query->bind_param('s', $username);

  $is_query_successful = $query->execute();

  if (!$is_query_successful) {
    Response::raise_internal_error($SERVER_ERROR_MESSAGE);
    return;
  }

  $result = $query->get_result();

  if (!$result) {
    Response::raise_internal_error($SERVER_ERROR_MESSAGE);
    return;
  }

  $locations = [];

  while ($row = $result->fetch_assoc()) {
    array_push($locations, $row);
  }

  $response = new Response();

  $response
    ->set_status_code(200)
    ->set_data($locations)
    ->send();
}