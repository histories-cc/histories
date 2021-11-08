import DbConnector from '../../../src/database/driver';

const IsUsedEmail = async (email: string): Promise<boolean> => {
  const query = `MATCH (user:User)
  WHERE user.email =~ "(?i)${email}"
  RETURN COUNT(user) > 0 AS isUsed`;

  const driver = DbConnector();
  const session = driver.session();
  const response = await session.run(query);
  driver.close();

  return response.records[0].get('isUsed');
};

export default IsUsedEmail;