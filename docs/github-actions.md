# GitHub Actions CI/CD Setup

## Overview

This project uses GitHub Actions for continuous integration and deployment. The setup includes:

- Automated testing
- Linting
- Building
- Database seeding for test environments
- Deployment pipeline

## Workflow Files

Two main workflow files control the CI/CD process:

1. **main.yml**: Handles testing, linting, and building the application
2. **deploy.yml**: Manages the deployment process (triggered only after successful tests)

## CI Process

The CI process includes:

- Setting up Node.js and MongoDB
- Installing dependencies
- Running linters
- Building the application
- Seeding the test database
- Running automated tests

## Deployment

The deployment workflow is configured to:

- Deploy only after all tests pass
- Build the production version of the application
- Deploy to your chosen hosting platform (currently configured as a placeholder)

## Customizing Deployment

To deploy to specific platforms, uncomment and configure the relevant sections in `.github/workflows/deploy.yml`:

### For Vercel:
```yaml
- name: Deploy to Vercel
  run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### For Heroku:
```yaml
- name: Deploy to Heroku
  uses: akhileshns/heroku-deploy@v3.12.14
  with:
    heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
    heroku_app_name: "your-app-name"
    heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## Required Secrets

For deployment, you need to add the following secrets to your GitHub repository:

1. Go to your repository settings
2. Select "Secrets and variables" > "Actions"
3. Add the required secrets for your deployment platform (e.g., `VERCEL_TOKEN`, `HEROKU_API_KEY`, etc.)

## Running Workflows Manually

You can trigger the deployment workflow manually:

1. Go to the "Actions" tab in your repository
2. Select the "Pricefy Deployment" workflow
3. Click "Run workflow"
