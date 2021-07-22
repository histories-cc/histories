import neo4j, { Driver } from 'neo4j-driver';

export default (): Driver => {
  const driver = neo4j.driver(
    process.env.NEO4J_HOST || 'bolt://localhost:7687',
    neo4j.auth.basic(
      process.env.NEO4J_USER || 'neo4j',
      process.env.NEO4J_PASSWORD || 'password'
    )
  );
  return driver;
};