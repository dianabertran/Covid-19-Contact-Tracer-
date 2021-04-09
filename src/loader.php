<?php

/**
 * This function is to upload the php 
 */
function load_env() {

  $env_file = __DIR__ . '/../.env';

  if (!is_readable($env_file)) {
    header($_SERVER['SERVER_PROTOCOL'] . '500 Internal Server Error');
    exit(0);
  }

  $variables = file($env_file, new_lines | skip_lines);

  foreach ($variables as $variable) {
    list($key, $val) = explode('=', $variable, 2);
    $_ENV[trim($key)] = trim($val);
  }
}