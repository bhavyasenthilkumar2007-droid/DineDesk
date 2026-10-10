
const foods = [
    {
        id: 1,
        name: "Burger",
        price: 120,
        emoji: "🍔",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        id: 2,
        name: "Pizza",
        price: 250,
        emoji: "🍕",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
    },
    {
        id: 3,
        name: "Pasta",
        price: 180,
        emoji: "🍝",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500"
    },
    {
        id: 4,
        name: "Fries",
        price: 90,
        emoji: "🍟",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"
    },
    {
        id: 5,
        name: "Cake",
        price: 150,
        emoji: "🍰",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"
    },
    {
        id: 6,
        name: "Salad",
        price: 110,
        emoji: "🥗",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500"
    }
];

let cart = [];

// DISPLAY FOOD MENU
function displayFoods(foodList = foods) {
    const container = document.getElementById("food-container");

    if (!container) {
        console.error("food-container not found in index.html");
        return;
    }

    container.innerHTML = "";

    if (foodList.length === 0) {
        container.textContent = "No food items found.";
        return;
    }

    foodList.forEach(function(food) {
        const card = document.createElement("div");
        card.className = "food-card";

        const image = document.createElement("img");
        image.className = "food-image";
        image.src = food.image;
        image.alt = food.name;
        image.loading = "lazy";

        image.onerror = function() {
            image.style.display = "none";
        };

        const name = document.createElement("h3");
        name.textContent = food.name;

        const price = document.createElement("p");
        price.textContent = "₹" + food.price;

        const button = document.createElement("button");
        button.className = "btn";
        button.textContent = "Add to Cart";

        button.addEventListener("click", function() {
            addToCart(food.id);
        });

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(button);

        container.appendChild(card);
    });
}

// ADD FOOD TO CART
function addToCart(id) {
    const food = foods.find(function(item) {
        return item.id === id;
    });

    if (!food) return;

    const existing = cart.find(function(item) {
        return item.id === id;
    });

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: food.id,
            name: food.name,
            price: food.price,
            emoji: food.emoji,
            quantity: 1
        });
    }

    updateCart();
}

// REMOVE FOOD FROM CART
function removeItem(id) {
    cart = cart.filter(function(item) {
        return item.id !== id;
    });

    updateCart();
}

// UPDATE CART AND TOTAL
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const totalElement = document.getElementById("total");

    if (!cartItems || !cartCount || !totalElement) {
        console.error("Cart elements not found in index.html");
        return;
    }

    let count = 0;
    let total = 0;

    cart.forEach(function(item) {
        count += item.quantity;
        total += item.price * item.quantity;
    });

    cartCount.textContent = count;
    totalElement.textContent = total;
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
        return;
    }

    cart.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "cart-item";

        const itemName = document.createElement("span");
        itemName.textContent =
            item.emoji + " " + item.name + " x " + item.quantity;

        const itemPrice = document.createElement("span");
        itemPrice.textContent = "₹" + (item.price * item.quantity);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function() {
            removeItem(item.id);
        });

        row.appendChild(itemName);
        row.appendChild(itemPrice);
        row.appendChild(removeButton);

        cartItems.appendChild(row);
    });
}

// OPEN CHECKOUT
function placeOrder() {
    const message = document.getElementById("order-message");

    if (cart.length === 0) {
        message.textContent =
            "Please add food items to your cart first!";
        return;
    }

    document.getElementById("payment-total").textContent =
        cart.reduce(function(sum, item) {
            return sum + item.price * item.quantity;
        }, 0);

    document.getElementById("payment-message").textContent = "";
    document.getElementById("payment").style.display = "block";

    document.getElementById("payment").scrollIntoView({
        behavior: "smooth"
    });
}

// SHOW/HIDE PAYMENT FIELDS
function updatePaymentFields() {
    const selectedMethod = document.querySelector(
        'input[name="payment-method"]:checked'
    );

    if (!selectedMethod) return;

    const method = selectedMethod.value;

    document.getElementById("upi-fields").style.display =
        method === "UPI" ? "block" : "none";

    document.getElementById("card-fields").style.display =
        method === "Card" ? "block" : "none";
}

