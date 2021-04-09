<?php
session_start();

use api\Response;
use db\DB;
use external\WebService;

require '../response.php';
require_once '../error.php';
require $_SERVER['doc_path'] . '/src/db.php';
require $_SERVER['doc_path'] . '/src/mysql_timestamp.php';
require $_SERVER['doc_path'] . '/src/web_service.php';


function report_infection()
{
  $SERVER_ERROR_MESSAGE = 'An error occurred when recording your infection.';

  $db = DB::get_instance();

  $username = $_SESSION['username'];
  $infection_date = mysql_timestamp($_POST['infectionDateTime']);

  $query_str = file_get_contents('infection/report_infection.sql');
  $query = $db->prepare($query_str);
  $query->bind_param('ss', $username, $infection_date);

  $is_query_successful = $query->execute();

  if (!$is_query_successful) {
    Response::raise_internal_error($SERVER_ERROR_MESSAGE);
    return;
  }

  if ($query->affected_rows != 1) {
    Response::raise_internal_error($SERVER_ERROR_MESSAGE);
    return;
  }

  $query_str = file_get_contents('sql/find_previous_visits.sql');
  $prev_visits_query = $db->prepare($query_str);
  $prev_visits_query->bind_param('ss', $username, $infection_date);

  $is_query_successful = $prev_visits_query->execute();

  if (!$is_query_successful) {
    Response::raise_internal_error($SERVER_ERROR_MESSAGE);
    return;
  }

  $rows = $prev_visits_query->get_result();

  if (!$rows) {
    Response::raise_internal_error($SERVER_ERROR_MESSAGE);
    return;
  }

  $reqs = [];
  $multi_curl = curl_multi_init();

  while ($visit = $rows->fetch_assoc()) {
    $location = [
      'x' => $visit['location_x'],
      'y' => $visit['location_y'],
      'date' => date('Y-m-d', $visit['visited_on_timestamp']),
      'time' => date('H:i:s', $visit['visited_on_timestamp']),
      'duration' => $visit['duration'],
    ];

    $req = WebService::new_request('POST', '/report', $location);

    array_push($reqs, $req);
    curl_multi_add_handle($multi_curl, $req);
  }

  do {
    curl_multi_exec($multi_curl, $running);
  } while ($running > 0);

  foreach ($reqs as $req) {
    if (curl_getinfo($req, CURLINFO_RESPONSE_CODE) != 200) {
      Response::raise_internal_error($SERVER_ERROR_MESSAGE);
      return;
    }
  }

  Response::success();
}
