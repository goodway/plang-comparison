import Fastify from "fastify";
import { Worker } from "worker_threads";

const fastify = Fastify();

const w1 = new Worker("./worker.js");
const w2 = new Worker("./worker.js");
const w3 = new Worker("./worker.js");

w1.setMaxListeners(0);
w2.setMaxListeners(0);
w3.setMaxListeners(0);

function run(worker, data) {
  return new Promise((resolve, reject) => {
    const onMessage = (msg) => {
      worker.off("error", onError);
      resolve(msg.result);
    };
    const onError = (err) => {
      worker.off("message", onMessage);
      reject(err);
    };

    worker.once("message", onMessage);
    worker.once("error", onError);
    worker.postMessage(data);
  });
}

fastify.get("/process", async (_request, reply) => {
  try {
    const id = Math.floor(Math.random() * (40000000 - 30000000 + 1)) + 30000000;
    const input = 5.0;

    const [r1, r2, r3] = await Promise.all([
      run(w1, { input, fn: "complexCalculation1" }),
      run(w2, { input, fn: "complexCalculation2" }),
      run(w3, { input, fn: "complexCalculation3" }),
    ]);

    return reply.type("application/json").send({
      result: r1 + r2 + r3,
      id: id,
      tasks: {
        task1: Math.round(r1 * 1000000) / 1000000,
        task2: Math.round(r2 * 1000000) / 1000000,
        task3: Math.round(r3 * 1000000) / 1000000,
      },
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal server error" });
  }
});

fastify.listen({ port: 8098, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`[${process.pid}] Server started on ${address}`);
});
