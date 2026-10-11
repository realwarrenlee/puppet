// All choreography is sampled from scroll progress; there is no playback clock.
const red = [
  [0,22,29,0,'puppet'],[.08,22,29,0,'puppet'],
  [.16,22,29,0,'puppet'],[.24,22,30,2,'puppet-bow'],
  [.30,24,29,0,'puppet-listen'],[.38,24,28,2,'puppet'],
  [.44,21,29,-2,'puppet-listen'],[.50,24,27,2,'puppet'],
  [.56,24,28,2,'puppet'],[.62,21,29,-2,'puppet-listen'],
  [.68,22,29,0,'puppet-listen'],[.76,22,30,2,'puppet-bow'],
  [.84,24,29,0,'puppet'],[.92,24,29,0,'puppet'],[1,53,29,0,'puppet'],
];
const green = [
  [0,56,29,0,'puppet-companion'],[.08,56,29,0,'puppet-companion'],
  [.16,56,29,0,'puppet-companion'],[.24,56,29,0,'puppet-companion-listen'],
  [.30,58,29,-2,'puppet-companion-challenge'],[.38,61,29,2,'puppet-companion-listen'],
  [.44,57,28,-2,'puppet-companion-challenge'],[.50,60,29,2,'puppet-companion'],
  [.56,58,27,-2,'puppet-companion-challenge'],[.62,60,29,2,'puppet-companion-listen'],
  [.68,58,29,0,'puppet-companion-listen'],[.76,58,30,-2,'puppet-companion-bow'],
  [.84,58,29,0,'puppet-companion'],[.92,108,29,0,'puppet-companion-listen'],[1,108,29,0,'puppet-companion-listen'],
];

export function sampleActor(progress, character) {
  const keys = character === 'red' ? red : green;
  const p = Math.max(0, Math.min(1, progress));
  const i = Math.max(0, keys.findLastIndex(key => key[0] <= p));
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const local = a === b ? 0 : (p - a[0]) / (b[0] - a[0]);
  const eased = local * local * (3 - 2 * local);
  // Hold the silhouette, then blend to the next posture near the next action.
  const blend = Math.max(0, (local - .65) / .35);
  const fadeIn = Math.min(1, p / .12);
  const opacity = fadeIn * fadeIn * (3 - 2 * fadeIn);
  return { x:a[1]+(b[1]-a[1])*eased, y:a[2]+(b[2]-a[2])*eased,
    lean:a[3]+(b[3]-a[3])*eased, pose:a[4], nextPose:b[4], blend, opacity };
}

export const performanceLines = [
  ['The path narrows.', 'Two travellers appear on a narrow forest path.'],
  ['A passage refused.', 'A bow meets a raised sleeve. Neither steps aside.'],
  ['A challenge answered.', 'One advances. The other turns away, then returns.'],
  ['A turn. A reply.', 'An advance, an evasion, and an answering gesture.'],
  ['Neither yields.', 'The movement settles. This time, both lower their heads.'],
  ['A different way through.', 'One makes room. The other passes with a bow.'],
];
