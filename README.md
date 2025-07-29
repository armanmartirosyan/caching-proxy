# Cashing Proxy

A lightweight, high-performance caching proxy server for optimizing API and web resource requests.

## Features

- Caches HTTP responses to reduce backend load
- Configurable cache expiration and invalidation
- Supports custom cache strategies (memory, disk, etc.)
- Easy integration with existing infrastructure
- Logging and metrics support

## Installation

```bash
git clone https://github.com/armanmartirosyan/caching-proxy.git
cd cashing-proxy
npm install
```

## Usage

```bash
npm start
```

By default, the proxy listens on port `8080`. You can configure the port and other settings in `config.json`.

## Configuration

Create `.env` to customize:

- `PORT`: Proxy server port
- `LOG_LEVEL`: Level of log function. It can be ["debug", "info", "warn", "error"]
- `REDIS_URL`: Redis connection string
- `REDIRECT_URL`: URL for caching data from

## License

MIT License
