const model = document.querySelector(".model");
const button = document.querySelector(".button");
const closeButton = document.querySelector(".close-button");

function togglecontainer() {
  model.classList.toggle("show-container");
}

function windowOnClick(event) {
  if (event.target === model) {
    togglecontainer();
  }
}

button.addEventListener("click", togglecontainer);
closeButton.addEventListener("click", togglecontainer);
window.addEventListener("click", windowOnClick);

let ddlcategory = document.getElementById("ddlcategory"),
  category = document.getElementById("category"),
  product = document.getElementById("product"),
  quntity = document.getElementById("quntity"),
  price = document.getElementById("price"),
  descount = document.getElementById("descount"),
  total = document.getElementById("total"),
  submit = document.getElementById("submit"),
  mood = "create";

let categoryArr =
  localStorage.category != null ? JSON.parse(localStorage.category) : [];
let productArr =
  localStorage.product != null ? JSON.parse(localStorage.product) : [];

document.addEventListener("DOMContentLoaded", function () {
  loadCategoryData();
  updateDataTable(); 
  CountProduct();
});

function loadCategoryData() {
  showCategory();
  showTableCategory();
  countCategory();
  CountProduct();
}

function saveCategory() {
  let objCategory = {
    category: category.value,
  };
  categoryArr.push(objCategory);
  localStorage.setItem("category", JSON.stringify(categoryArr));
  rest(); 
  loadCategoryData();
  CountProduct();
}


function showCategory() {
  let item = "";
  item += `<option value="">Select Category</option>`;

  for (let i = 0; i < categoryArr.length; i++) {
    item += `<option value="${i}">${categoryArr[i].category}</option>`;
  }
  ddlcategory.innerHTML = item;
}

