#!/usr/bin/env node

/**
 * README Timeline Update Script
 * Generates a summary of changes and updates the README.md timeline
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const README_PATH = './README.md';
const DAYS_BACK = 1;

// Helper function to execute git commands
function gitCommand(command) {
    try {
        return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    } catch (error) {
        return '';
    }
}

// Helper function to prompt user
function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

// Format today's date
function getTodayFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

// Get date for git log (yesterday)
function getSinceDate() {
    const date = new Date();
    date.setDate(date.getDate() - DAYS_BACK);
    return date.toISOString().split('T')[0];
}

// Main function
async function main() {
    console.log('\n========================================');
    console.log('   README Timeline Update Script');
    console.log('========================================\n');

    const today = getTodayFormatted();
    const sinceDate = getSinceDate();

    console.log(`Analyzing changes since ${sinceDate} for timeline entry: ${today}\n`);

    // Get commits
    const commits = gitCommand(`git log --since="${sinceDate}" --oneline`);
    if (!commits) {
        console.log('❌ No commits found since', sinceDate);
        console.log('Nothing to update. Exiting...');
        process.exit(0);
    }

    const commitLines = commits.split('\n');
    console.log(`✓ Found ${commitLines.length} commit(s):\n`);
    commitLines.forEach(line => console.log(`  ${line}`));

    // Get all modified files
    const allFiles = gitCommand(`git log --since="${sinceDate}" --name-only --pretty=format:`);
    const uniqueFiles = [...new Set(allFiles.split('\n').filter(f => f.trim()))];

    console.log('\nAnalyzing file changes...');

    // Get first commit hash
    const firstCommitHash = gitCommand(`git log --since="${sinceDate}" --format="%H" --reverse`).split('\n')[0];
    const baseCommit = firstCommitHash ? `${firstCommitHash}^` : 'HEAD^';

    // Analyze file changes
    const fileAnalysis = {};
    for (const file of uniqueFiles) {
        if (/\.(tsx?|jsx?|css|md)$/.test(file)) {
            const diff = gitCommand(`git diff ${baseCommit} HEAD -- "${file}"`);
            if (diff) {
                const additions = (diff.match(/^\+(?!\+)/gm) || []).length;
                const deletions = (diff.match(/^\-(?!\-)/gm) || []).length;
                fileAnalysis[file] = { additions, deletions, diff };
            }
        }
    }

    // Generate summary points
    const summaryPoints = [];

    for (const [file, analysis] of Object.entries(fileAnalysis)) {
        const fileName = path.basename(file);
        const { diff, additions, deletions } = analysis;

        // UploadsList component
        if (file.includes('UploadsList')) {
            if (diff.includes('hover')) {
                summaryPoints.push('Simplified uploads list UI by removing hover-based interactions');
            }
            if (/status|format|layout/.test(diff)) {
                summaryPoints.push('Reorganized uploads list layout (status, file info, and format selection)');
            }
        }

        // DropDown component
        if (file.includes('DropDown')) {
            if (/setOpen\(false\)|close|onClick/.test(diff)) {
                summaryPoints.push('Enhanced dropdown component to auto-close after format selection');
            }
        }

        // Dropzone component
        if (file.includes('Dropzone')) {
            if (/maxFiles.*10|multiple.*true/.test(diff)) {
                summaryPoints.push('Updated Dropzone to support multiple file uploads (up to 10 files)');
            }
            if (/status.*completed|downloadUrl/.test(diff)) {
                summaryPoints.push("Set default upload status to 'completed' with placeholder download URLs");
            }
        }

        // Header component
        if (file.includes('Header')) {
            if (/RWD|responsive|mobile|screen/.test(diff)) {
                summaryPoints.push('Fixed responsive design issues in Header component');
            }
        }

        // Other significant changes
        if (/\.(tsx?|jsx?)$/.test(file) && !/(UploadsList|DropDown|Dropzone|Header)/.test(file)) {
            if (additions > 20 || deletions > 20) {
                summaryPoints.push(`Refactored ${fileName} with significant changes (+${additions}/-${deletions} lines)`);
            }
        }
    }

    // Analyze README changes
    if (fileAnalysis['README.md']) {
        const readmeDiff = fileAnalysis['README.md'].diff;
        const completedTasks = (readmeDiff.match(/^\+- \[x\]/gm) || []).length;
        const addedTasks = (readmeDiff.match(/^\+- \[ \]/gm) || []).length;

        if (completedTasks > 0) {
            summaryPoints.push(`Marked ${completedTasks} task(s) as completed in README To-Do section`);
            
            // Check for specific task types
            if (/Choose format|hover|button/.test(readmeDiff)) {
                summaryPoints.push("  - Improved 'Choose format' button functionality");
            }
            if (/status|upload|list/.test(readmeDiff)) {
                summaryPoints.push('  - Tidied uploads list items and status displays');
            }
            if (/title|text|header/.test(readmeDiff)) {
                summaryPoints.push('  - Updated UI text and labels');
            }
        }
        if (addedTasks > 0) {
            summaryPoints.push(`Added ${addedTasks} new task(s) to README To-Do section`);
        }
    }

    // Remove duplicates
    const uniquePoints = [...new Set(summaryPoints)];

    // Build final summary
    let summary = `\n${today}\n`;
    if (uniquePoints.length > 0) {
        summary += '  ' + uniquePoints.join('. ') + '.';
    } else {
        summary += '  Various improvements and bug fixes based on recent commits.';
    }

    // Add overall stats
    const totalFiles = Object.keys(fileAnalysis).length;
    const totalAdditions = Object.values(fileAnalysis).reduce((sum, f) => sum + f.additions, 0);
    const totalDeletions = Object.values(fileAnalysis).reduce((sum, f) => sum + f.deletions, 0);

    summary += ` Modified ${totalFiles} file(s) with ${totalAdditions} addition(s) and ${totalDeletions} deletion(s).`;

    console.log('\n========================================');
    console.log('Generated Timeline Entry:');
    console.log('========================================');
    console.log(summary);
    console.log('\n========================================\n');

    // Ask for confirmation
    const response = await prompt('Do you want to update the README.md timeline? (Y/N): ');
    
    if (response.toLowerCase() !== 'y') {
        console.log('\nUpdate cancelled.');
        process.exit(0);
    }

    // Read current README
    const readmeContent = fs.readFileSync(README_PATH, 'utf8');

    // Find the Time Line section
    const timelineMatch = readmeContent.match(/(Time Line:\s*\n)([\s\S]*?)(\n\n####|\n*$)/);
    
    if (!timelineMatch) {
        console.log('\n❌ Error: Could not find "Time Line:" section in README.md');
        console.log('Make sure your README.md has a "Time Line:" section.');
        process.exit(1);
    }

    const beforeTimeline = timelineMatch[1];
    let timelineSection = timelineMatch[2];
    const afterTimeline = timelineMatch[3];

    // Check if entry for today already exists
    if (timelineSection.includes(today)) {
        console.log(`\n⚠️  Warning: An entry for ${today} already exists!`);
        const overwrite = await prompt('Do you want to replace it? (Y/N): ');
        
        if (overwrite.toLowerCase() !== 'y') {
            console.log('\nUpdate cancelled.');
            process.exit(0);
        }

        // Remove existing entry for today
        const todayRegex = new RegExp(`${today.replace(/\//g, '\\/')}[\\s\\S]*?(?=\\n\\n\\d{2}\\/\\d{2}\\/\\d{2}|$)`, 'g');
        timelineSection = timelineSection.replace(todayRegex, '').trim();
    }

    // Add new entry
    const newTimeline = timelineSection.trim() + '\n' + summary.trim();
    const updatedReadme = readmeContent.replace(
        beforeTimeline + timelineMatch[2],
        beforeTimeline + newTimeline
    );

    // Write back to file
    fs.writeFileSync(README_PATH, updatedReadme, 'utf8');

    console.log('\n✓ README.md timeline updated successfully!');
    console.log('\nNext steps:');
    console.log('  git add README.md');
    console.log(`  git commit -m "Updated timeline for ${today}"`);
    console.log('  git push');
}

// Run the script
main().catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
});
