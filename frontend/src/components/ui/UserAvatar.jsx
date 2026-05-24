import { API_ORIGIN } from '../../api/axiosInstance';

const isImageReference = (value = '') => /^(\/uploads\/|data:image\/|https?:\/\/|blob:)/i.test(value);

export default function UserAvatar({ user, size = 'md', className = '' }) {
  const avatarValue = user?.avatar || '';
  const profilePicture = user?.profilePicture || '';
  const rawImageSrc = isImageReference(profilePicture)
    ? profilePicture
    : isImageReference(avatarValue)
      ? avatarValue
      : '';
  const imageSrc = rawImageSrc.startsWith('/uploads/') ? `${API_ORIGIN}${rawImageSrc}` : rawImageSrc;
  const initials = (user?.name || user?.email || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'U';
  const sizeClass = {
    xs: 'w-6 h-6 text-[0.65rem]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-14 h-14 text-base',
  }[size] || 'w-9 h-9 text-sm';

  return (
    <div className={`brand-mark ${sizeClass} rounded-pill bg-gradient-primary flex items-center justify-center text-white font-bold shrink-0 overflow-hidden ${className}`}>
      {imageSrc ? (
        <img src={imageSrc} alt="" className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
