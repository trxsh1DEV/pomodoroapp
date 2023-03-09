/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useCallback, useEffect, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';

const bellFinish = require('../sounds/src_sounds_bell-finish.mp3');
const bellStart = require('../sounds/src_sounds_bell-start.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  PomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props) {
  const [mainTime, setMainTime] = useState(props.PomodoroTime);
  // Contando?
  const [timeCounting, setTimeCounting] = useState(false);
  // Trabalhando
  const [working, setWorking] = useState(false);
  // Descansando
  const [resting, setResting] = useState(false);
  // Ciclos de descanso
  const [cyclesQtdManager, setcyclesQtdManager] = useState(
    new Array(props.cycles - 1).fill(true),
  );

  // Dados q queremos coletar para ter estatisticas para o usuário

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numOfPomodoros, setNumOfPomodoros] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 1000 : null,
  );

  const configureWork = () => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    // Reiniciando contador
    setMainTime(props.PomodoroTime);
    audioStartWorking.play();
  };

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);
      long ? setMainTime(props.longRestTime) : setMainTime(props.shortRestTime);
      audioStopWorking.play();
    },
    [setTimeCounting, setWorking, setResting, setMainTime, props.longRestTime],
  );

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    // Verificando se a pessoa está trabalhando e se ela já cumpriu os ciclos curtos determinados, nesse caso 4
    if (working && cyclesQtdManager.length > 0) {
      // Descansos curtos
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      // Descanso longo
      configureRest(true);
      // Reiniciando ciclo longo "poderiamos criar uma função pra n repetir esse trecho do new..."
      setcyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumOfPomodoros(numOfPomodoros + 1);
    if (resting) configureWork();
  }, [
    // dependencias
    working,
    resting,
    mainTime,
    configureRest,
    setcyclesQtdManager,
    configureWork,
    cyclesQtdManager,
    numOfPomodoros,
    props.cycles,
    completedCycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>Você está: {working ? 'trabalhando' : 'descansando'}</h2>
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button text="Rest" onClick={() => configureRest(false)}></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Play'}
          onClick={() => setTimeCounting(!timeCounting)}
        ></Button>
      </div>

      <div className="details">
        <p>Ciclos concluídos: {completedCycles}</p>
        <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
        <p>Pomodoros concluídos: {numOfPomodoros}</p>
      </div>
    </div>
  );
}
