<p align="center">
  <a href="https://stackedlayer.com/">
    <img alt="StackedLayer" title="StackedLayer" src="https://i.imgur.com/eYBJABy.png" width="250">
  </a>
</p>

<h1 align="center"> StackedLayer </h1> <br>


<p align="center">
  <em><b>StackedLayer</b> is a secrets sharing website built with Astro. Designed with <b>security</b> in mind, it serves the community as an <b>open-source</b> feature-complete alternative to commercial offerings.</em>
</p>

---

## ⚠️ **Attention**

StackedLayer is currently in alpha and under active development. In this phase I won't be providing any kind of support or other kind of help. Furthermore I cannot guarantee that secrets shared in the [official website](https://stackedlayer.com/) will be migrated across different deployments.

---

## Introduction

My day job requires constant use of one-time secrets to keep confidentiality in communications, as I searched the internet I found **none** open-source self-hostable feature-complete solutions that I could trust, for this reason I decided to create my own. 


## Features

## Core Features

- 🔒 Encryption for all data
- 🗑️ Automatic deletion after viewing (one-time access)
- 📁 Secure file sharing
- 🔏 Encrypted secret text sharing
- ⏰ Configurable expiration times

## Security & Privacy

- 🛡️ No data stored in plain text
- 🔒 Turnstile protection against abuse

## Technical Features

- ⚡ Built with Astro.js for optimal performance
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 📱 Fully responsive design
- 🗄️ PostgreSQL database with Drizzle ORM
- 🔐 Authentication support via Auth.js

## Open Source

- 📖 Fully transparent, auditable code
- 🤝 GNU General Public License v3.0
- 🛠️ Self-hostable
- 🧩 Modular architecture

## User Experience

- 🚀 Fast and lightweight
- 🎯 Simple, intuitive interface
- 📋 Easy copy-to-clipboard functionality
- 🔗 Shareable secure links
- 🌐 Cross-platform compatibility

## Installation

StackedLayer is built on top of [Astro 5](https://astro.build/blog/astro-5/), the only reason why is that it's fast, and NextJS was a pain in the ass to deploy.


### External dependencies

Tried my best to modularize external dependencies, but the current ones are the following:

| Service               | Description                                                                                       |
|-----------------------|---------------------------------------------------------------------------------------------------|
| PostgreSQL            | Database ([Drizzle ORM](https://orm.drizzle.team/docs/overview))                                  |
| Turnstile             | Bot prevention on form submition ([Turnstile Docs](https://developers.cloudflare.com/turnstile/)) |

### Authentication

Authentication is optional and can be disabled, however if it's enabled the following providers have been implemented

| Provider           | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| Resend             | Email Magic Link ([Docs](https://resend.com/docs/introduction))             |
| Google             | OAuth 2.0 ([Docs](https://developers.google.com/identity/protocols/oauth2)) |


### Enviroment Variables

```
# Database variables
AUTH_DRIZZLE_URL=<string>

# Turnstile variables
TURNSTILE_SITE_KEY=<string>
TURNSTILE_SECRET_KEY=<string>

# Functionality variables
ENFORCE_ONE_TIME=<bool: enforces deletion of secrets on enabled>
SECRET_KEY=<string: global secret key to encrypt the secondary keys used to encrypt the secrets>
KEY_SALT=<string: salt for the global encryption key>
PUBLIC_FRONTEND_URL=<string>

# Text Secrets variables
SECRET_EXPIRATION_SECONDS=<number: how long will a text secret take to expire>
MAX_SECRET_LENGTH=<number: how long can a text secret be>

# File variables
FILE_EXPIRATION_SECONDS=<number: how long will a file secret take to expire>
MAX_FILE_SIZE_MB=<number: how big can a file secret be>

# Auth variables
AUTH_ENABLED=<bool>
LOGIN_REQUIRED=<bool: if true then it enforces login requirement to create secrets>
INVITE_ONLY=<bool: only users with invite key can finish registration>
AUTH_SECRET=<string>
AUTH_TRUST_HOST=<bool>

# Resend Magic Link
AUTH_RESEND_KEY=<string>

# Google Auth
AUTH_GOOGLE_ID=<string>
AUTH_GOOGLE_SECRET=<string>
```

### Docker

The `Dockerfile` is composed of 3 steps:

1. `pnpm` is installed
2. `pnpm run build` is executed, with the Astro public environment variables ([docs](https://docs.astro.build/en/guides/environment-variables/#vites-built-in-support))
3. All files are copied to the final `runtime` step, where it executes the node server

<p>
  <em>Just as a sidenote, this docker image is not optimized for size, I will cross that river when I come to it, for now every image size is aproximately 2 GB</em>
</p>

#### `docker run`

These correspond to the public environment variables of the application

| Argument            | Type      |
|---------------------|-----------|
| TURNSTILE_SITE_KEY  | string    | 
| PUBLIC_FRONTEND_URL | string    |

``` bash
docker build \
  --build-arg TURNSTILE_SITE_KEY=<TURNSTILE_SITE_KEY> \
  --build-arg PUBLIC_FRONTEND_URL=<PUBLIC_FRONTEND_URL> \
  -t stackedlayer .
```

```
docker run -d \
  -p 4321:4321 \
  --env-file .env \
  --name stackedlayer-app \
  stackedlayer
```


#### `docker compose`

The docker compose file automatically spins up a postgres database and replaces the env variable for the database connection.

```
docker compose up -d
```

### Running Locally

1. Install `pnpm`

I won't go over the details, here are the [docs](https://pnpm.io/installation)

2. Install dependencies

```
pnpm i
```

3. Generate database locally

```
pnpm db:generate
```

4. Push database schema to the server

```
pnpm db:push
```

5. Run project

```
pnpm dev
```

## Feedback

Feel free to send me feedback on Discord at `kildall` or [file an issue](https://github.com/kildall/stackedlayer/issues/new). Feature requests are always welcome.

