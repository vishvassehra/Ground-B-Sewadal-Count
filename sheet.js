// Reads the published Google Sheet server-side so the browser never talks to
// docs.google.com directly (no CORS, and the sheet id stays in env vars).
//
// Vercel env vars (Settings → Environment Variables):
//   SHEET_PUBLISH_ID  the 2PACX-... id from the "Publish to web" link
//   SHEET_GID         the tab's gid (Form Responses 1 = 1213054300)

const FALLBACK_ID =
  "2PACX-1vTsYgH-BuNyxUMcmAC4N-rDzhwv_rSDzesmk47TF6NYnXl7xqif1CoKYgeaUop0vBBSQkNo7TdvZqW2";
const FALLBACK_GID = "1213054300";

export default async function handler(req, res) {
  const id = process.env.SHEET_PUBLISH_ID || FALLBACK_ID;
  const gid = process.env.SHEET_GID || FALLBACK_GID;
  const url = `https://docs.google.com/spreadsheets/d/e/${id}/pub?gid=${gid}&single=true&output=csv`;

  try {
    const r = await fetch(url, { redirect: "follow" });
    if (!r.ok) {
      res.status(502).send(`Sheet returned ${r.status}`);
      return;
    }
    const csv = await r.text();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).send(csv);
  } catch (e) {
    res.status(502).send("Sheet unreachable");
  }
}
