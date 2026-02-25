// Stories Reader Application
// Local Storage Management for User Activity

class StoriesApp {
    constructor() {
        this.storageKey = 'storiesReaderData';
        this.initializeStorage();
    }

    // Initialize local storage
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({
                completedStories: [],
                readingProgress: {},
                totalTimeSpent: 0,
                lastVisit: new Date().toISOString(),
                userActivity: []
            }));
        }
    }

    // Get all stored data
    getStorageData() {
        return JSON.parse(localStorage.getItem(this.storageKey));
function login() {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Email required");
    return;
  }

  const user = {
    email: email,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "stories.html";
}

// Track topic click
function trackStory(topic) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  let activity = JSON.parse(localStorage.getItem("activity")) || [];

  activity.push({
    email: user.email,
    topic: topic,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("activity", JSON.stringify(activity));
  alert("Activity recorded");
}
