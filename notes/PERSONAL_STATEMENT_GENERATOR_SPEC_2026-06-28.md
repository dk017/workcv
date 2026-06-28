# WorkCV Personal Statement Generator

Research and implementation review date: 28 June 2026.

## User outcome

Turn three short inputs into a usable first draft of a UK CV personal statement:

- current role or background
- exact target role
- two or three relevant skills or achievements

The result is one paragraph, 3–4 sentences and 50–100 words. It uses implied
first person, UK English and only facts supplied by the user.

## Evidence

- The National Careers Service describes the CV introduction as a few short
  lines summarising who the applicant is and what they hope to do. It advises
  tailoring the CV to the advert and highlighting requested skills.
- Prospects advises no more than 150 words, short sentences, evidence, vacancy
  tailoring and avoiding clichés, jargon and empty claims.
- Prospects warns that AI-generated profiles can sound generic or insincere and
  recommends using AI responsibly for ideas, structure and editing.
- OpenAI states API inputs and outputs are not used for model training by
  default. Abuse-monitoring logs may retain customer content for up to 30 days.

Sources:

- https://nationalcareers.service.gov.uk/careers-advice/cv-sections
- https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters/writing-a-personal-statement-for-your-cv/
- https://platform.openai.com/docs/guides/structured-outputs
- https://platform.openai.com/docs/guides/your-data

## Product decisions

- Use OpenAI Responses API structured output, not Claude.
- Default to `gpt-5.4-mini`, which OpenAI currently recommends for lower-cost,
  lower-latency workloads. Allow override with
  `OPENAI_PERSONAL_STATEMENT_MODEL`.
- Set `store: false`; do not persist form inputs or output in WorkCV.
- Validate input on client and server.
- Reject outputs outside 50–100 words or 3–4 sentences, outputs with personal
  pronouns, common empty clichés, placeholders or numeric claims absent from
  the inputs.
- Retry once with concrete correction feedback, then fail rather than return a
  low-quality statement.
- Apply a bounded, per-process rate limit of six requests per 15 minutes for
  each hashed client address. Deployment uses one application container; a
  shared datastore will be needed before horizontal scaling.
- Never log user input or generated text.

## Operational requirements

- `OPENAI_API_KEY` is required in the server deployment environment.
- `RATE_LIMIT_SALT` is recommended to make hashed client identifiers
  deployment-specific.
- The page must state that data is sent to OpenAI and link to current data
  controls.
- Live API generation needs an integration smoke test after the deployment key
  is configured.

