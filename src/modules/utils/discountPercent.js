const discountPercent = (contexto = document) => {

    contexto.querySelectorAll('.item__showcase__destaques__descuentos__perce').forEach(i => {
    if (!i.classList.contains('ok')) {
      if (i.innerHTML == '0') {
        discount.classList.add('hide');
      }
      if (i.innerHTML.trim().indexOf('%') == -1) {
        i.classList.add('hide');
      } else {
        i.classList.add('ok');
        i.innerHTML = i.innerHTML.replace(/\,.*/, '%')

      }
    }
  })
}

export default discountPercent;
