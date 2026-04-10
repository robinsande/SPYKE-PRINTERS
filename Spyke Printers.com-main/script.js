// --- GLOBAL SETTINGS ---
const PHONE_NUMBER = "+254 711 583 416"; // Format without the +

// --- PRICES DATABASE ---
const PRICES = {
    cards: { base: 14, spotuv: 10, folded: 20 },
    flyers: { a4: 35, a5: 15, a6: 10 },
    banners: {
        rollup: 6000, xbanner: 5800, doorframe: 7500,
        backdrop: 27000, teardrop: 15400
    },
    stickers: { vinyl: 1380, reflective: 1800, magnet: 1150 },
    mugs: { standard: 500, magic: 800, travel: 1050, bottle: 750 },
    apparel: { tshirt: 580, hoodie: 1500, polo: 800 },
    stationery: { receipt: 500, calendar: 90, invoice: 500 },
    stamps: { rubber: 1500, self: 2500, dater: 3500, seal: 5500 }, // New
    branding: { full: 45000, partial: 25000, tint: 8000 } // New
};

// --- IMAGE MAP (For Dynamic Switching) ---
const IMAGE_MAP = {
    // Apparel
    'tshirt': 'images/apparel.jpg',
    'hoodie': 'images/apparel-hoodie.jpg',
    'polo': 'images/apparel-polo.jpg',
    // Mugs
    'standard': 'images/mugs-white.jpg',
    'magic': 'images/mugs-magic.jpg',
    'travel': 'images/mugs-travel.jpg',
    'bottle': 'images/mugs-bottle.jpg',
    // Stamps
    'rubber': 'images/stamp-rubber.jpg',
    'self': 'images/stamp-self.jpg',
    'dater': 'images/stamp-dater.jpg',
    'seal': 'images/stamp-seal.jpg',
    // Branding
    'full': 'images/car-full.jpg',
    'partial': 'images/car-partial.jpg',
    'tint': 'images/car-tint.jpg'
};



// --- HELPER FUNCTIONS ---
const formatMoney = (amount) => {
    return "KES " + amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const updateDisplay = (id, amount) => {
    const el = document.getElementById(id);
    if (el) el.innerText = formatMoney(amount);
};

const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value : null;
};

const getLabel = (id) => {
    const el = document.getElementById(id);
    if (!el) return "";
    return el.options[el.selectedIndex].text;
};

// --- CORE FEATURES ---

// 1. Dynamic Image Loader
function changeImage(selectElement) {
    const val = selectElement.value;
    const imgEl = document.querySelector('.product-image img');

    if (imgEl && IMAGE_MAP[val]) {
        // Simple fade effect
        imgEl.style.opacity = '0.5';
        setTimeout(() => {
            imgEl.src = IMAGE_MAP[val];
            imgEl.style.opacity = '1';
        }, 200);
    }
}




    msg += `------------------\n*Grand Total:* ${formatMoney(grandTotal)}`;

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');


// --- UI RENDERING ---

