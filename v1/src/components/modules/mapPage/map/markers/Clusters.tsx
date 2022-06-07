import { MapContext } from '@src/contexts/MapContext';
import { GetDistance } from '@src/functions/map';
import React, { useContext } from 'react';
import { MapRef } from 'react-map-gl';
import useSupercluster from 'use-supercluster';

import { Maybe } from '../../../../../../src/graphql/index';
import GetPoints from './GetPoints';
import Marker from './Marker';

interface ILeaf {
  properties: { preview: string | null; id: number };
  geometry: { coordinates: [number, number] };
}

interface ICluster {
  id: number; // generated id of cluster
  properties: {
    id: number; // place id (not if it's a cluster)
    cluster: boolean; // is cluster
    point_count: number; // number of places in cluster (only if it's a cluster)
    preview: string | null; // preview image of place (not if it's a cluster)
    icon: string | null; // place icon (not if it's a cluster)
  };
  geometry: { coordinates: [number, number] };
}

interface IClustersProps {
  mapRef: React.MutableRefObject<Maybe<MapRef>>;
}

const Clusters: React.FC<IClustersProps> = ({ mapRef }) => {
  const mapContext = useContext(MapContext);

  const { clusters, supercluster } = useSupercluster({
    points: GetPoints(), // get places from query in correct format
    zoom: mapContext.viewport.zoom,
    bounds: mapRef.current
      ? mapRef.current.getMap().getBounds().toArray().flat()
      : null,
    options: {
      radius: 75, // cluster radius
      maxZoom: 20, // max zoom to cluster points on
    },
  }); // get clusters

  return (
    <>
      {clusters.map((cluster: ICluster, index: number) => {
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        let preview: null | string = isCluster
          ? null
          : cluster.properties?.preview; // if element is not cluster set preview

        // if element is cluster get preview from the point with preview closest to the center of the cluster
        if (isCluster) {
          let closestPointDistance: number | null = null;

          // for each point in cluster
          supercluster.getLeaves(cluster.id).forEach((leaf: ILeaf) => {
            // if point does not have preview skip it
            if (leaf.properties.preview == null) return;
            // get coordinates difference between point and center of cluster
            const distance: number = GetDistance(
              cluster.geometry.coordinates,
              leaf.geometry.coordinates
            );

            if (
              closestPointDistance === null ||
              distance < closestPointDistance
            ) {
              // if distance is closer to center of cluster
              preview = leaf.properties?.preview; // update preview
              closestPointDistance = distance; // set new closest point distance
            }
          });
        }
        // if any preview was not found don't show marker
        if (preview === null) return null;

        return (
          <Marker
            key={index}
            place={{
              id: isCluster
                ? supercluster
                    .getLeaves(cluster.id)
                    .map((leaf: ILeaf) => leaf.properties.id)
                : [cluster.properties.id],
              longitude: cluster.geometry.coordinates[0],
              latitude: cluster.geometry.coordinates[1],
              isCluster,
              icon: isCluster ? null : cluster?.properties?.icon ?? null, // return icon only if it's place (not cluster)
              preview,
            }}
            numberOfPlaces={pointCount}
            onClick={() => {
              if (!isCluster) {
                // if it's not a cluster open place in sidebar and end function
                mapContext.setSidebarPlace(cluster.properties.id);
                mapContext.setShowSidebar(true);
                return;
              }
              // if it's a cluster zoom to see all places
              const expansionZoom = Math.min(
                supercluster.getClusterExpansionZoom(cluster.id),
                20
              );

              mapContext.setViewport({
                ...mapContext.viewport,
                longitude: cluster.geometry.coordinates[0],
                latitude: cluster.geometry.coordinates[1],
                zoom: expansionZoom,
              });
            }}
          />
        );
      })}
    </>
  );
};

export default Clusters;
