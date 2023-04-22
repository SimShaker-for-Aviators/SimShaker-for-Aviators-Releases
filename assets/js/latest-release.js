// latest-release.js

async function getLatestRelease(owner, repo, tagNamePrefix) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
    const data = await response.json();
  
    const betaReleases = data.filter(release => release.tag_name.startsWith(tagNamePrefix));
    if (betaReleases.length > 0) {
      return betaReleases[0];
    }
  
    throw new Error(`No ${tagNamePrefix} releases found for ${owner}/${repo}`);
  }


  function generateReleaseNotesContent(release) {
  const releaseNotesHtml = marked.parse(release.body);
  const releaseNotesDiv = `
    <details>
      <summary>Show release notes</summary>
      ${releaseNotesHtml}
      <hr>
    </details>
  `;
  return `
    <p>${releaseNotesDiv}</p>
  `;
}
  
async function updateReleaseInfo(releaseType, releaseInfoDiv, downloadButton) {
  try {
    const latestRelease = await getLatestRelease(owner, repo, releaseType);
    const releaseNotesContent = generateReleaseNotesContent(latestRelease);

    releaseInfoDiv.innerHTML = releaseNotesContent;
    downloadButton.href = latestRelease.assets[0].browser_download_url;
    downloadButton.innerHTML = `Download ${latestRelease.tag_name}`;

  } catch (error) {
    releaseInfoDiv.innerHTML = error.message;
  }
}

const owner = "SimShaker-for-Aviators";
const repo = "SimShaker-for-Aviators-Releases";

const stableReleaseInfoDiv = document.getElementById("stable-release-info");
const stableDownloadButton = document.getElementById("stable-download-button");
updateReleaseInfo("stable", stableReleaseInfoDiv, stableDownloadButton);

const betaReleaseInfoDiv = document.getElementById("beta-release-info");
const betaDownloadButton = document.getElementById("beta-download-button");
updateReleaseInfo("beta", betaReleaseInfoDiv, betaDownloadButton);
  