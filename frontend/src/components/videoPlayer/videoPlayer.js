import { useEffect, useState } from "react";

const VideoPlayer = (videoEl) => {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(true);

  let playerState = {
    playing,
    setPlaying,
    progress,
    setProgress,
    setSpeed,
    speed,
    muted,
  };

  useEffect(() => {
    playing ? videoEl.current.play() : videoEl.current.pause();
  }, [playing, videoEl]);

  const togglePlay = (e) => {
    setPlaying(!playing);
  };

  const handleOnTimeUpdate = () => {
    const progress =
      (videoEl.current.currentTime / videoEl.current.duration) * 100;

    setProgress(progress);
  };

  const handleVideoProgress = (e) => {
    const manualChange = Number(e.target.value);
    videoEl.current.currentTime =
      (videoEl.current.duration / 100) * manualChange;

    setProgress(manualChange);
  };

  const handleVideoSpeed = (e) => {
    const speed = Number(e.target.value);
    videoEl.current.playbackRate = speed;

    setSpeed(speed);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  useEffect(() => {
    muted ? (videoEl.current.muted = true) : (videoEl.current.muted = false);
  }, [muted, videoEl]);

  return {
    togglePlay,
    handleOnTimeUpdate,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
    playerState,
  };
};

export default VideoPlayer;