function showTableCategory() {
  let table = "";
  for (let i = 0; i < categoryArr.length; i++) {
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${categoryArr[i].category}</td>
        <td>
          <button onclick="deleteCategory(${i})" class="btn btn-danger">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>`;
  }
  document.getElementById("bodyTable").innerHTML = table;
}

function deleteCategory(id) {
  if (confirm("Are You Sure From Deleted?") == true) {
    categoryArr.splice(id, 1);
    localStorage.category = JSON.stringify(categoryArr);

    showTableCategory();
    showCategory()
    countCategory();
    CountProduct();
  }
}

function countCategory() {
  document.getElementById(
    "countCategory"
  ).innerHTML = ` Total Category (${categoryArr.length})`;
}

function validationCategory() {
  let valid = true;
  if (category.value == "") {
    alert("Enter Name Category: .. ");
    valid = false;
  } else {
    saveCategory();
    valid = true;
  }
  return valid;
}

function getTotal() {
  if (price.value != 0) {
    let Total = quntity.value * price.value - descount.value;
    total.value = Total;
    total.className.replace = "form-control bg-danger text-center";
    total.className = "form-control text-center";
    total.style.background = "var(--green-color)";
  } else {
    total.value = 0;
    total.className.replace = "form-control bg-success text-center";
    total.className = "form-control bg-danger text-center";
  }
}

function rest() {
  category.value = "";
  product.value = "";
  quntity.value = "";
  price.value = "";
  descount.value = "";
  total.value = 0;
}

const dataTable = new DataTable("#dataTable", {
  responsive: true,
});




let editProductIndex = -1;

function editProduct(index) {
  editProductIndex = index;
  const product = productArr[index];
  ddlcategory.value = categoryArr.findIndex(
    (cat) => cat.category === product.category
  );
  document.getElementById("product").value = product.product;
  quntity.value = product.quantity;
  price.value = product.price;
  descount.value = product.discount;
  total.value = product.total;
}



function savaProduct() {
  const selectedCategoryIndex = ddlcategory.value;
  const productName = product.value;
  const quantity = quntity.value;
  const productPrice = price.value;
  const discount = descount.value;
  const totalAmount = total.value;

  if (selectedCategoryIndex === "") {
    alert("Please select a category.");
    return;
  }

  const selectedCategory = categoryArr[selectedCategoryIndex].category;

  if (editProductIndex !== -1) {
    // If in update mode
    productArr[editProductIndex] = {
      category: selectedCategory,
      product: productName,
      quantity: quantity,
      price: productPrice,
      discount: discount,
      total: totalAmount,
    };

    editProductIndex = -1;

  } else {
    // If in create mode
    const newProduct = {
      category: selectedCategory,
      product: productName,
      quantity: quantity,
      price: productPrice,
      discount: discount,
      total: totalAmount,
    };
  
    productArr.push(newProduct);
  }
  
  localStorage.setItem("product", JSON.stringify(productArr));

  rest();
  CountProduct();
  updateDataTable();

}

function updateDataTable() {
  dataTable.clear();

  for (let i = 0; i < productArr.length; i++) {
    const product = productArr[i];
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${i + 1}</td>
      <td>${product.category}</td>
      <td>${product.product}</td>
      <td>${product.quantity}</td>
      <td>${product.price}</td>
      <td>${product.discount}</td>
      <td>${product.total}</td>
      <td>
        <button class="btn edit" onclick="editProduct(${i})">
          <i class="fa-solid fa-pen-to-square"></i> 
        </button>
        <button class="btn btn-danger" onclick="deleteProduct(${i})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    dataTable.row.add(newRow);
  }
  scroll({
    top: 0,
    behavior: "smooth",
  });
  dataTable.draw();
}


function deleteProduct(index) {
  if (confirm("Are you sure you want to delete this product?")) {
    productArr.splice(index, 1);
    localStorage.setItem("product", JSON.stringify(productArr));
    updateDataTable();
    rest(); 
  }
}

//Count Product

function CountProduct() {

  document.getElementById('countpro').innerHTML = `- TotalCategory (${categoryArr.length})`;
}

function ValidationProduct() {
  let lbcate = document.getElementById('lbcate');
  let lbProduct = document.getElementById('lbProduct');
  let lbqutity = document.getElementById('lbqutity');
  let lbPrice = document.getElementById('lbPrice');

  let valid = true;

  if (ddlcategory.options[ddlcategory.selectedIndex].text == 'Select Category') {

      lbcate.innerHTML = 'Category : * [Required]';
      lbcate.style.color = 'red';
      valid = false;

  } else {
      lbcate.innerHTML = 'Category : *';
      lbcate.style.color = 'var(--darkGreen-color)';
      valid = true;
  }
   

  if (product.value == '') {

      lbProduct.innerHTML = 'Product Nwme : * [Requred]';
      lbProduct.style.color = 'red';
      valid = false;

  } else {
      lbProduct.innerHTML = 'Product Nwme : * ';
      lbProduct.style.color = 'var(--darkGreen-color)';
      valid = true;
  }



  if (quntity.value == 0) {

      lbqutity.innerHTML = 'Quntity : * [Requred]';
      lbqutity.style.color = 'red';
      valid = false;

  } else {
      lbqutity.innerHTML = 'Quantity : *';
      lbqutity.style.color = 'var(--darkGreen-color)';
      valid = true;
  }

  if (price.value == 0) {

      lbPrice.innerHTML = 'Price : * [Requred]';
      lbPrice.style.color = 'red';
      valid = false;

  } else {
      lbPrice.innerHTML = 'Price : *';
      lbPrice.style.color = 'var(--darkGreen-color)';
      valid = true;
  }

  if (ddlcategory.options[ddlcategory.selectedIndex].text != '' &&
      product.value != '' && quntity.value != 0 && price.value != 0) {
        savaProduct();
  }

  return valid;
}

window.onload = function(){
  document.getElementById('download').addEventListener('click',() =>{
    let filePDF = this.document.getElementById('dataTable');
    html2pdf().from(filePDF).save();
  })
}
