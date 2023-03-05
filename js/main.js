"use strict";

const PRODUCTS = [
  {
    product_name: "WD 4TB Drive",
    product_price: "114",
    product_image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
    added_to_cart: false,
  },
  {
    product_name: "Acer SB220Q 21.5",
    product_price: "599",
    product_image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    added_to_cart: false,
  },
  {
    product_name: "Samsung 49-Inch",
    product_price: "999.99",
    product_image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
    added_to_cart: false,
  },
  {
    product_name: "BIYLACLESEN",
    product_price: "56.99",
    product_image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    added_to_cart: false,
  },
  {
    product_name: "Lock and Love",
    product_price: "29.95",
    product_image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
    added_to_cart: false,
  },
  {
    product_name: "Rain Jacket",
    product_price: "39.99",
    product_image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
    added_to_cart: false,
  },
];

updateProducts(PRODUCTS);

function updateProducts(items) {
  const localCart = localStorage.getItem("cart");
  if (localCart) {
    const cartItems = JSON.parse(localCart);
    renderData(cartItems);
  } else {
    localStorage.setItem("cart", JSON.stringify(items));
    renderData(items);
  }
}
function renderData(data) {
  let prodList = "";
  let navList = "";
  let cartLenght = 0;

  data.forEach((product) => {
    prodList += `
      <div class="col-4">
        <div class="product-card">
          <img
            src=${product.product_image}
            alt="product-image"
          /> 
          <div class="product-details">
            <h3 class="product-name">${product.product_name}</h3>
            <p class="price">${product.product_price}$</p>
            <div class="controls">
              <button type="button" class="cart-add" 
              onclick="productControls('${product.product_name}', '${
      !product.added_to_cart ? "add" : "remove"
    }')">${!product.added_to_cart ? "Add To Cart" : "Remove"}</button>
              <button type="button" class="quick-view"onclick="handleView('${
                product.product_name
              }')">Quick View</button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (product.added_to_cart) {
      cartLenght += 1;
      navList += `
      <div class="dropdown-item">
        <h4 class="product-name">${product.product_name}</h4>
        <p class="price">${product.product_price}$</p>
      </div>
    `;
    }
  });

  document.querySelector(
    ".products-wrapper"
  ).innerHTML = `<div class="row">${prodList}</div>`;
  document.querySelector(".dropdown-content").innerHTML = navList;
  document.querySelector(".cart-indicator").textContent = cartLenght;
}

// adding / removing from cart
function productControls(PName, type) {
  const cartData = JSON.parse(localStorage.getItem("cart"));
  cartData.filter((item) => item.product_name === PName)[0]["added_to_cart"] =
    type === "add" ? true : false;

  localStorage.setItem("cart", JSON.stringify(cartData));

  handleNotifs(PName, type);
  updateProducts();
}

// handle Popup
const popupTemplate = (cartItem) => `
    <div class="popup-wrap">
      <img
        class="popup-img"
        src=${cartItem.product_image}
        alt="product-image"
      />

      <div class="details">
        <h3 class="product-name">${cartItem.product_name}</h3>
        <p class="price">${cartItem.product_price}$</p>
        <div class="controls">
        <button class="cart-add mb-1"
          onclick="productControls('${cartItem.product_name}', '${
  !cartItem.added_to_cart ? "add" : "remove"
}'); handleView('${cartItem.product_name}')">
            ${!cartItem.added_to_cart ? "Add To Cart" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  `;
function handleView(PName) {
  const cartData = JSON.parse(localStorage.getItem("cart"));
  const cartItem = cartData.filter((item) => item.product_name === PName)[0];

  // when creating
  if (!document.querySelector(".popup")) {
    let overlay = document.createElement("div");
    overlay.className = "popup-over";
    document.body.appendChild(overlay);

    // create popup
    let popBox = document.createElement("div");
    popBox.className = "popup";

    let close = document.createElement("span");
    let x = document.createTextNode("x");

    close.appendChild(x);
    close.className = "close";
    popBox.appendChild(close);

    popBox.insertAdjacentHTML("beforeend", `${popupTemplate(cartItem)}`);
    document.body.appendChild(popBox);
  } else {
    // when updating
    document.querySelector(".popup-wrap").innerHTML = popupTemplate(cartItem);
  }
}

/* toggle between hiding and showing the dropdown content */
document.querySelector(".dropbtn").addEventListener("click", function (e) {
  e.stopPropagation();
  document.getElementById("myDropdown").classList.toggle("show");
});

// close the popup / dropdown
document.addEventListener("click", function (e) {
  if (e.target.className === "close") {
    e.target.parentElement.remove();
    document.querySelector(".popup-over").remove();
  } else if (e.target.className === "popup-over") {
    document.querySelector(".popup").remove();
    e.target.remove();
  } else if (!e.target.matches(".dropdown *")) {
    document.getElementById("myDropdown").classList.remove("show");
  }
});

// show notification for user after operations
function handleNotifs(PName, type) {
  let message = `${PName} was ${
    type === "add" ? "added" : "removed"
  } to the cart`;
  let notification = document.getElementById("notification");
  notification.innerHTML = message;
  if (!notification.classList.contains("message")) {
    notification.classList.add("message");
  }
}
