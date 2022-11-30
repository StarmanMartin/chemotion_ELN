const { test, expect } = require('@playwright/test');

async function login(name, password, page) {
  await page.goto('http://localhost:3000/users/sign_in');

  await page.getByLabel('Email or name abbreviation(case-sensitive)').fill(name);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
}

test('visit site', async ({ page }) => {
  await page.goto('http://localhost:3000/home');

  await expect(page.getByRole('button', { name: 'Chemotion' })).toBeVisible();
});

test('login as admin', async ({ page }) => {
  await login('ADM', 'PleaseChangeYourPassword', page);

  await expect(page.getByRole('heading', { name: 'ELN Administration' })).toBeVisible();
});

test('login as user', async ({ page }) => {
  await login('CU1', '@complat', page);
  await expect(page.getByRole('button', { name: 'User1 Complat' })).toBeVisible();
});
