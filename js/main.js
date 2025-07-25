
// Cart state
let cart = [];
let cartTotal = 0;

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    document.getElementById(sectionId).classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
}

// Add event listeners to nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href').substring(1);
        showSection(target);
    });
});

// Quantity controls
function changeQuantity(button, change) {
    const quantitySpan = button.parentElement.querySelector('.quantity');
    let currentQuantity = parseInt(quantitySpan.textContent);

    currentQuantity = Math.max(1, currentQuantity + change);
    quantitySpan.textContent = currentQuantity;
}

// Add to cart functionality
function addToCart(name, price, emoji) {
    const quantityElement = event.target.parentElement.querySelector('.quantity');
    const quantity = parseInt(quantityElement.textContent);

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: name,
            price: price,
            emoji: emoji,
            quantity: quantity,
            id: Date.now()
        });
    }

    updateCartDisplay();
    showToast(`${name} added to cart!`, 'success');

    // Reset quantity to 1
    quantityElement.textContent = '1';
}

// Remove from cart
function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        updateCartDisplay();
        showToast(`${itemName} removed from cart`, 'error');
    }
}

// Update cart item quantity
function updateCartQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        updateCartDisplay();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountElement = document.getElementById('cartCount');
    const cartTotalElement = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    cartCountElement.classList.toggle('show', totalItems > 0);

    // Calculate total
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.innerHTML = `Total: ${cartTotal.toFixed(2)}`;

    // Update cart items display
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; margin-top: 2rem;">Your cart is empty</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">${item.emoji}</div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${item.price.toFixed(2)}</div>
                            <div class="cart-item-controls">
                                <div class="quantity-controls">
                                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                                </div>
                                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                            </div>
                        </div>
                    </div>
                `).join('');
    }
}

// Toggle cart drawer
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Add or remove 'active' class
        mobileMenu.classList.toggle('open'); // Optional: for animated icon
    });
});


// Toast notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Mobile menu functionality
document.querySelector('.mobile-menu').addEventListener('click', function () {
    const navLinks = document.querySelector('.nav-links');
    const spans = this.querySelectorAll('span');

    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';

    spans.forEach((span, index) => {
        if (navLinks.style.display === 'flex') {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
});

// Smooth scrolling and page load animations
document.addEventListener('DOMContentLoaded', function () {
    // Add loading animation to cards
    const cards = document.querySelectorAll('.brand-card, .product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.brand-card, .product-card').forEach(card => {
    observer.observe(card);
});

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
        opacity: 0;
    transform: translateY(30px);
                }
    to {
        opacity: 1;
    transform: translateY(0);
                }
            }
    `;
document.head.appendChild(style);

// Add keyboard navigation
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const cartDrawer = document.querySelector('.cart-drawer');
        if (cartDrawer.classList.contains('open')) {
            toggleCart();
        }
    }
});

// Add hover sound effect simulation (visual feedback)
document.querySelectorAll('.cta-button, .add-to-cart, .quantity-btn').forEach(button => {
    button.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05)';
    });

    button.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
});

// Initialize cart display
updateCartDisplay();
