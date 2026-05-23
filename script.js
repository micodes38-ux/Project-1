/**
 * Spice Village — script.js
 * Extracted & organised from original WordPress theme HTML
 *
 * Covers:
 *  1. Accessibility: Skip-link injection
 *  2. Mobile nav: open / close overlay
 *  3. Mobile nav: keyboard support (Escape key)
 *  4. Mobile nav: focus-trap / focus-out detection
 *  5. Smooth nav state helpers
 */

(function () {
  'use strict';

  /* ============================================================
     1. SKIP-LINK  (mirrors WP's wp-block-template-skip-link JS)
     ============================================================ */
  function initSkipLink() {
    var skipLinkTarget = document.querySelector('main');
    var sibling        = document.querySelector('.wp-site-blocks');

    if (!skipLinkTarget || !sibling) return;

    var id = skipLinkTarget.id || 'wp--skip-link--target';
    skipLinkTarget.id = id;

    var skipLink = document.createElement('a');
    skipLink.classList.add('skip-link', 'screen-reader-text');
    skipLink.id   = 'wp-skip-link';
    skipLink.href = '#' + id;
    skipLink.innerText = 'Skip to content';

    sibling.parentElement.insertBefore(skipLink, sibling);
  }
let slides = document.querySelectorAll(".slide");
let index = 0;

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
}

function nextSlide() {
    index++;
    if (index >= slides.length) {
        index = 0;
    }
    showSlide(index);
}

function prevSlide() {
    index--;
    if (index < 0) {
        index = slides.length - 1;
    }
    showSlide(index);
}

// Auto slide (every 3 seconds)
setInterval(() => {
    nextSlide();
}, 3000);

  /* ============================================================
     2. MOBILE NAVIGATION
     ============================================================ */
  function initMobileNav() {
    var openBtn  = document.querySelector('.nav-toggle');
    var closeBtn = document.querySelector('.nav-close');
    var overlay  = document.getElementById('nav-modal');

    if (!openBtn || !closeBtn || !overlay) return;

    /** Open the mobile overlay */
    function openMenu() {
      overlay.classList.add('is-open');
      overlay.removeAttribute('hidden');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Menu');
      overlay.setAttribute('role', 'dialog');

      // Prevent body scroll while overlay is open
      document.documentElement.classList.add('has-modal-open');

      // Move focus to first focusable element inside overlay
      var firstFocusable = overlay.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) firstFocusable.focus();
    }

    /** Close the mobile overlay */
    function closeMenu() {
      overlay.classList.remove('is-open');
      overlay.removeAttribute('aria-modal');
      overlay.removeAttribute('role');

      document.documentElement.classList.remove('has-modal-open');

      // Return focus to the toggle button
      openBtn.focus();
    }

    openBtn.addEventListener('click',  openMenu);
    closeBtn.addEventListener('click', closeMenu);


    /* --------------------------------------------------------
       3. KEYBOARD SUPPORT
       -------------------------------------------------------- */
    overlay.addEventListener('keydown', function (e) {
      // Escape closes the menu
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeMenu();
        return;
      }

      // Tab — trap focus inside overlay while it's open
      if (e.key === 'Tab' && overlay.classList.contains('is-open')) {
        var focusable = Array.from(overlay.querySelectorAll(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(function (el) {
          return !el.closest('[hidden]');
        });

        if (focusable.length === 0) return;

        var first = focusable[0];
        var last  = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });


    /* --------------------------------------------------------
       4. FOCUS-OUT DETECTION
          Close overlay if focus moves outside it
       -------------------------------------------------------- */
    overlay.addEventListener('focusout', function (e) {
      if (!overlay.classList.contains('is-open')) return;

      // relatedTarget is the element receiving focus next
      var relatedTarget = e.relatedTarget;
      if (!relatedTarget || !overlay.contains(relatedTarget)) {
        // Small delay so click events on links inside overlay fire first
        setTimeout(function () {
          if (overlay.classList.contains('is-open') &&
              document.activeElement &&
              !overlay.contains(document.activeElement)) {
            closeMenu();
          }
        }, 100);
      }
    });


    /* --------------------------------------------------------
       5. CLOSE WHEN A NAV LINK IS CLICKED  (single-page or
          standard navigation — keeps UX clean)
       -------------------------------------------------------- */
    var navLinks = overlay.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }


  /* ============================================================
     6. SEARCH FUNCTIONALITY
     ============================================================ */
  function initSearch() {
    var searchInput = document.querySelector('.search-input');
    var searchBtn = document.querySelector('.search-btn');

    if (!searchInput || !searchBtn) return;

    function performSearch() {
      var query = searchInput.value.trim().toLowerCase();
      if (!query) {
        alert('Please enter a search term');
        return;
      }

      // Navigate to menu page and pass search query
      var menuUrl = 'menu.html';
      if (window.location.pathname.includes('menu.html')) {
        // If already on menu page, filter items
        filterMenuItems(query);
      } else {
        // Navigate to menu with search query
        window.location.href = menuUrl + '?search=' + encodeURIComponent(query);
      }
    }

    // Search on button click
    searchBtn.addEventListener('click', performSearch);

    // Search on Enter key
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  function filterMenuItems(query) {
    var menuItems = document.querySelectorAll('.menu-item');
    var foundCount = 0;

    menuItems.forEach(function (item) {
      var itemName = item.querySelector('h3');
      if (itemName && itemName.textContent.toLowerCase().includes(query)) {
        item.style.display = 'block';
        foundCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (foundCount === 0) {
      alert('No menu items found matching "' + query + '"');
    } else {
      // Scroll to results
      var firstItem = document.querySelector('.menu-item[style="display: block"]');
      if (firstItem) {
        firstItem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }


  /* ============================================================
     7. AUTHENTICATION BUTTONS
     ============================================================ */
  function initAuthButtons() {
    var signInBtn = document.querySelector('.signin-btn');
    var signUpBtn = document.querySelector('.signup-btn');

    if (signInBtn) {
      signInBtn.addEventListener('click', function () {
        // Navigate to dedicated signin page
        window.location.href = 'sign in.html';
      });
    }

    if (signUpBtn) {
      signUpBtn.addEventListener('click', function () {
        // Navigate to dedicated signup page
        window.location.href = 'sign up.html';
      });
    }
  }

  function showAuthModal(action) {
    var modalContent = '';
    
    if (action === 'signin') {
      modalContent = `
        <div class="auth-modal">
          <div class="auth-modal-content">
            <h2>Sign In</h2>
            <form>
              <input type="email" placeholder="Email" required>
              <input type="password" placeholder="Password" required>
              <button type="submit" class="btn btn-outline">Sign In</button>
              <p>Don't have an account? <a href="sign up.html">Create one</a></p>
            </form>
            <button class="modal-close">✕</button>
          </div>
        </div>
      `;
    } else {
      modalContent = `
        <div class="auth-modal">
          <div class="auth-modal-content">
            <h2>Sign Up</h2>
            <form>
              <input type="text" placeholder="Full Name" required>
              <input type="email" placeholder="Email" required>
              <input type="password" placeholder="Password" required>
              <input type="password" placeholder="Confirm Password" required>
              <button type="button" class="btn btn-outline" onclick="window.location.href='sign up.html'">Create Full Account</button>
              <p>Already have an account? <a href="#signin">Sign in</a></p>
            </form>
            <button class="modal-close">✕</button>
          </div>
        </div>
      `;
    }

    // Remove existing modal if any
    var existingModal = document.querySelector('.auth-modal');
    if (existingModal) existingModal.parentElement.remove();

    // Create modal overlay
    var modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = modalContent;

    document.body.appendChild(modalOverlay);

    // Close modal on close button click
    var closeBtn = modalOverlay.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        modalOverlay.remove();
      });
    }

    // Close modal on overlay click (outside modal)
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();
      }
    });
  }


  /* ============================================================
     8. CART FUNCTIONALITY
     ============================================================ */
  /* ============================================================
     8. CART FUNCTIONALITY (full)
     ============================================================ */
  var CART_KEY = 'spicevillage_cart_v1';

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    var cart = getCart();
    var total = cart.reduce(function (s, it) { return s + (it.quantity || 0); }, 0);
    document.querySelectorAll('.cart-count').forEach(function (el) { el.textContent = total; });
  }

  function addToCartItem(item) {
    var cart = getCart();
    var existing = cart.find(function (i) { return i.id === item.id; });
    if (existing) {
      existing.quantity = (existing.quantity || 0) + (item.quantity || 0);
    } else {
      cart.push(item);
    }
    saveCart(cart);
  }

  function updateCartItemQuantity(id, quantity) {
    var cart = getCart();
    var idx = cart.findIndex(function (i) { return i.id === id; });
    if (idx > -1) {
      if (quantity <= 0) cart.splice(idx, 1);
      else cart[idx].quantity = quantity;
      saveCart(cart);
    }
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
  }

  function formatPrice(p) {
    return p + 'PKR';
  }

  function openCartModal() {
    var existing = document.querySelector('.cart-modal-overlay');
    if (existing) return; // already open

    var cart = getCart();
    var overlay = document.createElement('div');
    overlay.className = 'cart-modal-overlay';
    overlay.innerHTML = '<div class="cart-modal"><button class="cart-close">✕</button><h3>Your Cart</h3><div class="cart-items"></div><div class="cart-footer"><div class="cart-total"></div><div class="cart-actions"><button class="btn btn-outline clear-cart">Clear</button><button class="btn btn-primary checkout-btn">Checkout</button></div></div></div>';

    document.body.appendChild(overlay);

    function render() {
      var itemsEl = overlay.querySelector('.cart-items');
      itemsEl.innerHTML = '';
      var totalAmount = 0;
      if (cart.length === 0) {
        itemsEl.innerHTML = '<p>Your cart is empty.</p>';
      } else {
        cart.forEach(function (it) {
          var itemEl = document.createElement('div');
          itemEl.className = 'cart-item';
          var itemTotal = (it.price || 0) * (it.quantity || 0);
          totalAmount += itemTotal;
          itemEl.innerHTML = '<div class="cart-item-info"><strong>' + it.name + '</strong><div class="cart-item-caption">' + (it.caption || '') + '</div></div><div class="cart-item-controls"><div class="cart-price">' + formatPrice(it.price) + '</div><div class="cart-qty"><button class="qty-dec" data-id="' + it.id + '">−</button><input type="number" min="1" value="' + it.quantity + '" data-id="' + it.id + '" class="cart-qty-input"/><button class="qty-inc" data-id="' + it.id + '">+</button></div><button class="remove-item" data-id="' + it.id + '">Remove</button></div>';
          itemsEl.appendChild(itemEl);
        });
      }

      overlay.querySelector('.cart-total').textContent = 'Total: ' + formatPrice(totalAmount);

      // attach events
      itemsEl.querySelectorAll('.qty-inc').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = this.getAttribute('data-id');
          var input = itemsEl.querySelector('.cart-qty-input[data-id="' + id + '"]');
          var val = parseInt(input.value || '0', 10) + 1;
          input.value = val;
          updateCartItemQuantity(id, val);
          cart = getCart(); render();
        });
      });

      itemsEl.querySelectorAll('.qty-dec').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = this.getAttribute('data-id');
          var input = itemsEl.querySelector('.cart-qty-input[data-id="' + id + '"]');
          var val = Math.max(0, parseInt(input.value || '0', 10) - 1);
          if (val === 0) {
            if (!confirm('Remove item from cart?')) return;
          }
          updateCartItemQuantity(id, val);
          cart = getCart(); render();
        });
      });

      itemsEl.querySelectorAll('.cart-qty-input').forEach(function (input) {
        input.addEventListener('change', function () {
          var id = this.getAttribute('data-id');
          var val = parseInt(this.value || '0', 10);
          if (isNaN(val) || val < 1) val = 1;
          updateCartItemQuantity(id, val);
          cart = getCart(); render();
        });
      });

      itemsEl.querySelectorAll('.remove-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = this.getAttribute('data-id');
          if (confirm('Remove item from cart?')) {
            updateCartItemQuantity(id, 0);
            cart = getCart(); render();
          }
        });
      });

      // Clear and Checkout
      overlay.querySelector('.clear-cart').addEventListener('click', function () {
        if (confirm('Clear cart?')) {
          clearCart(); cart = getCart(); render(); overlay.remove();
        }
      });

      overlay.querySelector('.checkout-btn').addEventListener('click', function () {
        if (cart.length === 0) { alert('Cart is empty'); return; }
        // Navigate to the dedicated checkout page (reads cart from localStorage)
        window.location.href = 'checkout.html';
      });
    }

    // Close handlers
    overlay.querySelector('.cart-close').addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });

    render();
  }

  function initCart() {
    // attach add-to-cart buttons on pages where products exist
    document.querySelectorAll('.add-to-cart').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = this.closest('.product-card');
        if (!card) return;
        var id = card.getAttribute('data-id');
        var name = card.getAttribute('data-name') || card.querySelector('.product-name').textContent;
        var price = parseFloat(card.getAttribute('data-price')) || 0;
        var caption = card.getAttribute('data-caption') || '';
        var qtyInput = card.querySelector('.product-qty');
        var qty = qtyInput ? Math.max(1, parseInt(qtyInput.value || '1', 10)) : 1;
        addToCartItem({ id: id, name: name, price: price, quantity: qty, caption: caption });
        // simple feedback
        var original = this.textContent;
        this.textContent = 'Added';
        setTimeout(() => this.textContent = original, 900);
      });
    });

    // attach quantity controls
    document.querySelectorAll('.qty-inc, .qty-dec').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = this.closest('.product-card');
        if (!card) return;
        var input = card.querySelector('.product-qty');
        var val = parseInt(input.value || '1', 10);
        if (this.classList.contains('qty-inc')) val = val + 1; else val = Math.max(1, val - 1);
        input.value = val;
      });
    });

    // cart button opens modal
    var cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) cartBtn.addEventListener('click', openCartModal);

    // update initial count
    updateCartCount();
  }
  function init() {
    initSkipLink();
    initMobileNav();
    initSearch();
    initAuthButtons();
    initCart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());