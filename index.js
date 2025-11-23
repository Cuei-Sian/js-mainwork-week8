// 請代入自己的網址路徑
const api_path = "doreenwang";
const token = "ncdwG72ozxZp8FePLHdpiZq3muC3";
const baseUrl = "https://livejs-api.hexschool.io";
const costomerApi = `${baseUrl}/api/livejs/v1/customer/${api_path}`;

//將get取得商品資料的過程包裝成函式
function getProduct() {
  // 透過get取得商品資料
  axios
    .get(`${costomerApi}/products`)
    .then(function (response) {
      // console.log(response.data.products);//測試用
      productData = response.data.products;
      renderProduct(productData);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 將取得的產品資料渲染在畫面上
const productWrap = document.querySelector(".productWrap");
let productData = [];

function renderProduct(data) {
  let str = "";
  data.forEach(function (item) {
    str += `
    <li class="productCard">
          <h4 class="productType">新品</h4>
          <img
            src="${item.images}"
            alt=""
          />
          <a href="#" class="addCardBtn" data-id=${item.id}>加入購物車</a>
          <h3>${item.title}</h3>
          <del class="originPrice">NT$${item.origin_price}</del>
          <p class="nowPrice">NT$${item.price}</p>
        </li>`;
  });
  productWrap.innerHTML = str;
}

//篩選產品
const productSelect = document.querySelector(".productSelect");

function filterProduct(value) {
  const result = [];
  if (value === "全部") {
    //選到"全部"選項時，所有會出現所有資料，並且中斷函式。
    renderProduct(productData);
    return;
  } else {
    productData.forEach(function (item) {
      if (item.category === value) {
        result.push(item);
      }
    });
  }
  renderProduct(result);
}

productSelect.addEventListener("change", function (e) {
  filterProduct(e.target.value);
  // console.log(e.target.value);//測試用
});

//加入購物車按鈕
function addCart(id) {
  const data = {
    data: {
      productId: id,
      quantity: 1,
    },
  };
  axios
    .post(`${costomerApi}/carts`, data)
    .then(function (response) {
      console.log(response);
      cartData = response.data.carts;
      cartTotal = response.data.finalTotal;
      renderCart();
    })
    .catch(function (error) {
      console.log(error);
    });
}

productWrap.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(e.target.dataset.id);
  addCart(e.target.dataset.id);
});

//渲染購物車
let cartData = [];
let cartTotal = 0;

function getCart() {
  axios
    .get(`${costomerApi}/carts`)
    .then(function (response) {
      cartData = response.data.carts;
      cartTotal = response.data.finalTotal;
      // console.log(cartData);//測試用
      renderCart();
    })
    .catch(function (error) {
      console.log(error);
    });
}

const shoppingCartTableBody = document.querySelector(
  ".shoppingCart-table tbody"
);

const shoppingCartTableFoot = document.querySelector(
  ".shoppingCart-table tfoot"
);

function renderCart() {
  if (cartData.length === 0) {
    shoppingCartTableBody.innerHTML = "目前購物車沒有商品";
    shoppingCartTableFoot.innerHTML = "";
    return;
  }
  let str = "";
  cartData.forEach(function (item) {
    str += `<tr  data-id="${item.id}">
              <td>
                <div class="cardItem-title">
                  <img src="${item.product.images}" alt="" />
                  <p>${item.product.title}</p>
                </div>
              </td>
              <td>NT$${item.product.origin_price}</td>
              <td><button type="button" class="minusBtn"> - </button>${item.quantity}<button type="button" class="addBtn"> + </button></td>
              <td>NT$${item.product.price}</td>
              <td class="discardBtn">
                <a href="#" class="material-icons discardBtnCart"> clear </a>
              </td>
            </tr>`;
  });
  shoppingCartTableBody.innerHTML = str;
  shoppingCartTableFoot.innerHTML = `<tr>
              <td>
                <a href="#" class="discardAllBtn">刪除所有品項</a>
              </td>
              <td></td>
              <td></td>
              <td>
                <p>總金額</p>
              </td>
              <td>NT$${cartTotal}</td>
            </tr>`;
}

//刪除所有購物車內容
shoppingCartTableFoot.addEventListener("click", function (e) {
  if (e.target.classList.contains("discardAllBtn")) {
    e.preventDefault();
    deleteAllCart();
  }
});
function deleteAllCart() {
  axios.delete(`${costomerApi}/carts`).then(function (response) {
    // console.log(response); //測試用
    cartData = response.data.carts;
    renderCart();
  });
}
//刪除購物車單一商品
function deleteCart(id) {
  axios.delete(`${costomerApi}/carts/${id}`).then(function (response) {
    console.log(response); //測試用
    cartData = response.data.carts;
    renderCart();
  });
}
shoppingCartTableBody.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.hasAttribute("data-id")) {
    deleteCart(e.target.dataset.id);
  }
});

