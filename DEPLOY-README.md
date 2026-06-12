# SoCal Tint Chino — Deploy Guide

Everything you need to put this site online, show the customer, and later swap their domain.

---

## 0. What's in this folder

```
index.html                ← Home
about.html                ← About + history timeline
gallery.html              ← Filterable photo gallery + lightbox
before-after.html         ← Drag-to-reveal before/after slider
contact.html              ← Contact + quote form + map
services/                 ← 6 service pages
assets/style.css          ← All styling
assets/app.js             ← All interactivity
assets/img/               ← Photos go here (see Step 1)
download-photos.sh        ← Script that fills assets/img/ from the old site
robots.txt, sitemap.xml, 404.html
```

---

## 1. Get the photos from the old site  ✅ DO THIS FIRST

The pages now point at a local `assets/img/` folder, which is currently **empty**.
While the OLD site (socaltintchino.com) is still online, run the included script to
download every photo the new site uses.

**Mac / Linux**
```bash
cd socaltint-redesign
./download-photos.sh
```

**Windows**: install Git for Windows, then right-click the folder → "Git Bash Here" and run
`./download-photos.sh`. (Or use WSL.)

It reads `assets/img/IMAGE-MANIFEST.txt` (46 images) and saves them into
`assets/img/2024/11/…`, `assets/img/2020/03/…`, etc. — exactly where the site expects them.

**Other ways to grab the photos (optional):**
- WordPress admin → **Media Library** → select all → download, or
- Your host's File Manager / FTP → download the whole `wp-content/uploads` folder, or
- WordPress admin → **Tools → Export**.

The script is the cleanest because it pulls *only* the images this site references.

> After running it, open `index.html` in your browser — every photo should now load locally.

---

## 2. Turn on the contact form (so leads email the shop)

The two quote forms (Home + Contact) are wired to **Web3Forms** — free, and it simply
**emails each submission to the shop's inbox**. No app to install; they read it in Gmail/Outlook.

1. Go to **https://web3forms.com**, enter the shop email (e.g. `ineedtintnow@gmail.com`),
   and copy the **Access Key** they send.
2. In `index.html` and `contact.html`, find this line (appears once in each):
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
   ```
   Replace `YOUR_WEB3FORMS_ACCESS_KEY` with the real key.
3. Done. Submissions now arrive by email. (Until the key is added, the form just shows a
   "thank you" message but doesn't send — perfect for the customer preview.)

*Prefer Formspree instead? It works the same way — create a form, then change the form's
`action` to your Formspree URL. Ask me and I'll switch it.*

---

## 3. Deploy to Cloudflare Pages (for the customer preview)

**Easiest — drag & drop:**
1. Sign in at **https://dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** →
   **Upload assets**.
2. Name it something like `socaltint`.
3. Drag this whole `socaltint-redesign` folder in (after Step 1 so images are included).
4. Cloudflare gives you a live link like **https://socaltint.pages.dev** — send that to the customer.

**Or connect a Git repo** (auto-deploys on every change): push this folder to GitHub, then in
Cloudflare Pages choose "Connect to Git." Build command: *none*. Output directory: `/` (root).

To update the preview later, just re-upload the folder (or push to Git).

---

## 4. Swap the domain (after the customer approves)

The goal: point **socaltintchino.com** at this new site instead of the old WordPress.

1. In Cloudflare Pages → your project → **Custom domains** → **Set up a custom domain** →
   enter `socaltintchino.com` (and `www.socaltintchino.com`).
2. Cloudflare shows the DNS records to use:
   - If the domain's DNS is **already on Cloudflare**, it adds them automatically — click confirm.
   - If DNS is **elsewhere** (GoDaddy, etc.), either move the domain to Cloudflare (recommended)
     or add the CNAME records they give you at your current registrar.
3. Wait for DNS to propagate (minutes to a few hours). HTTPS is automatic.

> ⚠️ **Before you swap:** make sure Step 1 ran and the photos are bundled locally. Once the
> domain points to the new site, the old `wp-content/uploads` images no longer exist on it —
> the local `assets/img/` copies are what keep the photos working.

**Tip:** keep the old WordPress hosting active for a week or two after the swap as a safety net,
then cancel it.

---

## 5. Quick things you can tweak yourself

- **Hero slide speed:** `assets/app.js` → search `4000` (milliseconds per slide).
- **Hero headlines per photo:** `assets/app.js` → the `copy` array.
- **Phone / address / hours:** appear in the top bar and footer of each page.
- **Add before/after sliders:** in `before-after.html`, copy a `.ba` block and point the
  `.before` / `.after` images at a matched pair.

Questions or changes? Just ask.
