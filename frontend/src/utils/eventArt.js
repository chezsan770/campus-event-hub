export function getEventArtStyle(token) {
  const map = {
    'from-blue-600 to-purple-600': { '--event-bg': '#FFC94B', '--event-shape': '#F17A7E', '--event-dot': '#F9A66C' },
    'from-purple-600 to-pink-600': { '--event-bg': '#F17A7E', '--event-shape': '#FFC94B', '--event-dot': '#F9FAF4' },
    'from-orange-500 to-red-500': { '--event-bg': '#F9A66C', '--event-shape': '#F17A7E', '--event-dot': '#FFC94B' },
    'from-green-500 to-teal-500': { '--event-bg': '#BFE7C7', '--event-shape': '#4A6163', '--event-dot': '#FFC94B' },
    'from-cyan-500 to-blue-500': { '--event-bg': '#F9FAF4', '--event-shape': '#FFC94B', '--event-dot': '#F17A7E' },
    'from-violet-600 to-blue-600': { '--event-bg': '#FFE4CF', '--event-shape': '#4A6163', '--event-dot': '#FFC94B' },
    'from-pink-500 to-orange-400': { '--event-bg': '#F17A7E', '--event-shape': '#F9A66C', '--event-dot': '#F9FAF4' },
    'from-blue-700 to-indigo-600': { '--event-bg': '#4A6163', '--event-shape': '#FFC94B', '--event-dot': '#F17A7E' },
    'from-slate-600 to-slate-800': { '--event-bg': '#FFF6E8', '--event-shape': '#4A6163', '--event-dot': '#F9A66C' },
  };

  return map[token] || map['from-blue-600 to-purple-600'];
}

export function getEventCoverStyle(eventOrToken) {
  if (eventOrToken && typeof eventOrToken === 'object' && eventOrToken.coverImage) {
    return {
      backgroundColor: 'var(--clr-surface-cont)',
    };
  }

  const token = typeof eventOrToken === 'string' ? eventOrToken : eventOrToken?.imageGradient;
  return getEventArtStyle(token);
}

export function hasCustomCover(event) {
  return Boolean(event?.coverImage);
}

export function getEventCoverMediaStyle(event) {
  const zoom = Math.max(Number(event?.coverZoom) || 100, 100);
  const rawPositionX = Number(event?.coverPositionX);
  const rawPositionY = Number(event?.coverPositionY);
  const positionX = Math.min(100, Math.max(0, Number.isFinite(rawPositionX) ? rawPositionX : 50));
  const positionY = Math.min(100, Math.max(0, Number.isFinite(rawPositionY) ? rawPositionY : 50));

  return {
    objectPosition: `${positionX}% ${positionY}%`,
    transform: `scale(${zoom / 100})`,
    transformOrigin: `${positionX}% ${positionY}%`,
  };
}
