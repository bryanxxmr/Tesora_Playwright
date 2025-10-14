import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('Login web Tesora Desarrollo',async ({ page }) => {
  await page.goto('https://b2b-front-dev.azurewebsites.net/')
  //esperar 10 segundos
  await page.waitForTimeout(10000);
  //el id de campo de texto es email
  await page.fill('#email', 'test@gmail.com');
  await page.fill('#password', 'Tesora1234');
  //el id del boton tiene como id next
  await page.click('#next');
  //esperar 10 segundos
  await page.waitForTimeout(10000);
  //el header_title es header__title es Conciliaciones
  await expect(page.locator('.header__title')).toHaveText('Conciliaciones');
});

test('Login web Tesora Certificación',async ({ page }) => {
  await page.goto('https://b2b-front-cert.azurewebsites.net/auth/sign-in')
  await page.waitForTimeout(10000);
  //el id de campo de texto es email-control
  await page.fill('#email-control', 'nayllenrojas@bcp.com.pe');
  await page.fill('#password-control', 'Peru@2025');
  //el id del boton tiene como id sign-in__submit
  await page.click('#sign-in__submit');
  //el header_title es header__title es Conciliaciones
  //await expect(page.locator('.header__title')).toHaveText('Conciliaciones');
  await page.fill('#search-filter-control','1');
  await page.waitForTimeout(5000);
  //hay un checked que tiene como nombre locator('p-tablecheckbox div').nth(2)
  await page.getByRole('cell', { name: 'transaction Conciliar points-' }).locator('a').click();
  //llama a un modal y tiene getByText('close Realizar conciliación')
  await expect(page.getByText('close Realizar conciliación')).toBeVisible();
  //ditigar dentro de #electronic-receipts-searcher FFA1-0007340
  await page.fill('#electronic-receipts-searcher-control','FFA1-0007340');
  //getByRole('row', { name: 'FFA1-0007340 star 01/07/2025' }).locator('p-tablecheckbox div').nth(2)
  await page.getByRole('row', { name: 'FFA1-0007340 star 01/07/2025' }).locator('p-tablecheckbox div').nth(2).click();
  await page.getByRole('button', { name: 'Conciliar' }).click();
  await expect(page.getByText('Guardando conciliación')).toBeVisible();
  await expect(page.getByText('¡Con éxito!')).toBeVisible();
  await page.waitForTimeout(5000);
});