//新增產品數量的加減按鈕
function updateCart(id, qty) {
  const data = {
    data: {
      id,
      quantity: qty,
    },
  };
  axios
    .patch(`${costomerApi}/carts`, data)
    .then(function (response) {
      console.log(response); //測試用
      cartData = response.data.carts;
      renderCart();
    })
    .catch(function (error) {
      console.log(error);
    });
}
//購物車商品增加
shoppingCartTableBody.addEventListener("click", function (e) {
  const id = e.target.closest("tr").getAttribute("data-id");
  e.preventDefault();
  if (e.target.classList.contains("discardBtnCart")) {
    // console.log(e.target.closest("tr").getAttribute("data-id"));//測試用
    deleteCart(id);
  }
  //商品增加按鈕
  if (e.target.classList.contains("addBtn")) {
    let result = {};
    cartData.forEach(function (item) {
      if (item.id === id) {
        result = item;
      }
    });
    let qty = result.quantity + 1;
    updateCart(id, qty);
  }
  //商品減少按鈕
  if (e.target.classList.contains("minusBtn")) {
    const cartItem = cartData.find((item) => item.id === id);
    let qty = cartItem.quantity - 1;
    if (qty === 0) {
      deleteCart(id);
    } else {
      updateCart(id, qty);
    }
  }
});

//預訂資料區塊
const orderInfoBtn = document.querySelector(".orderInfo-btn");
const orderInfoForm = document.querySelector(".orderInfo-form");

function checkForm() {
  const constraints = {
    姓名: {
      presence: { message: "^必填" },
    },
    電話: {
      presence: { message: "^必填" },
    },
    Email: {
      presence: { message: "^必填" },
      email: { message: "^請輸入正確的信箱格式" },
    },
    寄送地址: {
      presence: { message: "^必填" },
    },
  };
  const error = validate(orderInfoForm, constraints);
  console.log(error);
  return error;
}

function sendOrder() {
  if (cartData.length === 0) {
    alert("購物車不得為空");
    return;
  }
  if (checkForm()) {
    alert("表格內容必填");
    return;
  }

  const customerName = document.querySelector("#customerName");
  const customerPhone = document.querySelector("#customerPhone");
  const customerEmail = document.querySelector("#customerEmail");
  const customerAddress = document.querySelector("#customerAddress");
  const tradeWay = document.querySelector("#tradeWay");

  const data = {
    data: {
      user: {
        name: customerName.value.trim(),
        tel: customerPhone.value.trim(),
        email: customerEmail.value.trim(),
        address: customerAddress.value.trim(),
        payment: tradeWay.value,
      },
    },
  };
  axios
    .post(`${costomerApi}/orders`, data)
    .then(function (response) {
      console.log(response); //測試用
      orderInfoForm.reset();
    })
    .catch(function (error) {
      console.log(error);
    });
}
orderInfoBtn.addEventListener("click", function (e) {
  e.preventDefault();
  sendOrder();
});
//統一管理初始化動作
function init() {
  getProduct();
  getCart();
}
init();
