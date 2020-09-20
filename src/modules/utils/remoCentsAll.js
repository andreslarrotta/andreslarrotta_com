import Ordercart from './ordercart'
const remoCentsAll = (contexto = document) => {
  let prices = null;
  if (contexto.querySelector('.item__showcase__price-old')) {
    prices = contexto.querySelectorAll('.item__showcase__price-best, .item__showcase__price-old')
  } else {
    prices = contexto.querySelectorAll('.item__showcase__price-best')
  }


  if (prices) {
    for (const price of prices) {

      let nPrice = Ordercart.removeCents(price.textContent)
      price.textContent = nPrice;
    }
  }
}

export default remoCentsAll;
