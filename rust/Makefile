IMAGE = "plang-comparison-rust/build"

build:
	DOCKER_BUILDKIT=1 docker build --no-cache --platform=linux/amd64 --target artifact --output type=local,dest=./build .

clean:
	cargo clean

.PHONY: build clean
