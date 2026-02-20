# Webinar Landing Page Funnel

A single-page webinar funnel with lead capture and a second-page redirect.

## What’s included

- **Landing page** (`index.html`) with:
  - Header (Bodner & Clark logo + WATCH NOW)
  - Hero: headline, description, benefit list, video thumbnail
  - “What You’ll Discover” (4 modules in a 2×2 grid)
  - Accordion list (9 items with + icons)
  - “Who This Training Is Built For” + RESERVE YOUR SEAT CTA
- **Lead capture modal**: name, email, phone. Opens when any **WATCH NOW** or **RESERVE YOUR SEAT** button is clicked.
- **Second page** (`watch.html`): placeholder after form submit. Replace with your real second page when ready.

## Flow

1. User visits `index.html`.
2. User clicks any CTA → modal opens (name, email, phone).
3. User submits form → lead is stored in `localStorage` (optional; you can hook to your backend) and browser goes to `watch.html`.

## Run locally

No build step. Open in a browser:

```bash
# From project folder:
open index.html
# or use a simple server (e.g. Live Server in VS Code, or):
npx serve .
```

Then open `http://localhost:3000` (or the URL your server shows).

## Customize

- **Second page URL**: In `js/main.js`, set `secondPageUrl` to your real thank-you/watch page path.
- **Backend**: In the form `submit` handler in `js/main.js`, add a `fetch()` (or similar) to send name/email/phone to your API before redirecting.
- **Video**: Replace the video thumbnail block with a real embed (e.g. Vimeo/YouTube iframe) on the second page when you have the design.

## Files

- `index.html` – Landing page
- `watch.html` – Placeholder second page (to be replaced)
- `css/styles.css` – Styles
- `js/main.js` – Modal, accordion, form submit and redirect
