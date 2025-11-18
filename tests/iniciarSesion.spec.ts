import { test, expect } from '@playwright/test';
import { LoginPageTesora } from '../Pages/loginPageTesora';
import credential from '../credencial.json';

/**
 * Test: Iniciar Sesion
 * - Usa el Page Object `LoginPageTesora`.
 * - Toma credenciales desde variables de entorno con fallback a `credencial.json`.
 */

const creds = {
  username: process.env.TESORA_USER ?? credential.tesoraCertificacion.username,
  password: process.env.TESORA_PASS ?? credential.tesoraCertificacion.password,
};

test('Iniciar Sesion', async ({ page }, testInfo) => {
  const loginPage = new LoginPageTesora(page);

  // Navegar a la página de certificación/login
  await loginPage.navigateToCertificationPage();

  // Esperar que el formulario de login esté disponible
  await page.waitForSelector('#email', { timeout: 15000 });

  // Ingresar credenciales desde POM
  await loginPage.digitarMail(creds.username);
  await loginPage.digitarPassword(creds.password);

  // Enviar y esperar la navegación esperada (conciliaciones)
  await Promise.all([
    page.waitForURL(/admin\/conciliations/, { timeout: 30000 }).catch(() => {}),
    loginPage.submitLogin(),
  ]);

  // Validaciones básicas post-login
  try {
    await expect(page).toHaveURL(/admin\/conciliations/, { timeout: 15000 });
    // Header opcional si existe en la app
    const header = page.locator('.header__title');
    if (await header.count()) {
      await expect(header).toBeVisible({ timeout: 10000 });
    }
  } catch (err) {
    // Adjuntar evidencia en caso de fallo
    await testInfo.attach('screenshot-on-failure', { body: await page.screenshot(), contentType: 'image/png' });
    throw err;
  }

  // Adjuntar un screenshot final para el reporte
  await testInfo.attach('screenshot-final', { body: await page.screenshot(), contentType: 'image/png' });
});
