/* BazarVert — suivi des conversions Google Ads, avec consentement.
   TANT QUE AW_ID EST VIDE : aucun suivi, aucune bannière, aucun témoin, aucune requête.
   Pour activer : remplir AW_ID (ex. 'AW-1234567890') et les étiquettes ci-dessous. */
(function () {
  'use strict';
  var CONFIG = {
    AW_ID: '',            // Identifiant Google Ads, ex. 'AW-1234567890'
    LABEL_FORM: '',       // Étiquette de conversion « demande de soumission », ex. 'AbCdEfGhIj'
    LABEL_PHONE: ''       // Étiquette de conversion « appel » (facultatif)
  };
  if (!CONFIG.AW_ID) return;

  var KEY = 'od_consent';
  function lire() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function ecrire(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var charge = false;
  function charger() {
    if (charge) return; charge = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'denied' });
    gtag('js', new Date());
    gtag('config', CONFIG.AW_ID);
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CONFIG.AW_ID);
    document.head.appendChild(s);
    conversionConfirmation();
  }
  function conversion(label) {
    if (!charge || !label || !window.gtag) return;
    gtag('event', 'conversion', { send_to: CONFIG.AW_ID + '/' + label });
  }
  function conversionConfirmation() {
    if (!/confirmation(\.html)?$/.test(location.pathname)) return;
    var flag = null; try { flag = sessionStorage.getItem('od_conv'); sessionStorage.removeItem('od_conv'); } catch (e) {}
    if (flag === '1') conversion(CONFIG.LABEL_FORM);
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"]') : null;
    if (a) conversion(CONFIG.LABEL_PHONE);
  });

  function bannière() {
    var b = document.getElementById('od-consent'); if (b) return;
    var st = document.createElement('style');
    st.textContent = '#od-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:640px;margin:auto;background:#000;color:#fff;border-radius:16px;padding:20px 22px;font:14px/1.5 Arial,Helvetica,sans-serif;box-shadow:0 12px 40px #0006}#od-consent p{margin:0 0 14px;color:#e6e8df}#od-consent a{color:#5fae2f;text-decoration:underline}#od-consent .r{display:flex;gap:10px;flex-wrap:wrap}#od-consent button{font:inherit;font-weight:800;min-height:46px;padding:10px 20px;border-radius:9px;border:2px solid #5fae2f;cursor:pointer}#od-consent .ok{background:#5fae2f;color:#000}#od-consent .no{background:transparent;color:#fff}';
    document.head.appendChild(st);
    b = document.createElement('div'); b.id = 'od-consent'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Témoins');
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('Nous aimerions utiliser un témoin de mesure publicitaire (Google Ads) pour savoir si nos annonces mènent à des demandes de soumission. Aucun renseignement du formulaire n’est transmis. '));
    var l = document.createElement('a'); l.href = 'politique-confidentialite.html#temoins'; l.textContent = 'En savoir plus'; p.appendChild(l);
    var r = document.createElement('div'); r.className = 'r';
    var ok = document.createElement('button'); ok.type = 'button'; ok.className = 'ok'; ok.textContent = 'Accepter';
    var no = document.createElement('button'); no.type = 'button'; no.className = 'no'; no.textContent = 'Refuser';
    ok.onclick = function () { ecrire('oui'); b.remove(); charger(); };
    no.onclick = function () { ecrire('non'); b.remove(); };
    r.appendChild(ok); r.appendChild(no); b.appendChild(p); b.appendChild(r); document.body.appendChild(b);
  }

  window.odPreferencesTemoins = function () { try { localStorage.removeItem(KEY); } catch (e) {} bannière(); };
  function init() {
    var c = lire();
    if (c === 'oui') charger(); else if (c !== 'non') bannière();
    var lien = document.getElementById('od-prefs');
    if (lien) lien.addEventListener('click', function (e) { e.preventDefault(); window.odPreferencesTemoins(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
