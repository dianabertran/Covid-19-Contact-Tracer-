<?php
require 'src/config.php';
require 'api/login/cookies.php';

if (
  isset($_COOKIE[$IS_LOGGED_IN]) && $_COOKIE[$IS_LOGGED_IN] === '1'
) {
  setcookie($IS_LOGGED_IN, true, $LOGIN_EXPIRATION, '/');
  header('Location: ./home');

} else {
  header('Location: ./login');
}