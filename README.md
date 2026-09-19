# Ground B — khetra wise sewadal board

79th Sant Nirankari Samagam.

Reads the published Google Sheet **Khetra Wise Entry Exit Data** (tab: Form Responses 1)
and shows how many sewadal are in Ground B on any chosen date, khetra by khetra.

The sheet is the only store. Nothing is written back, no database.

## How the count works

Sheet columns: `Timestamp, Khetra, Unit, Status, Date, Males, Females`

For a chosen date **D**, every row with `Date <= D` is taken:

```
males(khetra)   = Σ Males   where Status = Entry  −  Σ Males   where Status = Exit
females(khetra) = Σ Females where Status = Entry  −  Σ Females where Status = Exit
strength        = males + females
```

An older `Count` column, if present, is still read and added to the total as an
unsplit figure.

The same netting runs per unit inside each khetra, and across the whole ground.
`Date` is the working date of the movement. If the form drops that header (it can
arrive as `Column 5`), the page finds the date column by looking at the values
themselves and says which column it used under the title; `Timestamp` is the last
resort. `Unit` may be left blank — those rows group under "Unit not given".
Rows with no usable date, status or head count are skipped and counted in the line
under the title.

## Screens

- **Board** — khetra cards: total, male/female split bar, female share, today's movement; tap for units and in/out totals.
- **Khetra table** — sortable on total, males, females, female %, in, out, units, last movement, with a ground total row.
- **Male / female** — male-female split per khetra as bars, highest and lowest female share, male-to-female ratio for the ground, top 8 units by strength.
- **Trend** — males as the lower band and total as the full height across the Samagam, peak and its date, last 14 dates of in/out split by male and female.
- **Log** — every row up to the chosen date with its M/F counts, searchable by khetra or unit, filterable to entry or exit.

Negative strength in a khetra (more exits than entries recorded) is flagged on the
Board so the sheet can be corrected.

## Deploy

```bash
git init
git add .
git commit -m "Ground B khetra board"
git remote add origin git@github.com:<you>/khetra-board.git
git push -u origin main
```

Then on Vercel: **New Project → import the repo → Deploy**. No build step, no framework preset.

Set these in Vercel → Settings → Environment Variables (both are optional; the
current sheet is hard-coded as fallback):

| Name | Value |
|---|---|
| `SHEET_PUBLISH_ID` | `2PACX-1vTsYgH-BuNyxUMcmAC4N-rDzhwv_rSDzesmk47TF6NYnXl7xqif1CoKYgeaUop0vBBSQkNo7TdvZqW2` |
| `SHEET_GID` | `1213054300` |

`api/sheet.js` fetches the sheet server-side and caches it on the edge for 60s, so
the browser never calls docs.google.com and the sheet id is not in the page source.
If that route is unavailable (opening `index.html` straight from disk), the page
falls back to the published CSV directly.

## Keeping it fed

The sheet is fed by a Google Form. Whatever the form writes must keep the same
column names — the page matches headers by name, not position, so column order can
change but the words `Khetra`, `Status`, `Date`, `Males` and `Females` must stay.
`Unit` is optional.

`Status` only needs to start with "Ex" to count as an exit; anything else counts as
an entry.
