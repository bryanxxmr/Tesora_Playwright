import { test, expect } from '@playwright/test';
import { LoginPageTesora } from '../Pages/loginPageTesora';
import { ModConciliation } from '../Pages/modConciliation';
import credential from '../credencial.json'



test('Login y Conciliacion Tesora Certificación',async ({ page }) => {
  const loginPage = new LoginPageTesora(page);
  await loginPage.navigateToCertificationPage();
  await page.waitForTimeout(6000);
  //el id de campo de texto es email-control
  await loginPage.digitarMail(credential.tesoraCertificacion.username);
  await loginPage.digitarPassword(credential.tesoraCertificacion.password); 
  await loginPage.submitLogin();
  await page.waitForTimeout(8000);
  //redireccionamiento a pagina https://b2b-front-cert.azurewebsites.net/admin/conciliations
  const modConciliation = new ModConciliation(page);
  await modConciliation.navigateToConciliationPage();
  await modConciliation.esperaCargaInicial();
  await modConciliation.buscarOperacion();
  await modConciliation.marcarCheckOperacion();
  await modConciliation.buscarComprobante();
  await modConciliation.marcarComprobante();
  await modConciliation.botonConciliar();
  await modConciliation.validaConciliacion();
})