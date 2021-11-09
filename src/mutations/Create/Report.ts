import RunCypherQuery from '../../database/RunCypherQuery';

// QUERY
/*
 * MATCH (user:User), (target)
 * WHERE ID(user) = 1 AND ID(target) = 4                    - match nodes by IDs
 * AND (target :Post OR target :Comment OR target :Hashtag) - only report these labels
 * MERGE (user)-[r:REPORT]->(target)                        - merge - in case user wants to change type (no need to delete and create report again)
 * SET r.createdAt = 1635490076649,                         - created at
 *     r.type = "inappropriate"                             - report types -> inappropriate | nudity | violence...
 *     r.detailInfo = "I don't think this should be here"   - report detail
 */

const Report = async ({
  logged,
  target,
}: {
  logged: number;
  target: number;
}): Promise<void> => {
  await RunCypherQuery(`MATCH (user:User), (target) WHERE ID(user) = ${logged} AND ID(target) = ${target}
AND (target:Post OR target:Comment OR target:Hashtag) MERGE (user)-[r:REPORT]-(target) SET r.createdAt = ${new Date().getTime()}, r.type = ""`);
};

export default Report;
