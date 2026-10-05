(function () {
  const $ = (s) => document.querySelector(s);
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const num = (v) => Math.round(v).toLocaleString("pt-BR");
  const dec = (v) => String(v).replace(".", ",");
  const KEY = "ecomoda-sacola";

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
  let filter = "Todas";
  let shipping = null;

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
  const photo = (p) => `<img src="${p.img}" alt="${p.name}" loading="lazy">`;
  const CATALOG = PRODUCTS.filter((p) => p.img);
  const find = (id) => PRODUCTS.find((p) => p.id === id);

  // Frete simulado por região do CEP (1º dígito). Em produção: API dos Correios/transportadora.
  function calcShipping(cep, subtotal) {
    const d = cep.replace(/\D/g, "");
    if (d.length !== 8) return null;
    if (subtotal >= 400) return 0;
    const table = { 8: 18, 0: 24, 1: 24, 2: 26, 3: 26, 9: 28, 7: 34, 4: 38, 5: 38, 6: 42 };
    return table[d[0]] ?? 30;
  }

  function renderImpactTotals() {
    const kg = CATALOG.reduce((s, p) => s + p.fabricKg, 0), l = CATALOG.reduce((s, p) => s + p.waterL, 0);
    $("#impact").innerHTML = `As ${CATALOG.length} peças da coleção reaproveitaram <b>${dec(kg.toFixed(1))} kg</b> de tecido e pouparam <b>${num(l)} litros</b> de água.`;
    const p = CATALOG[0];
    $("#hero-tag").innerHTML = `<strong>${p.name}</strong><span>Feita por ${p.artisan}</span><span>${dec(p.hours)} h de trabalho · ${dec(p.fabricKg)} kg de tecido salvo</span>`;
  }

  function renderGrid() {
    const list = CATALOG.filter((p) => filter === "Todas" || p.cat === filter);
    $("#grid").innerHTML = list.map((p) => {
      const inCart = cart.includes(p.id);
      return `<article class="card"><img src="${p.img}" alt="${p.name}" loading="lazy" data-detail="${p.id}"><div class="card-body">
        <h3>${p.name}</h3><p class="by">Feita por ${p.artisan}</p>
        <span class="price">${brl(p.price)}</span>
        <div class="row">
          <button data-detail="${p.id}">Ver história</button>
          <button class="add" data-add="${p.id}" ${inCart ? "disabled" : ""}>${inCart ? "Na sacola" : "Adicionar"}</button>
        </div></div></article>`;
    }).join("");
  }

  function renderCart() {
    const items = cart.map(find).filter(Boolean);
    const sub = items.reduce((s, p) => s + p.price, 0);
    shipping = calcShipping($("#cep").value, sub);
    $("#cart-count").textContent = items.length;
    $("#cart-items").innerHTML = items.map((p) =>
      `<li><span>${p.name}<br><span class="small">por ${p.artisan}</span></span><span>${brl(p.price)}<br><button data-remove="${p.id}">remover</button></span></li>`).join("");
    $("#cart-empty").hidden = items.length > 0;
    $("#cart-foot").hidden = items.length === 0;
    $("#sub").textContent = brl(sub);
    $("#ship").textContent = shipping === null ? "informe o CEP" : shipping === 0 ? "grátis" : brl(shipping);
    $("#total").textContent = brl(sub + (shipping || 0));
    const kg = items.reduce((s, p) => s + p.fabricKg, 0), l = items.reduce((s, p) => s + p.waterL, 0);
    $("#cart-impact").textContent = items.length ? `Com esta compra: ${dec(kg.toFixed(1))} kg de tecido reaproveitado e ${num(l)} litros de água poupados. Frete grátis acima de R$ 400.` : "";
    $("#pix").disabled = shipping === null;
    $("#pix-box").hidden = true;
  }

  function openDetail(id) {
    const p = find(id);
    $("#detail").innerHTML = `${photo(p)}<div class="inner"><h3>${p.name}</h3>
      <p>${p.story}</p>
      <dl>
        <dt>Artesã</dt><dd>${p.artisan}</dd>
        <dt>Tempo de produção</dt><dd>${dec(p.hours)} h</dd>
        <dt>Tecido reaproveitado</dt><dd>${dec(p.fabricKg)} kg</dd>
        <dt>Água poupada</dt><dd>${num(p.waterL)} L</dd>
        <dt>CO₂ evitado</dt><dd>${dec(p.co2Kg)} kg</dd>
        <dt>Disponibilidade</dt><dd>1 peça única</dd>
      </dl>
      <p class="small">Sua compra remunera diretamente o trabalho de ${p.artisan}.</p>
      <form method="dialog"><button class="btn full">Fechar</button></form></div>`;
    $("#detail").showModal();
  }

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.dataset.add) { cart.push(+t.dataset.add); save(); renderGrid(); renderCart(); $("#cart").hidden = false; }
    if (t.dataset.remove) { cart = cart.filter((i) => i !== +t.dataset.remove); save(); renderGrid(); renderCart(); }
    if (t.dataset.detail) openDetail(+t.dataset.detail);
    if (t.dataset.cat) {
      filter = t.dataset.cat;
      document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === t));
      renderGrid();
    }
  });

  $("#open-cart").onclick = () => { $("#cart").hidden = false; };
  $("#close-cart").onclick = () => { $("#cart").hidden = true; };
  $("#cep").addEventListener("input", (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 8);
    e.target.value = v.length > 5 ? v.slice(0, 5) + "-" + v.slice(5) : v;
    renderCart();
  });

  $("#pix").onclick = () => {
    const total = cart.map(find).reduce((s, p) => s + p.price, 0) + (shipping || 0);
    // Código fictício. Em produção, o backend geraria o BR Code via API do PSP (chaves em variáveis de ambiente).
    $("#pix-code").value = `00020126ECOMODA-DEMO-${Date.now().toString(36).toUpperCase()}-VALOR-${total.toFixed(2)}`;
    $("#pix-box").hidden = false;
  };
  $("#copy").onclick = async () => {
    try { await navigator.clipboard.writeText($("#pix-code").value); $("#copy").textContent = "Código copiado"; }
    catch (e) { $("#pix-code").select(); }
  };

  renderImpactTotals();
  renderGrid();
  renderCart();
})();
