## GitHub Actions CI/CD

The project uses GitHub Actions for continuous integration and deployment, providing automated testing, building, and deployment workflows.

### CI/CD Setup

- **Automated Testing**: All code changes are automatically tested
- **Linting**: Code quality checks are performed on every push and PR
- **Database Seeding**: Test database is automatically populated with sample data
- **Build Verification**: Ensures the application builds successfully
- **Deployment Pipeline**: Automates the deployment process

### Configuration Files

- `.github/workflows/main.yml`: Main CI workflow for testing and building
- `.github/workflows/deploy.yml`: Deployment workflow

### Detailed Documentation

For detailed information about the GitHub Actions setup, including customization and manual triggers, see [GitHub Actions Documentation](docs/github-actions.md).
