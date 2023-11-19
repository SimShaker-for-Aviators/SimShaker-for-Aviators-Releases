// latest-release.js

async function getLatestRelease(owner, repo, tagNamePrefix) {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
    const data = await response.json();

    // Sort the releases by created_at
    data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  
    const betaReleases = data.filter(release => release.tag_name.startsWith(tagNamePrefix));
    if (betaReleases.length > 0) {
      return betaReleases[0];
    }
  
    throw new Error(`No ${tagNamePrefix} releases found for ${owner}/${repo}`);
  }


  function generateReleaseNotesContent(release) {
  const releaseNotesHtml = marked.parse(release.body);
  return releaseNotesHtml
}
  
async function updateReleaseInfo(releaseType, releaseInfoDiv, downloadButton) {
  try {
    const latestRelease = await getLatestRelease(owner, repo, releaseType);
    const releaseNotesContent = generateReleaseNotesContent(latestRelease);

    releaseInfoDiv.innerHTML = ` 
      <a href="#" id="modal-link-${releaseType}" class="download-area">(Show release notes)</a >
      <div id="myModal-${releaseType}" class="modal">
        <!-- Modal content -->
        <div class="my-modal-content">
          <div class="my-modal-header">
            <span class="close-modal" id="span-${releaseType}">&times;</span>
            <h2>Release notes</h2>
          </div>
          <div class="my-modal-body">
            ${releaseNotesContent}
          </div>
          <div class="my-modal-footer">
            <h3></h3>
          </div>
        </div>
      </div>`

    configureModal(releaseInfoDiv, releaseType)

    downloadButton.href = latestRelease.assets[0].browser_download_url;
    downloadButton.disabled = false;
    downloadButton.innerHTML = `Download SimShaker for Aviators ${latestRelease.tag_name}`;
    downloadButton.onclick = function () {
      window.location.href = latestRelease.assets[0].browser_download_url;
    };
  } catch (error) {
    releaseInfoDiv.innerHTML = error.message;
  }
}


function configureModal(modaldiv, tag) {
  // Get the modal

  var modal = document.getElementById("myModal-" + tag);

  // Get the button that opens the modal
  var btn = document.getElementById("modal-link-" + tag);

  // Get the <span> element that closes the modal
  var span = document.getElementById("span-" + tag);

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
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
