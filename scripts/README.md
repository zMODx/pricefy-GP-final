# Pricefy Project PowerShell Scripts

This directory contains PowerShell scripts to help you manage the Pricefy project more efficiently.

## Prerequisites

- PowerShell 5.1 or higher
- Node.js
- PNPM package manager

## Available Scripts

### project-utils.ps1

A utility script for common project tasks.

```powershell
# Usage
.\scripts\project-utils.ps1 -Task <task>

# Available tasks
.\scripts\project-utils.ps1 -Task build      # Build the project
.\scripts\project-utils.ps1 -Task dev        # Start development server
.\scripts\project-utils.ps1 -Task lint       # Run linting
.\scripts\project-utils.ps1 -Task clean      # Clean project build files
.\scripts\project-utils.ps1 -Task install-deps # Install dependencies
```

### analyze-deps.ps1

A script to analyze and manage project dependencies.

```powershell
# Usage
.\scripts\analyze-deps.ps1 -Action <action>

# Available actions
.\scripts\analyze-deps.ps1 -Action list      # List all dependencies
.\scripts\analyze-deps.ps1 -Action outdated  # Check for outdated dependencies
.\scripts\analyze-deps.ps1 -Action security  # Scan for security vulnerabilities
.\scripts\analyze-deps.ps1 -Action cleanup   # Remove unused dependencies
```

## Project Profile

To use the project-specific PowerShell profile, source it in your PowerShell session:

```powershell
. .\pricefy-profile.ps1
```

This will load all the project-specific aliases and functions:

- `pfdev` - Start development server
- `pfbuild` - Build the project
- `pflint` - Run linting
- `pfclean` - Clean project build files
- `pfinstall` - Install dependencies
- `pfupdate` - Update all dependencies

## Execution Policy

If you encounter script execution policy issues, you might need to set your execution policy:

```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Adding New Scripts

When adding new PowerShell scripts, follow these guidelines:

1. Use approved PowerShell verbs (Get, Set, Start, Stop, etc.)
2. Include parameter validation
3. Add helpful comments
4. Update this README with the new script details
