import React from "react";
import Button from "../Button";

const EpisodeDetails = ({ index, title, description, audioFile, onClick }) => {
  return (
    <>
      <h3 style={{fontSize:"1.5rem"}}>
        {index}. {title}
      </h3>
      <p style={{ marginLeft: "1rem", color: "#8f8297" }}>{description}</p>
      <Button width="200px" text="Play" onClick={() => onClick(audioFile)} />
      <audio src=""></audio>
    </>
  );
};

export default EpisodeDetails;
