// this function is just to get the nearest place to the center of the cluster, it doesn't need to be geographically accurate
function GetDistance(
  place0: [number, number],
  place1: [number, number]
): number {
  return (
    Math.abs(Math.abs(place0[0]) - Math.abs(place1[0])) +
    Math.abs(Math.abs(place0[1]) - Math.abs(place1[1]))
  );
}

export default GetDistance;
