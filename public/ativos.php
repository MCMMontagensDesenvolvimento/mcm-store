<?php
require 'vendor/autoload.php';

use GuzzleHttp\Client;

// Criação do cliente
$client = new Client();

$cpf = $_GET['cpf'];  // 'Joao'
$nr = $_GET['nr'];  // 30

// URL da API
$url = "https://apihomolog.mcmmontagens.com.br/api/apdata/contratados/ativos?cpf=$cpf&nr=$nr";

// Fazer a requisição GET
$response = $client->request('GET', $url, [
    'verify' => false, // Ignorar a verificação SSL
]);

// Obter o corpo da resposta
$body = $response->getBody();

// Exibir a resposta
echo $body;
?>
