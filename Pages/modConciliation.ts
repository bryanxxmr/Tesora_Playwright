import { Page, expect } from "@playwright/test";

export class ModConciliation {
  constructor(private page: Page) {}

  async navigateToConciliationPage() {
    await this.page.goto('https://app-cert.tesorabcp.com/admin/conciliations');
  }

  async esperaCargaInicial() {
    // Verifica que el header sea visible y tenga el texto correcto
    await this.page.waitForTimeout(1000);
    await expect(this.page.locator('.header__title')).toBeVisible();
    await expect(this.page.locator('.header__title')).toHaveText('Conciliaciones');
  }

  async buscarOperacion() {
    await this.page.fill('#search-filter-control', '13664');
    await this.page.waitForTimeout(4000);
  }

  async marcarCheckOperacion() {
    await this.page.getByRole('cell', { name: 'transaction Conciliar points-' }).locator('a').click();
  }

  async buscarComprobante() {
    await this.page.fill('#electronic-receipts-searcher-control', 'FFF1-0000022');
  }

  async marcarComprobante() {
    //quiero que al aparecer el elemento le haga click(await this.page.getByRole('row', { name: 'FFA1-0007053 star 01/07/2025' }).locator('p-tablecheckbox div').nth(2).click();)


    const row = this.page.getByRole('row', { name: 'FFF1-0000022 star 17/09/2025' });
    await expect(row).toBeVisible();
    await row.locator('[id="-checkbox-0"] div').nth(2).click();
  }

  async botonConciliar() {
    await this.page.getByRole('button', { name: 'Conciliar' }).click();
  }

  async validaConciliacion() {
    await expect(this.page.getByText('Guardando conciliación')).toBeVisible({ timeout: 15000 });
    // Verifica que el mensaje de éxito aparece al final
    await expect(this.page.getByText('¡Con éxito!')).toBeVisible({ timeout: 15000 });
  }
}