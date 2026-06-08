# Automated Outreach Pipeline

> Turn a single company domain into verified decision-makers and personalized outreach emails.

Built as a production-oriented outreach automation pipeline that discovers lookalike companies, finds decision-makers, enriches them with verified emails, generates personalized outreach, and prepares campaigns for delivery.

---

## Overview

Starting from a single company domain:

```text
stripe.com
```

The pipeline automatically:

1. Discovers similar companies
2. Finds decision-makers
3. Enriches contacts with verified work emails
4. Generates personalized outreach emails
5. Presents a review step
6. Sends emails through Brevo

---

## Architecture

<img width="1340" height="713" alt="image" src="https://github.com/user-attachments/assets/050e6030-1efc-4ad6-91e1-76eebadd9eea" />

---

## Pipeline Flow

```text
Input Domain
     │
     ▼
Ocean.io
(Lookalike Company Discovery)
     │
     ▼
Prospeo
(Decision Maker Search)
     │
     ▼
Hunter.io
(Email Enrichment & Verification)
     │
     ▼
Lead Qualification
     │
     ▼
Email Template Generation
     │
     ▼
Preview & Approval
     │
     ▼
Brevo
(Email Delivery)
```

---

## Features

### Company Discovery

Discover lookalike companies from a seed company domain using Ocean.io.

Example:

```text
stripe.com
     │
     ▼
razorpay.com
cashfree.com
adyen.com
rapyd.net
```

---

### Decision Maker Discovery

Find relevant stakeholders including:

* C-Level Executives
* Vice Presidents

using Prospeo's people search API.

---

### Email Enrichment

Enrich contacts with:

* Verified work emails
* Deliverability status
* Domain matching

using Hunter.io.

Example:

```json
{
  "fullName": "Vivek Agarwal",
  "title": "Vice President of Engineering",
  "companyName": "Razorpay",
  "email": "vivek.agarwal@razorpay.com",
  "emailStatus": "valid"
}
```

---

### Personalized Outreach

Generate customized outreach emails dynamically.

Example:

```html
Hi Vivek,

I came across Razorpay while researching innovative fintech companies.

As Vice President of Engineering, I thought you might be interested in connecting.

Best Regards,
Ritabrata Ghosh
```

---

### Human Approval Gate

Before sending any emails:

```text
Preview
   ↓
Review
   ↓
Approve
   ↓
Send
```

This prevents accidental outreach and provides an additional safety layer.

---

## Engineering Highlights

### Modular Architecture

Each provider is isolated behind a service layer:

```text
OceanService
ProspeoService
HunterService
BrevoService
```

This allows easy provider replacement without affecting business logic.

---

### Schema Validation

External API responses are validated using Zod.

Benefits:

* Runtime safety
* Consistent contracts
* Early failure detection

---

### Resilience

Built-in:

* Retry mechanisms
* Error handling
* Rate limit management
* Sequential processing for constrained APIs

---

### Logging

Powered by Winston.

Includes:

* Colored terminal output
* Pipeline stage visibility
* Error tracking
* Success metrics

---

## Project Structure

```text
src
│
├── clients/
│   ├── ocean.client.ts
│   ├── prospeo.client.ts
│   ├── hunter.client.ts
│   └── brevo.client.ts
│
├── services/
│   ├── ocean.service.ts
│   ├── prospeo.service.ts
│   ├── hunter.service.ts
│   └── brevo.service.ts
│
├── pipeline/
│   └── outreach.pipeline.ts
│
├── templates/
│   └── outreach.template.ts
│
├── schemas/
│
├── types/
│
├── utils/
│
├── config/
│
└── index.ts
```

---

## Tech Stack

### Runtime

* Node.js
* TypeScript

### APIs

* Ocean.io
* Prospeo
* Hunter.io
* Brevo

### Validation

* Zod

### Logging

* Winston
* Chalk

### HTTP Client

* Axios

---

## Environment Variables

Create a `.env` file:

```env
OCEAN_API_KEY=

PROSPEO_API_KEY=

HUNTER_API_KEY=

BREVO_API_KEY=
```

---

## Installation

```bash
npm install
```

---

## Run

```bash
npm run dev
```

Example:

```text
Enter company domain:

stripe.com
```

---

## Sample Output

```text
✓ Ocean    → 5 companies

✓ Prospeo  → 12 contacts

✓ Hunter   → 8 verified emails

📨 Email Preview Generated

Send emails? (y/N)
```

---

## Future Improvements

* Redis-based job queue
* BullMQ workers
* Contact deduplication database
* AI-powered email personalization
* Campaign analytics dashboard
* Open & click tracking
* Multi-provider fallback support
* Web dashboard

---
