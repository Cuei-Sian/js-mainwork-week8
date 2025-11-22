// 請代入自己的網址路徑
const api_path = "doreenwang";
const token = "ncdwG72ozxZp8FePLHdpiZq3muC3";
const baseUrl = "https://livejs-api.hexschool.io";
const costomerApi = `${baseUrl}/api/livejs/v1/customer/${api_path}`;

// 透過get取得商品資料
axios
  .get(`${costomerApi}/products`)
  .then(function (response) {
    console.log(response.data.products);
    productData = response.data.products;
    renderProduct();
  })
  .catch(function (error) {
    console.log(error);
  });

// 渲染在畫面上
const productWrap = document.querySelector(".productWrap");
let productData = [];

function renderProduct() {
  let str = "";
  productData.forEach(function (item) {
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
