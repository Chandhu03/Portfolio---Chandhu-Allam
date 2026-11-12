# Chandhu Allam — portfolio

Static portfolio site served by GitHub Pages from the root of `main`:
https://chandhu03.github.io/Portfolio---Chandhu-Allam/

No build step and no runtime dependencies: plain HTML, one stylesheet and one small script.

## Structure

| Path | Contents |
|------|----------|
| `index.html` | Home: positioning, selected work, teaching and experience, skills, contact |
| `work/*.html` | Case studies: SecureMind, PhishGuard, IoT Sentinel, forensic investigations, SecureText |
| `resume.html` | Web résumé with a print stylesheet (use "Save as PDF") |
| `assets/css/site.css` | Design tokens and all styles |
| `assets/js/site.js` | Mobile navigation, header state, print button, hero light |
| `assets/img`, `assets/work` | Portrait, social image and real application screenshots |
| `projects.html`, `projects/*.html` | Redirects from the previous site's URLs |
| `404.html` | Not-found page (absolute paths, served at any depth) |

## Preview locally

```sh
python -m http.server 8000
# open http://localhost:8000/
```

## Content rules

- Every metric on the site comes from a project artefact (metrics files, evaluation reports, test runs). Update numbers from those sources, not from memory.
- Keep team work credited as team work, and keep "planned" separate from "done".
- Never publish a phone number, home address, student number or private course material.
