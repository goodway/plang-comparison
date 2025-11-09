const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is starting ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    const fastify = require('fastify')({ logger: false });
    const cors = require('@fastify/cors');

    // Регистрация CORS
    fastify.register(cors, {
        origin: '*',
    });

    function complexCalculation1(data) {
        let result = data * 2 + Math.sin(data) * Math.cos(data);

        for (let i = 0; i < 1000; i++) {
            result += Math.sin(data + i * 0.001) * Math.cos(data - i * 0.001);
        }

        return result;
    }

    function complexCalculation2(data) {
        let result = Math.pow(data, 3) + Math.sqrt(data) + Math.log(data + 1);

        for (let i = 0; i < 500; i++) {
            result += Math.sqrt(data + i * 0.01) * Math.log(data - i * 0.005 + 1);
        }

        return result;
    }

    function complexCalculation3(data) {
        let result = Math.pow(data, 2) + data * 10 + 100;

        for (let i = 0; i < 2000; i++) {
            result += (data + i * 0.0001) * (data - i * 0.0002);
        }

        return result;
    }

    fastify.get('/process', async (request, reply) => {
        try {
            const id = Math.floor(Math.random() * (40000000 - 30000000 + 1)) + 30000000;
            const input = 5.0;

            const [result1, result2, result3] = await Promise.all([
                complexCalculation1(input),
                complexCalculation2(input),
                complexCalculation3(input)
            ]);

            const totalResult = result1 + result2 + result3;

            const tasks = {
                task1: Math.round(result1 * 1000000) / 1000000,
                task2: Math.round(result2 * 1000000) / 1000000,
                task3: Math.round(result3 * 1000000) / 1000000
            };

            return reply.send({
                result: totalResult,
                id: id,
                tasks: tasks
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ error: 'Internal server error' });
        }
    });

    const start = async () => {
        try {
            await fastify.listen({ port: 8098, host: 'localhost' });
            console.log(`Worker ${process.pid} started on http://127.0.0.1:8098`);
        } catch (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    };

    start();
}
