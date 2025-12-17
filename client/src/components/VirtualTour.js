import React, { useMemo, useState } from 'react';
import ReactPannellum from 'react-pannellum';
import './VirtualTour.css';

export default function VirtualTour({ panoramicImages }) {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const rooms = useMemo(() => {
    const list = panoramicImages || [];
    return Array.isArray(list) ? list.filter((r) => r && r.url) : [];
  }, [panoramicImages]);

  if (!rooms.length) {
    return (
      <div className="no-tour">
        <h3>360° Tour Not Available</h3>
        <p>This property doesn’t have a 360° tour yet.</p>
      </div>
    );
  }

  const current = rooms[Math.min(selectedRoom, rooms.length - 1)];
  const config = {
    type: 'equirectangular',
    panorama: current.url,
    autoLoad: true,
    showControls: true,
    showFullscreenCtrl: true,
    showZoomCtrl: true,
    hfov: 100,
    maxHfov: 120,
    minHfov: 50,
  };

  return (
    <div className="virtual-tour">
      <h2>360° Virtual Tour</h2>
      <p className="tour-instructions">Click and drag to look around • Scroll to zoom</p>

      <div className="room-selector">
        {rooms.map((room, idx) => (
          <button
            key={`${room.url}-${idx}`}
            className={idx === selectedRoom ? 'active' : ''}
            type="button"
            onClick={() => setSelectedRoom(idx)}
          >
            {room.roomName || `View ${idx + 1}`}
          </button>
        ))}
      </div>

      <div className="panorama-viewer">
        <ReactPannellum
          id={`detail-tour-${idxSafe(selectedRoom)}-${rooms.length}`}
          sceneId="scene1"
          imageSource={config.panorama}
          config={config}
          style={{ width: '100%', height: '600px', borderRadius: '16px', overflow: 'hidden' }}
        />
      </div>
    </div>
  );
}

function idxSafe(v) {
  return Number.isFinite(v) ? v : 0;
}
