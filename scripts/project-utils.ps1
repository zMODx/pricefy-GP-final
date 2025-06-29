# PowerShell script for common project tasks
# Usage: .\scripts\project-utils.ps1 -Task [build|dev|lint|clean]

param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("build", "dev", "lint", "clean", "install-deps")]
    [string]$Task
)

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $projectRoot

function Start-Build {
    Write-Host "Building the project..." -ForegroundColor Green
    pnpm run build
}

function Start-Development {
    Write-Host "Starting development server..." -ForegroundColor Green
    pnpm run dev
}

function Start-Linting {
    Write-Host "Running linting..." -ForegroundColor Green
    pnpm run lint
}

function Start-Cleaning {
    Write-Host "Cleaning project cache..." -ForegroundColor Green
    
    # Remove Next.js build output
    if (Test-Path ".next") {
        Remove-Item -Recurse -Force ".next"
        Write-Host "Removed .next folder" -ForegroundColor Yellow
    }
    
    # Remove node_modules (optional, uncomment if needed)
    # if (Test-Path "node_modules") {
    #     Remove-Item -Recurse -Force "node_modules"
    #     Write-Host "Removed node_modules folder" -ForegroundColor Yellow
    # }
    
    # Clear npm cache
    Write-Host "Clearing pnpm cache..." -ForegroundColor Yellow
    pnpm store prune
}

function Install-Dependencies {
    Write-Host "Installing project dependencies..." -ForegroundColor Green
    pnpm install
}

# Execute the selected task
switch ($Task) {
    "build" { Start-Build }
    "dev" { Start-Development }
    "lint" { Start-Linting }
    "clean" { Start-Cleaning }
    "install-deps" { Install-Dependencies }
}
