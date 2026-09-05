import { test, expect } from '@playwright/test';

const firstStage = 'js-1-variables-and-types';
const storageKey = 'devpath_roadmap_progress_v2';
const solution = 'const nomeInstrutor = "JavaScript";\nlet anosExperiencia = 5;\nconsole.log(nomeInstrutor, anosExperiencia);';

async function openEditor(page, stageId = firstStage) {
  // The fallback must remain usable even when the editor CDN is unavailable.
  await page.route('**/cdn.jsdelivr.net/**', (route) => route.abort());
  await page.goto(`/playground/${stageId}`);
  await page.getByRole('button', { name: 'Simples', exact: true }).click();
  return page.getByRole('textbox', { name: 'Código de script.js', exact: true });
}

test('a starter fails, a real solution passes, edits invalidate results and the draft survives reload', async ({ page }) => {
  const editor = await openEditor(page);
  await page.getByRole('button', { name: /Executar código/ }).click();
  await expect(page.getByRole('button', { name: /Executar código/ })).toBeEnabled();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '{}').completedStages || [], storageKey)).toEqual([]);

  await editor.fill(solution);
  await expect(page.getByText('Código alterado. Use Executar código para atualizar o resultado.')).toBeVisible();
  await page.getByRole('button', { name: /Executar código/ }).click();
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '{}').completedStages || [], storageKey)).toContain(firstStage);
  await expect(page.getByRole('button', { name: /Executar novamente/ })).toBeVisible();

  await editor.fill('const nomeInstrutor = ;');
  await expect(page.getByRole('button', { name: /Executar código/ })).toBeVisible();
  // Incomplete typing must not execute automatically or show a runtime failure.
  await expect(page.getByText('Erro durante a execução')).toHaveCount(0);
  await page.getByRole('button', { name: /Executar código/ }).click();
  await expect(page.getByText('Erro durante a execução')).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Simples', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Código de script.js', exact: true })).toHaveValue('const nomeInstrutor = ;');
});

test('knowledge check explains an incorrect answer, permits retry and persists the answer', async ({ page }) => {
  await openEditor(page);
  const question = await page.evaluate(async () => {
    const { jsRoadmapCourse } = await import('/src/data/roadmapData.js');
    return jsRoadmapCourse.stages[0].instruction.knowledgeCheck;
  });
  expect(question).toBeTruthy();
  await page.getByRole('radio').nth((question.correctIndex + 1) % question.options.length).check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.getByText('Vamos rever este conceito.')).toBeVisible();
  await page.getByRole('button', { name: 'Tentar de novo', exact: true }).click();
  await page.getByRole('radio').nth(question.correctIndex).check();
  await page.getByRole('button', { name: 'Verificar resposta' }).click();
  await expect(page.getByText('Isso mesmo!')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Isso mesmo!')).toBeVisible();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).completedStages, storageKey)).toEqual([]);
});

test('preview preserves the HTML head, can inspect const values, logs circular data and scopes storage per exercise', async ({ page }) => {
  await openEditor(page);
  const result = await page.evaluate(async () => {
    const { buildPreview, loadPreview } = await import('/src/lib/playgroundRuntime.js');
    const iframe = document.querySelector('iframe[title="Preview do desafio"]');
    localStorage.setItem('devpath-runtime-test-sentinel', 'preserved');
    const files = {
      'index.html': '<html><head><title>My exercise</title><style>#test { color: rgb(255, 0, 0); }</style></head><body><p id="test">Hello</p><script src="script.js"></script></body></html>',
      'script.js': 'const answer = 42; const circular = {}; circular.self = circular; console.log(circular); localStorage.clear(); localStorage.setItem("test", "scoped");',
      'style.css': '',
    };
    await loadPreview(iframe, buildPreview(files, 'runtime-test-a'));
    const win = iframe.contentWindow;
    const first = { title: iframe.contentDocument.title, color: win.getComputedStyle(iframe.contentDocument.querySelector('#test')).color, answer: win.__getVar('answer'), logs: win.__consoleLogs, errors: win.__scriptErrors, scoped: win.localStorage.getItem('test') };
    await loadPreview(iframe, buildPreview({ ...files, 'script.js': '' }, 'runtime-test-b'));
    return { ...first, otherStageValue: iframe.contentWindow.localStorage.getItem('test'), sentinel: localStorage.getItem('devpath-runtime-test-sentinel') };
  });
  expect(result).toMatchObject({ title: 'My exercise', color: 'rgb(255, 0, 0)', answer: 42, errors: [], scoped: 'scoped', otherStageValue: null, sentinel: 'preserved' });
  expect(result.logs).toHaveLength(1);
});

test('mobile study, editor and output tabs remain reachable without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/playground/${firstStage}`);
  await page.getByRole('button', { name: 'Editor', exact: true }).click();
  await page.getByRole('button', { name: 'Simples', exact: true }).click();
  await page.getByRole('textbox', { name: 'Código de script.js', exact: true }).fill(solution);
  await page.getByRole('button', { name: /Executar código/ }).click();
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) || '{}').completedStages || [], storageKey)).toContain(firstStage);
  await page.getByRole('button', { name: 'Resultado', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Expressão JavaScript' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
