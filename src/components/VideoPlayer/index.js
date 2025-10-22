import React, { useState } from 'react';
import './VideoPlayer.css';

function VideoPlayer({ videoId, title = "Vídeo" }) {
  const [loaded, setLoaded] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;

  return (
    <div className="video-player">
      <div className="video-aspect-ratio">
        {!loaded && (
          <div className="video-loading">
            <div className="spinner"></div>
          </div>
        )}
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </div>
    </div>
  );
}

export default VideoPlayer;