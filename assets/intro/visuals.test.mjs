import test from 'node:test';
import assert from 'node:assert/strict';
import { handLandmarks, fitHand } from './visuals.js';
import { K as rows } from '../keyLayout-C2ezFcAu.js';

test('all eight fingertips stay inside their own home keys at desktop and mobile widths', () => {
  for (const [width, height, gap] of [[1000, 52, 5], [650, 52, 5], [350, 28, 2]]) {
    const row = rows[2];
    const unit = (width - gap * (row.length - 1) - row.length * 2) / row.reduce((sum, key) => sum + key.width, 0);
    let left = 0;
    const keys = Object.fromEntries(row.map(key => {
      const keyWidth = unit * key.width + 2;
      const result = [key.code, { x: left + keyWidth / 2, y: 2 * (height + gap) + height / 2, width: keyWidth }];
      left += keyWidth + gap;
      return result;
    }));
    for (const landmarks of Object.values(handLandmarks)) {
      const matrix = fitHand(landmarks.map(([, x, y]) => [x, y]), landmarks.map(([key]) => [keys[key].x, keys[key].y]));
      landmarks.forEach(([key, x, y]) => {
        const actualX = matrix[0] * x + matrix[2] * y + matrix[4];
        const actualY = matrix[1] * x + matrix[3] * y + matrix[5];
        assert.ok(Math.abs(actualX - keys[key].x) < keys[key].width / 2 - 2, `${width}px: ${key} horizontal alignment`);
        assert.ok(Math.abs(actualY - keys[key].y) < height / 2 - 2, `${width}px: ${key} vertical alignment`);
      });
    }
  }
});
