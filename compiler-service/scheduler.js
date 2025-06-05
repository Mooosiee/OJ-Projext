//This file  contains the cleanupDirectory function and a function to initialize the cron schedule.

import cron from "node-cron";
import fs from "fs/promises"; // Using promise-based filesystem oprations for async/await
import path from "path";
import { fileURLToPath } from "url"; // For __dirname equivalent in ES Modules

// --- Setup __dirname (if not already set up in this file) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // This will be the directory of the current file

// --- Define Paths to Your Temporary Directories ---

// Example: If scheduler.js is in D:\...\compiler-service\scheduler.js
// then CODES_DIR will be D:\...\compiler-service\codes
//correctly creates the absolute path to compiler-service/codes/
const CODES_DIR = path.join(__dirname, "codes"); //D:\GITDEMO\OJ\OJ-Projext\compiler-service\codes
const INPUTS_DIR = path.join(__dirname, "inputs");
const OUTPUTS_DIR = path.join(__dirname, "outputs");

// Logging these paths when the module loads, just to verify them once
console.log("[Scheduler] CODES_DIR resolved to:", CODES_DIR);
console.log("[Scheduler] INPUTS_DIR resolved to:", INPUTS_DIR);
console.log("[Scheduler] OUTPUTS_DIR resolved to:", OUTPUTS_DIR);

// --- Configuration for Cleanup ---
// How old files must be before they are deleted.
// 1 * 60 * 1000 ms = 1 minute. (Good for quick testing)
// 60 * 60 * 1000 ms = 1 hour.
// 24 * 60 * 60 * 1000 ms = 24 hours.
//This means: "Delete any file that was last modified more than 1 minute ago."
const MAX_FILE_AGE_MS = 1 * 60 * 1000; // For testing: delete files older than 1 minute
// const MAX_FILE_AGE_MS = 24 * 60 * 60 * 1000; // For production: delete files older than 24 hours

// --- Cleanup Function ---
/*
This is the main cleanup function. It goes through every file in a given folder 
and deletes files that are too old. 
/**
 * Deletes files older than MAX_FILE_AGE_MS in a given directory.
 * @param {string} directoryPath - Absolute path to the directory.
 * @param {string} directoryName - Descriptive Name for logs.
 * A descriptive name for logs is just a nickname like "Inputs"
 * that you include in logs to make debugging and monitoring easier.
 */
async function cleanupDirectory(directoryPath, directoryName) {
  console.log(
    `[Cron Cleanup - ${directoryName}] Attempting to access directory: ${directoryPath}`
  );
  //This checks if the folder exists. If it doesn't, it logs a warning and skips trying to clean it.
  try {
    // 1. Check if the directory exists and we can access it.
    // `fs.access` will throw an error if the path doesn't exist or permissions are denied.
    await fs.access(directoryPath);
    console.log(
      `[Cron Cleanup - ${directoryName}] Directory accessed. Starting cleanup for: ${directoryPath}`
    );
  } catch (err) {
    // If the directory doesn't exist or isn't accessible, log it and stop for this directory.
    console.warn(
      `[Cron Cleanup - ${directoryName}] Directory not accessible or does not exist, skipping: ${directoryPath} (Error: ${err.message})`
    );
    return; // Exit this function for this directory
  }
  try {
    //We read all files in the directory and prepare to loop through them.
    const entries = await fs.readdir(directoryPath); // get list of files
    let deletedCount = 0;
    //We loop over each file and get its metadata (like last modified time).
    for (const file of entries) {
      const fullPath = path.join(directoryPath, file); // complete path of file
      try {
        //If the file is older than the allowed age, it is deleted, and we log it.
        const stat = await fs.stat(fullPath); // get file info
        if (stat.isFile()) {
          //ensure it's a file, not a folder
          const age = Date.now() - stat.mtimeMs; // how old is the file?
          if (age > MAX_FILE_AGE_MS) {
            await fs.unlink(fullPath); // delete the file
            deletedCount++;
            console.log(`[${directoryName}] Deleted: ${fullPath}`);
          }
        }
      } catch (err) {
        //Errors with individual files are logged.
        console.error(
          `[${directoryName}] Error with file ${fullPath}:`,
          err.message
        );
      } //At the end, we log how many files were cleaned up in total.
    }
    console.log(
      `[${directoryName}] Cleanup complete. Deleted ${deletedCount} files.`
    );
  } catch (err) {
    //If reading the directory itself fails (e.g., permission issues), we log the error.
    console.error(`[${directoryName}] Failed to read directory:`, err.message);
  }
}
/**
 * Starts the scheduled cleanup using node-cron.
 */
//This is the main function that sets up the scheduled cleanup job.
export function startScheduledCleanup() {
  //This is the cron expression. You can change how often the cleanup runs.
  //const cronSchedule = "*/1 * * * *"; // Every 1 minute for testing
   const cronSchedule = '0 3 * * *'; // Every day at 3 AM (for production)
  //Validates the cron pattern to avoid scheduling mistakes.
  if (!cron.validate(cronSchedule)) {
    console.error(`[Node-Cron] Invalid cron pattern: ${cronSchedule}`);
    return;
  }
  console.log(`[Node-Cron] Scheduling cleanup every minute...`);
  /*This sets the job to run every minute (or at the time you set).
It:
Logs the start time
Cleans up all 3 directories
Logs the end time */
  cron.schedule(cronSchedule, async () => {
    console.log(
      `[Node-Cron] Cleanup started at ${new Date().toLocaleTimeString()}`
    );
    await cleanupDirectory(CODES_DIR, "Codes");
    await cleanupDirectory(INPUTS_DIR, "Inputs");
    await cleanupDirectory(OUTPUTS_DIR, "Outputs");
    console.log(
      `[Node-Cron] Cleanup finished at ${new Date().toLocaleTimeString()}`
    );
  });
    console.log(`[Node-Cron] Cleanup job scheduled.`);
}
