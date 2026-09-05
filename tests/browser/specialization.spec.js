import { test, expect } from '@playwright/test';

test('the roadmap exposes phases and the final project of every module on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Saiba de onde partir e o que vai construir.' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Explorar a fase/ })).toHaveCount(4);
  await page.getByRole('button', { name: 'Expandir módulos', exact: true }).click();
  const modules = await page.evaluate(async () => {
    const { jsRoadmapCourse } = await import('/src/data/roadmapData.js');
    return jsRoadmapCourse.modules.map((module) => ({ id: module.id, project: jsRoadmapCourse.stages.find((stage) => stage.id === module.projectStageId).title.replace(/^[^\p{L}\p{N}]+/u, '') }));
  });
  for (const module of modules) {
    await expect(page.locator(`[id="${module.id}"]`).getByRole('heading', { name: module.project, exact: true })).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('a lesson ends with a project plan and an optional extra challenge', async ({ page }) => {
  await page.route('**/cdn.jsdelivr.net/**', (route) => route.abort());
  await page.goto('/playground/js-1-variables-and-types');
  await page.getByText('Desafio extra da lição', { exact: true }).click();
  await expect(page.getByText(/Crie uma variável de pontuação/)).toBeVisible();
  await page.getByRole('button', { name: 'Ver plano do projeto', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Construa etapa por etapa' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Critérios de entrega' })).toBeVisible();
  await expect(page.getByText(/etapas preparatórias pendentes neste módulo/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Abrir projeto do módulo', exact: true })).toHaveCount(0);
});

test('a completed original lesson remains accessible after new prerequisites are added', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('devpath_roadmap_progress_v2', JSON.stringify({
    completedStages: ['js-4-arrow-functions-defaults'], currentStageId: 'js-4-arrow-functions-defaults',
  })));
  await page.goto('/');
  await page.getByRole('button', { name: 'Expandir módulos', exact: true }).click();
  await expect(page.locator('a[href="/playground/js-4-arrow-functions-defaults"]')).toBeVisible();
});

for (const mode of ['starter', 'solution']) {
  test(`new curriculum ${mode === 'starter' ? 'starters cannot pass without implementation' : 'reference implementations satisfy the real browser checks'}`, async ({ page }) => {
    test.setTimeout(120000);
    await page.goto('/');
    const outcomes = await page.evaluate(async (mode) => {
      const [{ jsRoadmapCourse }, { buildPreview, loadPreview, withTimeout }, { foundationSolutions }, { advancedSolutions }] = await Promise.all([
        import('/src/data/roadmapData.js'),
        import('/src/lib/playgroundRuntime.js'),
        import('/tests/fixtures/foundationSolutions.js'),
        import('/tests/fixtures/advancedSolutions.js'),
      ]);
      const solutions = { ...foundationSolutions, ...advancedSolutions };
      const results = [];
      const iframe = document.createElement('iframe');
      iframe.title = 'Verificação curricular';
      document.body.append(iframe);
      try {
        for (const [id, solution] of Object.entries(solutions)) {
          const stage = jsRoadmapCourse.stages.find((item) => item.id === id);
          if (!stage) { results.push({ id, error: 'Stage missing' }); continue; }
          const files = { ...stage.playground.files, ...(mode === 'solution' ? solution : {}) };
          await loadPreview(iframe, buildPreview(files, `verify-${mode}-${id}`));
          const win = iframe.contentWindow;
          const helpers = { files, source: files['script.js'], getVar: (name) => win.__getVar?.(name) ?? win[name], logs: win.__consoleLogs, consoleCalls: win.__consoleCalls, errors: win.__scriptErrors };
          const checks = [];
          for (const task of stage.playground.tasks) {
            try { checks.push({ id: task.id, ...await withTimeout(Promise.resolve().then(() => task.check(iframe.contentDocument, win, helpers))) }); }
            catch (error) { checks.push({ id: task.id, pass: false, tip: error.message }); }
          }
          results.push({ id, allPassed: checks.length > 0 && checks.every((check) => check.pass), failures: checks.filter((check) => !check.pass), errors: helpers.errors.map((error) => error.message) });
        }
      } finally { iframe.remove(); }
      return results;
    }, mode);
    expect(outcomes.length).toBeGreaterThanOrEqual(25);
    for (const result of outcomes) {
      expect(result.error, result.id).toBeUndefined();
      if (mode === 'solution') expect(result.errors, result.id).toEqual([]);
      expect(result.allPassed, `${result.id}: ${JSON.stringify(result.failures)}`).toBe(mode === 'solution');
    }
  });
}
