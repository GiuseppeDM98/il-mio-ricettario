from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Go to registration page
    page.goto("http://localhost:3000/register")

    # Fill out the form
    page.get_by_placeholder("Nome completo").fill("Test User")
    # Use a unique email to avoid conflicts on re-runs
    unique_email = f"testuser_{int(time.time())}@example.com"
    page.get_by_placeholder("Email").fill(unique_email)
    page.get_by_placeholder("Password").fill("password123")

    # Click the register button
    page.get_by_role("button", name="Registrati").click()

    # Wait for navigation to the recipes page
    expect(page).to_have_url("http://localhost:3000/ricette", timeout=30000)

    # Assert that the welcome text for new users is visible
    expect(page.get_by_text("Nessuna ricetta trovata")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)