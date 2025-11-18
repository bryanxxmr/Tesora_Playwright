import { Page, expect, type TestInfo } from "@playwright/test";

export class LoginPageTesora {
  constructor(private page: Page) {}

  // Metodo para la pagina web de Certificacion
  async navigateToCertificationPage() {
    await this.page.goto('https://tesoracert.b2clogin.com/tesoracert.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_tesora_app_login&client_id=cf43f3d7-4a79-421b-a639-da991dcb9fd8&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fapp-cert.tesorabcp.com%2Floading&scope=openid&response_type=id_token&prompt=login');
  }

  async digitarMail(email: string) {
    // Espera que el input de email esté visible antes de escribir
    await this.page.waitForSelector('#email', { state: 'visible', timeout: 15000 });
    await this.page.fill('#email', email);
  }

  async digitarPassword(password: string) {
    // Espera que el input de password esté visible antes de escribir
    await this.page.waitForSelector('#password', { state: 'visible', timeout: 15000 });
    await this.page.fill('#password', password);
  }

  async submitLogin() {
    // Espera que el botón esté disponible y lo clickea
    await this.page.waitForSelector('#next', { state: 'visible', timeout: 10000 });
    await this.page.click('#next');
  }

  /**
   * Helper de alto nivel: realiza el flujo completo de login y espera la navegación
   * hacia la sección de conciliaciones. Usar desde tests para reducir duplicación.
   */
  async loginAndWait(email: string, password: string) {
    await this.navigateToCertificationPage();
    await this.digitarMail(email);
    await this.digitarPassword(password);
    await Promise.all([
      this.page.waitForURL(/admin\/conciliations/, { timeout: 30000 }).catch(() => {}),
      this.submitLogin(),
    ]);
  }

  /**
   * Comprueba si la aplicación llegó a la pantalla de conciliaciones.
   * Intenta esperar la URL y, si no coincide, busca un header indicativo.
   */
  async isAtConciliations(timeout = 5000): Promise<boolean> {
    try {
      await this.page.waitForURL(/admin\/conciliations/, { timeout });
      return true;
    } catch {
      const header = this.page.locator('.header__title');
      try {
        // si el header aparece consideramos que está logueado
        await header.waitFor({ state: 'visible', timeout });
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Valida explícitamente que la aplicación está en la pantalla de conciliaciones.
   * Lanza una excepción si la comprobación falla (útil dentro de try/catch en tests).
   */
  async validateAtConciliations(timeout = 15000): Promise<void> {
    // Intentamos esperar la URL primero
    try {
      await this.page.waitForURL(/admin\/conciliations/, { timeout });
    } catch {
      // continuar: la expect más abajo dará un mensaje más claro
    }

    const header = this.page.locator('.header__title');

    // Comprobaciones explícitas con mensajes claros
    await expect(this.page, 'La URL no es la esperada (/admin/conciliations/)').toHaveURL(/admin\/conciliations/, { timeout });

    // Si hay un header, verificar que sea visible
    if (await header.count()) {
      await expect(header, 'El header de conciliaciones no está visible').toBeVisible({ timeout });
    }
  }

  /**
   * Adjunta un screenshot al TestInfo (útil desde el bloque catch de los tests).
   */
  async attachScreenshot(testInfo: TestInfo, name = 'screenshot') {
    await testInfo.attach(name, { body: await this.page.screenshot(), contentType: 'image/png' });
  }

  // Helper antiguo (no usado por el POM de login)
  async buscarOperacion() {
    await this.page.fill('#search-filter-control', '232832');
  }
}