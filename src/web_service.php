<?php

use CurlHandle;

namespace external;

class WebService
{
  private static $SERVICE_URL = 'http://ml-lab-4d78f073-aa49-4f0e-bce2-31e5254052c7.ukwest.cloudapp.azure.com:60500';

  public static function new_request(

    string $endpoint,
    string $query_string = '',
    string $method,
    array $input = []
  ): CurlHandle {
    $req = curl_init();
    curl_setopt(
      $req,
      CURLOPT_URL,
      $_ENV['PHP_ENV'] === 'prod'
        ? self::$SERVICE_URL . $endpoint . $query_string
    );
    curl_setopt($req, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($req, CURLOPT_HEADER, false);
    curl_setopt($req, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($req, CURLOPT_POSTFIELDS, json_encode($input));
    curl_setopt($req, CURLOPT_RETURNTRANSFER, true);

    return $req;
  }
}