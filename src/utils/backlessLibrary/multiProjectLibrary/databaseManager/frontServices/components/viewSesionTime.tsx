import React, { useEffect, useState } from 'react';
import { setSesionTime } from '../../../configs';

interface CountdownTimerProps {
  initialTime: string; // Formato "hh:mm:ss"
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialTime }) => {
  // Convertir el tiempo inicial (hh:mm:ss) a segundos
  const timeToSeconds = (time: string): number => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const [timeLeft, setTimeLeft] = useState(timeToSeconds(initialTime));

  useEffect(() => {
    if (timeLeft <= 0) return;

    // Configurar el temporizador para la cuenta regresiva
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
      setSesionTime(formatTime(timeLeft))
    }, 1000);

    // Limpiar el temporizador cuando el componente se desmonte o el tiempo se agote
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Formatear el tiempo restante en "hh:mm:ss"
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div>
      {timeLeft > 0 ? (
        <span>Tiempo restante: {formatTime(timeLeft)}</span>
      ) : (
        <span>Tiempo finalizado</span>
      )}
    </div>
  );
};

export default CountdownTimer;
