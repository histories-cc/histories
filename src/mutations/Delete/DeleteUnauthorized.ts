import RunCypherQuery from '@src/database/RunCypherQuery';

// QUERY
/*
 * MATCH (user:User)
 * WHERE user.verified = false                                      - not verified users
 * AND user.createdAt < (1635086849331 - 1000 * 60 * 60 * 24 * 3)   - calculates in js current time minus 3 days
 * DELETE user                                                      - delete all matching
 */

// run this query every 12 hours with github action
const DeleteUnauthorized = async (): Promise<void> => {
  await RunCypherQuery(
    `MATCH (user:User) WHERE user.verified = false AND user.createdAt < ${
      new Date().getTime() - 1000 * 60 * 60 * 24 * 3
    } DELETE user`
  );
};

export default DeleteUnauthorized;
