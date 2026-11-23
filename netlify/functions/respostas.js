// Devolve as respostas dos formulários (só com a palavra-passe certa).
// Variáveis de ambiente (Netlify → Site configuration → Environment variables):
//   BACKOFFICE_PASSWORD  palavra-passe do /backoffice
//   NETLIFY_API_TOKEN    Personal access token da Netlify
//   SITE_ID              (a Netlify costuma definir; se faltar, copiar o "Project ID")
const crypto = require("crypto");

const json = (status, body) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const hash = (s) => crypto.createHash("sha256").update(String(s)).digest();
const IGNORAR = new Set(["ip", "user_agent", "referrer", "bot-field", "form-name"]);

async function api(path, token) {
  const r = await fetch("https://api.netlify.com/api/v1" + path, {
    headers: { Authorization: "Bearer " + token },
  });
  if (!r.ok) throw new Error("Netlify API " + r.status);
  return r.json();
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { erro: "Método não permitido." });

  const pass = process.env.BACKOFFICE_PASSWORD;
  const token = process.env.NETLIFY_API_TOKEN;
  const siteId = process.env.SITE_ID || process.env.NETLIFY_SITE_ID;
  if (!pass || !token || !siteId) {
    return json(500, { erro: "Falta configurar BACKOFFICE_PASSWORD, NETLIFY_API_TOKEN ou SITE_ID na Netlify." });
  }

  let enviada = "";
  try { enviada = JSON.parse(event.body || "{}").password || ""; } catch (e) {}
  if (!crypto.timingSafeEqual(hash(enviada), hash(pass))) {
    return json(401, { erro: "Palavra-passe errada." });
  }

  try {
    const forms = await api("/sites/" + siteId + "/forms", token);
    const out = {};
    for (const f of forms) {
      const linhas = [];
      for (let page = 1; ; page++) {
        const subs = await api("/forms/" + f.id + "/submissions?per_page=100&page=" + page, token);
        for (const s of subs) {
          const campos = {};
          for (const [k, v] of Object.entries(s.data || {})) {
            if (!IGNORAR.has(k) && v !== null && String(v).trim() !== "") campos[k] = String(v).trim();
          }
          linhas.push({ criado: s.created_at, campos });
        }
        if (subs.length < 100) break;
      }
      linhas.sort((a, b) => a.criado.localeCompare(b.criado));
      out[f.name] = linhas;
    }
    return json(200, { formularios: out });
  } catch (e) {
    return json(502, { erro: "Não foi possível obter as respostas: " + e.message });
  }
};
