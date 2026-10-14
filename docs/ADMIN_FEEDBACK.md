# BookVerse AI — Admin & Template Feedback

**Reviewer:** Person 2 (Frontend / UI-UX)  
**Branch:** `frontend-ui`  
**Date:** October 2026  

---

## How to Run Locally (Quick-Start)

```powershell
# 1. Create & activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env from example
Copy-Item .env.example .env
# Open .env and fill: SECRET_KEY, DB_* credentials (or enable SQLite block)

# ── OPTIONAL: use SQLite instead of PostgreSQL ──
# Open bookverse/settings/dev.py and uncomment lines 12-17
# (the DATABASES SQLite block). Do NOT commit that change.

# 4. Migrate & create superuser
python manage.py migrate
python manage.py createsuperuser

# 5. Start server
python manage.py runserver
```

Open → http://127.0.0.1:8000/ | Admin → http://127.0.0.1:8000/admin/

---

## Admin Panel Findings

| # | Area | What I Tested | Expected | Actual | Severity | Suggested Fix |
|---|------|--------------|----------|--------|----------|---------------|
| 1 | **settings/base.py — critical bug** | Reviewed `base.py` line 133 | `ACCOUNT_UNIQUE_EMAIL = True` on its own line; `LOGIN_REDIRECT_URL = '/'` on the next line | Both settings are merged onto one line: `ACCOUNT_UNIQUE_EMAIL = TrueLOGIN_REDIRECT_URL = '/'` — so `LOGIN_REDIRECT_URL` is **never set**, causing redirect issues after login | **High** | Person 1 should split line 133 into two lines: `ACCOUNT_UNIQUE_EMAIL = True` and `LOGIN_REDIRECT_URL = '/'` |
| 2 | **Jazzmin admin login** | Visit `/admin/`, enter superuser credentials | Dark Jazzmin themed login screen | ✅ Works correctly; Jazzmin theme applied with blue accent navbar | Low | — |
| 3 | **Category CRUD** | Add/Edit/Delete Category via admin | Slug auto-populates from name using `prepopulated_fields` | ✅ Slug auto-fills correctly on add; editable on change form | Low | — |
| 4 | **Book CRUD** | Add/Edit/Delete Book via admin | Slug auto-populates; price, is_best_seller, is_new_arrival editable inline in list | ✅ Works; `list_editable` for price, flags works correctly | Low | — |
| 5 | **Book — no cover image field** | Try to upload a cover image on Book add form | Cover image field available | ❌ `Book` model has no `cover_image` / `author` / `category` fields yet. Placeholder CSS cover used on frontend | **High** | Person 1 (store app) should add `cover_image = ImageField(...)`, `author = CharField(...)`, `category = ForeignKey(Category, ...)` to `Book` model |
| 6 | **Best Sellers toggle** | Toggle `is_best_seller` on/off in book list view | Books appear/disappear from Best Sellers section on homepage | ✅ Works via `list_editable`; global context processor picks up changes | Low | — |
| 7 | **New Arrivals toggle** | Toggle `is_new_arrival` in list | Books appear/disappear from New Arrivals | ✅ Works correctly | Low | — |
| 8 | **Search in admin** | Use the admin search bar for books/users | Search works across title/description and email/username | ✅ `search_fields` on both `BookAdmin` and `UserAdmin` work | Low | — |
| 9 | **User admin — email login** | Create user with email, try to log in on frontend | `USERNAME_FIELD = 'email'` → login with email works | ✅ Auth backend correctly uses email; `CustomUserCreationForm` captures email | Low | — |
| 10 | **Cart admin** | Visit admin, look for Cart section | Cart model CRUD available | ❌ `cart` app has an empty `models.py`; no admin registered | **Med** | Person 4 needs to build `Cart`/`CartItem` models and register with admin |
| 11 | **Orders admin** | Visit admin, look for Orders section | Order model CRUD available | ❌ `orders` app has an empty `models.py` | **Med** | Person 4 needs to build `Order`/`OrderItem` models |
| 12 | **Newsletter admin** | Check for subscriber management | Newsletter subscriber list in admin | ❌ `newsletter` app has no model / admin yet | **Med** | Person 3 needs to add `Subscriber` model and register it |
| 13 | **AI Summary admin** | Check for AI summary management | AI summaries visible in admin | ❌ `ai_summary` app has minimal `models.py` stub | **Med** | Person 5 needs to implement `BookSummary` model |
| 14 | **Homepage with 0 books** | Cleared database, loaded `/` | Friendly empty states rendered | ✅ All sections show `{% empty %}` states with guide text | Low | — |
| 15 | **Homepage with 8+ books** | Added 8 books via admin | Cards render with gradient placeholder, price, badges | ✅ Grid renders correctly; badges show for best_seller/new_arrival | Low | — |
| 16 | **Mobile responsiveness (375px)** | DevTools → 375px width | Navbar collapses, grid goes 2-col, hero panel hides | ✅ All breakpoints work correctly | Low | — |
| 17 | **Tablet (768px)** | DevTools → 768px | 2-col book grid, footer 2-col | ✅ Layout adapts correctly | Low | — |
| 18 | **Desktop (1280px)** | Default viewport | Full navbar, 4-col grid, hero panel visible | ✅ Looks great | Low | — |
| 19 | **LOGIN_REDIRECT_URL not set** | Login as user | Should redirect to `/` after login | ⚠️ Due to bug #1, redirect may fall back to allauth default (`/accounts/profile/`) instead of `store:home` | **High** | Fix line 133 in `base.py` (see #1) |
| 20 | **Static files directory** | First run | `static/` dir auto-created | ❌ The `static/` directory did not exist in the repo — created `static/css/style.css` and `static/js/main.js` as part of this PR | Low | Ensure `static/` is in `.gitignore` exclusion properly or add a `.gitkeep` |

