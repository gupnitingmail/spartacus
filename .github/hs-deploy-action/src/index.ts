import * as github from '@actions/github';
import * as exec from '@actions/exec';
import { build } from './functions';
import { deploy, undeploy } from './deploy';

async function run() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const UPP_ACTION = process.env.UPP_ACTION;

  if (!GITHUB_TOKEN) {
    throw new Error('Github token missing in action');
  }

  const octoKit = github.getOctokit(GITHUB_TOKEN);
  const context = github.context;
  const eventName = context.eventName;

  let branch;

  if (eventName === 'push') {
    console.log(`Push event. Payload: ${JSON.stringify(context.payload)}`);
    branch = context.payload.push.head.ref;
  } else if (eventName === 'pull_request') {
    console.log(`PR event. Payload: ${JSON.stringify(context.payload)}`);
    branch = context.payload.pull_request.head.ref;
  }

  console.log(`Starting Hosting service deployment of PR branch ${branch}.`);

  //run sh to get CLI and prep
  await exec.exec('sh', ['./.github/hs-deploy-action/upp-cli-setup.sh']);

  if (UPP_ACTION === 'deploy') {
    await build();
    await deploy(github, octoKit);
    console.log('--> Hosting service deployment done');
  } else if (UPP_ACTION === 'undeploy') {
    await undeploy(branch);
  }
}

run();
