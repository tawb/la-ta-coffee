# Email Provider Decision

## Current state

auth-service sends email through Gmail SMTP, using credentials supplied via
environment variables (MAIL_USERNAME, MAIL_PASSWORD). Sending is now abstracted
behind a MailProvider interface, with GmailProvider as the current, real
implementation.

## The three real options considered

### Option A: stay on Gmail

Genuinely free, and it already works. But it has real, practical limits for a
production system:

- A normal Gmail account has a real, enforced sending cap, roughly 500 emails
  per day. A real, growing customer base would hit this quickly.
- Gmail SMTP has no real delivery guarantees, no retry queue on their end, no
  bounce or complaint reporting.
- We directly experienced, during development, that outbound port 587 can be
  blocked entirely by a network or ISP, with no way to work around it from our
  side. A real production deployment shouldn't depend on port 587 being open
  wherever it happens to run.

### Option B: self-hosted SMTP

Full control over the server, but a genuinely real, ongoing operational
burden. Running your own mail server means:

- Managing your own IP reputation, if it gets flagged as a spam source, every
  email is affected, not just one account.
- Setting up and maintaining real SPF, DKIM, and DMARC records correctly, and
  keeping them correct as infrastructure changes.
- No real, built-in monitoring, bounce handling, or deliverability insight,
  all of that would need to be built separately.

This is genuinely more work than a small team should take on for something
that isn't the actual core product.

## Decision: move to a transactional email provider

The real, correct replacement is a transactional email provider, specifically
recommending **AWS SES** (Amazon Simple Email Service).

Reasoning:

- Genuinely built for exactly this use case, transactional, one-to-one emails
  like password resets and welcome messages, not bulk marketing.
- Real, established sender reputation already in place, meaningfully better
  real-world deliverability than a personal Gmail account.
- Real, built-in monitoring for bounces, complaints, and delivery status.
- Genuinely cheap at real scale, a fraction of a cent per email, with a free
  tier covering realistic early-stage volume.
- If this project ever deploys on AWS infrastructure, SES integrates directly,
  no separate account or billing relationship needed.

## Why this is a low-risk change to make later

Because sending is already abstracted behind the real MailProvider interface,
switching providers means writing one new class, SesProvider, implementing
the same send(to, subject, plainTextBody, htmlBody) method, and changing
which implementation Spring wires in. EmailService, the Thymeleaf templates,
the retry logic, and the async behavior all stay exactly as they are, none of
that code needs to change at all.

## What actually needs to happen to make the switch, when it's time

1. Create an AWS account and verify a sending domain in SES.
2. Add the AWS SDK for Java dependency.
3. Write SesProvider implementing MailProvider, using the SES SDK client
   instead of JavaMailSender.
4. Swap which @Component is active, either by removing GmailProvider or using
   a real Spring profile to choose between them per environment.
5. Move out of SES's sandbox mode once ready for real, unrestricted sending.

## Status

Staying on Gmail for now, since this is still a development-stage project.
This document is the real, honest answer to "what replaces Gmail", not a
statement that the replacement has happened yet.