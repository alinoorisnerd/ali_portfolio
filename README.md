# Ali Noor — Portfolio

A fast, static portfolio site (plain HTML, CSS and JavaScript, no build step), ready for GitHub Pages.

**Features:** animated circuit-trace background, letter-by-letter name reveal, typing tagline, 3D chip that follows the mouse, scroll reveals, count-up stats, a timeline that draws as you scroll, an animated battery chart, the Novus design-flow animation, a working 16-bit processor simulator, photo/video carousels, a full-screen viewer, dark/light mode, and page transitions. Animations turn off automatically for visitors who set "reduce motion" on their device.

## Folder structure

```
index.html          Home page
novus.html          Novus case-study page
favicon.svg         Browser tab icon
css/style.css       All styles (colours are at the top, under :root)
js/media.js         EVERY photo, video and certificate is listed here
js/circuit.js       Background circuit animation
js/main.js          All other interactions
assets/cv/          Ali_Noor_CV.pdf (the Download CV buttons link here)
assets/images/      Your photos
assets/videos/      Your videos (.mp4)
assets/certificates/  Certificate images
.nojekyll           Tells GitHub Pages to serve files as-is
```

## Adding your photos and videos

1. Open `js/media.js`. Each section (about, rumi, robot, certificates, photos …) lists the files it expects, e.g. `assets/images/rumi-1.jpg`.
2. Save your file into that folder **with exactly that name** (GitHub Pages is case-sensitive: `Rumi-1.JPG` will not match `rumi-1.jpg`), or change the name in `media.js`.
3. Until a file exists, the site shows a neat placeholder telling you which file it's waiting for.
4. Add or remove slides by adding or deleting lines in `media.js`. A carousel with one item shows no arrows.

**Tips**
- Resize photos to about 1600 px wide and save as JPG (~200–400 KB) so the site stays fast.
- Videos: keep them short (10–30 s), MP4 (H.264), under ~15 MB each. They play muted and loop. GitHub refuses files over 100 MB. For longer videos, upload to YouTube and use `type: 'youtube'`.
- **Hotspot app:** put your YouTube video ID in `media.js` under `hotspot` (the part after `watch?v=`).

## Editing text

All text is in `index.html` and `novus.html`; search for the sentence you want to change. The battery chart values are near the top of the "battery chart" block in `js/main.js` (minutes to empty for CPU, DSP, GPU and sMobileNNs on the Galaxy A52 5G). They were read off your test chart, so replace them with the exact numbers from your data.

To update the CV, replace `assets/cv/Ali_Noor_CV.pdf` with a new file of the same name.

## Preview on your computer

Open a terminal in this folder and run:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000. (Double-clicking `index.html` also works, but videos and some features behave better through a local server.)

## Publish on GitHub Pages

1. On GitHub, create a new **public** repository named exactly `alinoorisnerd.github.io` (your username + `.github.io`).
2. Upload everything in this folder (the files, not the folder itself) to the repository, including the hidden `.nojekyll` file. On the website: **Add file → Upload files**, drag everything in, then **Commit changes**.
3. Go to **Settings → Pages**. Under "Build and deployment", choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute or two the site is live at **https://alinoorisnerd.github.io**.

If you use a different repository name (e.g. `portfolio`), the address becomes `https://alinoorisnerd.github.io/portfolio/`. Everything still works because all links are relative.

**Custom domain (optional):** buy a domain, add it under Settings → Pages → Custom domain, and follow GitHub's DNS instructions.

## Changing colours

At the top of `css/style.css`:
- `--accent` is the green "signal" colour (buttons, highlights, background pulses)
- `--copper` is the PCB copper colour
- The `[data-theme="light"]` block holds the light-mode versions.
