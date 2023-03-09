import React from 'react';
import { PomodoroTimer } from './components/pomodoro-timer';
function App() {
  return (
    <div className="container">
      <PomodoroTimer
        PomodoroTime={1500} // 25mnt
        shortRestTime={300} // 5mnt (shorttime) descanso curto
        longRestTime={900} // 15mnt desconto longo
        cycles={4} // a cada 4 ciclos
      />
    </div>
  );
}

export default App;
