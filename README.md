# Braveclaw

Braveclaw is a static research library designed for researchers.

## Structure

- `public/` - deployable site root
- `public/assets/` - shared styles and scripts
- `public/research/` - case files and future research folders
- `public/research/remitbridge/` - the first dossier based on the supplied brief

## Local Preview

From the repo root:

```bash
cd public
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## GitHub Pages

This repo is configured for deployment to GitHub Pages from the `public/` directory via GitHub Actions.

- **Deployment Workflow**: `.github/workflows/deploy.yml`
- **Output Directory**: `public`

The site is automatically deployed to GitHub Pages on every push to the `main` branch.

