import type { NextApiRequest, NextApiResponse } from 'next';

import DeleteUnauthorized from '../../src/graphql/resolvers/User/DeleteUnauthorized';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ success: await DeleteUnauthorized() });
};

export default Handler;