function renderCartModal() {
    // Create Modal HTML if not exists
    if (!document.querySelector('.cart-overlay')) {
        const modal = document.createElement('div');
        modal.className = 'cart-overlay';
        modal.innerHTML = `
            <div class="cart-modal">
                <div class="cart-header">
                    <h3>Your Shopping Bag</h3>
                    <button class="close-cart" onclick="toggleCartModal(false)">×</button>
                </div>
                <div class="cart-items" id="cart-items-container">
                    <!-- Items go here -->
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Total</span>
                        <span id="cart-grand-total">KES 0.00</span>
                    </div>
                    <button class="checkout-btn" onclick="checkout()">Checkout via WhatsApp</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) toggleCartModal(false);
        });
    }

    // Create Floating Button if not exists
    if (!document.querySelector('.floating-cart')) {
        const btn = document.createElement('div');
        btn.className = 'floating-cart';
        btn.innerHTML = `🛒 <span class="cart-count">0</span>`;
        btn.onclick = () => toggleCartModal(true);
        document.body.appendChild(btn);
    }
}

function renderCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-grand-total');
    if (!container) return;

    container.innerHTML = '';
    let grandTotal = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:gray;">Cart is empty</p>';
    } else {
        cart.forEach(item => {
            grandTotal += item.price;
            const div = document.createElement('div');
            div.className = 'cart-item';

            // Format details for display
            let detailsStr = Object.values(item.details).join(', ');

            div.innerHTML = `
                <div class="cart-item-info">
                    <h5>${item.category}</h5>
                    <p>${detailsStr}</p>
                    <small style="color:var(--accent-gold)">${formatMoney(item.price)}</small>
                </div>
                <button class="cart-remove" onclick="removeFromCart(${item.id})">🗑</button>
            `;
            container.appendChild(div);
        });
    }

    if (totalEl) totalEl.innerText = formatMoney(grandTotal);
    updateCartCount();
}

function toggleCartModal(show) {
    const modal = document.querySelector('.cart-overlay');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
        if (show) {
            modal.classList.add('active');
            renderCartUI(); // Refresh on open
        } else {
            modal.classList.remove('active');
        }
    }
}


// --- CALCULATOR FUNCTIONS ---
function calculateTotal() {
  // 1. Get the values from the page
  const unitPrice = parseFloat(document.getElementById('unit-price').innerText);
  const quantity = parseInt(document.getElementById('qty').value);
  
  // 2. Perform the calculation
  const total = unitPrice * quantity;
  
  // 3. Display the result, formatted to 2 decimal places
  document.getElementById('total-display').innerText = total.toFixed(2);
}

function calcCards() {
    const qty = parseInt(getVal('c-qty')) || 100;
    const type = getVal('c-type');
    const sides = getVal('c-sides');

    let base = PRICES.cards[type] || 14;
    if (sides === 'double') base += 5;

    updateDisplay('c-total', base * qty);
}

function calcFlyers() {
    const qty = parseInt(getVal('f-qty')) || 1000;
    const type = getVal('f-size');
    let unit = PRICES.flyers[type] || 0;
    updateDisplay('f-total', unit * qty);
}

function calcBanners() {
    const qty = parseInt(getVal('b-qty')) || 1;
    const type = getVal('b-type');
    let unit = PRICES.banners[type] || 0;
    updateDisplay('b-total', unit * qty);
}

function calcStickers() {
    const qty = parseInt(getVal('s-qty')) || 1;
    const type = getVal('s-type');
    let unit = PRICES.stickers[type] || 0;
    updateDisplay('s-total', unit * qty);
}

function calcMugs() {
    const qty = parseInt(getVal('m-qty')) || 1;
    const type = getVal('m-type');
    let unit = PRICES.mugs[type] || 0;
    updateDisplay('m-total', unit * qty);
}

function calcApparel() {
    const qty = parseInt(getVal('a-qty')) || 1;
    const type = getVal('a-type');
    let unit = PRICES.apparel[type] || 0;
    updateDisplay('a-total', unit * qty);
}

function calcStationery() {
    const qty = parseInt(getVal('st-qty')) || 1;
    const type = getVal('st-type');
    let unit = PRICES.stationery[type] || 0;
    updateDisplay('st-total', unit * qty);
}

// New
function calcStamps() {
    const qty = parseInt(getVal('st-qty')) || 1;
    const type = getVal('st-type');
    let unit = PRICES.stamps[type] || 0;
    updateDisplay('st-total', unit * qty);
}

// New
function calcBranding() {
    const qty = parseInt(getVal('br-qty')) || 1;
    const type = getVal('br-type');
    let unit = PRICES.branding[type] || 0;
    updateDisplay('br-total', unit * qty);
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {

    // 1. Render Cart UI Containers
    renderCartModal();
    updateCartCount();

    // 2. Mobile Menu
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => nav.classList.toggle('active'));
    }

    // 3. Attach Events with Cart support
    const setupForm = (formId, calcFunc, displayId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        // Math listeners
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                calcFunc();
                // Dynamic Image Check
                if (input.tagName === 'SELECT') changeImage(input);
            });
            input.addEventListener('input', calcFunc);
        });

        // Initial Calc
        calcFunc();

        // Add to Cart Button override
        const btn = form.querySelector('.add-cart-btn');
        if (btn) {
            // Remove old listeners to be safe (though this is fresh load)
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.innerText = "Add to Cart +";
            newBtn.addEventListener('click', () => {
                // Collect specific details for each form
                let details = {};
                // Simple scraper: get keys from labels and values from inputs
                inputs.forEach(inp => {
                    const label = form.querySelector(`label[for="${inp.id}"]`);
                    let key = label ? label.innerText : inp.id;
                    let val = inp.tagName === 'SELECT' ? inp.options[inp.selectedIndex].text : inp.value;
                    details[key] = val;
                });

                // Get Category from Title or manually map
                const category = document.title.split('-')[0].trim();

                addToCart(category, displayId, details);
            });
        }
    };

    // --- SETUP FORMS ---
    setupForm('card-form', calcCards, 'c-total');
    setupForm('flyer-form', calcFlyers, 'f-total');
    setupForm('banner-form', calcBanners, 'b-total');
    setupForm('sticker-form', calcStickers, 's-total');
    setupForm('mug-form', calcMugs, 'm-total');
    setupForm('apparel-form', calcApparel, 'a-total');
    setupForm('stat-form', calcStationery, 'st-total');

    // New Pages
    setupForm('stamp-form', calcStamps, 'st-total');
    setupForm('branding-form', calcBranding, 'br-total');

    // 4. Initialize Search
    initSearch();
});


// --- SEARCH FUNCTIONALITY ---
const SEARCH_INDEX = [
    { title: "Business Cards", url: "business-cards.html", keys: "cards, visiting, contact, premium, matte" },
    { title: "Flyers & Marketing", url: "flyers.html", keys: "pamphlet, brochure, a4, a5, a6" },
    { title: "Rubber Stamps", url: "stamps.html", keys: "seal, self inking, dater, official, rubber" },
    { title: "Vehicle Branding", url: "car-branding.html", keys: "car, wrap, tint, sticker, partial, fleet" },
    { title: "Apparel & Uniforms", url: "apparel.html", keys: "shirt, hoodie, polo, clothing, embroidery" },
    { title: "Banners & Signage", url: "banners.html", keys: "rollup, xstand, backdrop, teardrop, display" },
    { title: "Stickers & Labels", url: "stickers.html", keys: "vinyl, decal, magnetic, packaging" },
    { title: "Stationery", url: "stationery.html", keys: "invoice, calendar, receipt book, office" },
    { title: "Merch (Mugs/Bottles)", url: "mugs.html", keys: "cup, bottle, travel, magic, gift" }
];

function initSearch() {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    // Create Search HTML
    const searchDiv = document.createElement('div');
    searchDiv.className = 'search-container';
    searchDiv.innerHTML = `
        <span class="search-icon">🔍</span>
        <input type="text" class="search-input" placeholder="Search products..." id="site-search">
        <div class="search-results" id="search-results"></div>
    `;

    // Insert before the Mobile Toggle Button (or as appropriate in nav)
    // We want it visible on Desktop, so putting it before nav works well
    const mobileBtn = document.getElementById('mobile-menu-btn');
    navContainer.insertBefore(searchDiv, mobileBtn);

    // Event Listeners
    const input = document.getElementById('site-search');
    const resultsDiv = document.getElementById('search-results');

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        resultsDiv.innerHTML = '';

        if (query.length < 2) {
            resultsDiv.classList.remove('active');
            return;
        }

        const matches = SEARCH_INDEX.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.keys.includes(query)
        );

        if (matches.length > 0) {
            matches.forEach(match => {
                const div = document.createElement('div');
                div.className = 'search-item';
                div.innerHTML = `<span>${match.title}</span>`;
                div.onclick = () => window.location.href = match.url;
                resultsDiv.appendChild(div);
            });
            resultsDiv.classList.add('active');
        } else {
            const div = document.createElement('div');
            div.className = 'search-item';
            div.style.cursor = 'default';
            div.innerText = 'No results found.';
            resultsDiv.appendChild(div);
            resultsDiv.classList.add('active');
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!searchDiv.contains(e.target)) {
            resultsDiv.classList.remove('active');
        }
    });
}
