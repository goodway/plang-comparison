import { parentPort } from "worker_threads";

const functions = {
  complexCalculation1(data) {
    let result = data * 2 + Math.sin(data) * Math.cos(data);

    for (let i = 0; i < 1000; i++) {
      result += Math.sin(data + i * 0.001) * Math.cos(data - i * 0.001);
    }

    return result;
  },
  complexCalculation2(data) {
    let result = Math.pow(data, 3) + Math.sqrt(data) + Math.log(data + 1);

    for (let i = 0; i < 500; i++) {
      result += Math.sqrt(data + i * 0.01) * Math.log(data - i * 0.005 + 1);
    }

    return result;
  },
  complexCalculation3(data) {
    let result = Math.pow(data, 2) + data * 10 + 100;

    for (let i = 0; i < 2000; i++) {
      result += (data + i * 0.0001) * (data - i * 0.0002);
    }

    return result;
  },
};

parentPort.on("message", (msg) => {
  const { input, fn } = msg;
  const f = functions[fn];

  if (!f) {
    throw new Error(`Function ${fn} is not defined!`);
  }

  parentPort.postMessage(f(input));
});
