import React from "react";
import "./style.css";
import { useRef } from "react";
import { useState } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeDown,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { useEffect } from "react";

const AudioPlayer = ({ audioSrc, image }) => {
  const [duration, setDuration] = useState(0);
  const [isMute, setIsMute] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef();

  const handleDurationChange = (e) => {
    setCurrentTime(e.target.value);
    audioRef.current.currentTime = e.target.value;
  };
  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = volume;
  };
  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMute(!isMute);

  //   useEffect(() => {
  //     setDuration(audioRef.current.duration);
  //   }, [audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isMute) {
      audioRef.current.volume = 0;
      setVolume(0);
    } else {
      audioRef.current.volume = 1;
      setVolume(1);
    }
  }, [isMute]);
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <div className="custom-audio-player">
      <img src={image} className="display-img" />
      <audio src={audioSrc} ref={audioRef}></audio>
      <p onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</p>
      <div className="duration-flex">
        <p>{formatTime(currentTime)}</p>
        <input
          className="duration-range"
          type="range"
          max={duration}
          min={0}
          step={0.01}
          value={currentTime}
          onChange={handleDurationChange}
        />
        <p>-{formatTime(duration - currentTime)}</p>
        <p onClick={toggleMute}>
          {isMute ? <FaVolumeUp /> : <FaVolumeMute />}{" "}
        </p>
        <input
          value={volume}
          min={0}
          max={1}
          step={0.01}
          className="volume-range"
          type="range"
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
