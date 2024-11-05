import * as core from '@actions/core';
import { getOctokit, context } from '@actions/github';
import * as fs from 'fs';

async function run() {
  try {
    // Get authenticated GitHub client (Octokit)
    const github = getOctokit(process.env.GITHUB_TOKEN as string);

    // Get owner and repo from context of payload that triggered the action
    const { owner: currentOwner, repo: currentRepo } = context.repo;

    // Get the inputs from the workflow file
    const tagName = core.getInput('tag_name', { required: true });
    const tag = tagName.replace('refs/tags/', '');

    const releaseName = core.getInput('release_name', { required: false }).replace('refs/tags/', '');
    const body = core.getInput('body', { required: false });
    const draft = core.getInput('draft', { required: false }) === 'true';
    const prerelease = core.getInput('prerelease', { required: false }) === 'true';
    const commitish = core.getInput('commitish', { required: false }) || context.sha;

    const bodyPath = core.getInput('body_path', { required: false });
    const owner = core.getInput('owner', { required: false }) || currentOwner;
    const repo = core.getInput('repo', { required: false }) || currentRepo;

    let bodyFileContent: string | null = null;
    if (bodyPath && bodyPath !== '') {
      try {
        bodyFileContent = fs.readFileSync(bodyPath, { encoding: 'utf8' });
      } catch (error) {
        core.setFailed((error as Error).message);
      }
    }

    // Create a release
    const createReleaseResponse = await github.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: releaseName,
      body: bodyFileContent || body,
      draft,
      prerelease,
      target_commitish: commitish
    });

    // Get the ID, html_url, and upload URL for the created Release from the response
    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl }
    } = createReleaseResponse;

    // Set the output variables for use by other actions
    core.setOutput('id', releaseId);
    core.setOutput('html_url', htmlUrl);
    core.setOutput('upload_url', uploadUrl);
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

run().then(r => console.log(r))
