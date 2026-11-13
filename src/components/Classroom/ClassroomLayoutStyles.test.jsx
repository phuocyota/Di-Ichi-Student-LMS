import { afterEach, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
const classroomStyles = readFileSync('src/components/Classroom/classroom.css', 'utf8');
const livekitStyles = readFileSync('node_modules/@livekit/components-styles/dist/general/index.css', 'utf8');

const nodes = [];
function appendStyles(text) {
  const style = document.createElement('style');
  style.textContent = text;
  document.head.append(style);
  nodes.push(style);
}
afterEach(() => { nodes.forEach(node => node.remove()); nodes.length = 0; });

it('nạp CSS LiveKit trước CSS ứng dụng và giữ phòng fixed theo viewport', () => {
  const entry = readFileSync('src/main.jsx', 'utf8');
  expect(entry.indexOf("import '@livekit/components-styles'")).toBeLessThan(entry.indexOf("import App from './App.jsx'"));
  appendStyles(livekitStyles);
  appendStyles(classroomStyles);
  const room = document.createElement('div');
  room.className = 'lk-room-container live-room-shell';
  document.body.append(room);
  nodes.push(room);
  const style = getComputedStyle(room);
  expect(style.position).toBe('fixed');
  expect(style.height).toBe('100dvh');
  expect(style.display).toBe('flex');
});

it('giãn ParticipantTile mà FocusLayout render trực tiếp và căn video chia sẻ ở giữa', () => {
  appendStyles(livekitStyles);
  appendStyles(classroomStyles);
  const stage = document.createElement('div');
  stage.className = 'live-spotlight live-spotlight--share';
  stage.innerHTML = '<div class="lk-participant-tile" data-lk-source="screen_share"><video class="lk-participant-media-video" data-source="screen_share"></video></div>';
  document.body.append(stage);
  nodes.push(stage);
  const tile = getComputedStyle(stage.firstElementChild);
  const video = getComputedStyle(stage.querySelector('video'));
  expect(tile.width).toBe('100%');
  expect(tile.height).toBe('100%');
  expect(video.width).toBe('100%');
  expect(video.height).toBe('100%');
  expect(video.objectFit).toBe('contain');
  expect(video.objectPosition).toBe('center');
});
