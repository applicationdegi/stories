/*********************************
 * DEVICE IDENTIFICATION
 *********************************/
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

/*********************************
 * ACTIVITY LOGGING
 *********************************/
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

/*********************************
 * STORY NAVIGATION
 *********************************/
function openStory(storyName) {
  localStorage.setItem("currentStory", storyName);
  saveLog("Story Opened", storyName);
  window.location.href = "story.html";
}

function nextStory() {
  const story = localStorage.getItem("currentStory");
  saveLog("Next Button Clicked", story);
}

/*********************************
 * STORY PAGE TRACKING
 *********************************/
if (window.location.pathname.includes("story.html")) {
  const story = localStorage.getItem("currentStory");

  if (story && document.getElementById("storyTitle")) {
    document.getElementById("storyTitle").innerText = story;
    saveLog("Story Page Viewed", story);
  }

  let maxScroll = 0;

  window.addEventListener("scroll", () => {
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const percent = Math.round((window.scrollY / scrollHeight) * 100);
    if (percent > maxScroll) {
      maxScroll = percent;
      saveLog("Scroll", story, percent + "%");
    }
  });
}

/*********************************
 * TXT EXPORT
 *********************************/
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
      text += `Language : ${log.device.language}\n`;
      text += `Screen   : ${log.device.screenResolution}\n`;
      text += `Touch    : ${log.device.touchSupport}\n`;
    }

    text += "\n------------------------------\n\n";
  });

  return text;
}

function downloadLogsTxt() {
  const logs = JSON.parse(localStorage.getItem("activityLogs")) || [];
  if (!logs.length) return alert("No logs available");

  const blob = new Blob([generateLogsTxt(logs)], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "activity_logs.txt";
  a.click();
}

/*********************************
 * CSV EXPORT (FIXED & FLAT)
 *********************************/
function convertLogsToCSV(logs) {
  const headers = [
    "action",
    "story",
    "details",
    "time",
    "deviceId",
    "deviceType",
    "browser",
    "platform",
    "language",
    "screenResolution",
    "touchSupport"
  ];

  const rows = logs.map(log => [
    log.action,
    log.story,
    log.details,
    log.time,
    log.device?.deviceId,
    log.device?.deviceType,
    log.device?.browser,
    log.device?.platform,
    log.device?.language,
    log.device?.screenResolution,
    log.device?.touchSupport
  ].map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(","));

  return [headers.join(","), ...rows].join("\n");
}

function downloadCSVLogs() {
  const logs = JSON.parse(localStorage.getItem("activityLogs")) || [];
  if (!logs.length) return alert("No logs available");

  const blob = new Blob([convertLogsToCSV(logs)], {
    type: "text/csv;charset=utf-8;"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "site_logs.csv";
  a.click();
}

/*********************************
 * OPTIONAL: CLEAR LOGS
 *********************************/
function clearLogs() {
  localStorage.removeItem("activityLogs");
  alert("Logs cleared");
}