---

## Known Gaps Summary

| Gap | Owner | Priority |
|-----|-------|----------|
| `Book` model missing `cover_image`, `author`, `category` FK | Person 1 | High |
| `LOGIN_REDIRECT_URL` bug in `base.py` line 133 | Person 1 | High |
| Cart models, views, URLs, admin | Person 4 | High |
| Order models, views, URLs, admin | Person 4 | High |
| Newsletter subscriber model + subscribe view | Person 3 | Med |
| AI Summary model + Gemini view | Person 5 | Med |
| `store:category_detail` URL pattern | Person 1 | Med |
| `store:search` view and URL | Person 1 | Low |
| Book detail page (`store:book_detail`) | Person 1 | High |
| Social auth (Google) setup in allauth | Person 1 | Low |

---

## Questions for Backend Teammates

### → Person 1 (store / accounts / settings)

1. **Line 133 bug** — can you split `ACCOUNT_UNIQUE_EMAIL = TrueLOGIN_REDIRECT_URL = '/'` into two lines ASAP? This breaks post-login redirect.
2. When will you add `cover_image`, `author`, and `category` FK to `Book`? The frontend has guards ready (`{% if book.cover_image %}`).
3. Will `store:category_detail` be a slug-based URL like `{% url 'store:category_detail' cat.slug %}`?
4. What will `store:book_detail` look like? I'll add a click handler to book cards once available.
5. Is there a `store:search` view planned? The navbar search form is ready to point there.

### → Person 3 (newsletter)

6. What form fields does the subscribe endpoint accept? The newsletter forms currently POST `email`. Will you keep that name?
7. What URL name will you use? I've left `<!-- TODO Person 3: {% url 'newsletter:subscribe' %} -->` comments throughout.

### → Person 4 (cart / orders)

8. What URL name for adding to cart? I expect `cart:add_to_cart` with `book.slug` kwarg — is that correct?
9. What is the cart detail page URL name? I've used `cart:cart_detail` in the navbar badge link.
10. Will you register `Cart`/`CartItem` in admin so I can test the cart count badge?

### → Person 5 (AI summary)

11. The AI summary button currently links to `#`. Will the URL be `ai_summary:index` or `ai_summary:book_summary` with `book.slug`?
12. Should I add an "AI Summary" button directly on each book card, or only on a book detail page?
