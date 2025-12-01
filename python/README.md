# Comparision python

## Generate Virtual envs.

```
python3 -m venv .venv
```

## Activate Virtual envs.

```
source .venv/bin/activate
```

## Install dependencies

```
pip install -r requirements.txt
```

## Run

```
uvicorn main:app --host 0.0.0.0 --port 8097
```

### Testing

```shell
 wrk2 -t 4 -c 500 -d 20 -R 5000 -L "http://localhost:8097/process"
```
