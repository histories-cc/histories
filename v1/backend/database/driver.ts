import neo4j from 'neo4j-driver';

const DBConnector = () => {
  const driver = neo4j.driver(
    process.env.NEO4J_HOST || 'bolt://localhost:7687',
    neo4j.auth.basic(
      process.env.NEO4J_USER || 'neo4j',
      process.env.NEO4J_PASSWORD || 'password'
    ),
    { disableLosslessIntegers: true }
  );
  return driver;
};

export default DBConnector;
