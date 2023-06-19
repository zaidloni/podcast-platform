import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

function PodcastCard({ title, id, displayImage }) {
  console.log(displayImage, title, id);
  return (
    <Link to={`/podcast/${id}`}>
      <div className="podcast-card">
        <img className="podcast-display-image" src={displayImage} />
        <p className="podcast-title">{title}</p>
      </div>
    </Link>
  );
}

export default PodcastCard;
