function showPaymentLogos () {
    // Valida si la función se ejecuta en media query o si la restaura a su estado actual
    if (window.matchMedia('(min-width: 40em)').matches) {
        document.querySelector('.checkout__payment__list').setAttribute('style','');
    } else {
        ShowPaymentLogos.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('%c mostraremos los medios de pago', 'color: green;');
            const divHeight = document.querySelector('.checkout__payment__list img');
            if (document.querySelector('.checkout__payment__list').offsetHeight === 0) {
                document.querySelector('.checkout__payment__list')
                    .setAttribute('style',`height : ${divHeight.offsetHeight}px; margin-bottom: 2rem`);
            } else {
                document.querySelector('.checkout__payment__list')
                    .setAttribute('style','height : 0; margin-bottom: 0');
            }
        })
    }
}

function checkoutFooter () {
    // Valida el botón para aparecer y desaparecer en resize y al principio de la ejecución
    showPaymentLogos();
    addEventListener('resize', function () {
        showPaymentLogos();
    })
}

export default checkoutFooter;