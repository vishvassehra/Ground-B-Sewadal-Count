# Ground B — khetra wise sewadal board

Reads the published Google Sheet **Khetra Wise Entry Exit Data** (tab: Form Responses 1)
and shows how many sewadal are in Ground B on any chosen date, khetra by khetra.

The sheet is the only store. Nothing is written back, no database.

## How the count works

Sheet columns: `Timestamp, Khetra, Unit, Status, Count, Date`

For a chosen date **D**, every row with `Date <= D` is taken:

```
strength(khetra) = Σ Count where Status = Entry  −  Σ Count where Status = Exit
```

The same netting runs per unit inside each khetra, and across the whole ground.
`Date` is the working date of the movement; `Timestamp` is only a fallback when
`Date` is blank. Rows with no usable date, status or count are skipped and counted
in the line under the title.

## Screens

- **Board** — khetra cards with current strength, tap for units, came-in / went-out totals, last movement date.
- **Khetra table** — sortable strength / came in / went out / units / last movement, with a ground total.
- **Trend** — running strength across all dates, peak and its date, last 14 dates of in/out/net, share of the ground by khetra.
- **Movement log** — every entry/exit row up to the chosen date, searchable by khetra or unit, filterable to entry or exit.

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
change but the words `Khetra`, `Unit`, `Status`, `Count`, `Date` must stay.

`Status` only needs to start with "Ex" to count as an exit; anything else counts as
an entry.
