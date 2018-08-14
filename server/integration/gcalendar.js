const {Compute} = require('google-auth-library');

async function main() {
  const client = new Compute({
  });
  const projectId = 'sinaxys-212519';
  const url = `https://www.googleapis.com/dns/v1/projects/${project_id}`;
  const res = await client.request({url});
  console.log(res.data);
}

main().catch(console.error);
