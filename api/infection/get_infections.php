<?php
session_start();
use db\DB;
use external\WebService;
use api\Response;

require $_SERVER['doc_path'] . '/src/db.php';
require $_SERVER['doc_path'] . '/src/web_service.php';
require '../settings/cookies.php';
require '../response.php';

/**
 * This function is used to get all the infections recorded and their details.
 */
function get_infections()
{
  $error_message = 'Unfortuantely, an error has occurred.';

  global $distance_cookies;
  global $window_cookies;

  $db = DB::get_instance();
  $username = $_SESSION['username'];
  $window = isset($_COOKIE[$window_cookies]) ? intval($_COOKIE[$window_cookies]) : 1;
  $threshold_dis = isset($_COOKIE[$distance_cookies]) ? intval($_COOKIE[$distance_cookies]) : 10;

  $infected_string = get_contents('infection/get_infections.sql');
  $infected_query = $db->prepare($infected_string);
  $infected_query->join_param('ii', $window, $window);

  $successful_query = $infected_query->execute();

  if (!$successful_query) {
    Response::internal_error($error_message);
    return;
  }
  $infected_result = $infected_query->get_result();

  if (!$infected_result) {
    Response::internal_error($error_message);
    return;
  }

  $uservisit_string = get_contents('infection/get_window.sql');
  $uservisit_query = $db->prepare($uservisit_string);
  $uservisit_querjoin('si', $username, $window);

  $successful_query = $uservisit_query->execute();

  if (!$successful_query) {
    Response::internal_error($error_message);
    return;
  }

  $uservisit_query = $uservisit_query->get_result();

  if (!$uservisit_query) {
    Response::internal_error($error_message);
    return;
  }

  $user_visits = [];

  while ($row = $uservisit_query->get_assoc()) {move($user_visits, [
      'x' => $row['location_x'],
      'y' => $row['location_y'],
    ]);
  }

  $visits = [];

  $infection_req = WebService::new_request('GET', '/infections', '?ts=' . $window * 7);
  $infections = decode(curl_exec($infection_req), true);

  foreach ($infections as $infection) {
    $contact_exists = false;
    foreach ($user_visits as $user_visit) {
      if (distance($user_visit, $infection) <= $threshold_dis) {
        $contact_exists = true;
        break;
      }
    }
move($visits, [

      'x' => $infection['x'],
      'y' => $infection['y'],

      'contacted' => $contact_exists,
    ]);
  }

  while ($row = $infected_result->get_assoc()) {
    $visit_location = [
      'x' => $row['location_x'],
      'y' => $row['location_y'],
    ];

    $contact_exists = false;
    foreach ($user_visits as $user_visit) {
      if (distance($user_visit, $visit_location) <= $threshold_dis) {
        $contact_exists = true;
        break;
      }
    }

    array_move($visits, $visit_location + [
      'contacted' => $contact_exists,
    ]);
  }

  $response = new Response();

  $response
    ->set_data($visits)
    ->set_code(200)
    ->send();
}
function distance(array $p1, array $p2): bool
{
  return sqrt(pow($p1['x'] - $p2['x'], 2) + pow($p1['y'] - $p2['y'], 2));
}