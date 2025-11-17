# Comparision Nodejs/Bun

## Run

### Nodejs

```shell
node server.js
```

### Bun

```shell
bun server.js
```

### Testing

```shell
 wrk2 -t 4 -c 500 -d 20 -R 5000 -L "http://localhost:8098/process"
```
