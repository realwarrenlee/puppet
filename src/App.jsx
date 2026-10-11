import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Play } from '@phosphor-icons/react';
import '@fontsource/fraunces/latin-500.css';
import '@fontsource/fraunces/latin-600.css';
import { Performance } from './Performance.jsx';
import { performanceLines } from './performance.mjs';

const acts = [
  { name: 'The invitation', start: 0, end: .055, image: 'curtain', lines: [
    ['Behind the\nlittle stage.', 'Enter a small world. Discover what keeps it alive.']
  ] },
  { name: 'Through the curtain', start: .055, end: .12, image: 'world', lines: [
    ['A world,\nwaiting inside.', 'The curtain parts. The outside falls away.'],
    ['Step a little closer.', 'Let the scenery pass around you.']
  ] },
  { name: 'The performance', start: .12, end: .36, image: 'world', lines: performanceLines },
  { name: 'Inside the world', start: .36, end: .43, image: 'world', lines: [
    ['Follow the character.', 'Past the trees. Between the layers.'],
    ['How far does\nthis world go?', 'The scene looks different when you get close.']
  ] },
  { name: 'The edge of the scene', start: .43, end: .50, image: 'preparation-reveal', lines: [
    ['A world has edges.', 'The scenery moves aside. Another kind of work comes into view.']
  ] },
  { name: 'The person beneath', start: .50, end: .62, image: 'preparation-reveal', lines: [
    ['Behind the character.', 'A hand, a voice, and practice.'],
    ['Meet Adrian Ong.', 'In Singapore, he practises Hokkien glove and string puppetry alongside a full-time job.'],
    ['The stage is only\npart of the story.', 'He also writes scripts, builds stages and handles sound.']
  ] },
  { name: 'Before the curtain opens', start: .62, end: .83, image: 'scriptwriting', images: ['scriptwriting', 'scriptwriting', 'stage-assembly', 'cue-wait', 'cue-response', 'cue-bow'], lines: [
    ['First, a story.', 'On the page, an entrance, a challenge, and a way through.'],
    ['Write. Read. Revise.', 'A line must work in a voice. A pause must leave room for a gesture.'],
    ['Build somewhere\nfor it to happen.', 'Scenery fits into place, layer by layer. The little world takes shape.'],
    ['Find the cue.', 'Two people. A shared rhythm.'],
    ['A beat. A response.', 'Movement and accompaniment meet.'],
    ['Try it again.', 'Rehearse the moment together.'],
  ] },
  { name: 'Passing it on', start: .83, end: .94, image: 'rehearsal', lines: [
    ['Practice is shared.', 'Adrian teaches puppetry and voice skills to younger participants, including his niece, and holds rehearsals at home.'],
    ['A new beginning.', 'The gesture you first saw onstage is something another person can learn.']
  ] },
  { name: 'See it again', start: .94, end: 1, image: 'world', lines: [
    ['Back to the\nlittle stage.', 'The same character. A different way of seeing.'],
    ['Now, who do you see?', 'The performer. The preparation. The people learning what comes next.']
  ] },
];
const clamp = n => Math.max(0, Math.min(1, n));
const range = (p, a, b) => clamp((p - a) / (b - a));
const ease = n => n * n * (3 - 2 * n);
const tween = (p, a, b) => ease(range(p, a, b));

function Puppet({ phase, returned = false }) {
  const pose = phase < .34 ? 'puppet' : phase < .67 ? 'puppet-listen' : 'puppet-bow';
  const lean = Math.sin(phase * Math.PI * 2) * 4;
  return <div className={`actor ${returned ? 'return-actor' : ''}`} style={{ transform: `translateY(${Math.sin(phase * Math.PI) * -3}%) rotate(${lean}deg)` }}>
    {['puppet', 'puppet-listen', 'puppet-bow'].map(name => <img key={name} src={`/assets/${name}.png`} alt="" style={{ opacity: name === pose ? 1 : 0 }}/>) }
  </div>;
}

