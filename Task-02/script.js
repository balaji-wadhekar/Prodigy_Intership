// DOM Elements
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');

// Stopwatch Variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let lapCounter = 1;

/**
 * Format time in milliseconds to HH:MM:SS.ms format
 * Dynamically pads single digits with leading zeros
 */
function formatTime(time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10); // Display 2 digits for ms

    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    const paddedMilliseconds = String(milliseconds).padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}.${paddedMilliseconds}`;
}

/**
 * Update the digital display with formatted elapsed time
 */
function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

/**
 * Start Timer Action
 */
function startTimer() {
    // Prevent multiple intervals running simultaneously
    if (timerInterval) return; 

    // Calculate start time based on already elapsed time
    startTime = Date.now() - elapsedTime;
    
    // Accurate time tracking with setInterval
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10); // Update every 10ms for smooth ms display

    // Manage button states
    startBtn.disabled = true;
    startBtn.textContent = 'Start'; // In case it was 'Resume'
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
}

/**
 * Pause / Stop Timer Action
 */
function pauseTimer() {
    if (!timerInterval) return;

    // Clear interval to stop execution without clearing elapsed time
    clearInterval(timerInterval);
    timerInterval = null;

    // Manage button states
    startBtn.disabled = false;
    startBtn.textContent = 'Resume';
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
}

/**
 * Reset Timer Action
 */
function resetTimer() {
    // Stop the timer
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Reset all variables
    elapsedTime = 0;
    lapCounter = 1;

    // Update UI
    updateDisplay();
    lapsList.innerHTML = ''; // Clear lap list from DOM

    // Manage button states
    startBtn.disabled = false;
    startBtn.textContent = 'Start';
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
}

/**
 * Lap Action
 */
function recordLap() {
    // Create new list item for the lap
    const lapItem = document.createElement('li');
    lapItem.classList.add('lap-item');

    // Create Lap Number Span
    const lapNumSpan = document.createElement('span');
    lapNumSpan.classList.add('lap-number');
    lapNumSpan.textContent = `Lap ${String(lapCounter).padStart(2, '0')}`;

    // Create Lap Time Span
    const lapTimeSpan = document.createElement('span');
    lapTimeSpan.classList.add('lap-time');
    lapTimeSpan.textContent = formatTime(elapsedTime);

    // Append to list item
    lapItem.appendChild(lapNumSpan);
    lapItem.appendChild(lapTimeSpan);

    // Prepend to the list container (newest laps on top)
    lapsList.prepend(lapItem);
    
    // Increment lap counter
    lapCounter++;
}

// Event Listeners for Control Panel
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);

// Initialize display on load
updateDisplay();
