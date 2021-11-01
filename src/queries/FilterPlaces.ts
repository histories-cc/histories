import RunCypherQuery from '../database/RunCypherQuery';
import { ValidateCoordinates, ValidateDate } from '../validation';

type queryInput = {
  maxLatitude: number;
  minLatitude: number;
  maxLongitude: number;
  minLongitude: number;
  minDate?: number;
  maxDate?: number;
};

const FilterPlacesQuery = async ({
  maxLatitude,
  minLatitude,
  maxLongitude,
  minLongitude,
  minDate,
  maxDate,
}: queryInput) => {
  // validate coordinates
  const validateMaxCoordinates = ValidateCoordinates([
    maxLatitude,
    maxLongitude,
  ]).error;
  if (validateMaxCoordinates) throw new Error(validateMaxCoordinates);
  const validateMinCoordinates = ValidateCoordinates([
    minLatitude,
    minLongitude,
  ]).error;
  if (validateMinCoordinates) throw new Error(validateMinCoordinates);

  // validate date if defined
  if (minDate) {
    const validateMinDate = ValidateDate(Number(minDate)).error;
    if (validateMinDate) throw new Error(validateMinDate);
  }
  if (maxDate) {
    const validateMaxDate = ValidateDate(Number(maxDate)).error;
    if (validateMaxDate) throw new Error(validateMaxDate);
  }

  const query = `MATCH (place:Place)<-[:IS_LOCATED]-(post:Post)<-[:CREATED]-(author:User)
WHERE place.location.latitude >= ${minLatitude} AND place.location.latitude <= ${maxLatitude}
AND place.location.longitude >= ${minLongitude} AND place.location.longitude <= ${maxLongitude}
${minDate ? ` AND post.postDate >= ${minDate} ` : ''}
${maxDate ? ` AND post.postDate <= ${maxDate} ` : ''}
WITH place{.*,latitude: place.location.latitude, longitude: place.location.longitude, id: ID(place), posts: COLLECT(post{.*, id: ID(post), author: author{.*, id: ID(author)}})} AS result
RETURN COLLECT(result) AS places`;

  const result = await RunCypherQuery(query);

  return result.records[0].get('places').map((x: any) => ({
    ...x,
    posts: x.posts.map((post: any) => ({
      ...post,
      url: post.url,
    })),
  }));
};

export default FilterPlacesQuery;
