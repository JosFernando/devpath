import test from 'node:test';
import assert from 'node:assert/strict';
import { jsRoadmapCourse as course } from '../src/data/roadmapData.js';
import { curriculumLessons } from '../src/data/curriculumLessons.js';
import { curriculumChecks } from '../src/data/curriculumChecks.js';
import { normalizeProgress } from '../src/lib/progressStorage.js';

test('the specialization has an ordered path with one final project per module', () => {
  assert.equal(course.modules.length, 10);
  assert.equal(course.phases.length, 4);
  assert.deepEqual(course.phases.flatMap((phase) => phase.moduleIds), course.modules.map((module) => module.id));
  const ids = course.stages.map((stage) => stage.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const [index, stage] of course.stages.entries()) {
    assert.equal(stage.stepNumber, index + 1);
    assert.deepEqual(stage.dependencies, index ? [ids[index - 1]] : []);
  }
  assert.deepEqual(course.stages.filter((stage) => stage.isCapstone).map((stage) => stage.id), [ids.at(-1)]);
  assert.deepEqual(course.modules.flatMap((module) => course.stages.filter((stage) => stage.moduleId === module.id)), course.stages);
  for (const module of course.modules) {
    const project = course.stages.filter((stage) => stage.moduleId === module.id).at(-1);
    assert.equal(module.projectStageId, project.id, `${module.id} must end with its project`);
    assert.match(project.category.toLowerCase(), /projeto/);
    assert.ok(module.outcomes.length >= 2);
    assert.ok(module.prerequisites.length >= 1);
    for (const field of ['deliverables', 'milestones', 'rubric', 'stretchGoals']) {
      assert.ok(project.projectBrief[field].length >= 1, `${project.id}: ${field}`);
    }
  }
});

test('every stage includes teaching, a question, examples, hints and executable requirements', () => {
  for (const stage of course.stages) {
    const instruction = stage.instruction;
    assert.ok(instruction.deepLesson.length > 300, `${stage.id}: meaningful lesson`);
    assert.ok(instruction.learningObjectives.length >= 2, `${stage.id}: objectives`);
    assert.ok(instruction.challengeExamples.length > 0, `${stage.id}: examples`);
    assert.ok(instruction.progressiveHints.length >= 2, `${stage.id}: hints`);
    const question = instruction.knowledgeCheck;
    assert.ok(question.question && question.explanation, `${stage.id}: question`);
    assert.ok(question.options.length >= 3);
    assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < question.options.length);
    assert.ok(stage.estimatedMinutes > 0);
    assert.ok(stage.playground.files['index.html']);
    assert.ok(stage.playground.files[stage.playground.activeFile]);
    const tasks = stage.playground.tasks;
    assert.ok(tasks.length > 0, `${stage.id}: runnable checks`);
    assert.equal(new Set(tasks.map((task) => task.id)).size, tasks.length);
    assert.ok(tasks.every((task) => typeof task.check === 'function'));
  }
});

test('existing authored lessons and behavioral checks are actually connected to the course', () => {
  for (const [id, lesson] of Object.entries(curriculumLessons)) {
    const stage = course.stages.find((item) => item.id === id);
    assert.ok(stage, id);
    assert.equal(stage.instruction.deepLesson, lesson.deepLesson);
    assert.equal(stage.instruction.knowledgeCheck, lesson.knowledgeCheck);
  }
  for (const [id, tasks] of Object.entries(curriculumChecks)) {
    assert.equal(course.stages.find((stage) => stage.id === id).playground.tasks, tasks);
  }
});

test('expanding the course preserves saved work from the original stages', () => {
  const id = 'js-17-grand-capstone-app';
  const files = { 'script.js': 'const minhasTarefas = []; // meu trabalho' };
  const progress = normalizeProgress({ completedStages: [id], currentStageId: id, stageFiles: { [id]: files } }, { stageIds: course.stages.map((stage) => stage.id) });
  assert.deepEqual(progress.completedStages, [id]);
  assert.equal(progress.currentStageId, id);
  assert.deepEqual(progress.stageFiles[id], files);
  assert.equal(progress.xp, 25);
});
