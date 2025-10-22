// src/utils/notificationUtils.ts
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const enableAudioContext = (): void => {
  // This helps with autoplay restrictions
  const enableAudio = () => {
    const audio = new Audio();
    audio.muted = true;
    audio.play().then(() => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    }).catch(() => {
      // Ignore errors
    });
  };

  document.addEventListener('click', enableAudio, { once: true });
  document.addEventListener('touchstart', enableAudio, { once: true });
};