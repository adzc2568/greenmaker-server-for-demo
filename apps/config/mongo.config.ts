import { registerAs } from '@nestjs/config';


export default registerAs('mongo', () => {
  const username = process.env.MONGO_USERNAME;
  const password = encodeURIComponent(process.env.MONGO_PASSWORD);
  const resource = process.env.MONGO_RESOURCE;
  const dbname = process.env.DB_NAME;

  const uri = `mongodb+srv://${username}:${password}@${resource}/${dbname}?retryWrites=true&w=majority`;

  return { username, password, resource, uri };
});
