import RunCypherQuery from '../../../../database/RunCypherQuery';

// run this query every 12 hours with github action
const DeleteUnauthorized = async (): Promise<void> => {
  const query = `
  MATCH (user:User)
  WHERE user.verified = false
    AND user.createdAt < $time
  DELETE user
  `;

  await RunCypherQuery({
    query,
    params: { time: new Date().getTime() - 1000 * 60 * 60 * 24 * 3 },
  });
};

export default DeleteUnauthorized;
