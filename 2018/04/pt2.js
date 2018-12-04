const fs = require('fs');
const path = require('path');

const fileContents = fs.readFileSync(path.join(__dirname, './input.txt')).toString('utf8');
const arr = fileContents.split(/\n/);

const timeRegex = /^\[([\d]{4})-([\d]{2})-([\d]{2}) ([\d]{2}):([\d]{2})\]/;

// sort the input by timestamp
arr.sort((a, b) => {
  const [, yearA, monthA, dayA, hourA, minuteA] = timeRegex.exec(a).map(Number);
  const [, yearB, monthB, dayB, hourB, minuteB] = timeRegex.exec(b).map(Number);

  if (yearA > yearB) return 1;
  if (yearA < yearB) return -1;
  if (monthA > monthB) return 1;
  if (monthA < monthB) return -1;
  if (dayA > dayB) return 1;
  if (dayA < dayB) return -1;
  if (hourA > hourB) return 1;
  if (hourA < hourB) return -1;
  if (minuteA > minuteB) return 1;
  if (minuteA < minuteB) return -1;
  return 0;
});

// accumulate sleepiest guard
const guardSleeps = {};
const startShiftRegex = /Guard #([\d]+) begins shift$/;
const fallAsleepRegex = /00:([\d]{2})\] falls asleep$/;
const wakeUpRegex = /00:([\d]{2})\] wakes up$/;

let currentGuard;
let currentNap = [];

function writeGuardSleep() {
  guardSleeps[currentGuard] = guardSleeps[currentGuard] || [];
  guardSleeps[currentGuard].push(currentNap);
  currentNap = [];
}

arr.forEach(entry => {
  const startShiftResult = startShiftRegex.exec(entry);
  if (startShiftResult) {
    const [, id] = startShiftResult.map(Number);

    // edge case: sleeps through the end of the shift?
    // not sure if it's possible, we're gonna handle for it.
    if (currentNap.length !== 0) {
      currentNap = [currentNap[0], 60];
      writeGuardSleep();
    }

    currentGuard = id;
    return;
  }

  const fallAsleepResult = fallAsleepRegex.exec(entry);
  if (fallAsleepResult) {
    const [, min] = fallAsleepResult.map(Number);
    currentNap[0] = min;
  }

  const wakeUpResult = wakeUpRegex.exec(entry);
  if (wakeUpResult) {
    const [, min] = wakeUpResult.map(Number);
    currentNap[1] = min;
    writeGuardSleep();
  }
});

const sleepPeakFrequencyCache = new Map();
function getGuardSleepPeakFrequency(guardId) {
  if (sleepPeakFrequencyCache.has(guardId)) return sleepPeakFrequencyCache.get(guardId);
  if (!guardSleeps[guardId]) return [-1, -1];
  const sleepByMinute = guardSleeps[guardId].reduce((map, nap) => {
    for (let i = nap[0]; i < nap[1]; i++) {
      map[i] = map[i] || 0;
      map[i]++;
    }
    return map;
  }, {});
  const sleepiestMinute = Object.keys(sleepByMinute)
    .sort((minuteA, minuteB) => sleepByMinute[minuteB] - sleepByMinute[minuteA])[0];
  const amountOfSleepInMinute = sleepByMinute[sleepiestMinute];
  const result = [sleepiestMinute, amountOfSleepInMinute];
  sleepPeakFrequencyCache.set(guardId, result);
  return result;
}

const mostConsistentGuard = Object.keys(guardSleeps).reduce((result, key) => {
  if (getGuardSleepPeakFrequency(key)[1] > getGuardSleepPeakFrequency(result)[1]) return key;
  return result;
}, null);

const [sleepiestMinute] = getGuardSleepPeakFrequency(mostConsistentGuard);

console.log(sleepiestMinute * mostConsistentGuard);
