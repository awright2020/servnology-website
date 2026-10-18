# Servnology website

A single-page marketing site for servnology.com. Plain HTML, CSS and JavaScript, with no build step.

```
index.html        all page copy and image links
css/styles.css    colors, fonts and layout (colors and fonts are at the top)
js/main.js        mobile menu, header, demo form
assets/           favicon; put founder headshots here
CNAME             tells GitHub Pages to serve the site at servnology.com
```

## Editing
- **Pages:** `index.html` (home), `problem.html`, `voice-agent.html`, `benefits.html`, `mission.html`, `team.html`, `demo.html`.
- **Words:** open the page and edit the text in place.
- **Photos:** search the page for `IMAGE:` and replace the `src="..."` URL.
- **Example calls** on the Voice Agent page: edit `CALL_SCENARIOS` at the top of `js/main.js`.
- **Header, footer and email** are repeated on every page, so change them on each `.html` file.
- **Colors and fonts:** change the variables at the top of `css/styles.css`.

## Still to do before launch
- **Headshots:** save each photo as `assets/alexander-wright.jpg` and `assets/rohan-kumar.jpg`. They replace the placeholders automatically.
- **Email:** the site uses aew244@cornell.edu. When your servnology.com address is ready, search every `.html` file and `js/main.js` for `aew244@cornell.edu` and replace it.

## Connect the demo form
GitHub Pages can't receive form submissions by itself, so the form uses a free form service.
1. Create a free form at https://formspree.io and copy its endpoint URL (looks like `https://formspree.io/f/abcdwxyz`).
2. In `demo.html`, find `data-endpoint=""` on the form and paste the URL between the quotes.
Until then, the form tells visitors to email you instead.

## Photos
Photos are loaded from Unsplash and are free to use under the Unsplash License. Before launch, open the site and check that you like each one; swap any you don't.

## Publishing
See `../getting-started.md` for the GitHub Pages and Porkbun DNS steps. Upload the **contents** of this folder (not the folder itself) to the root of the repository.
