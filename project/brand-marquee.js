(() => {
  const viewport = document.querySelector('.brand-marquee');
  if (!viewport) return;
  const set = viewport.querySelector('.brand-set');
  const clone = set.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('img').forEach(img => img.alt = '');
  set.parentElement.append(clone);
  let position = 0, last = 0, frame = 0, visible = false, hovering = false, touching = false, focused = false, resumeAt = 0;
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
  observer.observe(viewport);
  viewport.addEventListener('mouseenter', () => hovering = true);
  viewport.addEventListener('mouseleave', () => hovering = false);
  viewport.addEventListener('focus', () => focused = true);
  viewport.addEventListener('blur', () => focused = false);
  const cursor = document.createElement('img');
  cursor.src = 'assets/home/Drag.png';
  cursor.alt = '';
  cursor.className = 'brand-drag-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  let dragId = null, previousX = 0;
  viewport.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.classList.add('is-visible');
    viewport.classList.add('has-drag-cursor');
    if (dragId !== e.pointerId) return;
    const width = set.getBoundingClientRect().width;
    position = ((viewport.scrollLeft + previousX - e.clientX) % width + width) % width;
    viewport.scrollLeft = position;
    previousX = e.clientX;
  });
  viewport.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  viewport.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') { touching = true; return; }
    if (e.button !== 0) return;
    e.preventDefault();
    touching = true;
    dragId = e.pointerId;
    previousX = e.clientX;
    viewport.setPointerCapture(e.pointerId);
    cursor.classList.add('is-dragging');
  });
  const release = e => {
    if (dragId !== null && viewport.hasPointerCapture(dragId)) viewport.releasePointerCapture(dragId);
    dragId = null;
    touching = false;
    cursor.classList.remove('is-dragging');
    resumeAt = e.pointerType === 'mouse' ? 0 : performance.now() + 2000;
    const rect = viewport.getBoundingClientRect();
    hovering = e.pointerType === 'mouse' && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!hovering) cursor.classList.remove('is-visible');
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  viewport.addEventListener('wheel', () => resumeAt = performance.now() + 2000, {passive:true});
  function tick(now) {
    const dt = last ? Math.min(now - last, 50) : 0;
    last = now;
    if (visible && !document.hidden && !hovering && !touching && !focused && now > resumeAt) {
      position += dt * .032;
      const width = set.getBoundingClientRect().width;
      if (width) position %= width;
      viewport.scrollLeft = position;
    } else position = viewport.scrollLeft;
    frame = requestAnimationFrame(tick);
  }
  frame = requestAnimationFrame(tick);
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); observer.disconnect(); });
  window.addEventListener('pageshow', e => { if(e.persisted) { observer.observe(viewport); last = 0; frame = requestAnimationFrame(tick); } });
})();
