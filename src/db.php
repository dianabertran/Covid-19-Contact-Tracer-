<?php

namespace db;

use mysqli;

/**
 * This is used for accessing the webpage.
 */
class DB
{
  private static mysqli | null $instance = null;

  public static function get_instance()
  {
    if (self::$instance == null) {
      self::$instance = new mysqli('db', $_ENV['DB_USER'],
       $_ENV['DB_PASSWORD'],
        $_ENV['DB_NAME']);
    }

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    return self::$instance;
  }
}