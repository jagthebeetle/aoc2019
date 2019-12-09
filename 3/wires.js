const fs = require('fs');

class Line {
  constructor(x0, x1, y0, y1) {
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
    this.steps = 0;
  }
}

class VerticalLine extends Line {
  constructor(x, y, length) {
    super(x, x, y, y + length);
    this.x = x;
  }
}

class HorizontalLine extends Line {
  constructor(x, y, length) {
    super(x, x + length, y, y);
    this.y = y;
  }
}

class Point {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
  }

  l1() {
    return Math.abs(x) + Math.abs(y);
  }
}

const verticalLines1 = new Set();
const horizontalLines1 = new Set();
const verticalLines2 = new Set();
const horizontalLines2 = new Set();
const f = fs.readFileSync('input.txt', 'utf8');
const [wire1, wire2] = f.split('\n').map(w => w.split(','));
// Build intersections from orthogonal lines, since intersection of colinear
// segments would not be well defined (overlap) or would be composed of at least
// one pair of orthogonal segments (lines meet at point and turn 90deg).
buildSegments(wire1, verticalLines1, horizontalLines1);
buildSegments(wire2, verticalLines2, horizontalLines2);
const intersections = new Set();
intersectLines(verticalLines1, horizontalLines2);
intersectLines(verticalLines2, horizontalLines1);

function intersectLines(vLines, hLines) {
  for (const vLine of vLines) {
    const vy0 = Math.min(vLine.y0, vLine.y1);
    const vy1 = Math.max(vLine.y0, vLine.y1);
    for (const hLine of hLines) {
      const hx0 = Math.min(hLine.x0, hLine.x1);
      const hx1 = Math.max(hLine.x0, hLine.x1);
      // Lines cross
      if (hx0 <= vLine.x && vLine.x <= hx1) {
        if (vy0 <= hLine.y && hLine.y <= vy1) {
          const weight = vLine.steps + hLine.steps +
              Math.abs(vLine.x - hLine.x0) + Math.abs(hLine.y - vLine.y0);
          intersections.add(new Point(vLine.x, hLine.y, weight));
        }
      }
    }
  }
}

let minDistance = Infinity;
for (const point of intersections) {
  const pathWeight = point.w;
  if (pathWeight < minDistance) {
    minDistance = pathWeight;
  }
}
console.info(minDistance);

function buildSegments(segments, verticalLines, horizontalLines) {
  let x = 0;
  let y = 0;
  let steps = 0;
  for (const directive of segments) {
    const [direction, distance] = parseDirective(directive);
    if (direction === 'x') {
      const line = new HorizontalLine(x, y, distance);
      line.steps = steps;
      horizontalLines.add(line);
      x += distance;
    } else if (direction === 'y') {
      const line = new VerticalLine(x, y, distance);
      line.steps = steps;
      verticalLines.add(line);
      y += distance;
    }
    steps += Math.abs(distance);
  }
}

/**
 * @param {string} directive
 * @returns ['x'|'y', number]
 */
function parseDirective(directive) {
  const direction = directive[0];
  const distance = directive.substring(1);
  const directionScale = direction === 'U' || direction === 'R' ? 1 : -1;
  return [
    direction === 'U' || direction === 'D' ? 'y' : 'x',
    distance * directionScale,
  ];
}
