import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { jsRoadmapCourse } from '../src/data/roadmapData.js';

test('every lesson has a beginner path with a worked example and explained practice', () => {
  for (const stage of jsRoadmapCourse.stages) {
    const guide = stage.instruction.beginnerGuide;
    for (const field of ['idea', 'before', 'output', 'mistake', 'practice', 'answer']) {
      assert.ok(typeof guide[field] === 'string' && guide[field].length > 0, `${stage.id}: ${field}`);
    }
    assert.ok(guide.code || guide.exampleInput, stage.id);
    assert.ok(guide.steps.length >= 3, stage.id);
    if (!guide.code) assert.equal(typeof guide.exampleInput, 'string', `${stage.id}: project input`);
  }
});

test('standalone synchronous examples produce the results taught in the guide', () => {
  const stages = jsRoadmapCourse.stages.filter(stage => stage.instruction.beginnerGuide.code);
  let checked = 0;
  for (const stage of stages) {
    const { code, output } = stage.instruction.beginnerGuide;
    if (/document\.|localStorage|setInterval|setTimeout|async |^</m.test(code) || code.startsWith('.cartao')) continue;
    const logs = [];
    const context = { console: { log: (...values) => logs.push(values.map(value => Array.isArray(value) ? `[${value.join(', ')}]` : String(value)).join(' ')) } };
    vm.runInNewContext(code, context, { timeout: 1000 });
    assert.equal(logs.join('\n'), output, stage.id);
    checked++;
  }
  assert.ok(checked >= 15);
});
