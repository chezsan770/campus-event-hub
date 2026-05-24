import { getEventCoverMediaStyle, hasCustomCover } from '../../utils/eventArt';

export default function EventCoverMedia({ event, className = '' }) {
  if (!hasCustomCover(event)) return null;

  return (
    <img
      src={event.coverImage}
      alt=""
      className={`event-cover-media ${className}`}
      style={getEventCoverMediaStyle(event)}
      aria-hidden="true"
    />
  );
}
