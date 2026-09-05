import { test, expect } from '@playwright/test';

test('the API project rejects its starter and verifies success, failures and form submission', async ({ page }) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { jsRoadmapCourse } = await import('/src/data/roadmapData.js');
    const { buildPreview, loadPreview, withTimeout } = await import('/src/lib/playgroundRuntime.js');
    const stage = jsRoadmapCourse.stages.find(item => item.id === 'js-project-api-dashboard');
    const solution = `
      async function carregarPerfil(username) {
        const status = document.querySelector('#status');
        const result = document.querySelector('#resultado');
        const button = document.querySelector('#buscar');
        status.textContent = 'carregando';
        result.textContent = '';
        button.disabled = true;
        try {
          const response = await fetch('https://api.github.com/users/' + encodeURIComponent(username));
          if (!response.ok) throw new Error('HTTP ' + response.status);
          const data = await response.json();
          result.textContent = data.login;
          status.textContent = 'sucesso';
        } catch {
          status.textContent = 'erro';
        } finally {
          button.disabled = false;
        }
      }
      document.querySelector('#perfil-form').addEventListener('submit', event => {
        event.preventDefault();
        carregarPerfil(document.querySelector('#username').value);
      });
    `;
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const outcomes = [];
    try {
      for (const script of [stage.playground.files['script.js'], solution]) {
        const files = { ...stage.playground.files, 'script.js': script };
        await loadPreview(frame, buildPreview(files, stage.id));
        const win = frame.contentWindow;
        const checks = [];
        for (const requirement of stage.playground.tasks) {
          checks.push(await withTimeout(requirement.check(frame.contentDocument, win, { getVar: name => win.__getVar(name) })));
        }
        outcomes.push({ checks, errors: win.__scriptErrors });
      }
    } finally { frame.remove(); }
    return outcomes;
  });
  expect(results[0].checks.every(check => !check.pass)).toBe(true);
  expect(results[1].checks.every(check => check.pass), JSON.stringify(results[1])).toBe(true);
  expect(results[1].errors).toEqual([]);
});
