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
          <a href="#" class="addCardBtn">加入購物車</a>
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

//渲染購物車
let cartData = [];

function getCart() {
  axios
    .get(`${costomerApi}/carts`)
    .then(function (response) {
      cartData = response.data.carts;
      console.log(cartData);
      renderCart();
    })
    .catch(function (error) {
      console.log(error);
    });
}

const shoppingCartTableBody = document.querySelector(
  ".shoppingCart-table tbody"
);

function renderCart() {
  let str = "";
  cartData.forEach(function (item) {
    str += `<tr>
              <td>
                <div class="cardItem-title">
                  <img src="${item.product.images}" alt="" />
                  <p>${item.product.title}</p>
                </div>
              </td>
              <td>NT$${item.product.origin_price}</td>
              <td>${item.quantity}</td>
              <td>NT$${item.product.price}</td>
              <td class="discardBtn">
                <a href="#" class="material-icons"> clear </a>
              </td>
            </tr>`;
  });
  shoppingCartTableBody.innerHTML = str;
}

//統一管理初始化動作
function init() {
  getProduct();
}
init();
