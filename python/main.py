import asyncio
import random
from concurrent.futures import ProcessPoolExecutor
from math import cos, log, sin, sqrt

from fastapi import FastAPI

app = FastAPI()
executor = ProcessPoolExecutor(max_workers=4)


@app.get("/process")
async def process():
    input = 5
    req_id = random.randint(30_000_000, 40_000_000)

    loop = asyncio.get_running_loop()

    f1 = loop.run_in_executor(executor, complex_calculation_1, input)
    f2 = loop.run_in_executor(executor, complex_calculation_2, input)
    f3 = loop.run_in_executor(executor, complex_calculation_3, input)

    task1, task2, task3 = await asyncio.gather(f1, f2, f3)

    return {
        "result": task1 + task2 + task3,
        "id": req_id,
        "tasks": {
            "task1": round(task1, 6),
            "task2": round(task2, 6),
            "task3": round(task3, 6),
        },
    }


def complex_calculation_1(data: int) -> float:
    res = data * 2 + sin(data) * cos(data)

    for i in range(1000):
        res += sin((data + i * 0.001)) * cos((data - i * 0.001))

    return res


def complex_calculation_2(data: int) -> float:
    res = pow(data, 3) + sqrt(data) + log((data + 1))

    for i in range(500):
        res += sqrt((data + i * 0.01)) * log((data - i * 0.005 + 1))

    return res


def complex_calculation_3(data: int) -> float:
    res = pow(data, 2) + data * 10 + 100

    for i in range(2000):
        res += (data + i * 0.0001) * (data - i * 0.0002)

    return res
