import Matter from 'matter-js';
import type { Body, Constraint } from 'matter-js';

/** A decorative enhancement: readable flex layout first, physics only during interaction. */
export async function setupPhysics(container: HTMLElement): Promise<() => void> {
  await document.fonts.ready;
  const engine = Matter.Engine.create({ enableSleeping: true, positionIterations: 10, velocityIterations: 8, constraintIterations: 4 });
  engine.gravity.x = engine.gravity.y = 0;
  const pills = [...container.querySelectorAll<HTMLElement>('.skill-pill')];
  let bodies: { element: HTMLElement; body: Body; width: number; height: number; x: number; y: number }[] = [];
  let frame: number | undefined, resizeFrame: number | undefined;
  let lastTime = 0, accumulator = 0, lastWidth = 0;
  let visible = false, disposed = false;
  let drag: { pointer: number; element: HTMLElement; constraint: Constraint; target: { x: number; y: number } } | undefined;
  const step = 1000 / 120;
  const wake = () => bodies.forEach(item => Matter.Sleeping.set(item.body, false));

  const draw = () => {
    for (const item of bodies) {
      const x = item.body.position.x - item.width / 2, y = item.body.position.y - item.height / 2;
      if (Math.abs(x - item.x) > .05 || Math.abs(y - item.y) > .05) {
        item.element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        item.x = x; item.y = y;
      }
    }
  };
  const stop = () => { if (frame !== undefined) cancelAnimationFrame(frame); frame = undefined; lastTime = 0; accumulator = 0; };
  const awake = () => !!drag || bodies.some(item => !item.body.isSleeping);
  const tick = (now: number) => {
    frame = undefined;
    if (disposed || !visible || document.hidden || !awake()) return;
    accumulator += lastTime ? Math.min(32, now - lastTime) : step;
    lastTime = now;
    while (accumulator >= step) {
      if (drag) {
        // A cursor can jump across the whole box in one event. Advance its spring
        // in small steps so the collision solver sees every pill along the path.
        const anchor = drag.constraint.pointA;
        const dx = drag.target.x - anchor.x, dy = drag.target.y - anchor.y;
        const ratio = Math.min(1, 4 / (Math.hypot(dx, dy) || 1));
        anchor.x += dx * ratio; anchor.y += dy * ratio;
      }
      for (const item of bodies) {
        const speed = Matter.Body.getSpeed(item.body);
        if (speed > 8) Matter.Body.setSpeed(item.body, 8);
      }
      Matter.Engine.update(engine, step);
      accumulator -= step;
    }
    draw();
    if (awake()) frame = requestAnimationFrame(tick);
    else lastTime = 0;
  };
  const start = () => { if (!disposed && visible && !document.hidden && awake() && frame === undefined) frame = requestAnimationFrame(tick); };
  const release = () => {
    if (!drag) return;
    const current = drag;
    drag = undefined;
    current.element.removeAttribute('data-dragging');
    Matter.Composite.remove(engine.world, current.constraint);
    if (current.element.hasPointerCapture(current.pointer)) current.element.releasePointerCapture(current.pointer);
    start();
  };
  const build = () => {
    stop(); release();
    container.classList.remove('physics-active');
    container.style.removeProperty('height');
    pills.forEach(pill => pill.style.removeProperty('transform'));
    const rect = container.getBoundingClientRect();
    const width = container.clientWidth, height = container.clientHeight;
    lastWidth = width;
    const measured = pills.map(element => {
      const bounds = element.getBoundingClientRect();
      return { element, width: bounds.width, height: bounds.height, x: bounds.left - rect.left - container.clientLeft, y: bounds.top - rect.top - container.clientTop };
    });
    Matter.Composite.clear(engine.world, false);
    Matter.Engine.clear(engine);
    const thickness = 1000;
    const wall = { isStatic: true, friction: .4 };
    Matter.Composite.add(engine.world, [
      Matter.Bodies.rectangle(width / 2, -thickness / 2, width + 2 * thickness, thickness, wall),
      Matter.Bodies.rectangle(width / 2, height + thickness / 2, width + 2 * thickness, thickness, wall),
      Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height + 2 * thickness, wall),
      Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + 2 * thickness, wall),
    ]);
    bodies = measured.map(item => {
      const body = Matter.Bodies.rectangle(item.x + item.width / 2, item.y + item.height / 2, item.width, item.height, { frictionAir: .1, friction: .8, restitution: 0, density: .01, sleepThreshold: 30, chamfer: { radius: Math.min(18, item.height / 2 - 1) } });
      Matter.Body.setInertia(body, Infinity);
      Matter.Sleeping.set(body, true);
      Matter.Composite.add(engine.world, body);
      return { ...item, body, x: Infinity, y: Infinity };
    });
    container.style.height = `${rect.height}px`;
    container.classList.add('physics-active');
    draw();
  };
  const coordinates = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    return { x: event.clientX - rect.left - container.clientLeft, y: event.clientY - rect.top - container.clientTop };
  };
  const down = (event: PointerEvent) => {
    if (event.button !== 0 || drag) return;
    const element = (event.target as HTMLElement).closest<HTMLElement>('.skill-pill');
    const item = bodies.find(body => body.element === element);
    if (!item || !element) return;
    event.preventDefault();
    window.getSelection()?.removeAllRanges();
    const point = coordinates(event);
    // Sleeping neighbours must participate before the first constraint solve.
    wake();
    const constraint = Matter.Constraint.create({ pointA: { ...point }, bodyB: item.body, pointB: { x: point.x - item.body.position.x, y: point.y - item.body.position.y }, length: 0, stiffness: .025, damping: .2 });
    Matter.Composite.add(engine.world, constraint);
    element.setPointerCapture(event.pointerId);
    element.dataset.dragging = '';
    drag = { pointer: event.pointerId, element, constraint, target: point };
    start();
  };
  const move = (event: PointerEvent) => {
    if (drag?.pointer !== event.pointerId) return;
    const point = coordinates(event);
    drag.target = { x: Math.max(0, Math.min(container.clientWidth, point.x)), y: Math.max(0, Math.min(container.clientHeight, point.y)) };
    wake();
    start();
  };
  const up = (event: PointerEvent) => { if (drag?.pointer === event.pointerId) release(); };
  const visibility = () => { if (document.hidden) { stop(); release(); } else start(); };
  build();
  const intersection = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (visible) start(); else { stop(); release(); }
  }, { threshold: .01 });
  intersection.observe(container);
  const resize = new ResizeObserver(() => {
    if (disposed || Math.abs(container.clientWidth - lastWidth) < 1) return;
    if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => { resizeFrame = undefined; if (!disposed) build(); });
  });
  resize.observe(container);
  container.addEventListener('pointerdown', down);
  container.addEventListener('pointermove', move);
  container.addEventListener('pointerup', up);
  container.addEventListener('pointercancel', up);
  container.addEventListener('lostpointercapture', up);
  document.addEventListener('visibilitychange', visibility);
  return () => {
    disposed = true; stop(); release();
    if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame);
    intersection.disconnect(); resize.disconnect();
    container.removeEventListener('pointerdown', down);
    container.removeEventListener('pointermove', move);
    container.removeEventListener('pointerup', up);
    container.removeEventListener('pointercancel', up);
    container.removeEventListener('lostpointercapture', up);
    document.removeEventListener('visibilitychange', visibility);
    Matter.Composite.clear(engine.world, false); Matter.Engine.clear(engine);
    container.classList.remove('physics-active'); container.style.removeProperty('height');
    pills.forEach(pill => pill.style.removeProperty('transform'));
  };
}
