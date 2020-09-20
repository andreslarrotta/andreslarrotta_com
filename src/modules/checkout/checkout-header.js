const headerCheckout = () => {
    const navElements = document.querySelectorAll('.menu-1__proceso .menu-1__proceso__item .menu-1__proceso__item__punto'),
        menu = document.querySelector('.menu-1__proceso'),
        url = `${location.pathname}${location.hash}`;
    console.log(navElements);
    navElements.forEach(item => {
        item.classList.remove('activo');
        console.log(url);
    })
    if (url == '/checkout/#/cart') {
        navElements[0].classList.add('activo')
        if(window.screen.width < 640) {
            menu.style.float = "right";
            menu.style.right = "calc(45% - 434px)";
        }
        
    } else if (url == '/checkout/#/email') {
        navElements[1].classList.add('activo');
        if(window.screen.width < 640) {
            menu.style.float = "right";
            menu.style.right = "calc(45% - 285px)";
        }
    }
    else if (url == '/checkout/#/shipping' || url == '/checkout/#/profile' || url == '/checkout/#/payment') {
        navElements[2].classList.add('activo');
        if(window.screen.width < 640) {
            menu.style.float = "right";
            menu.style.right = "calc(45% - 165px)";
        }
    }
    else if (url == '/checkout/orderPlaced/') {
        navElements[3].classList.add('activo');
        console.log(menu);
        if(window.screen.width < 640) {
            menu.style.float = "right";
            menu.style.right = "calc(45% - 43px)";
        }
    }

    
}

export default headerCheckout;

setTimeout(function() {
    
}, 2000);