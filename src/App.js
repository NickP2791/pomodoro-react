import { ImArrowUp, ImArrowDown, ImPlay3, ImPause2 } from "react-icons/im";
import { BiReset } from "react-icons/bi";
import { IconContext } from "react-icons/lib";
import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [breakTm, setBreakTm] = useState(5 * 60);
  const [sessionTm, setSessionTm] = useState(25 * 60);
  const [timer, setTimer] = useState(() => 25 * 60);
  const [startStop, setStartStop] = useState(false);
  const [flag, setFlag] = useState("Session");

  const playDoneSound = () => {
    var audio = document.getElementById("beep");
    audio.currentTime = 0;
    audio.play();
  };

  const handleBreakUp = () => {
    if (!startStop) {
      setBreakTm((prev) => (prev + 60 <= 60 * 60 ? prev + 60 : prev));
    }
  };

  const handleBreakDown = () => {
    if (!startStop) {
      setBreakTm((prev) => (prev - 60 >= 60 ? prev - 60 : prev));
    }
  };

  const handleSessionUp = () => {
    if (!startStop) {
      setSessionTm((prev) => (prev + 60 <= 60 * 60 ? prev + 60 : prev));
      setTimer((prev) => (prev + 60 <= 60 * 60 ? sessionTm + 60 : prev));
    }
  };

  const handleSessionDown = () => {
    if (!startStop) {
      setSessionTm((prev) => (prev - 60 >= 60 ? prev - 60 : prev));
      setTimer((prev) => (prev - 60 >= 60 ? sessionTm - 60 : prev));
    }
  };

  const handleReset = () => {
    var audio = document.getElementById("beep");
    setStartStop(() => false);
    audio.pause();
    audio.currentTime = 0;
    setBreakTm(() => 5 * 60);
    setSessionTm(() => 25 * 60);
    setTimer(() => 25 * 60);
    setFlag(() => "Session");
  };

  const timeFormat = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // //used for testing code against FCC test suite
    // let checkit = minutes + ":" + seconds;
    // const timerRe = new RegExp(/^(\d{2,4})[\.:,\/](\d{2})$/);
    // console.log(timerRe.test(checkit) + " and " + checkit);

    return minutes + ":" + seconds;
  };

  const minuteConvert = (minAdjust) => {
    return Math.floor(minAdjust / 60);
  };

  //test timer type when clock hits ZERO, then switches timer
  //session to break, break to session, changes title name of timer
  const ZeroTest = () => {
    if (flag === "Session") {
      setFlag("Break");
      setTimer(breakTm);
    } else {
      setFlag("Session");
      setTimer(sessionTm);
    }
  };

  //used to post the Zero time for 1 second and test for zero
  useEffect(() => {
    if (timeFormat(timer) === "00:00") {
      playDoneSound();
      setTimeout(() => {
        ZeroTest();
      }, 1000);
    }
  }, [timer]);

  //beating heart of the countdown timer
  //the useEffect is used as the on/off switch for the timer
  useEffect(() => {
    let interval = null;

    if (startStop) {
      interval = setInterval(() => {
        setTimer((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [startStop]);

  return (
    <IconContext.Provider value={{ size: "2.5em" }}>
      <div className='App'>
        <div className='container-wrapper'>
          <h1>Pomodoro by Pauletto</h1>
          <div className='row top'>
            <div className='break-box'>
              <div className='column'>
                <h2 id='break-label'>Break Length</h2>

                <button
                  className='btn-more'
                  id='break-increment'
                  onClick={handleBreakUp}>
                  <ImArrowUp />
                </button>
                <p className='adjusters' id='break-length'>
                  {minuteConvert(breakTm)}
                </p>
                <span style={{ fontSize: "1em" }}>minutes</span>
                <button
                  className='btn-less'
                  id='break-decrement'
                  onClick={handleBreakDown}>
                  <ImArrowDown />
                </button>
              </div>
            </div>
            <div className='session-box'>
              <div className='column'>
                <h2 id='session-label'>Session Length</h2>

                <button
                  className='btn-more'
                  id='session-increment'
                  onClick={handleSessionUp}>
                  <ImArrowUp />
                </button>
                <p className='adjusters' id='session-length'>
                  {minuteConvert(sessionTm)}
                </p>
                <span style={{ fontSize: "1em" }}>minutes</span>
                <button
                  className='btn-less'
                  id='session-decrement'
                  onClick={handleSessionDown}>
                  <ImArrowDown />
                </button>
              </div>
            </div>
          </div>

          <div className='timer-box'>
            <h2 id='timer-label'>{flag}</h2>
            <p id='time-left'>{timeFormat(timer)}</p>
            <audio src='../audioclips/audiomass-output.mp3' id='beep'></audio>
            <div className='row'>
              <button
                id='start_stop'
                onClick={() => setStartStop((prev) => !prev)}>
                {startStop ? <ImPause2 /> : <ImPlay3 />}
              </button>
              <button id='reset' onClick={handleReset}>
                <BiReset />
              </button>
            </div>
          </div>
        </div>
      </div>
    </IconContext.Provider>
  );
}

export default App;
