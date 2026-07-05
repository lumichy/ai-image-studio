# Task 3 Report: Agnes API Client

## Status: DONE

## What Was Done

Created `src/lib/agnes.ts` with two exported functions:

1. **`generateTextToImage(prompt, styleId, sizeId)`** — Calls Agnes `/images/generations` endpoint with model `agnes-image-2.1-flash`, JSON body with prompt + size.
2. **`generateImageToImage(prompt, referenceImage, styleId, sizeId)`** — Calls Agnes `/images/edits` endpoint with model `agnes-image-2.0-flash`, FormData with prompt + size + reference image (converted from base64 to Blob).

## Implementation Details

- API base URL: `process.env.AGNES_API_BASE_URL` with fallback to `https://apihub.agnes-ai.com/v1`
- API key: `process.env.AGNES_API_KEY`
- Both functions consume `buildPrompt` and `getDimensions` from `./constants`
- `base64ToBlob` helper handles both data URL prefix (`data:image/png;base64,...`) and raw base64
- Error handling: throws `Error` with status code + raw response text
- No `Content-Type` header on I2I request (FormData sets boundary automatically)

## Verification

- `npx tsc --noEmit` — **passed**, zero errors

## Commit

- `bd01f69` — `feat: add Agnes API client wrapper`

## Concerns

None. Implementation matches the plan exactly.
