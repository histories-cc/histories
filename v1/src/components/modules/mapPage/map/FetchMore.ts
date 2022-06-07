import IMapContext from '@src/types/contexts/MapContext';
import { IBounds } from '@src/types/map';

interface FetchMoreProps {
  mapContext: IMapContext;
  bounds: IBounds;
}

async function FetchMore({
  mapContext,
  bounds,
}: FetchMoreProps): Promise<void> {
  await mapContext.placesQuery?.fetchMore({
    variables: {
      input: {
        filter: {
          maxLatitude: bounds.maxLatitude,
          maxLongitude: bounds.maxLongitude,
          minLatitude: bounds.minLatitude,
          minLongitude: bounds.minLongitude,
          exclude: mapContext.placesQuery.data?.places
            .filter(
              (place) =>
                place.latitude > bounds.minLatitude &&
                place.latitude < bounds.maxLatitude &&
                place.longitude > bounds.minLongitude &&
                place.longitude < bounds.maxLongitude
            )
            .map((place) => place.id),
          take: 120,
        },
      },
    },
    updateQuery: (prev: any, { fetchMoreResult }) => {
      if (!fetchMoreResult) return prev; // if no new data, return prev data
      const prevPlaces =
        prev.places === undefined || prev.places.length === undefined
          ? []
          : prev.places;
      // add new places
      return {
        places: [
          ...prevPlaces,
          ...fetchMoreResult.places.filter(
            (place: any) => !prevPlaces.find((p: any) => p.id === place.id) // filter out duplicates
          ),
        ],
      };
    },
  });

  await mapContext.postsQuery?.fetchMore({
    variables: {
      input: {
        filter: {
          maxLatitude: bounds.maxLatitude,
          maxLongitude: bounds.maxLongitude,
          minLatitude: bounds.minLatitude,
          minLongitude: bounds.minLongitude,
        },
      },
    },
    updateQuery: (prev: any, { fetchMoreResult }) => {
      if (!fetchMoreResult) return prev; // if no new data, return prev data
      const prevPosts = prev.posts.length === undefined ? [] : prev.posts;
      // add new posts
      return {
        posts: [
          ...prevPosts,
          ...fetchMoreResult.posts.filter(
            (post: any) => !prevPosts.find((p: any) => p.id === post.id) // filter out duplicates
          ),
        ],
      };
    },
  });
}

export default FetchMore;
