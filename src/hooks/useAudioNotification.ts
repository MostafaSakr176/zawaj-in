// src/hooks/useAudioNotification.ts - Alternative version
import { useRef, useCallback, useEffect } from 'react';

export const useAudioNotification = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  const initializeAudio = useCallback(async () => {
    try {
      // Create AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume context if suspended (for autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Load audio file if not already loaded
      if (!bufferRef.current) {
        const response = await fetch('/sounds/notification.mp3');
        const arrayBuffer = await response.arrayBuffer();
        bufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
        console.log('Audio buffer loaded successfully');
      }
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }, []);

  const playNotificationSound = useCallback(async () => {
    try {
      await initializeAudio();
      
      if (audioContextRef.current && bufferRef.current) {
        const source = audioContextRef.current.createBufferSource();
        const gainNode = audioContextRef.current.createGain();
        
        source.buffer = bufferRef.current;
        gainNode.gain.value = 0.7; // Volume
        
        source.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        source.start();
        console.log('Sound played using Web Audio API');
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [initializeAudio]);

  return { playNotificationSound,  };
};