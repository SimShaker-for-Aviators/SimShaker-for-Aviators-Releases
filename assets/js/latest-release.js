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
  
  async function updateReleaseInfo(releaseType, releaseInfoDiv, downloadButton) {
    try {
      const latestRelease = await getLatestRelease(owner, repo, releaseType);
      const releaseNotesHtml = marked.parse(latestRelease.body);
      const releaseNotesDiv = `
        <details>
          <summary>Show release notes</summary>
          ${releaseNotesHtml}
        </details>
      `;
      releaseInfoDiv.innerHTML = `
        <p>Latest ${releaseType} release</p>
        <p>${releaseNotesDiv}</p>
      `;
      downloadButton.href = latestRelease.assets[0].browser_download_url;
      downloadButton.disabled = false;
      downloadButton.innerHTML = `Download ${repo}-${latestRelease.tag_name}.zip (${releaseType})`;
      downloadButton.onclick = function () {
        window.location.href = latestRelease.assets[0].browser_download_url;
      };
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
  