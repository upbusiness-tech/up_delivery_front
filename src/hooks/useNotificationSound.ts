import { useRef, useCallback } from "react";
import song from '../assets/notificationSong.mp3'

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(song);
  }

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // reinicia se já estava tocando
      audioRef.current.play().catch((err) => {
        console.warn("Não foi possível tocar o som (interação do usuário necessária):", err);
      });
    }
  }, []);

  return { play };
}