# Project-specific PowerShell profile for Pricefy
# Save this as "pricefy-profile.ps1" in your project root directory
# To use: . .\pricefy-profile.ps1

Write-Host "Loading Pricefy PowerShell profile..." -ForegroundColor Cyan

# Set environment variables
$env:NEXT_PUBLIC_API_URL = "http://localhost:3000/api"

# Define shortcuts for common tasks using Set-Alias instead of functions
function Start-PricefyDev { & .\scripts\project-utils.ps1 -Task dev }
function Start-PricefyBuild { & .\scripts\project-utils.ps1 -Task build }
function Start-PricefyLint { & .\scripts\project-utils.ps1 -Task lint }
function Start-PricefyClean { & .\scripts\project-utils.ps1 -Task clean }
function Install-PricefyDeps { & .\scripts\project-utils.ps1 -Task install-deps }

# Set aliases for the functions
Set-Alias -Name pfdev -Value Start-PricefyDev
Set-Alias -Name pfbuild -Value Start-PricefyBuild
Set-Alias -Name pflint -Value Start-PricefyLint
Set-Alias -Name pfclean -Value Start-PricefyClean
Set-Alias -Name pfinstall -Value Install-PricefyDeps

# Define a function to update all dependencies
function Update-PricefyDependencies {
    Write-Host "Updating all dependencies to their latest versions..." -ForegroundColor Green
    pnpm update --latest
}

# Set alias for the update function
Set-Alias -Name pfupdate -Value Update-PricefyDependencies

# Create a better prompt for the project
function prompt {
    $projectName = "Pricefy"
    $location = $(Get-Location).Path
    $nodeVersion = (node --version).Trim()
    $pnpmVersion = (pnpm --version).Trim()
    
    Write-Host "[$projectName]" -NoNewline -ForegroundColor Magenta
    Write-Host " $location" -NoNewline -ForegroundColor Green
    Write-Host " (Node $nodeVersion | PNPM $pnpmVersion)" -ForegroundColor Gray
    return "> "
}

# Print available commands
Write-Host "Available commands:" -ForegroundColor Yellow
Write-Host "  pfdev     - Start development server" -ForegroundColor White
Write-Host "  pfbuild   - Build the project" -ForegroundColor White
Write-Host "  pflint    - Run linting" -ForegroundColor White
Write-Host "  pfclean   - Clean project build files" -ForegroundColor White
Write-Host "  pfinstall - Install dependencies" -ForegroundColor White
Write-Host "  pfupdate  - Update all dependencies" -ForegroundColor White

Write-Host "`nTo use this profile in any PowerShell session, run: . .\pricefy-profile.ps1" -ForegroundColor Cyan
