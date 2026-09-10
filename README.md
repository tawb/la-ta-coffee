<div align="center">

# ☕ La Ta Coffee

**A full stack coffee shop app, rebuilt as a real microservices system**

*Angular · Spring Boot · PostgreSQL · RabbitMQ · Eureka · Docker · Spring AI + Claude (MCP)*

Built solo by **Tawba** as a full backend and microservices learning project

</div>

<br>

## 📋 Table of Contents

* [What This Project Actually Does](#what-this-project-actually-does)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [The Services](#the-services)
* [How the Services Talk to Each Other](#how-the-services-talk-to-each-other)
* [A Custom Annotation Worth Pointing Out](#a-custom-annotation-worth-pointing-out)
* [A Confirmation Flow Worth Pointing Out](#a-confirmation-flow-worth-pointing-out)
* [How to Run This Locally](#how-to-run-this-locally)
* [Environment Variables](#environment-variables)
* [API Documentation](#api-documentation)
* [Diagrams](#diagrams)
* [Known Limitations](#known-limitations)
* [A Quick Note](#a-quick-note-for-whoever-is-reading-this)

<br>

## What This Project Actually Does

| Step | What happens |
|------|---------------|
| 1️⃣ | A user signs up and logs in through `auth service`. They get a real signed JWT token back. |
| 2️⃣ | That same token works across every other service, without those services ever asking `auth service` to check it. They just verify the signature themselves. |
| 3️⃣ | `core service` handles the menu, reservations, and orders. Building an order makes one real request to `auth service` to fetch the real customer name, and prices are recalculated server side so nothing can be faked from the frontend. |
| 4️⃣ | Once an order is saved, `core service` does not wait around to send an email. It drops a message on a queue and moves on. `notification service` picks it up and sends a real email through Gmail. |
| 5️⃣ | If `auth service` is briefly unreachable when `core service` needs it, `core service` does not immediately give up. It retries a few times first. |
| 6️⃣ | A logged in user can also just ask, in plain English, through a real AI chat. It can browse the menu and look up your own orders and reservations, and it can place a real order or make a real reservation, but only after showing you exactly what it is about to do and getting a real yes first. |

<br>

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular |
| Backend | Java, Spring Boot |
| Database | PostgreSQL (one database per service) |
| Messaging | RabbitMQ |
| Service discovery | Eureka |
| Containers | Docker, Docker Compose |
| Email | Real Gmail SMTP, HTML templates via Thymeleaf |
| AI / Assistant | Spring AI, Anthropic Claude, Model Context Protocol (MCP) |

<br>

## Project Structure

```
la ta coffee services
│
├── frontend                 the Angular app
├── discovery server         the service registry, everyone checks in here
├── auth service             signup, login, password reset, identity
├── core service             menu, reservations, orders, newsletter
├── notification service     listens for new orders, sends real emails
├── mcp server               exposes the menu, orders, and reservations as real tools an AI can call
├── ai chat service          talks to Claude, forwards the real logged in user's identity through
└── docs                     diagrams and saved API documentation
```

<br>

## The Services

| Service | Port | Responsibility |
|---------|------|------------------|
| 🚪 `api gateway` | `8080` | Single entry point. Every frontend request lands here first and gets routed to the right service. No business logic of its own. |
| 📖 `discovery server` | `8761` | The Eureka registry. Every service registers itself here on startup so others can find its real address, nothing hardcoded. |
| 🔐 `auth service` | `8081` | Owns identity. Signup, login, password reset, JWT issuance. Its own database, `latacoffee auth`. |
| ☕ `core service` | `8082` | Owns the actual coffee shop logic. Menu, reservations, orders, newsletter. Its own database, `latacoffee core`. Verifies tokens locally using the shared signing secret, no call to `auth service` needed just to check a login. |
| ✉️ `notification service` | `8083` | No REST API of its own. Listens to a RabbitMQ queue called `order created` and sends a real confirmation email for every new order. |
| 🤖 `mcp server` | `8084` | Exposes the real menu, a user's own orders and reservations, and the ability to place a real order or make a real reservation, as tools an AI can call. Browsing the menu needs no login; everything tied to a specific user needs a real, valid JWT, verified locally the same way `core service` does it. |
| 💬 `ai chat service` | `8085` | The actual chat brain. Talks to Anthropic's Claude, and opens a fresh MCP connection per request carrying that specific user's own JWT, so the AI can only ever act as the person actually asking. |
| 🐘 `PostgreSQL` | `5432` | Two fully separate databases, `latacoffee auth` and `latacoffee core`. No foreign keys between them, on purpose. |
| 🐰 `RabbitMQ` | `5672` (dashboard on `15672`) | Carries the asynchronous messaging between `core service` and `notification service`. |

<br>

## How the Services Talk to Each Other

There are three genuinely different kinds of communication here, each used for a specific reason.

### 🔗 Synchronous, real HTTP calls

`core service` calls `auth service` directly when it truly needs an answer before it can continue, for example fetching the real customer name for an order. This call is protected by a shared internal secret header, so nothing outside the system can hit that internal endpoint directly. It is also wrapped in a custom retry annotation, explained below.

### 📬 Asynchronous, message queue

`core service` publishes a message to RabbitMQ **after** the order is already saved successfully. It never waits for anyone to read that message. `notification service` reads it whenever it gets to it and sends the email. If `notification service` were briefly down, orders would still succeed completely fine, the email would just arrive a little later.

### 🤖 Through the MCP server

`ai chat service` never talks to `core service` directly. Every chat request opens its own short lived MCP connection to `mcp server`, carrying the real logged in user's JWT the whole way through. `mcp server` checks that token itself, then makes its own authenticated call to `core service`, which checks it again. Three services, one real identity, verified independently at every hop, never just trusted from the one before it.

<br>

## A Custom Annotation Worth Pointing Out

`@RetryOnFailure` is a small custom Java annotation built specifically for this project, using Spring AOP.

```java
@RetryOnFailure(maxAttempts = 3, delayMs = 1000)
public UserProfileResponse getUserProfile(String email) {
    ...
}
```

Behind it sits an aspect that intercepts any method carrying this annotation. If the real method call throws an exception, it waits a moment and tries again, up to the number of attempts configured. This exists because `core service` genuinely depends on `auth service` being reachable to build an order, and a hard dependency between two independent services is a real risk in any microservices system. This is one honest, working answer to that risk.

It was tested for real, not just written and trusted. `auth service` was stopped on purpose, the retry attempts were watched live in the logs before the request finally failed, and normal operation was then confirmed once `auth service` came back up. The same pattern got reused for sending emails, so a slow or briefly unreachable mail server does not mean a lost email.

<br>

## A Confirmation Flow Worth Pointing Out

Letting an AI place a real order or make a real reservation is a genuinely different kind of risk than letting it read data. A tool description that just tells the model to confirm with the user first is an instruction to the model, not something enforced by code, so it is not what this actually relies on.

```java
@Tool(description = "Preview a new coffee order for the current user, without actually placing it yet...")
public OrderPreview previewOrder(String time, String name, List<String> items) { ... }

@Tool(description = "Actually place an order that was previously previewed with previewOrder...")
public OrderResponse confirmOrder(String confirmationToken) { ... }
```

`previewOrder` has no side effect. It looks up the real menu items, computes the real total server side, and hands back a one time confirmation token tied to that specific user. `confirmOrder` will only act on a token that still exists and actually belongs to the person asking, and it is removed the moment it is used. There is no path from "the AI decided to" straight to a real order that skips a genuine preview step first.

An earlier version placed the order in a single tool call, relying only on that description asking the model to confirm first. That was caught in review before it ever shipped, a description is not a guarantee, so it was rebuilt around this two step token flow instead.

<br>

## How to Run This Locally

> 💡 You do not need five terminal windows. Docker handles all of it.

1. Clone the repo.
2. Each service that needs secrets has a file called `.env.example`. Copy it to a real `.env` in that same folder, and fill in your own real values. `auth service`, `core service`, `notification service`, `mcp server`, and `ai chat service` all need this.
3. From the repo root, run:

```bash
docker compose up --build
```

4. Give it a few minutes the first time, it needs to build every service and pull the base images.
5. Once everything is up, open the frontend at `http://localhost:4200`.

<br>

## Environment Variables

Check each service's `.env.example` for the exact variables it needs.

| Variable | Needed by | Notes |
|----------|-----------|-------|
| `DB_PASSWORD` | `auth service`, `core service` | Your real Postgres password |
| `JWT_SECRET` | `auth service`, `core service`, `mcp server`, `ai chat service` | Must be the **exact same value** everywhere, or token verification fails |
| `INTERNAL_API_SECRET` | `auth service`, `core service` | Must also match exactly on both sides |
| `MAIL_USERNAME`, `MAIL_PASSWORD` | `auth service`, `notification service` | A real Gmail account and app password |
| `ANTHROPIC_API_KEY` | `ai chat service` | A real Anthropic API key, this is what actually powers the chat |

Never commit a real `.env` file. It is already excluded through `.gitignore`.

<br>

## API Documentation

Both `auth service` and `core service` expose live, interactive documentation once running.

| Service | URL |
|---------|-----|
| Auth service | `http://localhost:8081/swagger-ui/index.html` |
| Core service | `http://localhost:8082/swagger-ui/index.html` |

A full snapshot of both API specs is also saved as plain JSON inside `docs/api specs`, so anyone can review the real API contract without running anything at all.

`mcp server` does not expose a REST or Swagger interface, it speaks the MCP protocol directly. The real way to see its tools is connecting to it with MCP Inspector.

<br>

## Diagrams

Inside the `docs` folder:

* `erd.png`, the full database entity relationship diagram
* `architecture diagram.png`, every service and exactly how they connect

<br>

## Known Limitations

* The internal endpoint `auth service` exposes for `core service` is protected by a shared secret header, not full mutual authentication. Good enough here, would need more work before a real production system.
* `notification service` has no database of its own. If it goes down while a message is waiting, the message is still safely sitting in the queue, just not yet picked up.
* `mcp server` and `ai chat service` each call their downstream service through a hardcoded address rather than going through real Eureka based load balancing, even though both are registered with Eureka. Fine while each service only ever runs as one instance, would need a real load balanced client before this could scale past that.
* The AI chat has no memory between messages. Each one is answered on its own, so a follow up like "how much is the second one" will not know what "the second one" was.
* A previewed order or reservation that is never confirmed just sits there, there is no expiry on it yet. Not a real problem at the current scale, would need a real cleanup job eventually.

<br>

## A Quick Note for Whoever Is Reading This

Every piece of this, the service split, the retry logic, the messaging, the Docker setup, was built and debugged by hand. A fair number of real bugs got found and fixed along the way: wrong package names, a missing Jackson dependency, a queue that only got declared on one side, a secret that quietly had two different values in two different `.env` files. Adding the AI assistant on top surfaced its own new lessons too, a login check that looked correct but quietly let an unauthenticated request through anyway, because Spring treats an anonymous visitor as "authenticated" by default unless you specifically check for that. Nothing here is a copy paste template.
