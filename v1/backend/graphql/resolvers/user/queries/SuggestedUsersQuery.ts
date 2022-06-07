import RunCypherQuery from '../../../../database/RunCypherQuery';

const SuggestedUsersQuery = async (logged: number | null) => {
  const query =
    logged !== null
      ? `MATCH (logged:User)
      WHERE ID(logged) = ${logged}
      MATCH (user:User)
      WHERE NOT (logged)-[:FOLLOW]->(user) AND NOT user = logged
      RETURN collect(user{.*, id: ID(user)}) AS suggestions LIMIT 15`
      : `
      MATCH (user:User)
      RETURN COLLECT(user{.*, id: ID(user)}) AS suggestions LIMIT 15`;

  const [result] = await RunCypherQuery({ query });

  if (result.records[0] === undefined) throw new Error('unexpected error');
  else return result.records[0].get('suggestions');
};

export default SuggestedUsersQuery;
