"use strict";

let productListData = undefined;
let filteredProducts = undefined;

let startIndex = 0;
let endIndex = 10;

let product = "";
let filterCategories = [];

let sortByPrice = "";
let searchedText = "";

let showMoreButtonElem = `<div class="text-center showmore"><a href="javascript:void(0)">show more</a></div></div>`;
let loader = [1,2,3,4,5,6,7,8,9,10].map(res => {return `<div class="shimmer-loader"></div>`}).join('');

let showMoreContainer = document.getElementById('showmoreContainer');
let productListContainer = document.getElementById('productListContainer');

//api call to get all products
async function fetchProductList() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        productListData = await response.json();
        filteredProducts = productListData;
        console.log(productListData); // Output the data to the console
        bindResultCount();
        addProductsToContainer(filteredProducts);
    } catch (error) {
        productListContainer.innerHTML = `<p class="word-wrap ml">An error has occurred while processing your request. Please try again later.</p>`;
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('errorModal').style.display = 'block';
    }
}

//bind total products count
function bindResultCount() {
    let resultCount = `<p class="text-nowrap ml">${productListContainer.children.length} Results</p>`;
    let resultCountElem = document.getElementById('resultstxt');
    let mobileResultCountElem = document.getElementById('mobileResultstxt');
    resultCountElem.innerHTML = resultCount;
    mobileResultCountElem.innerHTML = resultCount;
}

productListContainer.innerHTML = loader;
fetchProductList();

//add products to container div
function addProductsToContainer(data, loardMore = false) {
    if (!loardMore) product = "";
    for (let i = startIndex; i < (endIndex < data.length ? endIndex : data.length); i++) {
        product = product + `<div class="product" onclick="window.location.href='../../pages/product-details/product-details.html'">
                <img src="${data[i].image}" class="bg-secondary" alt="">
                <p class="product-title"><b>${data[i].title}</b></p>
                <p><b>${'$' + data[i].price}</b></p>
                <div class="heartImg"><img src="/assets/images/heart.png" /></div>
            </div>`;
    }
    if (filteredProducts.length > 10) {
        showMoreContainer.innerHTML = showMoreButtonElem;
        document.querySelector('.showmore').addEventListener('click', showMoreProducts);
    }
    if (endIndex >= filteredProducts.length) {
        document.querySelector('.showmore') && document.querySelector('.showmore').remove();
    }
    productListContainer.innerHTML = product;
    bindResultCount();
}

function searchProduct(searchText) {
    searchedText = searchText;
    filterProducts('',false,true);
}

//filter products based on category, search text
function filterProducts(categoryName, checked, searchFlag=false) {
    startIndex = 0;
    endIndex = 10;
    
    if (checked) {
        filterCategories.push(categoryName);
    } else {
        !searchFlag && filterCategories.splice(filterCategories.indexOf(categoryName), 1);
    }

    filteredProducts = filterCategories.length === 0 
    ? productListData 
    : productListData.filter(productObj => filterCategories.includes(productObj.category));

    if (searchedText) {
        filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchedText.toLowerCase()));
    }
    
    sortProducts(sortByPrice);
};

//ascending sort
const sortByPriceAsc = (items) => {
    return items.slice().sort((a, b) => a.price - b.price);
};

//descending sort
const sortByPriceDesc = (items) => {
    return items.slice().sort((a, b) => b.price - a.price);
};

//sort products based on price
function sortProducts(sortType) {
    sortByPrice = sortType;
    startIndex = 0;
    endIndex = 10;
    if (sortType === 'asc') {
        filteredProducts = sortByPriceAsc(filteredProducts);
    } else if (sortType === 'desc') {
        filteredProducts = sortByPriceDesc(filteredProducts);
    }
    addProductsToContainer(filteredProducts);
}

//lazy loading products
function showMoreProducts() {
    startIndex = endIndex;
    endIndex += 10;
    addProductsToContainer(filteredProducts, true);
}

document.getElementById('toggleFilterSidebar').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
});

document.getElementById('closeSidebar').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
});

document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('errorModal').style.display = 'none';
}

document.getElementById('retry-button').onclick = function() {
    document.getElementById('errorModal').style.display = 'none';
    productListContainer.innerHTML = loader;
    fetchProductList();
}

document.getElementById('cancel-button').onclick = function() {
    document.getElementById('errorModal').style.display = 'none';
}