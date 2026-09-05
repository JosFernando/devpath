import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`beginner explanation and optional detail are readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 });
    await page.route('**/cdn.jsdelivr.net/**', route => route.abort());
    await page.goto('/playground/js-1-variables-and-types');
    const guide = page.getByRole('region', { name: 'Explicação passo a passo' });
    await expect(guide.getByRole('heading', { name: 'Vamos entender do começo' })).toBeVisible();
    await expect(guide.getByText('Lia\n5', { exact: true })).toBeVisible();
    await expect(guide.getByText('7. A conta será 4 + 3. O nome continuará sendo Lia.')).not.toBeVisible();
    await guide.getByText('Ver resposta explicada', { exact: true }).click();
    await expect(guide.getByText('7. A conta será 4 + 3. O nome continuará sendo Lia.')).toBeVisible();
    const details = page.locator('.lesson-details');
    await expect(details).not.toHaveAttribute('open');
    await details.locator(':scope > summary').click();
    await expect(details).toHaveAttribute('open', '');
    await expect(details.getByText('Objetivo da aula', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await guide.locator('p').first().evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16);
    await page.getByRole('button', { name: 'Ir para o desafio', exact: true }).click();
    await expect(page.getByText('Sua tarefa', { exact: true })).toBeVisible();
  });
}
