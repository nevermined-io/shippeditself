(function () {
  "use strict";

  function fmtMoney(cents) {
    var n = Number(cents) / 100;
    return "$" + n.toFixed(4);
  }

  function shortHash(hash) {
    if (!hash) return "—";
    if (hash.length <= 14) return hash;
    return hash.slice(0, 6) + "…" + hash.slice(-4);
  }

  function explorerUrl(chain, hash) {
    if (!hash) return null;
    if (chain === "Base") return "https://basescan.org/tx/" + hash;
    if (chain === "Tempo") return "https://explore.tempo.xyz/receipt/" + hash;
    return null;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function renderReceipt(data) {
    var body = document.getElementById("receipt-body");
    body.innerHTML = "";

    var rows = (data && data.rows) || [];
    if (!rows.length) {
      var tr = document.createElement("tr");
      var td = el("td", "receipt-empty", "No settled payments yet.");
      td.colSpan = 6;
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }

    rows.forEach(function (r) {
      var tr = document.createElement("tr");

      var tdM = el("td", null, r.merchant);
      tdM.title = r.merchant;
      tr.appendChild(tdM);

      var tdReq = el("td", null, r.requestId);
      tdReq.title = r.requestId;
      tr.appendChild(tdReq);

      var tdA = el("td", "num", fmtMoney(r.amountCents));
      tr.appendChild(tdA);

      var tdF = el("td", "num", fmtMoney(r.feeCents));
      tr.appendChild(tdF);

      var tdS = document.createElement("td");
      var pill = el("span", "status-pill", r.status);
      tdS.appendChild(pill);
      tr.appendChild(tdS);

      var tdT = document.createElement("td");
      var url = explorerUrl(r.chain, r.txHash);
      var label = shortHash(r.txHash) + (r.chain ? " (" + r.chain + ")" : "");
      if (url) {
        var a = el("a", null, label);
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
        a.title = r.txHash;
        tdT.appendChild(a);
      } else {
        tdT.textContent = label;
        tdT.title = r.txHash || "";
      }
      tr.appendChild(tdT);

      body.appendChild(tr);
    });

    if (data.totals) {
      var t = data.totals;
      var totalsRow = document.createElement("tr");
      totalsRow.className = "totals";

      var c0 = el("td", "totals-label", t.count + " payments · " + t.vendors + " vendors");
      c0.colSpan = 2;
      totalsRow.appendChild(c0);
      totalsRow.appendChild(el("td", "num", fmtMoney(t.amountCents)));
      totalsRow.appendChild(el("td", "num", fmtMoney(t.feeCents)));
      totalsRow.appendChild(el("td", null, "all Settled"));
      totalsRow.appendChild(el("td", null, (t.chains || []).join(", ")));

      body.appendChild(totalsRow);
    }

    if (data.stats) {
      var s = data.stats;
      var setText = function (id, val) {
        var node = document.getElementById(id);
        if (node) node.textContent = val;
      };
      if (s.capCents != null) setText("stat-cap", fmtMoney(s.capCents));
      if (s.spentCents != null) setText("stat-spend", fmtMoney(s.spentCents));
      if (data.totals) {
        setText("stat-payments", String(data.totals.count));
        setText("stat-vendors", String(data.totals.vendors));
        setText("stat-chains", (data.totals.chains || []).join(" + "));
      }
    }
  }

  fetch("receipt.json", { cache: "no-store" })
    .then(function (res) { return res.json(); })
    .then(renderReceipt)
    .catch(function () {
      var body = document.getElementById("receipt-body");
      if (body) body.innerHTML = '<tr><td colspan="6" class="receipt-empty">Receipt unavailable.</td></tr>';
    });
})();
