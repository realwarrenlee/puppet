import { sampleActor } from './performance.mjs';

const poses = {
  red: ['puppet', 'puppet-listen', 'puppet-bow'],
  green: ['puppet-companion', 'puppet-companion-listen', 'puppet-companion-challenge', 'puppet-companion-bow'],
};

export function Performance({ active, progress }) {
  return <div className="performance-cast" style={{visibility:active ? 'visible' : 'hidden'}} aria-hidden="true">
    {['red', 'green'].map(character => {
      const actor = sampleActor(progress, character);
      return <div key={character} className={`performance-actor ${character}`} style={{left:`${actor.x}%`,top:`${actor.y}%`,transform:`rotate(${actor.lean}deg)`,opacity:actor.opacity}}>
        {poses[character].map(pose => {
          const opacity = Number(pose === (actor.blend < .5 ? actor.pose : actor.nextPose));
          return <img decoding="async" key={pose} src={`/assets/${pose}.webp`} alt="" style={{opacity}}/>;
        })}
      </div>;
    })}
  </div>;
}
