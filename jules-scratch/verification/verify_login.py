from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000/login")

    page.get_by_placeholder("Email").fill("test@example.com")
    page.get_by_placeholder("Password").fill("password")
    page.get_by_role("button", name="Accedi").click()

    page.wait_for_url("http://localhost:3000/ricette")

    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)