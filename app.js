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
    }

    // Update storage data
    updateStorage(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Mark story as completely read
    markStoryComplete(storyId, storyTitle) {
        const data = this.getStorageData();
        if (!data.completedStories.includes(storyId)) {
            data.completedStories.push(storyId);
        }
        
        // Log activity
        data.userActivity.push({
            action: 'story_completed',
            storyId: storyId,
            storyTitle: storyTitle,
            timestamp: new Date().toISOString()
        });

        data.lastVisit = new Date().toISOString();
        this.updateStorage(data);
    }

    // Track reading progress
    updateReadingProgress(storyId, scrollPercentage) {
        const data = this.getStorageData();
        data.readingProgress[storyId] = {
            percentage: scrollPercentage,
            lastUpdated: new Date().toISOString()
        };

        // Log activity
        data.userActivity.push({
            action: 'reading_progress',
            storyId: storyId,
            scrollPercentage: scrollPercentage,
            timestamp: new Date().toISOString()
        });

        this.updateStorage(data);
    }

    // Update total time spent
    updateTimeSpent(seconds) {
        const data = this.getStorageData();
        data.totalTimeSpent += seconds;
        this.updateStorage(data);
    }

    // Get completed stories
    getCompletedStories() {
        return this.getStorageData().completedStories;
    }

    // Get user activity log
    getUserActivity() {
        return this.getStorageData().userActivity;
    }

    // Get reading progress for specific story
    getProgressForStory(storyId) {
        const data = this.getStorageData();
        return data.readingProgress[storyId] || null;
    }

    // Export user activity data
    exportActivityData() {
        const data = this.getStorageData();
        return JSON.stringify(data, null, 2);
    }

    // Clear all data
    clearAllData() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
    }

    // Get statistics
    getStatistics() {
        const data = this.getStorageData();
        return {
            totalStoriesCompleted: data.completedStories.length,
            totalTimeSpent: data.totalTimeSpent,
            totalActivities: data.userActivity.length,
            lastVisit: data.lastVisit,
            completedStories: data.completedStories
        };
    }
}

// Initialize the app
const storiesApp = new StoriesApp();

// Track time spent on page
let sessionStartTime = Date.now();
window.addEventListener('beforeunload', () => {
    const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
    storiesApp.updateTimeSpent(timeSpent);
});

// Export for use in HTML
window.StoriesApp = storiesApp;