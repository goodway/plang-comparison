# syntax=docker/dockerfile:1.6

FROM rust:1.88-slim-bookworm AS builder

RUN apt-get clean && apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    librdkafka-dev \
    zlib1g-dev \
    libzstd-dev \
    cmake \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --release --locked

FROM scratch AS artifact
ARG BIN=pcr
COPY --from=builder /app/target/release/${BIN} /${BIN}
