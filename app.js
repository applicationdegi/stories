function saveLog(action, story = "", details = "") {
  let logs = JSON.parse(localStorage.getItem("activityLogs")) || [];

  logs.push({
    action,
    story,
    details,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("activityLogs", JSON.stringify(logs));
}

// Open story
function openStory(storyName) {
  localStorage.setItem("currentStory", storyName);
  saveLog("Story Opened", storyName);
  window.location.href = "story.html";
}

// Load story page
if (window.location.pathname.includes("story.html")) {
  const story = localStorage.getItem("currentStory");
  document.getElementById("storyTitle").innerText = story;

  saveLog("Story Page Viewed", story);

  // Scroll tracking
  let maxScroll = 0;
  window.addEventListener("scroll", () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      saveLog("Scroll", story, scrollPercent + "%");
    }
  });
}

// Next page button
function nextStory() {
  const story = localStorage.getItem("currentStory");
  saveLog("Next Button Clicked", story);
  alert("Next story loading...");
}
