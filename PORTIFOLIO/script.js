
/* =====================================================
   APETITOSO SABOR — script.js
   1. Dados do cardápio
   2. Elementos da página
   3. Aviso (toast)
   4. Cardápio e carrinho
   5. Contador de números
   ===================================================== */


/* ---------- 1. DADOS DO CARDÁPIO ---------- */
// Para adicionar um prato, copie uma linha e mude os valores.
// category: "grelha" | "lanche" | "doce"
const menuItems = [
  { emoji: "🐟", name: "Peixe grelhado",      desc: "Filé suculento com molho de pimentões e ervas frescas.",   price: "R$ 54,90", category: "grelha" },
  { emoji: "🍗", name: "Frango crocante",     desc: "Coxas douradas com tempero da casa e limão.",              price: "R$ 39,90", category: "grelha" },
  { emoji: "🥩", name: "Picanha na brasa",    desc: "Fatias macias, ponto da sua escolha, com farofa.",         price: "R$ 69,90", category: "grelha" },
  { emoji: "🍔", name: "Hambúrguer clássico", desc: "Blend artesanal, queijo derretido e molho especial.",      price: "R$ 29,90", category: "lanche" },
  { emoji: "🍕", name: "Pizza margherita",    desc: "Tomate fresco, muçarela e manjericão no forno a lenha.",   price: "R$ 44,90", category: "lanche" },
  { emoji: "🍟", name: "Batata frita",        desc: "Crocante por fora, macia por dentro, com cheddar.",        price: "R$ 19,90", category: "lanche" },
  { emoji: "🥗", name: "Salada colorida",     desc: "Folhas, tomate, pimentão e molho cítrico.",                price: "R$ 24,90", category: "grelha" },
  { emoji: "🥤", name: "Shake de chocolate",  desc: "Cremoso, com calda e chantilly por cima.",                 price: "R$ 22,90", category: "doce"   }
];


/* ---------- 2. ELEMENTOS DA PÁGINA ---------- */
const menuGrid  = document.getElementById("menu-grid");
const tabs      = document.getElementById("tabs");
const cartBtn   = document.getElementById("cart");
const cartCount = document.getElementById("cart-count");
const toast     = document.getElementById("toast");

let cartTotal = 0;
let toastTimer;


/* ---------- 3. AVISO (TOAST) ---------- */
function showToast(message, duration = 2200) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), duration);
}


/* ---------- 4. CARDÁPIO E CARRINHO ---------- */
function createCard(item, index) {
  const card = document.createElement("article");
  card.className = "card";
  card.style.animationDelay = `${index * 70}ms`;

  card.innerHTML = `
    <div class="card__pic-wrap"><div class="card__pic">${item.emoji}</div></div>
    <div class="card__body">
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <div class="card__row">
        <span class="price">${item.price}</span>
        <button class="add">Adicionar</button>
      </div>
    </div>`;

  const button = card.querySelector(".add");
  button.addEventListener("click", () => addToCart(button, item.name));
  return card;
}

function renderMenu(category) {
  menuGrid.innerHTML = "";
  menuItems
    .filter(item => category === "all" || item.category === category)
    .forEach((item, index) => menuGrid.appendChild(createCard(item, index)));
}

function addToCart(button, itemName) {
  cartTotal++;
  cartCount.textContent = cartTotal;

  // reinicia a animação do contador
  cartBtn.classList.remove("pop");
  void cartBtn.offsetWidth;
  cartBtn.classList.add("pop");

  // feedback no botão
  button.classList.add("ok");
  button.textContent = "Adicionado";
  setTimeout(() => {
    button.classList.remove("ok");
    button.textContent = "Adicionar";
  }, 1200);

  showToast(`${itemName} adicionado. Chame no WhatsApp para finalizar.`);
}

// Filtros
tabs.addEventListener("click", event => {
  const selected = event.target.closest("button");
  if (!selected) return;

  [...tabs.children].forEach(tab => tab.setAttribute("aria-pressed", tab === selected));
  renderMenu(selected.dataset.category);
});

// Clique no carrinho
cartBtn.addEventListener("click", () => {
  const message = cartTotal
    ? `${cartTotal} item(ns) no carrinho. Chame no WhatsApp para finalizar.`
    : "Carrinho vazio. Escolha um prato.";
  showToast(message, 2400);
});

renderMenu("all");


/* ---------- 5. CONTADOR DE NÚMEROS ---------- */
// Os números da seção "Sobre" sobem de 0 até o valor ao aparecerem na tela.
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    counterObserver.unobserve(entry.target);

    const target = Number(entry.target.dataset.countTo);
    let value = 0;

    const timer = setInterval(() => {
      value += Math.ceil(target / 30);
      if (value >= target) {
        value = target;
        clearInterval(timer);
      }
      entry.target.textContent = value;
    }, 35);
  });
}, { threshold: 0.6 });

document.querySelectorAll("[data-count-to]").forEach(el => counterObserver.observe(el));