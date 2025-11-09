module.exports = {
    apps: [{
        name: 'fastify-coroutine-server',
        script: './server.js',
        instances: 'max',
        exec_mode: 'cluster',
        node_args: '--max-old-space-size=128',
        env: {
            NODE_ENV: 'production',
            PORT: 8098,
            HOST: 'localhost'
        },
        max_memory_restart: '128M',
        watch: false,
        error_file: '/dev/null',
        out_file: '/dev/null',
        log_file: '/dev/null',
        time: false,
        combined_logs: true,
        merge_logs: true,
        cwd: './',
        env_production: {
            NODE_ENV: 'production'
        }
    }]
}