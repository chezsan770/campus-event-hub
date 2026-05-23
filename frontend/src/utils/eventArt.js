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
