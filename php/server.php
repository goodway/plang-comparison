<?php
declare(strict_types=1);

use Swoole\Http\Server;
use Swoole\Http\Request;
use Swoole\Http\Response;
use Swoole\Coroutine as Co;

function complexCalculation1(float $data): float
{
    $result = $data * 2 + sin($data) * cos($data);
    for ($i = 0; $i < 1000; $i++) {
        $result += sin($data + $i * 0.001) * cos($data - $i * 0.001);
    }
    return $result;
}

function complexCalculation2(float $data): float
{
    $result = pow($data, 3) + sqrt($data) + log($data + 1);
    for ($i = 0; $i < 500; $i++) {
        $result += sqrt($data + $i * 0.01) * log($data - $i * 0.005 + 1);
    }
    return $result;
}

function complexCalculation3(float $data): float
{
    $result = pow($data, 2) + $data * 10 + 100;

    for ($i = 0; $i < 2000; $i++) {
        $result += ($data + $i * 0.0001) * ($data - $i * 0.0002);
    }
    return $result;
}

$server = new Server('0.0.0.0', 8096);
$server->set([
    'worker_num' => swoole_cpu_num() * 3, // can be 1-4 per cpu core by swoole official recommendations. Optimal x2, x3 - for high load, x4 - max stable for high load
    'enable_coroutine' => true,
    'max_coro_num' => 50000,
]);

$server->on('start', function (): void {
    echo "Server started on http://0.0.0.0:8096\n";
});

$server->on("request", function (Request $req, Response $res): void {

    $input = 5.0;
    $id = random_int(30000000, 40000000);

    Co::join([
        go(function () use ($input, &$res1): void {
            $res1 = complexCalculation1($input);
        }),
        go(function () use ($input, &$res2): void {
            $res2 = complexCalculation2($input);
        }),
        go(function () use ($input, &$res3): void {
            $res3 = complexCalculation3($input);
        }),
    ]);

    $results = $res1 + $res2 + $res3;

    $res->header('Content-Type', 'application/json');
    $res->end(json_encode([
        'result' => $results,
        'id' => $id,
        'tasks' => [
            'task1' => round($res1, 6),
            'task2' => round($res2, 6),
            'task3' => round($res3, 6)
        ]
    ]));
});

$server->start();