export function App() {
  const journey = useRef(null);
  const [progress, setProgress] = useState(0);
  const [videoStarted, setVideoStarted] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const calm = reduced;

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = journey.current;
      if (el) setProgress(clamp(-el.getBoundingClientRect().top / (el.offsetHeight - innerHeight)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    update();
    return () => { removeEventListener('scroll', schedule); removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, [calm]);

  const index = Math.max(0, acts.findLastIndex(act => progress >= act.start));
  const act = acts[index];
  const local = range(progress, act.start, act.end);
  const lineIndex = Math.min(act.lines.length - 1, index === 6
    ? progress < .746 ? Math.floor(range(progress, .62, .746) * 3) : 3 + Math.floor(range(progress, .746, .83) * 3)
    : Math.floor(local * act.lines.length));
  const [title, body] = act.lines[lineIndex];
  const curtain = tween(progress, .025, .115);
  const enter = tween(progress, .36, .43);
  const reveal = tween(progress, .43, .505);
  const workshop = tween(progress, .605, .63);
  const rehearsal = tween(progress, .815, .84);
  const returning = tween(progress, .93, .955);
  const openingOpacity = 1 - tween(progress, .04, .06);
  const scriptZoom = 1 + range(progress, .62, .704) * .06;
  const buildScene = tween(progress, .694, .714);
  const buildZoom = 1.05 - range(progress, .704, .746) * .05;
  const soundScene = tween(progress, .736, .756);
  const cueIndex = Math.min(2, Math.floor(range(progress, .746, .83) * 3));

  return <>
    <a className="skip" href="#story-end">Skip to the story notes</a>
    {calm ? <main className="reading">
      {acts.map(chapter => <section key={chapter.name}>
        <h1>{chapter.lines[0][0]}</h1>
        <div className="reading-art"><img src={`/assets/${chapter.image}.png`} alt={chapter.image === 'preparation-reveal' ? 'A side view reveals layered scenery, wooden stage supports and a practitioner inspecting a scenic panel at a worktable.' : chapter.image === 'rehearsal' ? 'A mentor and learner practise with glove puppets.' : chapter.image === 'scriptwriting' ? 'A cut-paper performer revises a script at a table.' : 'A miniature paper theatre with layered forest scenery.'}/>{chapter.image === 'world' && <img className={`reading-puppet ${chapter.name === 'The performance' ? 'reading-red' : ''}`} src="/assets/puppet.png" alt="A red and cream glove puppet with one sleeve raised."/>}{chapter.name === 'The performance' && <img className="reading-puppet reading-green" src="/assets/puppet-companion.png" alt="A green-robed glove puppet faces the red traveller."/>}</div>
        {chapter.lines.map(([heading, text], n) => <div key={heading}>{n > 0 && chapter.images && chapter.images[n] !== chapter.images[n-1] && <img src={`/assets/${chapter.images[n]}.png`} alt={chapter.images[n] === 'stage-assembly' ? 'Paper hands fit tree scenery into the slots of a miniature stage.' : 'Two cut-paper practitioners rehearse together: one operates a rear-facing glove puppet and the other plays an electronic percussion pad.'}/>} {n > 0 && <h2>{heading}</h2>}<p>{text}</p></div>)}
      </section>)}
    </main> : <main ref={journey} className="journey" aria-label="Enter the puppet world and discover the people behind it">
      <div className={`viewport act-${index}`}>
        <div className="backstage scene" aria-hidden="true" style={{ transform: `scale(${1.14 - range(progress, .43, .62) * .14}) translateY(${-workshop * 10}%)` }}><img src="/assets/preparation-reveal.png" alt=""/></div>
        <div className="stage-world scene" aria-hidden="true" style={{ transform: `translateX(${-reveal * 190}%) scale(${1 + enter * .62})`, transformOrigin: '52% 55%', visibility: reveal === 1 ? 'hidden' : 'visible' }}>
          <img className="world" src="/assets/world.png" alt=""/>
          <div className="performer-path" style={{ opacity: index > 2 ? 1 : 0, transform: `translateX(${-enter * 7}%)` }}><Puppet phase={range(progress,.36,.43)}/></div>
          <Performance active={index === 2} progress={range(progress,.12,.36)}/>
          <img className="foreground" src="/assets/foreground.png" alt="" style={{ transform: `scale(${1.15 + enter * .8}) translateX(${-enter * 6}%)` }}/>
        </div>
        <div className="workshop scene" aria-hidden="true" style={{ transform: `translateY(${(1 - workshop) * 105}%)`, visibility: workshop === 0 ? 'hidden' : 'visible' }}>
          <img className="preparation-frame" src="/assets/scriptwriting.png" alt="" style={{transform:`scale(${scriptZoom})`}}/>
          <img className="preparation-frame" src="/assets/stage-assembly.png" alt="" style={{transform:`translateX(${(1 - buildScene) * 105}%) scale(${buildZoom})`,visibility:buildScene === 0 ? 'hidden' : 'visible'}}/>
          <div className="cue-scenes" style={{transform:`translateY(${(1 - soundScene) * 105}%)`,visibility:soundScene === 0 ? 'hidden' : 'visible'}}>
            {['cue-wait', 'cue-response', 'cue-bow'].map((image,n) => <img key={image} src={`/assets/${image}.png`} alt="" style={{visibility:n === cueIndex ? 'visible' : 'hidden',transform:`scale(${1 + range(progress, .746, .802) * .04})`}}/>)}
          </div>
        </div>
        <div className="rehearsal scene" aria-hidden="true" style={{ transform: `translateX(${(1 - rehearsal) * 105}%)`, visibility: rehearsal === 0 ? 'hidden' : 'visible' }}><img src="/assets/rehearsal.png" alt="" style={{ transform: `scale(${1.08 - range(progress, .84, .93) * .08})` }}/></div>
        <div className="return-stage scene" aria-hidden="true" style={{ transform: `translateY(${(1 - returning) * 105}%)`, visibility: returning === 0 ? 'hidden' : 'visible' }}>
          <img className="world" src="/assets/world.png" alt=""/>
          <Puppet phase={range(progress, .955, 1)} returned/>
          <img className="foreground" src="/assets/foreground.png" alt="" style={{ transform: 'scale(1.22)' }}/>
        </div>
        <div className="curtain curtain-left" style={{ transform: `translateX(${-curtain * 102}%) scale(${1 + curtain * .1})`, visibility: curtain === 1 ? 'hidden' : 'visible' }} aria-hidden="true"><img src="/assets/curtain.png" alt=""/></div>
        <div className="curtain curtain-right" style={{ transform: `translateX(${curtain * 102}%) scale(${1 + curtain * .1})`, visibility: curtain === 1 ? 'hidden' : 'visible' }} aria-hidden="true"><img src="/assets/curtain.png" alt=""/></div>
        <section className={`caption ${index === 0 ? 'opening' : ''}`} key={`${index}-${lineIndex}`} style={index === 0 ? { opacity: openingOpacity } : undefined} aria-label={act.name}>
          <h1>{title}</h1><p>{body}</p>
          {index === 0 && <div className="invitation" aria-hidden="true"><ArrowDown size={26} weight="thin"/></div>}
        </section>
      </div>
      <div className="sr-only">{acts.map(chapter=><section key={chapter.name}><h2>{chapter.name}</h2>{chapter.lines.map(([heading,text])=><p key={heading}>{heading} {text}</p>)}</section>)}</div>
    </main>}
    <section className="ending" id="story-end">
      <h2>A small stage.<br/>A living practice.</h2>
      <p>This experience is inspired by Mr Adrian Ong Sin Yong, a youth practitioner of Chinese puppetry with over a decade of experience. His practice encompasses Hokkien glove puppetry and Hokkien string puppetry. Balancing his passion for puppetry with his full-time job, he regularly performs at major festive occasions for deities’ birthday celebrations in local temples.</p>
      <p>Besides being a puppeteer, he has taken up multiple roles of scriptwriter, sound technician, and stage builder to ensure the continuity of his practice. Recognising the declining availability of live musicians, he has innovatively incorporated pre-recorded music and electronic drum kits as alternatives to traditional live accompaniment while retaining the cultural integrity of the practice.</p>
      <p>He actively mentors young participants, including his niece and peers, by sharing puppetry skills, voice performance techniques, and cultural significance through cultural and community events, as well as staging rehearsals in his own home.</p>
      <p className="performance-note">Learn more about <a href="https://www.roots.gov.sg/ich-landing/ich/chinese-puppetry" target="_blank" rel="noreferrer">Chinese Puppetry</a> at ROOTS.sg by National Heritage Board.</p>
      {videoStarted ? <iframe className="story-video" src="https://www.youtube-nocookie.com/embed/TmdKp1ZMh0w?autoplay=1" title="Meet Adrian Ong Sin Yong — a film by Roots Sg" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/> : <button className="story-video video-preview" onClick={() => setVideoStarted(true)} aria-label="Play the film about Adrian Ong Sin Yong">
        <img src="https://i.ytimg.com/vi/TmdKp1ZMh0w/maxresdefault.jpg" alt="" loading="lazy"/>
        <span className="video-play" aria-hidden="true"><Play size={32} weight="fill"/></span>
      </button>}
      <footer className="colophon"><p>Behind the Little Stage</p><p>An independent Culture × Tech experiment</p></footer>
    </section>
  </>;
}
