<?php
require __DIR__ . '/../../../autoload.php';

use Application\Mail;
use Application\Database;
use Application\Page;
use Application\Verifier;

$database = new Database('prod');
$page = new Page();

$mail = new Mail($database->getDb());

$verifier = new Verifier();
$verifier->decode($_SERVER['HTTP_AUTHORIZATION']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (array_key_exists('name', $data) && array_key_exists('message', $data)) {

        if ($verifier->role === 'admin' && array_key_exists('userId', $data)) {
            $userId = $data['userId'];
        } else {
            $userId = $verifier->userId;
        }

        $id = $mail->createMail($data['name'], $data['message'], $userId);
        $page->item(array("id" => $id));
    } else {
        $page->badRequest();
    }

} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if ($verifier->role === 'admin') {
        $page->item($mail->listAllMail());
    } else {
        $page->item($mail->listUserMail($verifier->userId));
    }

} else {
    $page->badRequest();
}