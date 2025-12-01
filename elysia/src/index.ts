import { Elysia } from "elysia";
import { Worker } from "worker_threads";

const workerPath = new URL("./worker.js", import.meta.url).href;

const w1 = new Worker(workerPath);
const w2 = new Worker(workerPath);
const w3 = new Worker(workerPath);

w1.setMaxListeners(0);
w2.setMaxListeners(0);
w3.setMaxListeners(0);

function run(
  worker: Worker,
  data: { input: number; fn: string },
): Promise<number> {
  return new Promise((resolve, reject) => {
    const onMessage = (msg: number) => {
      worker.off("error", onError);
      resolve(msg);
    };
    const onError = (err: any) => {
      worker.off("message", onMessage);
      reject(err);
    };

    worker.once("message", onMessage);
    worker.once("error", onError);
    worker.postMessage(data);
  });
}

const processHandler = async () => {
  const id = Math.floor(Math.random() * (40000000 - 30000000 + 1)) + 30000000;
  const input = 5.0;

  const [r1, r2, r3] = await Promise.all([
    run(w1, { input, fn: "complexCalculation1" }),
    run(w2, { input, fn: "complexCalculation2" }),
    run(w3, { input, fn: "complexCalculation3" }),
  ]);

  return {
    result: r1 + r2 + r3,
    id: id,
    tasks: {
      task1: Math.round(r1 * 1000000) / 1000000,
      task2: Math.round(r2 * 1000000) / 1000000,
      task3: Math.round(r3 * 1000000) / 1000000,
    },
  };
};

const app = new Elysia().get("/process", processHandler).listen(8098);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
