/**
 * Réception automatique des inscriptions – Centre d'excellence Cloud & IA
 *
 * Le site envoie, à la fin d'un test de positionnement ou d'une demande de tarif groupe,
 * le code résultat (IAM1.… ou IAMENT1.…). Ce script vérifie le code, le décode et ajoute
 * une ligne dans l'onglet « Candidats » ou « Entreprises » du fichier qui le contient.
 *
 * Seuls les codes valides produits par le site sont acceptés : un envoi forgé ou abîmé est ignoré.
 * Un même code n'est jamais enregistré deux fois.
 *
 * Installation : voir integration/README.md.
 */

var MAX_BODY = 8000;
var LABELS_PARCOURS = { cloud: "Cloud Foundations", ai: "AI Foundations" };
var LABELS_RECO = {
  pret: "Prêt à démarrer",
  pret_cloud: "Prêt (revoir les notions Cloud)",
  prep: "Avec modules préparatoires",
  bases: "Renforcer les bases d'abord",
  cloud_first: "Commencer par Cloud Foundations"
};
var LABELS_FORMAT = { inter: "Dans une promotion IAM", intra: "Promotion dédiée", conseil: "À discuter" };

function doGet() {
  return json_({ ok: true, service: "inscriptions" });
}

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? String(e.postData.contents) : "";
    if (!raw || raw.length > MAX_BODY) return json_({ ok: false, error: "taille" });
    var req = JSON.parse(raw);
    if (req.hp) return json_({ ok: true }); // champ piège rempli : robot, on ignore sans le dire
    var code = String(req.code || "").trim();
    var src = clean_(req.src, 40);
    var page = clean_(req.page, 80);

    var decoded = decode_(code);
    if (!decoded) return json_({ ok: false, error: "code" });

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      if (decoded.kind === "candidat") {
        var sh = ss.getSheetByName("Candidats");
        if (exists_(sh, 9, code)) return json_({ ok: true, duplicate: true });
        var d = decoded.data;
        sh.appendRow([
          new Date(),
          LABELS_PARCOURS[d.t] || clean_(d.t, 20),
          clean_(d.n, 120),
          text_(clean_(d.p, 40)),
          clean_(d.e, 160),
          Number(d.s) || 0,
          LABELS_RECO[d.r] || clean_(d.r, 40),
          src,
          code,
          page,
          ref_(code)
        ]);
      } else {
        var sh2 = ss.getSheetByName("Entreprises");
        if (exists_(sh2, 11, code)) return json_({ ok: true, duplicate: true });
        var c = decoded.data, n = c.n || {};
        var eff = [];
        if (n.cloud) eff.push(n.cloud + " Cloud");
        if (n.ai) eff.push(n.ai + " IA");
        if (n.pack) eff.push(n.pack + " Pack");
        sh2.appendRow([
          new Date(),
          clean_(c.ent, 160),
          clean_(c.nom, 120),
          clean_(c.fct, 120),
          text_(clean_(c.p, 40)),
          clean_(c.e, 160),
          eff.join(", "),
          LABELS_FORMAT[c.fmt] || clean_(c.fmt, 40),
          clean_(c.per, 80),
          Number(c.est) || 0,
          code,
          ref_(code)
        ]);
      }
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "serveur" });
  }
}

/* ---------- Vérification et décodage du code (même algorithme que le site) ---------- */

function decode_(code) {
  var m = /^(IAM1|IAMENT1)\.([A-Za-z0-9_-]+)\.([0-9A-Z]{6})$/.exec(code);
  if (!m) return null;
  if (fnv_(m[2]) !== m[3]) return null;
  var b64 = m[2].replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  var data;
  try {
    data = JSON.parse(Utilities.newBlob(Utilities.base64Decode(b64)).getDataAsString("UTF-8"));
  } catch (e) {
    return null;
  }
  if (!data || typeof data !== "object") return null;
  if (m[1] === "IAM1") {
    if (!data.n || !data.e || !LABELS_PARCOURS[data.t]) return null;
    return { kind: "candidat", data: data };
  }
  if (!data.ent || !data.e) return null;
  return { kind: "entreprise", data: data };
}

function fnv_(str) {
  var h = 2166136261;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  var s = h.toString(36).toUpperCase();
  while (s.length < 7) s = "0" + s;
  return s.slice(-6);
}

/* ---------- Utilitaires ---------- */

function exists_(sheet, col, code) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var found = sheet.getRange(2, col, last - 1, 1).createTextFinder(code).matchEntireCell(true).findNext();
  return !!found;
}

function clean_(v, max) {
  var s = String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim();
  if (/^[=+\-@]/.test(s)) s = "'" + s; // évite qu'un texte soit interprété comme une formule
  return s.slice(0, max);
}

function text_(s) {
  return s && s.charAt(0) !== "'" ? "'" + s : s; // garde le téléphone en texte (+221…)
}

function ref_(code) {
  return code.slice(-6);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
