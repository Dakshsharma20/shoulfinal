# Placeholder imagery

> **Since this site became a full MongoDB-backed app:** `product-*.svg`
> and `category-*.svg` here are only the *seed* images (used once by
> `npm run seed`) — the live site reads product/category images from
> MongoDB (Cloudinary URLs), managed at `/admin/products` and
> `/admin/categories`. Everything else below (hero, founder, about-page,
> gallery) is still a plain static file as described.

Every generated image in this folder is an SVG in the Soul Hues palette
(sage green, off-white cream) so the site looks complete out of the box
with zero external dependencies or broken links. Regenerate them anytime
with `scripts/gen_placeholders.py`.

`logo-soulhues.png` is the exception — it's the real, uploaded Soul Hues
logo (not a placeholder) and is used as-is in the navbar, footer, loading
screen, and favicon/social-share images. See the main `README.md` for how
to swap it.

They exist purely as stand-ins. To go live, replace them with real
photography **using the exact same filenames** (or update the `image`
paths in `data/products.json` and the relevant components) and the site
will pick them up automatically:

| File pattern | Used for |
|---|---|
| `logo-soulhues.png` | The real Soul Hues logo — navbar, footer, loading screen, favicon |
| `hero-jewellery.svg` | Homepage hero banner |
| `flatlay-collection.svg` | "Explore Collection" / storytelling sections |
| `founder-shivani.svg` | About page + homepage founder portrait |
| `about-craftsmanship.svg`, `about-why-handmade.svg` | About page imagery |
| `category-*.svg` | Seed-only — manage real category images at `/admin/categories` |
| `product-*.svg` | Seed-only — manage real product images at `/admin/products` |
| `gallery-*.svg` | Instagram-style customer gallery masonry |

Recommended real-photo specs when you're ready to swap:
- Product shots: square, min. 1200×1200px, soft neutral or lifestyle backdrop
- Hero: portrait or landscape, min. 1600px on the long edge
- Founder portrait: min. 1200×1500px, natural light
