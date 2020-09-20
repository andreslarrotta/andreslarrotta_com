function checkoutCart () {
    hasItems();
    resizeItemImage(138,194);
}

function hasItems () {
    setTimeout(() => {
        if(document.querySelector('.product-item')) {
            console.log('hay productos')
            document.getElementById('cart-title').style.display = 'none';
            const deliveryTitle = document.createElement('h2');
            deliveryTitle.setAttribute('class', 'checkout__cart__title');
            deliveryTitle.textContent = 'MI PEDIDO';
            document.getElementById('cart-title').insertAdjacentElement('beforebegin', deliveryTitle)
        }
    }, 500);
}
function resizeItemImage (width, height) {
    setTimeout(() => {
        let productImages = document.querySelectorAll('.product-item img');
        productImages.forEach (function(productImage) {
            
            let source = productImage.getAttribute('src');
            let regExp = /-\d+-\d+/
            source = source.replace(regExp, `-${width}-${height}`);
            productImage.setAttribute('src', source);
            productImage.setAttribute('height', height);
            productImage.setAttribute('width', width);
            productImage.setAttribute('style', `width: ${width}px; height: ${height}px; max-width: ${width}px;`)
            console.log(productImage);
        })
    }, 2000)
}

export default checkoutCart;