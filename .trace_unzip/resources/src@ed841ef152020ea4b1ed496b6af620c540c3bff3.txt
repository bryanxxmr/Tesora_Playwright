import { Page } from "@playwright/test";

export class LoginPageTesora {
    constructor(private page: Page) {}

  //Metodo para la pagina web de Certificacion
  async navigateToCertificationPage() {
    await this.page.goto('https://tesoracert.b2clogin.com/tesoracert.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_tesora_app_login&client_id=cf43f3d7-4a79-421b-a639-da991dcb9fd8&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fapp-cert.tesorabcp.com%2Floading&scope=openid&response_type=id_token&prompt=login');
  }

  async digitarMail(email: string) {
    await this.page.fill('#email', email);
  }

  async digitarPassword(password: string) {
    await this.page.fill('#password', password);
  }

  async submitLogin() {
    await this.page.click('#next');
  }

  async buscarOperacion() {
    await this.page.fill('#search-filter-control', '232832');
  }
}