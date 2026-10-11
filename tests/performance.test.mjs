import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleActor, performanceLines } from '../src/performance.mjs';

test('both characters fade in at fixed positions and the companion exits right without fading', () => {
  for (const character of ['red', 'green']) {
    assert.equal(sampleActor(0, character).opacity, 0);
    assert.equal(sampleActor(.06, character).opacity, .5);
    assert.equal(sampleActor(.12, character).opacity, 1);
    assert.equal(sampleActor(0, character).x, sampleActor(.12, character).x);
  }
  assert.equal(sampleActor(.88, 'green').opacity, 1);
  assert.equal(sampleActor(.92, 'green').opacity, 1);
  assert.ok(sampleActor(.88, 'green').x > sampleActor(.84, 'green').x);
  assert.ok(sampleActor(.92, 'green').x > 100);
  assert.equal(sampleActor(1, 'red').opacity, 1);
});

test('the puppets keep separate silhouettes throughout the exchange and exit', () => {
  for (let i=0; i<=1000; i++) {
    const red = sampleActor(i/1000, 'red');
    const green = sampleActor(i/1000, 'green');
    // Mobile sprites occupy 30% of the stage; reserve room for leaning sleeves.
    if (green.opacity > 0 && red.opacity > 0) assert.ok(green.x - red.x >= 34);
    assert.ok(Math.abs(red.lean) <= 2 && Math.abs(green.lean) <= 2);
  }
});

test('both characters use distinct postures, including a bow', () => {
  for (const character of ['red', 'green']) {
    const postures = new Set(Array.from({length:101}, (_,i) => sampleActor(i/100, character).pose));
    assert.ok(postures.size >= 3);
    assert.ok([...postures].some(pose => pose.endsWith('bow')));
  }
  assert.equal(performanceLines.length, 6);
});

test('scrolling reverses exactly and holding progress holds every animation value', () => {
  for (const character of ['red', 'green']) {
    const forward = Array.from({length:1001}, (_,i) => sampleActor(i/1000, character));
    const reverse = Array.from({length:1001}, (_,i) => sampleActor((1000-i)/1000, character)).reverse();
    assert.deepEqual(forward, reverse);
    for (let i=0; i<forward.length-1; i++) {
      assert.ok([forward[i].x, forward[i].y, forward[i].lean, forward[i].blend].every(Number.isFinite));
      assert.ok(Math.abs(forward[i].x-forward[i+1].x) < 1.2);
      assert.ok(forward[i].blend >= 0 && forward[i].blend <= 1);
    }
  }
});
