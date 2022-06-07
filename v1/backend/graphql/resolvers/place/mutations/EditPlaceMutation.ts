import DbConnector from '../../../../database/driver';

interface IEditPlaceProps {
  userId: number;
  placeId: number;
  name: string;
  description: string;
}

const EditPlaceMutation = async ({
  userId,
  placeId,
  name,
  description,
}: IEditPlaceProps) => {
  const query = `
MATCH (user:User {isAdmin:true, id: ${userId}}), (place:Place {id: ${placeId}}) 
SET place.description = "${description}", place.name = "${name}"
`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'success';
};

export default EditPlaceMutation;
