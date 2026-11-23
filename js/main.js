(function () {
  "use strict";

  /* ---------- Menu hambúrguer (telemóvel) ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("menu");
  if (toggle && links) {
    var close = function () {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { close(); toggle.focus(); }
    });
  }

  /* ---------- RSVP: campos condicionais ---------- */
  /* Existem sempre no HTML (a Netlify precisa deles); aqui só os escondemos. */
  var extra = document.getElementById("campos-sim");
  var radios = document.querySelectorAll('input[name="presenca"]');
  if (extra && radios.length) {
    var update = function () {
      var sim = document.querySelector('input[name="presenca"]:checked');
      extra.hidden = !(sim && sim.value === "Sim");
    };
    radios.forEach(function (r) { r.addEventListener("change", update); });
    update();
  }

  /* ---------- Copiar IBAN ---------- */
  var btn = document.getElementById("copiar-iban");
  var ibanEl = document.getElementById("iban");
  var msg = document.getElementById("copiado");
  if (btn && ibanEl) {
    btn.addEventListener("click", function () {
      var iban = ibanEl.textContent.replace(/\s+/g, "");
      var done = function () {
        msg.textContent = "Copiado!";
        setTimeout(function () { msg.textContent = ""; }, 2500);
      };
      var fallback = function () {
        var ta = document.createElement("textarea");
        ta.value = iban; ta.setAttribute("readonly", "");
        ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); }
        catch (e) { msg.textContent = "Não foi possível copiar. Seleciona o IBAN manualmente."; }
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(iban).then(done, fallback);
      } else {
        fallback();
      }
    });
  }

  /* ---------- obrigado.html: mensagem por formulário ---------- */
  var thanks = document.getElementById("obrigado-texto");
  if (thanks) {
    var f = new URLSearchParams(window.location.search).get("f");
    var textos = {
      rsvp: "Recebemos a tua resposta. Obrigado por nos avisares, é uma alegria enorme poder contar contigo!",
      mensagem: "Recebemos a tua mensagem e vamos guardá-la com muito carinho. Obrigado!"
    };
    if (textos[f]) thanks.textContent = textos[f];
  }
})();
