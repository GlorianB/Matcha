import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { withRouter } from 'react-router';


//api import

const MapComponent = (props) => {

  const MAPBOX_TOKEN='pk.eyJ1IjoiZ2xvcmlhbiIsImEiOiJja2VqZnNoc2wyZmM0MnJtaTc0MzQzdnRyIn0.EoglFdd7iACPh-DZvR14sg';

  const pos = {
    userLatitude : props.userLatitude,
    userLongitude : props.userLongitude
  };

  const [markerPos, setMarkerPos] = useState({
    markerLatitude : 0.0,
    markerLongitude : 0.0
  });

  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude : 37.7577,
    longitude : -122.4376,
    zoom: 8
  });

  const { markerLatitude, markerLongitude } = markerPos;

  const updatePosition = props.updatePosition,
        userLatitude = pos.userLatitude,
        userLongitude = pos.userLongitude;

  const handlePosition = async () => {
    const getPosition = props.getPosition;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latLng = position.coords;
        handlePositionChanged({ latitude : userLatitude, longitude : userLongitude }, { latitude : position.coords.latitude, longitude : position.coords.longitude }).then(() => {
          setViewport({ ...viewport, latitude : latLng.latitude, longitude : latLng.longitude });
          setMarkerPos({ markerLatitude : latLng.latitude, markerLongitude : latLng.longitude });
        })
      }, (error) => {
        console.log(error);
        getPosition().then((position) => {
          handlePositionChanged({ latitude : userLatitude, longitude : userLongitude }, { latitude : position.latitude, longitude : position.longitude }).then(() => {
            setViewport({ ...viewport, latitude : position.latitude, longitude : position.longitude });
            setMarkerPos({ markerLatitude : position.latitude, markerLongitude : position.longitude });
          })
        });
      })
  } else {
      const position = await getPosition();
      await handlePositionChanged({ latitude : userLatitude, longitude : userLongitude }, { latitude : position.latitude, longitude : position.longitude });
      setViewport({ ...viewport, latitude : position.latitude, longitude : position.longitude });
      setMarkerPos({ markerLatitude : position.latitude, markerLongitude : position.longitude });
    }
  }

  const handlePositionChanged = async (latLngBefore, latLngAfter) => {
    if (JSON.stringify(latLngBefore) !== JSON.stringify(latLngAfter))
      await updatePosition(latLngAfter);
  }

  useEffect(() => {
    handlePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReactMapGL
      { ...viewport }
      onViewportChange={ (viewport) => setViewport(viewport) }
      mapboxApiAccessToken={ MAPBOX_TOKEN }
      mapStyle='mapbox://styles/glorian/ckekx1le90rzk19ocp7ggq0xn'
    >
      <Marker draggable latitude={markerLatitude} longitude={markerLongitude}>
          <img alt='pin' src={process.env.PUBLIC_URL + '/pin.png'} height='40' width='20'/>
      </Marker>
    </ReactMapGL>
  );

};

const Map = withRouter(MapComponent);

export default Map;
