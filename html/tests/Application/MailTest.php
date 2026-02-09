<?php
use PHPUnit\Framework\TestCase;
use Application\Mail;

class MailTest extends TestCase {
    protected PDO $pdo;

    protected function setUp(): void
{
    $dsn = "pgsql:host=db_prod;port=5432;dbname=prod";

    $this->pdo = new PDO($dsn, 'user', 'pass');
    $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $this->pdo->exec("DROP TABLE IF EXISTS mail;");
    $this->pdo->exec("
        CREATE TABLE mail (
            id SERIAL PRIMARY KEY,
            subject TEXT NOT NULL,
            body TEXT NOT NULL
        );
    ");
}


    public function testCreateMail() {
        $mail = new Mail($this->pdo);
        $id = $mail->createMail("Alice", "Hello world");
        $this->assertIsInt($id);
        $this->assertEquals(1, $id);
    }
    public function testGetMail()
    {
    $mail = new Mail($this->pdo);
    $id = $mail->createMail("Test subject", "Test body");

    $result = $mail->getMail($id);

    $this->assertEquals("Test subject", $result['subject']);
    $this->assertEquals("Test body", $result['body']);
    }
    public function testGetAllMail()
    {
    $mail = new Mail($this->pdo);
    $mail->createMail("A", "One");
    $mail->createMail("B", "Two");

    $results = $mail->getAllMail();

    $this->assertCount(2, $results);
    }
    public function testUpdateMail()
    {
    $mail = new Mail($this->pdo);
    $id = $mail->createMail("Old", "Old body");

    $updated = $mail->updateMail($id, "New", "New body");

    $this->assertTrue($updated);

    $result = $mail->getMail($id);
    $this->assertEquals("New", $result['subject']);
    }
    public function testDeleteMail()
    {
    $mail = new Mail($this->pdo);
    $id = $mail->createMail("Delete me", "Bye");

    $deleted = $mail->deleteMail($id);
    $this->assertTrue($deleted);

    $this->assertFalse($mail->getMail($id));
    }

}