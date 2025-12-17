import React, { useMemo, useState } from 'react';
import ReactPannellum from 'react-pannellum';
import './VirtualTourViewer.css';

export default function VirtualTourViewer({ property }) {
  const [selectedRoom, setSelectedRoom] = useState(0);

  const rooms = useMemo(() => {
    const list = property?.panoramicImages || [];
    return Array.isArray(list) ? list.filter((r) => r && r.url) : [];
  }, [property]);

  if (!rooms.length) {
    return (
      <div className="vtv-empty">
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
    <div className="vtv">
      <div className="vtv-roombar">
        {rooms.map((room, idx) => (
          <button
            key={`${room.url}-${idx}`}
            className={`vtv-room ${idx === selectedRoom ? 'active' : ''}`}
            type="button"
            onClick={() => setSelectedRoom(idx)}
          >
            {room.roomName || `View ${idx + 1}`}
          </button>
        ))}
      </div>

      <div className="vtv-view">
        <ReactPannellum
          id={`tour-${property?._id || 'property'}-${selectedRoom}`}
          sceneId="scene1"
          imageSource={config.panorama}
          config={config}
          style={{ width: '100%', height: '600px', borderRadius: '16px', overflow: 'hidden' }}
        />
      </div>
    </div>
  );
}
