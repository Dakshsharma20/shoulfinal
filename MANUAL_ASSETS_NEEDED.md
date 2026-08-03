# Manual Assets Needed — Real Photos & Videos From Instagram

## 📢 Update: the site is now a full CMS

Since this file was first written, the site was converted to a
full-stack app with a MongoDB-backed admin panel. **Product and
category images are no longer swapped by replacing files in
`public/images/` — upload them through `/admin/products` and
`/admin/categories` instead**, where they're stored on Cloudinary and
show up on the live site immediately.

The sections below about **product/category images are now historical**
— they describe the old static-file workflow. What's still accurate:
the **Founder Portrait**, **About Page Imagery**, and **Featured
Reels** sections near the bottom, since those weren't moved into the
CMS (see `README.md` §8 for why).

---

**Why this file exists:** I couldn't pull photos/videos from Instagram
automatically (blocked by `robots.txt`, no download path even if I
could see them). You then uploaded 6 real screenshots directly, so
those are now live on the site. This file tracks what's done and what
still needs real photos.

## ✅ Done — real photos now live on the site

From your 6 uploads, I identified **1 necklace (3 angles) + 3 earring
pairs**, cropped out the Instagram UI and baked-in watermarks/stickers,
and applied light sharpening + brightness/contrast. They're saved in
`public/images/real/` and were seeded into MongoDB (via `npm run seed`)
for:

| Real photo | Now used for |
|---|---|
| `necklace-reversible-hero.jpg` | **Hero banner** (default, unless overridden in `/admin/settings`) |
| `necklace-reversible-2.jpg` | Product: **Forest Leaf Necklace** |
| `earrings-tiger-eye.jpg` | Product: **Whisper Drop Earrings** — good name match |
| `earrings-blossom-boom.jpg` | Product: **Pearl Bloom Earrings** — good name match |
| `earrings-jelly-star.jpg` | Product: **Gold Vine Hoops** — ⚠️ name mismatch, see below |
| All 6 photos (2 repeated) | **Instagram Gallery** (8 tiles) + **Follow us on Instagram** preview strip (still static, not CMS-driven) |

**⚠️ One thing worth fixing when you can:** "Gold Vine Hoops" shows a
photo of teal/cream fringe beaded earrings ("Jelly star"), since that
was the only earring slot left. Now that the site is CMS-driven, the
easiest fix is in `/admin/products`: either rename the product to match
the photo, or upload a real gold-hoops photo to replace it — no code
changes needed either way.

## How to get more files

Your camera roll / original files are the best source (better quality
than Instagram's compressed versions). Otherwise: open the post in a
browser → right-click the image → "Save image as," or use Instagram's
**Download Your Information** tool (Settings → Accounts Center → Your
information and permissions) for original-quality exports. For Reels,
open it → **Share → Copy Link**.

## Recommended specs

| Type | Shape | Minimum size |
|---|---|---|
| Product photo | Square | 1200×1200px |
| Hero image | Portrait or landscape | 1600px on the long edge |
| Category tile | Square | 800×800px |
| Reel cover | Vertical 9:16 | 1080×1920px |
| Founder portrait | Portrait | 1200×1500px |

---

## Historical — pre-CMS product/category image list

*(Kept for reference only. Use `/admin/products` and
`/admin/categories` instead of the file paths below.)*

<details>
<summary>Expand old static-file checklist</summary>

### Best Sellers (2 of 4 remaining)
| Product name | Old placeholder file |
|---|---|
| Gold Charm Bangle | `public/images/product-gold-charm-bangle.svg` |
| Pearl Hair Pin Set | `public/images/product-pearl-hair-pin-set.svg` |

### New Arrivals (3 of 4 remaining)
| Product name (temp) | Old placeholder file |
|---|---|
| Moonstone Cuff | `public/images/product-moonstone-cuff.svg` |
| Handmade Beaded Ring | `public/images/product-stacking-ring-set.svg` |
| Beaded Anklet Duo | `public/images/product-beaded-anklet-duo.svg` |

### Remaining Products (5 of 6 remaining)
| Product name | Old placeholder file |
|---|---|
| Emerald Grace Necklace | `public/images/product-layered-pearl-necklace.svg` |
| Sun Coin Pendant | `public/images/product-sun-coin-pendant.svg` |
| Floral Charm Bracelet | `public/images/product-braided-thread-bracelet.svg` |
| Botanical Band Ring | `public/images/product-botanical-band-ring.svg` |
| Dainty Bell Anklet | `public/images/product-dainty-anklet.svg` |

> No real photos exist yet for **bracelets, rings, anklets, or hair
> accessories** — none of your 6 uploads were in these categories.

### Featured Collections (category tiles) — 6 images
| Category | Old placeholder file |
|---|---|
| Earrings | `public/images/category-earrings.svg` |
| Necklaces | `public/images/category-necklaces.svg` |
| Bracelets | `public/images/category-bracelets.svg` |
| Rings | `public/images/category-rings.svg` |
| Anklets | `public/images/category-anklets.svg` |
| Hair Accessories | `public/images/category-hair-accessories.svg` |

</details>

---

## Still needed — Featured Reels — 4 videos
Static preview cards linking to your profile are live now. To point
each card at its *specific* Reel:
1. Send the Reel's share link — `https://www.instagram.com/reel/XXXXXXXXX/`
   — for each of the 4 slots in `data/reels.json`.
2. Provide a cover-frame image for each, to replace:
   `public/images/reel-1.svg`, `reel-2.svg`, `reel-3.svg`, `reel-4.svg`

Once you have the 4 links, either point each card at its Reel URL
(quick one-line change), or use Instagram's official embed
(`<blockquote class="instagram-media">` + their `embed.js`) to play the
Reel inline instead of linking out — ask if you'd like that instead.

## Still needed — Founder Portrait — 1 image
| Replace this file | With |
|---|---|
| `public/images/founder-shivani.svg` | A real photo of Shivani |

## Still needed — About Page Imagery — 2 images
| Replace this file | With |
|---|---|
| `public/images/about-craftsmanship.svg` | A process/craftsmanship shot |
| `public/images/about-why-handmade.svg` | A close-up detail shot |

## Logo — done ✅
`public/images/logo-soulhues.png` is your real uploaded logo. You can
also replace it from `/admin/settings` without touching any files.

---

**Remaining: 4 Reel links/covers + 1 founder portrait + 2 About page
images.** Everything product/category-related is now managed in
`/admin`, not by replacing files.
