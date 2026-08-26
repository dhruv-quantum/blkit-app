# Brainy Ladder — Kit Companion

A web app for browsing your Brainy Ladder kit's instruction sheets and
activity videos, installable on a phone's home screen like a regular app —
no App Store required.

This is an early build. Right now it fully covers **The Brainy Badgers
(Nursery)** kit's **Animals** booklet (11 real activities, pulled from the
actual kit PDF), organized into 4 developmental quarters. Everything else —
sibling kits, other booklets — is shown locked, ready to be filled in.

---

## 1. Before you start

You need **Node.js** installed on your computer (this runs the project, it
has nothing to do with the app's content). Any version 20 or newer works.

1. Go to **[nodejs.org](https://nodejs.org)** and download the **LTS**
   version for your operating system.
2. Run the installer, accepting the defaults.
3. Confirm it worked — open a terminal (**Terminal** on Mac, **Command
   Prompt** or **PowerShell** on Windows) and type:
   ```
   node -v
   npm -v
   ```
   Both should print a version number. If you get "command not found,"
   restart your terminal (or your computer) and try again.

You'll also want a code editor to look at files later —
[VS Code](https://code.visualstudio.com) is free and works well, but isn't
required just to run the app.

---

## 2. First-time setup

1. Unzip this project folder somewhere easy to find, e.g. your Desktop.
2. Open a terminal and navigate into it:
   ```
   cd path/to/brainy-ladder-app
   ```
   (Type `cd `, then drag the folder into the terminal window, then press
   Enter — most terminals fill in the path for you.)
3. Install the project's dependencies (only needed once, or after content
   updates change what's installed):
   ```
   npm install
   ```
   This downloads everything the app needs into a `node_modules` folder.
   It can take a minute; you'll see a progress bar.

---

## 3. Running it locally

```
npm run dev
```

This starts a local server and prints a URL, typically
`http://localhost:5173`. Open that in your browser — you should see the
Kit Library screen. Changes you make to the code appear instantly without
restarting anything.

Press `Ctrl + C` in the terminal to stop the server.

### Viewing it on your phone

1. Make sure your phone and computer are on the **same Wi-Fi network**.
2. Run:
   ```
   npm run dev -- --host
   ```
3. It will print a second URL like `http://192.168.1.23:5173` — type that
   into your phone's browser.
4. To install it like an app:
   - **Android (Chrome):** tap the ⋮ menu → **Add to Home screen**.
   - **iPhone (Safari):** tap the Share icon → **Add to Home Screen**.

It'll then open full-screen from your home screen icon, just like the demo
you saw in the earlier prototype.

---

## 4. Version control with GitHub

This project is already set up as a git repository with one commit. Putting
it on GitHub gives you a backup, a change history, and — usefully — lets
hosting services auto-deploy every time you push, instead of manually
dragging a folder in.

1. Go to **[github.com/new](https://github.com/new)**, give it a name (e.g.
   `brainy-ladder-app`), and create it **empty** — don't check "Add a
   README" or `.gitignore`, since this project already has both.
2. GitHub will show you a remote URL, e.g.
   `https://github.com/your-username/brainy-ladder-app.git`. Back in your
   terminal, inside the project folder:
   ```
   git remote add origin https://github.com/your-username/brainy-ladder-app.git
   git push -u origin main
   ```
3. Refresh the GitHub page — your code is now there.

From then on, whenever you make changes:
```
git add -A
git commit -m "describe what changed"
git push
```

Prefer a visual tool over the command line? **[GitHub
Desktop](https://desktop.github.com)** does all of the above through a
simple interface — open the project folder in it, and it walks you through
publishing the repository and committing changes with buttons instead of
commands.

**Note:** this repo has no secrets or API keys in it (the app doesn't talk
to any backend), so there's nothing sensitive to worry about even if you
make the GitHub repository public.

### Auto-deploying from GitHub

Once your code is on GitHub, hosting is a one-time setup instead of a
manual step every time:

- **Netlify:** [app.netlify.com](https://app.netlify.com) → "Add new site"
  → "Import an existing project" → pick your GitHub repo. Build command:
  `npm run build`, publish directory: `dist`. Every future `git push`
  auto-deploys.
- **Vercel:** same idea at [vercel.com/new](https://vercel.com/new) — it
  auto-detects the Vite settings.

---

## 5. Putting it online without GitHub

If you'd rather skip GitHub for now, you can still host it directly:

1. Run `npm run build` — this creates a `dist/` folder with the finished,
   optimized app.
2. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)** and drag
   the `dist` folder into the page. Netlify gives you a live URL in seconds.

The tradeoff: you'd repeat this drag-and-drop manually after every change,
since there's no repo for it to auto-deploy from.

---

## 6. Adding content

Everything a booklet contains — its activities, quarters, materials,
steps, and sheet images — lives in one file:

```
src/data/kit.js
```

### Adding an image for a sheet

Drop the image file into `public/images/sheets/`, then reference it as
`/images/sheets/your-file-name.jpg` in `kit.js` (see the existing entries
for the pattern).

### Adding a new activity to the Animals booklet

Copy one of the objects inside `ANIMALS_BOOKLET.activities` in `kit.js` and
adjust its fields:

```js
{
  id: "unique-id",              // must be unique across all activities
  title: "Activity Name",
  theme: "Wild Animals",        // just a label shown as a tag
  quarter: 2,                   // 1-4, which quarter it belongs to
  sheetImage: "/images/sheets/your-file.jpg",
  sheetLabel: "Sheet 4 · Activity 12",
  focus: "What skill this builds",
  materials: ["Item one", "Item two"],
  steps: ["Step one.", "Step two."],
  videoUrl: null,                // or an embeddable URL once you have one
}
```

### Unlocking a new booklet (e.g. Early Literacy)

In `kit.js`, find the booklet's entry in `LOCKED_BOOKLETS` and turn it into
a full booklet object like `ANIMALS_BOOKLET` — give it `unlocked: true`, a
`cover` image, and an `activities` array following the same shape above.
It'll automatically appear as an open-able card on the kit home screen.

### Unlocking a new kit (e.g. Playgroup, KG-I, KG-II)

In `kit.js`, `AGE_GROUPS` controls the ladder on the Library screen. Right
now only Nursery is `unlocked: true`. Adding a second kit properly (its own
booklets, activities, progress tracking) means extending the data model a
bit further than a single flag — happy to help with that step when you're
ready to load real content for one of those.

### Adding a real activity video

Once you have a video hosted somewhere embeddable (YouTube, Vimeo, etc.),
just set that activity's `videoUrl` to the embed link, e.g.
`"https://www.youtube.com/embed/VIDEO_ID"`. The video button will switch
from the "coming soon" state to actually playing it.

---

## 7. How progress is stored

Marking an activity complete saves to the browser's local storage on that
device — nothing leaves the phone or gets sent anywhere. That means:

- Progress is per-device. Dad's phone and Mum's phone won't show the same
  checkmarks unless it's the same browser.
- Clearing browser data / reinstalling wipes progress.
- There's no login and no account system yet.

If you later want progress to sync across a family's devices, that needs a
small backend (or a service like Firebase/Supabase) plus a sign-in step —
a bigger undertaking than this app currently covers, worth a dedicated
conversation when you're ready for it.

---

## 8. Project structure

```
brainy-ladder-app/
├─ public/
│  ├─ icons/            → app icons (home screen, browser tab)
│  └─ images/sheets/     → the actual kit page images
├─ src/
│  ├─ data/kit.js        → ALL content: kits, booklets, quarters, activities
│  ├─ components/        → reusable UI pieces (cards, modals, icons...)
│  ├─ pages/             → the 3 screens: Library, KitHome, BookletView
│  ├─ hooks/useProgress.js → local-storage-backed completion tracking
│  └─ utils/storage.js   → small localStorage helper
├─ src/__tests__/        → automated tests covering the full click-through
├─ vite.config.js        → build tool + PWA (installable app) config
└─ package.json
```

---

## 9. Running the tests (optional)

There's an automated test that clicks through the entire app — opening the
kit, switching quarters, marking activities done, opening both modals —
and checks everything behaves correctly. You never need to run this, but
if you (or a developer you bring on) change the code later, it's a quick
way to check nothing broke:

```
npm test
```

---

## What's next

Natural next steps, roughly in order of how much they'd unlock:

1. **Load a second booklet's real content** (Early Literacy, Early
   Numeracy, or Social & Emotional) so the Nursery kit stops being
   single-booklet.
2. **Add real activity videos** as they're produced.
3. **Load a second kit** (Playgroup, KG-I, or KG-II) with its own booklets.
4. **Accounts + cloud sync**, if progress needs to follow a family across
   devices rather than staying local to one phone.
