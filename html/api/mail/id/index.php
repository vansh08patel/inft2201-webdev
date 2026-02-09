<?php
require __DIR__ . '/../../../vendor/autoload.php';

use Application\Mail;
use Application\Page;


$host = getenv('DB_PROD_HOST') ?: 'db_prod';
$db   = getenv('DB_PROD_NAME') ?: 'prod';
$user = getenv('DB_USER') ?: 'user';
$pass = getenv('DB_PASS') ?: 'pass';

$dsn = "pgsql:host=$host;port=5432;dbname=$db";

$pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);


$mail = new Mail($pdo);
$page = new Page();


$uri = $_SERVER['REQUEST_URI'];
$parts = explode('/', trim($uri, '/'));
$id = (int) end($parts);


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $item = $mail->getMail($id);
    $item ? $page->item($item) : $page->notFound();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $updated = $mail->updateMail($id, $data['subject'], $data['body']);
    $updated ? $page->item($mail->getMail($id)) : $page->notFound();
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $deleted = $mail->deleteMail($id);
    $deleted ? http_response_code(200) : $page->notFound();
    exit;
}


$page->badRequest();
