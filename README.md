# hyacinthblabagno.work

My personal portfolio for job applications. It's a static Astro site: every page is built ahead of time, there's no database and no login, and all the content lives in plain text files in this folder.

## Where things live

| What | File |
|---|---|
| Name, role title, hero text, email, profile links, resume, page description | `src/data/site.json` |
| About bio, "Based in" details, the six skills | `src/data/about.json` |
| Experience (jobs) | `src/data/experience.json` |
| Tools | `src/data/tools.json` |
| Work showcase (reels, ads, AI content, animations, statics, stories) | `src/data/showcase.json` |
| Case studies, client feedback, certifications | `src/data/proof.json` |
| Hero and About photo | `src/assets/portrait-about.jpg` |
| Brand logos (white, trimmed WebP) | `public/logos/` and the list in `src/components/SelectedWork.astro` |
| Share image (shown when the link is posted) | `public/og-image.png` (1200 x 630) |
| Browser tab icon | `public/favicon.svg` and `public/apple-touch-icon.png` |
| Colors, type sizes and corners (the only place to change them) | `src/styles/global.css` (top of the file) |

## Booking link and brand groups

- **Schedule a call:** paste your Calendly link into `"bookingUrl"` in `src/data/site.json`. Until then, "Schedule a call" and every "Talk about a role" button go to the contact form, which notes the skill the visitor asked about.
- **Brands handled through a client:** `"groups"` in `src/data/showcase.json` lists brands that show inside one client's card (for example Expert Biotics, Uncle Scientist and Stacked Science under Proper Ecom).

## Two safety rules built in

1. **Placeholders never go live.** Any value written as `[PLACEHOLDER: ...]` is hidden on the live site. While previewing, it shows in a yellow box so I can spot it.
2. **Nothing unconfirmed goes live.**
   - The bio, each job, and the tool list each have `"confirmed": false`. Change that to `true` once it's correct.
   - While previewing, unconfirmed items still show, with a "needs your confirmation" tag.

## Preview the site on my computer

You only need to do this the first time:

```bash
cd "/Volumes/Extreme SSD/Hyacinth B./hyacinthblabagno-work"
npm install
```

Then, every time:

```bash
npm run dev
```

Open http://localhost:4321 (the address is printed in the terminal). Saved changes show up straight away. Press `Ctrl + C` to stop.

To check what the **live** site will contain (drafts and placeholders removed):

```bash
npm run build
npm run preview
```

## Edit the work showcase

The "Selected work" section is built from `src/data/showcase.json`. Each item is one tile:

```json
{ "id": "reel-hs-bills", "category": "reels", "title": "I have bills to pay",
  "alt": "Split screen of foot spa, hair wash, hair colour and nail services",
  "kind": "video", "media": "v-hairsolution-cinth-hs-billstopay", "aspect": "9:16",
  "brand": "Hair Solution Nails and Spa" }
```

- `category`: `reels`, `ads`, `ai`, `animations`, `statics` or `stories` (the tabs).
- `kind`: `video` or `image`. `media` is the Cloudinary public ID (cloud `ktee3ije`).
- `featured: true` puts an item first in its tab. `hidden: true` takes it off the site without deleting it.
- Each tab shows its first 10 items (8 for statics), plus a "Show all" button.
- Hovering a video plays a silent 6-second preview; clicking opens the full video with sound.

- Statics and stories (listed under `grouped`) show one cover per brand. Selecting it opens the whole collection. A brand's designs board (`board: true`) is used as the cover.
- `roles` holds the short "My role" line shown in the viewer for each brand. Brands with no line show none.
- The hero's "A look at recent work" strip uses the `featured` items, plus the first ad, animation and two stories.

**Profile card (hero):** uses the hero photo, your name and role, LinkedIn and email icons, "Download CV" (once the resume is confirmed) and "Contact me". To show the availability badge, set `availability` in `site.json`, for example `"Open to full-time roles"`.

**Tool icons:** matched by name in `src/lib/toolIcons.ts`. Brands that aren't in the Simple Icons library (Adobe, Microsoft and a few others) use lettered tiles in their brand colors.

Case studies, client feedback and certifications are in `src/data/proof.json`. Feedback must be copied word for word from the client.

## Add or swap images and videos

Images and videos for the showcase live on Cloudinary (account `ktee3ije`, folder `hyacinth portfolio`). Cloudinary resizes and compresses them automatically for each screen.

1. Upload the file to Cloudinary (public IDs are flat, for example `rabble-flatlay-01`).
2. Copy its **public ID** (the name without the file extension).
3. Paste it as `media` on the item in `src/data/showcase.json`, with `kind` (`image` or `video`), `aspect` (`9:16`, `4:5` or `1:1`) and a plain description in `alt`.

**About videos:**
- Videos show a still frame with a play button, and only download when someone presses play.
- The still frame is taken 1 second into the video.
- To use a custom still instead, upload an image and add `poster: "its public ID"` under the video.
- Don't use Google Drive links. Drive doesn't stream video reliably on websites.

**About `alt` text:** describe what's in the picture for someone who can't see it. One plain sentence is enough.

**Swap a photo of me:**
- Replace `src/assets/portrait-about.jpg` with a new file of the same name, in portrait shape (about 4:5).
- Then update `portraitAlt` in `site.json` or `about.json`.

**Swap the share image:** replace `public/og-image.png` with a 1200 x 630 PNG.

## Edit text

Open the matching file from the table above and change the words between the quotes. A few things to keep in mind:

- Keep the quotes and commas exactly where they are. If a file has a mistake, `npm run dev` or `npm run build` stops and names the file and the line.
- Inside JSON text, write an apostrophe normally (`I'm`). A double quote inside text needs a backslash: `\"`.
- **Bio:** `bio` in `about.json` is a list of paragraphs. The first one is shown larger.
- **Hero headline and intro:** `hero` in `site.json`.
- **Jobs:** each job in `experience.json` is one `{ ... }` block. Copy a block to add a job. They show in the order listed.
- **Tools:** in `tools.json`, add or remove names inside a group's list.

## Update contact details

All in `src/data/site.json`:

- `email`: the address the "Email me" and "Copy email address" buttons use.
- `socials`: profile links. Each has a `label` (what's shown) and a `url`. Add more by copying a line.
- `resumeFile` and `resumeConfirmed`: see "Update the resume" below.

## Update the resume

The resume PDF is built from the same files as the site, so it always matches:
- name, role and contact details from `site.json`
- skills from `about.json`
- jobs from `experience.json`
- tools from `tools.json`
- the summary and education from `resume.json`

1. Edit those files.
2. Run:

```bash
npm run resume
```

This saves `public/hyacinth-blabagno-resume.pdf`. If anything is still unconfirmed or missing a date, the PDF gets a yellow "DRAFT" banner at the top, and the terminal lists what's left.

3. When the PDF is final, set `"resumeConfirmed": true` in `site.json`. The "Resume (PDF)" links in the menu and in Contact only appear on the live site after that.

**Using a resume made somewhere else:** save it as `public/hyacinth-blabagno-resume.pdf` and don't run `npm run resume`, because it would overwrite your file.

If any of these is still a `[PLACEHOLDER: ...]`, it's simply left off the live site.

## Publish changes

Not set up yet. The plan is to use GitHub and Netlify, with the domain hyacinthblabagno.work. Once it's connected, publishing will be:

1. Save my changes.
2. Commit and push to GitHub.
3. Netlify builds and publishes automatically in about a minute.

The build settings are already in `netlify.toml`.
