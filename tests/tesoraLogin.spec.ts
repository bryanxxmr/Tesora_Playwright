import { test, expect } from '@playwright/test';
import { LoginPageTesora } from '../Pages/loginPageTesora';
import { ModConciliation } from '../Pages/modConciliation';
import credential from '../credencial.json'

const creds = {
  username: process.env.TESORA_USER ?? credential.tesoraCertificacion.username,
  password: process.env.TESORA_PASS ?? credential.tesoraCertificacion.password,
};

test('Login y Conciliacion Tesora Certificación',async ({ page }, testInfo) => {
  const loginPage = new LoginPageTesora(page);
  // Usar helper POM para navegar, logear y esperar la navegación esperada
  await loginPage.loginAndWait(creds.username, creds.password);

  const modConciliation = new ModConciliation(page);

  try {
    await modConciliation.esperaCargaInicial();
    await modConciliation.buscarOperacion();
    await modConciliation.marcarCheckOperacion();
    await modConciliation.buscarComprobante();
    await modConciliation.marcarComprobante();
    await modConciliation.botonConciliar();
    await modConciliation.validaConciliacion();
  } catch (err) {
    await testInfo.attach('screenshot-on-failure', { body: await page.screenshot(), contentType: 'image/png' });
    throw err;
  }
})

// Test adicional importado desde tests/iniciarSesion.spec.ts
test('Iniciar Sesion', async ({ page }, testInfo) => {
  const loginPage = new LoginPageTesora(page);
  // Usar helper del POM para realizar el login y esperar la navegación
  await loginPage.loginAndWait(creds.username, creds.password);

  // Validaciones básicas post-login (usando helper POM)
  try {
    // Método POM que lanza si la verificación falla
    await loginPage.validateAtConciliations(15000);
  } catch (err) {
    // Adjuntar evidencia en caso de fallo usando POM
    await loginPage.attachScreenshot(testInfo, 'screenshot-on-failure');
    throw err;
  }

  // Adjuntar un screenshot final para el reporte
  await loginPage.attachScreenshot(testInfo, 'screenshot-final');
});