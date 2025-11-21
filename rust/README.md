# Comparision Rust

## Build

### Для текущей системы

```shell
cargo build --release --locked
```

### Для для линукс(x64) через докер 

```shell
cargo build --release --locked
```

### Testing

```shell
 wrk2 -t 4 -c 500 -d 20 -R 5000 "http://localhost:8097/process"
```
