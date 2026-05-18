# LiveSched
A live schedule I made for Lively wallpaper, with a built in verse of the day!

<img width="1919" height="1039" alt="image" src="https://github.com/user-attachments/assets/23707e7c-b2f0-421a-8069-e60186b2dba9" />


# GUIDE
I made this wallpaper to keep up with my deadlines in school without having to open the school portal.

This folder is what you need for the live wallpaper part. The deadlines part needs a little extra setup with Google Calendar and Google Apps Script.



# WHAT'S IN THE FOLDER
index.html      — the main page (clock, schedule grid, deadlines panel)
script.js       — all the logic (schedule, clock, bible verse, deadlines)
styles.css      — how everything looks
Script for Calendar.txt — paste this into Google Apps Script (not into script.js)

You might also want a background image named background.jpg in the same folder (styles.css looks for it). Use whatever image you want for your wallpaper.

Optional apps for running it as a wallpaper:
- Wallpaper Engine (Steam), or
- Lively Wallpaper (free)



# PART 1 - GET YOUR SCHOOL CALENDAR INTO GOOGLE CALENDAR
First you need to get a certain calendar link from your school portal's calendar.

Not sure how to get it in your school portal, but for Blackboard, there is a gear icon at the top of the Calendar tab. Then within that, there is a (...) that you can click. You will find a Share Calendar option. Click it, then you can get a link. Copy it.

(If your school doesn't use Blackboard, look for something like "Subscribe", "Export", "ICS link", or "Calendar feed" in your portal's calendar settings, same idea.)

Then you go to Google Calendar.

1. On the left, find "Other calendars" and click the + next to it.
2. Choose "From URL".
3. Paste your copied URL.
4. Name it whatever you want and add it.

Give it a minute to sync. You should see your school events showing up in Google Calendar.


# PART 2 - GET YOUR GOOGLE CALENDAR ID (for Apps Script)
1. In Google Calendar, find the calendar you just added (or any calendar you want deadlines from).
2. Click the three dots next to it for the Settings.
3. Scroll down to "Integrate calendar".
4. You will find something that looks like this:

   randomchars123243324@import.calendar.google.com

   Copy that whole thing. That is your Calendar ID.


# PART 3 — GOOGLE APPS SCRIPT (the backend for deadlines)
This is what pulls your deadline events and gives your wallpaper a link it can read. Do this once.

1. Go to https://script.google.com
2. Click "New project" and name it whatever you want.
3. Open the file "Script for Calendar.txt" from this folder.
4. Copy ALL of its contents.
5. Paste into the Apps Script editor (replace whatever default code is there).

Now edit this line in that pasted code:

   const calId = "YOUR_CALENDAR_HERE";

Replace YOUR_CALENDAR_HERE with the Calendar ID you copied earlier. Keep it inside the quotation marks, ok?

6. Save the project.

Deploy it as a web app:

1. Click Deploy -> New deployment.
2. Click the gear/select type and choose "Web app".
3. Description: whatever you want.
4. Execute as: Me
5. Who has access: Anyone (your wallpaper needs to fetch it; the calendar ID is the sensitive part, don't share your deployment URL publicly)
6. Click Deploy.
7. Authorize when Google asks (normal for first time).
8. Copy the Web app URL. It will look like:

   https://script.google.com/macros/s/...../exec

Just don't give your link to anyone else. Anyone with that URL can read whatever events that calendar exposes through this script.

# PART 4 — CONNECT THE WEB APP URL TO script.js
1. Open script.js in Notepad, VS Code, or any text editor.
2. Find section 5, labelled:

   5. DEADLINES SYSTEM (With Offline Cache & Interaction)

3. Near the top of that section you'll see:

   const APU_URL = "your_script_goes_here"; //put the script url here

4. Replace your_script_goes_here with your Web app URL you got from Part 3. Keep it inside the quotation marks.
5. Press Ctrl+S to save.


# PART 5 - SET UP YOUR CLASS SCHEDULE (the grid)
Still in script.js, go to the very top of the schedule data (section 1 area). You will find something called:

   const schedule = { ... }

The schedule works by a numbered grid:

   "row-col": value

Examples:
   "0-0" means Row 0, Column 0
   "7-2" means Row 7, Column 2

The grid is 13 rows × 8 columns (see script.js: rows = 13, cols = 8).

Column guide (already set up in the template):
   Col 0 = time labels
   Col 1 = MON
   Col 2 = TUE
   Col 3 = WED
   Col 4 = THU
   Col 5 = FRI
   Col 6 = SAT
   Col 7 = SUN

Row 0 = day headers. Rows 1–12 = time slots (see the "Time Column" entries like "7:00 - 8:00", etc.).

For a class block, use an array with 4 parts:

   "row-col": ["SUBJECT NAME", "ROOM", "SECTION OR LABEL", "hasmeet or nomeet"]

   hasmeet  = class has a meeting (online/hybrid indicator — green styling)
   nomeet   = no meeting (different color)

Example (placeholder in the template):

   "5-2": ["EVENT", "Place", "Urgent", "hasmeet"],

Change EVENT, Place, and Urgent to your real subject, room, and whatever third label you want. Delete entries you don't need. Add new "row-col" keys for your actual timetable.

String entries (no array) are for headers only — like "MON" or "7:00 - 8:00".

The wallpaper highlights whichever class block matches the current day and time slot automatically.



# PART 6 - RUN IT AS A WALLPAPER
You need something like Wallpaper Engine or Lively Wallpaper.

Wallpaper Engine (paid, Steam):
1. Install Wallpaper Engine.
2. Open it → Create Wallpaper -> Web wallpaper (or import HTML).
3. Point it at this folder's index.html (all files index.html, script.js, styles.css — and background.jpg if you use one — should stay together in the same folder).
(NOTE: this part was made by ai. i actually don't know how wallpaper engine works. I never used it, but I've heard its similar to lively.)

Lively Wallpaper (free):
1. Install Lively Wallpaper.
2. Add wallpaper -> HTML / open local file.
3. Select index.html from this folder (keep the whole folder together).

Open index.html in a browser first if you want to test before setting it as wallpaper. You should see the clock, schedule, bible verse area, and deadlines panel.


# HOW THE DEADLINES PANEL BEHAVES (good to know)

- It fetches from your Apps Script URL (the one you pasted in APU_URL).
- It caches deadlines locally so if the fetch fails, you might still see old data.
- Click "UPCOMING DEADLINES" at the top to force a full refresh (clears cache and silenced items).
- Click a deadline item to silence it (greyed out) — click again to un-silence.
- New items show in brighter green.
- Due within 24 hours shows as urgent (red).
- Past due items fade out.
- Refreshes automatically about every 30 minutes when the cache is old.

Note: The updates to the deadlines are not really in real time. The script in google fetches every 30 minutes. So you should still be check your school portal if there are sudden deadlines like quizes and stuff. 


