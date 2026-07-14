# B&B Driving Academy — Landing Website

A fast, mobile-first landing page for **B&B Driving Academy**.
Static HTML/CSS/JS — no build step, no dependencies. Deploys to Netlify or Vercel as-is.

> **Learn. Practice. Pass.** — Certified Code 8, 10 & 14 instruction, learners classes and test bookings. Open 7 days a week.

## Features

- **Pixel-canvas hero** — animated pixel-ripple background, glass shimmer headline, glass CTA buttons, and a scrolling trust marquee (recreated in vanilla JS/CSS, no framework).
- **WhatsApp booking** — visitor enters name, area and service; the button opens WhatsApp with the message pre-filled and ready to send. No backend required.
- Services, Why-Us, animated stats, and a full contact footer.
- Sticky nav — on mobile the logo is enlarged (left), with a "Book a Lesson" button kept in the header bar plus a slide-in drawer.
- Fully responsive (mobile-first), accessible, and respects `prefers-reduced-motion` (static pixel field, no animation).

## Brand

| | |
|---|---|
| Red | `#E11B22` |
| Navy | `#14213D` |
| WhatsApp / Phone | 083 749 1860 (`wa.me/27837491860`) |
| Social | Facebook & Instagram — `@BBDRIVNGACADEMY` |
| Web | www.bandbdriving.co.za |

## Structure

```
index.html      # markup + content
styles.css      # all styling / responsive rules
script.js       # nav, reveals, counters, hero parallax, WhatsApp booking
assets/         # logo + campaign creatives
netlify.toml    # Netlify config (also works on Vercel with no changes)
```

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

**Netlify** — drag the folder into Netlify, or connect this repo. Publish directory: `.` (root). No build command.

**Vercel** — import the repo; framework preset **Other**, output directory root. No build command.

## Things to update

- **WhatsApp number** — change `WA_NUMBER` in `script.js` (and the `wa.me/` / `tel:` links in `index.html`) if the number changes.
- **Email** — `info@bandbdriving.co.za` is a placeholder in the booking + footer; swap for the real inbox.
- **Social links** — point Facebook/Instagram URLs at the real handles.
- **Pricing** — add a pricing section/table once package prices are confirmed.