// PAYMENT METHOD CHANGE
document.querySelectorAll('input[name="payment-method"]').forEach(
    function(input) {
        input.addEventListener("change", updatePaymentFields);
    }
);

// CANCEL CHECKOUT
document.getElementById("cancel-payment").addEventListener(
    "click",
    function() {
        document.getElementById("payment").style.display = "none";

        document.getElementById("order-message").textContent =
            "Checkout cancelled. Your cart items are still saved.";
    }
);

// PROCESS DEMO PAYMENT
document.getElementById("payment-form").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const selectedMethod = document.querySelector(
            'input[name="payment-method"]:checked'
        );

        if (!selectedMethod) return;

        const method = selectedMethod.value;
        const message = document.getElementById("payment-message");

        if (method === "UPI") {
            const upi = document.getElementById("upi-id").value.trim();

            if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upi)) {
                message.textContent =
                    "Enter a demo UPI ID, for example test@upi.";
                return;
            }
        }

        if (method === "Card") {
            const name =
                document.getElementById("card-name").value.trim();

            const number =
                document.getElementById("card-number").value
                    .replace(/\s/g, "");

            const expiry =
                document.getElementById("card-expiry").value.trim();

            const cvv =
                document.getElementById("card-cvv").value.trim();

            if (
                !name ||
                !/^\d{16}$/.test(number) ||
                !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) ||
                !/^\d{3}$/.test(cvv)
            ) {
                message.textContent =
                    "Enter valid demo card details to continue.";
                return;
            }
        }

        const orderId = "DD" + Date.now().toString().slice(-6);

        const total = cart.reduce(function(sum, item) {
            return sum + item.price * item.quantity;
        }, 0);

        const methodName =
            method === "COD"
                ? "Cash on Delivery"
                : method === "UPI"
                    ? "UPI (Demo)"
                    : "Card (Demo)";

        document.getElementById("success-order-id").textContent = orderId;
        document.getElementById("success-total").textContent = total;
        document.getElementById("success-method").textContent = methodName;

        document.getElementById("payment").style.display = "none";

        const successCard = document.getElementById("success-card");
        successCard.style.display = "block";

        successCard.scrollIntoView({
            behavior: "smooth"
        });

        message.textContent =
            "Demo order confirmed. No real payment was made.";

        document.getElementById("order-message").textContent =
            "Your order " + orderId + " has been confirmed.";

        cart = [];
        updateCart();

        this.reset();
        updatePaymentFields();
    }
);

// CLOSE SUCCESS CARD
function closeSuccessCard() {
    document.getElementById("success-card").style.display = "none";
}

// FOOD SEARCH
const foodSearch = document.getElementById("food-search");

if (foodSearch) {
    foodSearch.addEventListener("input", function() {
        const searchText = foodSearch.value.toLowerCase().trim();

        const filteredFoods = foods.filter(function(food) {
            return food.name.toLowerCase().includes(searchText);
        });

        displayFoods(filteredFoods);
    });
}

// TABLE RESERVATION
function setupReservation() {
    const form = document.getElementById("reservation-form");

    if (!form) {
        console.error("Reservation form not found in index.html");
        return;
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const name =
            document.getElementById("customer-name").value.trim();

        const date =
            document.getElementById("booking-date").value;

        const time =
            document.getElementById("booking-time").value;

        const guests =
            Number(document.getElementById("guests").value);

        const message =
            document.getElementById("reservation-message");

        if (new Date(date + "T" + time) <= new Date()) {
            message.textContent =
                "Please select a future date and time.";
            return;
        }

        message.textContent =
            "Thank you, " + name +
            "! Demo reservation received for " +
            guests + " guest(s).";

        form.reset();
    });
}

// INITIALIZE WEBSITE
displayFoods();
updateCart();
updatePaymentFields();
setupReservation();
