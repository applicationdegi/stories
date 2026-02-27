/*******************************
 * DEVICE IDENTIFICATION
 *******************************/
function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

function getBrowserName(ua) {
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  return "Unknown";
}

function getDeviceType(ua) {
  if (/mobile/i.test(ua)) return "Mobile";
  if (/tablet/i.test(ua)) return "Tablet";
  return "Desktop";
}

function getDeviceDetails() {
  const ua = navigator.userAgent;

  return {
    deviceId: getDeviceId(),
    deviceType: getDeviceType(ua),
    browser: getBrowserName(ua),
    platform: navigator.platform || "Unknown",
    language: navigator.language,
    screenResolution: `${screen.width}x${screen.height}`,
    touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    userAgent: ua
  };
}

/*******************************
 * ACTIVITY LOGGING
 *******************************/
function saveLog(action, story = "", details = "") {
  const logs = JSON.parse(localStorage.getItem("activityLogs")) || [];

  logs.push({
    action,
    story,
    details,
    time: new Date().toLocaleString(),
    device: getDeviceDetails()
  });

  localStorage.setItem("activityLogs", JSON.stringify(logs));
}

/*******************************
 * OPEN STORY
 *******************************/
function openStory(storyName) {
  localStorage.setItem("currentStory", storyName);
  saveLog("Story Opened", storyName);
  window.location.href = "story.html";
}

/*******************************
 * STORY PAGE LOGIC
 *******************************/
if (window.location.pathname.includes("story.html")) {
  const story = localStorage.getItem("currentStory");

  if (story) {
    document.getElementById("storyTitle").innerText = story;
    saveLog("Story Page Viewed", story);
  }

  // Scroll tracking
  let maxScroll = 0;

  window.addEventListener("scroll", () => {
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      saveLog("Scroll", story, scrollPercent + "%");
    }
  });
}

/*******************************
 * NEXT STORY BUTTON
 *******************************/
function nextStory() {
  const story = localStorage.getItem("currentStory");
  saveLog("Next Button Clicked", story);
  // alert("Next story loading...");
}
function generateLogsTxt(logs) {
  let text = "===== ACTIVITY LOGS =====\n\n";

  logs.forEach((log, i) => {
    text += `#${i + 1}\n`;
    text += `Action   : ${log.action}\n`;
    text += `Story    : ${log.story || "-"}\n`;
    text += `Details  : ${log.details || "-"}\n`;
    text += `Time     : ${log.time}\n`;

    if (log.device) {
      text += `Device ID: ${log.device.deviceId}\n`;
      text += `Device   : ${log.device.deviceType}\n`;
      text += `Browser  : ${log.device.browser}\n`;
      text += `Platform : ${log.device.platform}\n`;
      text += `Screen   : ${log.device.screenResolution}\n`;
    }

    text += "\n--------------------------------\n\n";
  });

  return text;
}
function downloadLogsTxt(logs) {
  if (!logs.length) {
    alert("No logs available");
    return;
  }

  const content = generateLogsTxt(logs);
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "activity_logs.txt";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function exportLogs() {
  const logs = JSON.parse(localStorage.getItem("activityLogs")) || [];
  downloadLogsTxt(logs);
}
