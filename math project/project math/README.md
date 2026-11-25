# Crypto-graph

Crypto-graph is a web application for viewing cryptocurrency market charts and
managing a personal watchlist. The React client gets market data from the NestJS
API; the API uses CoinGecko for market data and MongoDB for user accounts and
watchlists.

## Project structure

- `client/crypto-g/` — React client.
- `server/crypto-graph-serv/` — NestJS API.
- `docker-compose.yml` — current Docker Compose configuration.

## Run locally without Docker (Windows)

Install Node.js/npm and MongoDB Community Server first. Start the MongoDB
Windows service (for example, from an elevated PowerShell window with
`Start-Service MongoDB`). The local example connects to the default MongoDB
port without authentication; adjust `DB_HOST` in the server `.env` if your
MongoDB setup differs.

In the first terminal, prepare and start the API:

```powershell
cd .\server\crypto-graph-serv
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm ci
npm run start:dev
```

In a second terminal, start the React client:

```powershell
cd .\client\crypto-g
npm ci
npm start
```

Open <http://localhost:4000>; the API and Swagger are at
<http://localhost:4100> and <http://localhost:4100/api-doc>. Replace the
development JWT values in `server/crypto-graph-serv/.env` before using the
application beyond local development. The client startup script sets port
4000 to match the API's CORS policy. Google login and password-reset email
remain unavailable until their credentials are configured.

## Run locally with Docker Compose

1. Install Docker Desktop with the Compose plugin.
2. Copy `.env.example` to `.env` and replace the development-only JWT secrets
   and database password if needed. Keep the database password URL-safe because
   it is embedded in the MongoDB connection URI. Google login requires a Google
   OAuth web client; password reset requires an SMTP account. See the optional
   variables in `.env.example`.
3. From the repository root, run `docker compose up --build`.
4. Open the client at <http://localhost:4000>. The API is available at
   <http://localhost:4100>, with Swagger documentation at
   <http://localhost:4100/api-doc>.

If the build fails with a BuildKit error such as `failed to stat active key`,
build the API with Compose and the frontend with a separate Buildx builder,
then start the services. In PowerShell:

```powershell
docker buildx create --name crypto-graph-recovery --driver docker-container --use
docker compose build server
docker buildx build --builder crypto-graph-recovery --load -t projectmath-client:latest -f client/crypto-g/docker/cli/Dockerfile client/crypto-g
docker compose up -d
```

If that builder already exists, skip the `docker buildx create` command. The
workaround avoids exporting both Compose images through the separate builder,
which can be very slow on this setup.

Compose starts MongoDB with persistent data in the `mongo-data` volume and
waits for its health check before starting the API. The database port is not
published to the host. The Compose defaults and example secrets are for local
development only, not production. Docker serves a prebuilt React production
bundle with Nginx and runs the compiled NestJS API rather than starting
development watchers inside resource-constrained containers.

To stop the services, run `docker compose down`. To also delete the local
database data, run `docker compose down --volumes`.

The client uses Create React App 5 with an older `loader-utils` dependency that
still requests the MD4 hash algorithm. Its local start and build scripts set
Node's legacy OpenSSL provider for compatibility. The frontend Docker image
installs dependencies with Node 14 and compiles the production bundle with
Node 16, where the legacy hash is supported without that flag.

## Requirements

The recovery environment has been checked with Node.js 24, npm 11, Docker
Desktop, WSL2, and Ubuntu. The Docker images use Node.js 14 to retain
compatibility with the project's older native dependencies.

The application also requires access to the CoinGecko API. `.env.example`
contains local development placeholders; do not commit `.env` or real
credentials.

## Google login and password reset

For Google login, create an OAuth 2.0 Web application in Google Cloud Console,
configure the OAuth consent screen, and add the value of `GOOGLE_CALLBACK_URL` (by default
`http://localhost:4100/auth/google/callback`) as an authorized redirect URI.
For an app in testing mode, add your Google account as a test user. Set
`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in
`server/crypto-graph-serv/.env` for a native run (or the repository `.env` for
Compose). Do not send or commit the client secret. The Google button
signs in existing accounts or creates an account on first sign-in using Google's
verified email.

For password reset, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`,
`SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM`. Reset links are valid for 30
minutes. Set `FRONTEND_URL` to the public frontend origin when deploying away
from localhost. With Gmail, use `smtp.gmail.com`, port `587`, and
`SMTP_SECURE=false`; create an App Password in your Google account (2-Step
Verification must be enabled) and use it as `SMTP_PASSWORD`, not your normal
Google password. Without SMTP configuration, reset requests return an explicit
service-unavailable error rather than claiming an email was sent.

The login form's “Remember Me” checkbox controls persistence: checked sessions
use browser-persistent storage and refresh cookies; unchecked sessions use
session storage and browser-session cookies.

## Verification notes

The NestJS server and React client compile. The focused server market-data tests
and client landing-page test pass. Server authentication tests cover password
validation, access-token identity lookup, refresh-token verification, and
hashed refresh-token storage. Account-recovery tests cover Google account
creation, reset-token email flow, invalid tokens, password hashing, and session
revocation. Client tests cover login/registration, remember-me storage,
and the empty favorites state. The market-data API requests the top 15
CoinGecko markets and their 7-day price sparklines in one request; historical
market-cap averages are not returned because this CoinGecko endpoint provides
only the current market cap. The client currently charts prices only.
