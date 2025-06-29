# PowerShell script to analyze and manage dependencies
# Usage: .\scripts\analyze-deps.ps1 [-Action <Action>]

param (
    [Parameter(Mandatory=$false)]
    [ValidateSet("list", "outdated", "security", "cleanup")]
    [string]$Action = "list"
)

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $projectRoot

function Show-Dependencies {
    Write-Host "Listing project dependencies..." -ForegroundColor Green
    pnpm list --depth=0
    
    Write-Host "`nDependency Statistics:" -ForegroundColor Cyan
    $packageJson = Get-Content -Path "package.json" | ConvertFrom-Json
    $dependencies = $packageJson.dependencies.PSObject.Properties.Name.Count
    $devDependencies = $packageJson.devDependencies.PSObject.Properties.Name.Count
    
    Write-Host "- Production dependencies: $dependencies" -ForegroundColor Yellow
    Write-Host "- Development dependencies: $devDependencies" -ForegroundColor Yellow
    Write-Host "- Total: $($dependencies + $devDependencies)" -ForegroundColor Yellow
}

function Show-OutdatedDependencies {
    Write-Host "Checking for outdated dependencies..." -ForegroundColor Green
    pnpm outdated
}

function Test-SecurityVulnerabilities {
    Write-Host "Scanning for security vulnerabilities..." -ForegroundColor Green
    pnpm audit
}

function Remove-UnusedDependencies {
    Write-Host "Analyzing for unused dependencies..." -ForegroundColor Green
    
    Write-Host "`nCleaning node_modules folder..." -ForegroundColor Yellow
    pnpm prune
    
    Write-Host "`nRemoving extraneous packages..." -ForegroundColor Yellow
    pnpm dedupe
}

# Execute the selected action
switch ($Action) {
    "list" { Show-Dependencies }
    "outdated" { Show-OutdatedDependencies }
    "security" { Test-SecurityVulnerabilities }
    "cleanup" { Remove-UnusedDependencies }
}
