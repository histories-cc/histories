const express = require('express');
const next = require('next');
// path to compiled file
const { ApplyMidleware } = require('./dist/backend/graphql/utils/apolloServer');
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  server.use(
    graphqlUploadExpress({
      maxFiles: 5,
      maxFileSize: 20000000,
    })
  );

  await ApplyMidleware(server);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log(`🚀 Server ready`);
  });
});
