import { useRouter } from "next/router";
import React, { useEffect, useState } from "react"
import ReactMapGl, { ViewStateChangeEvent } from 'react-map-gl';
import { useMap } from 'react-map-gl';


interface IIndexPageMapProps {

}

const IndexPageMap: React.FC<IIndexPageMapProps> = () => {
  // contexts
  const { myMapA: mapContext } = useMap();


  // hooks
  const router = useRouter()


  const [viewState, setViewState] = useState<{
    longitude: number, latitude: number, zoom: number
  }>({
    longitude: 15,
    latitude: 40,
    zoom: 3.5
  });

  useEffect(() => {
    if (!router.isReady) return;

    // get devices location
    if (mapContext === undefined) {
      navigator.geolocation.getCurrentPosition((position) => {
               setViewState({
          latitude: position.coords.latitude || 0,
          longitude: position.coords.longitude || 0,
          zoom: 14,
        })
      })
    }

    // TODO: load data from URL query
  }, [router])

  useEffect(() => {


    // mapContext.getBounds().toArray()
  }, [viewState])


  const UpdateURLQuery = () => {
    if (!router.isReady ||
      mapContext === undefined) return;

    router.replace({
      query: {
        lat: mapContext.getCenter().lat.toFixed(4),
        lng: mapContext.getCenter().lng.toFixed(4),
        z: mapContext.getZoom()
      }
    })
  }

  return (<div><ReactMapGl
    id="myMapA"
    {...viewState}
    onMove={event => setViewState(event.viewState)}

    onDragEnd={UpdateURLQuery}
    onZoomEnd={UpdateURLQuery}


    style={{ width: "100%", height: "calc(100vh - 78px)", position: "absolute", bottom: 0 }}
    mapStyle="mapbox://styles/mapbox/streets-v11"
    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX}
  /></div>);
}


export default IndexPageMap