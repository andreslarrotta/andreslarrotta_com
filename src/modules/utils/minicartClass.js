import Ordercart from './ordercart';
let extend = function (defaults, options) {
  var extended = {};
  var prop;
  for (prop in defaults) {
    if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
      extended[prop] = defaults[prop];
    }
  }
  for (prop in options) {
    if (Object.prototype.hasOwnProperty.call(options, prop)) {
      extended[prop] = options[prop];
    }
  }
  return extended;
};
class MinicartObj {
  constructor(options) {
    let defaults = {
      divContMinicart: null,
      btnTotalProduct: null,
      classActiveMinicart: 'active',

    }
    this.options = extend(defaults, options);
    this.state = {
      products: [],
      totals: [],
      itemTotals: 0
    }
    this.divContMinicart = document.getElementById(this.options.divContMinicart)
    this.btnTotalProduct = document.querySelector(this.options.btnTotalProduct)
    this.classActiveMinicart = this.options.classActiveMinicart
    this.contItem = document.createElement('div')
    this.contItem.setAttribute('class', 'minicart__items-cont')
    this.init()
  }
  setState(newsState) {

    Object.assign(this.state, newsState);
    this.render()
  }
  render() {
   
    const {products,totals,itemTotals} = this.state,
      divCont = this.contItem,
      divAppen = document.getElementById('itemsMinicart')
   
    if (products.length > 0) {
      this.contItem.innerHTML = '';
      this.contItem.innerHTML = products.map((element, index) => {
        let bestPriceT = '',
          listPriceT = ''
      
        
          console.log(products.length)
          let countCart = document.querySelectorAll('.iconm-bag-account')
          for (let count of countCart) {
            count.innerHTML = `<p>${products.length}</p>`
          }
          if(element.price < element.listPrice){
            bestPriceT = `${element.price.toString().substring(0, element.price.toString().length-2)}`
            listPriceT = `${element.listPrice.toString().substring(0, element.listPrice.toString().length-2)}`
            listPriceT = `<span class="last">$ ${Ordercart.currency(parseInt(listPriceT))}</span>`
          }else{
            bestPriceT = `${element.price.toString().substring(0, element.price.toString().length-2)}`
            listPriceT = ``
          }
        bestPriceT = `<span class="best">$ ${Ordercart.currency(parseInt(bestPriceT))}</span>`
        

        return `
                    <div class="itemM__box">
                            <figure class="itemM__box__figure">
                                
                                    <a href="${element.detailUrl}">
                                        <img class="itemM__box__figure__image" src="${element.imageUrl.replace('-55-55','-160-160')}" alt="${element.name}">
                                    </a>
                            </figure>
                            <div class="itemM__box__namePrice">
                                <a href="#" class="itemM__box__removeProduct" data-index="${index}" data-qy="${element.quantity}">
                                        &times;
                                    </a>
                                <h4 class="itemM__box__namePrice__name">
                                    ${element.name}
                                </h4>
                                
                                
                                <p class="itemM__box__namePrice__price">
                                    ${listPriceT}
                                    ${bestPriceT}
                                </p>
                                <div class="itemM__box__qy">
                                  <span>Cantidad</span>
                                  <div class="itemM__box__qy__int">
                                      <button type="button" class="btn itemM__box__qy__int__btn" data-type="minus" data-field="mpquant[${element.productId}]" data-index="${index}">
                                        <span class="btnIcon-muminus"></span>
                                      </button>
                                      <input size="20" type="text" class="itemM__box__qy__int__quantity" 
                                      value="${element.quantity}" productindex="0" style="display:block" 
                                      name="mpquant[${element.productId}]" min="1" max="20">
                                    
                                     
                                      <button type="button" class="btn itemM__box__qy__int__btn" data-type="plus" data-field="mpquant[${element.productId}]" data-index="${index}">
                                      <span class="btnIcon-muplus"></span>
                                      </button>
                                  </div>

                                </div>
                            </div>
                            

                    </div>
            `

      }).join('')
      if (divAppen) {
        divAppen.innerHTML = ''
        divAppen.appendChild(this.contItem)
      }
    }
    
    let totale = `
    <div class="minicart__totals">
        <p style="${totals.discounts.length > 0 ? 'display:flex;' : 'display:none;'}" class="minicart__totals__descuento">
            <span class="minicart__totals__text">Descuentos</span>
            <span id="minicart__discounts" class="minicart__totals__total">
            $ ${totals.discounts.length > 0 ? Ordercart.currency(parseInt(totals.discounts[0].value.toString().substring(0, totals.discounts[0].value.toString().length-2))) : ''}
            
            </span>
        </p>
        <p style="${totals.shipping.length > 0 ? 'display:flex;' : 'display:none;'}" class="minicart__totals__envio">
            <span class="minicart__totals__text">Envío</span>
            <span id="minicart__discounts" class="minicart__totals__total">
              $ ${totals.shipping.length > 0 ? Ordercart.currency(parseInt(totals.shipping[0].value.toString().substring(0, totals.shipping[0].value.toString().length - 2))) : ''}
              
            </span>
          </p>

        <p class="minicart__totals__totalP">
            <span class="minicart__totals__text">Total</span>
            <span id="minicart__total" class="minicart__totals__total">
            $ ${Ordercart.currency(parseInt(totals.total.toString().substring(0, totals.total.toString().length-2)))}
            </span>
        </p>
    </div>
    `
    if(document.getElementById('minicart__totals')){
      document.getElementById('minicart__totals').innerHTML = ''
      document.getElementById('minicart__totals').innerHTML = totale
    }
    

    let items = [...document.querySelectorAll('.numberofItems')]
        items.forEach(ele=>{
            ele.innerHTML =  itemTotals
    })






  }
  async init() {
    //console.log('inic minicart', this.items)
    this.setHtmlCart()
    let order = await Ordercart.miniCart()
    this.setState({
      products: order.items,
      totals: order.totals,
      itemTotals: order.tItems
    })
  }
  setHtmlCart() {
    let htmlMini = `
        <aside id="minicart" class="minicart">

        <div class="minicart__container">
          <div class="minicart__header">
            <p>Mi carrito</p>
            <button id="closeMinicart">
                <span class="iconx icon-fl-icon-fl-close"></span>
            </button>
          </div>
          <div id="itemsMinicart" class="minicart__items">
           
          </div>
          <div id="minicart__totals" class="minicart__totals">
          </div>
          <div class="minicart__footer">
      
            <a href="/checkout/#/cart" class="minicart__footer__buy buttons buttons__v1">
              <span class="text">COMPRAR</span>
            </a>
            
          </div>
        </div>
      </aside>
      
        `
    if (this.divContMinicart) {
      this.divContMinicart.insertAdjacentHTML('afterend', htmlMini)
      document.getElementById('itemsMinicart').addEventListener('click',(e)=>{
        this.eventsMinicart(e)
      })
      document.getElementById('closeMinicart').addEventListener('click',(e)=>{
          
          this.openAction('close')
      })
    }
  }
  eventsMinicart(e){
    
    let element = e.target;
    
    
    
    
    console.log(element)
    if(e.target.classList.contains('itemM__box__qy__int__btn')) {
        e.preventDefault();
        e.stopImmediatePropagation()
       
        Ordercart.buttonsChangeQ(e.target,(value)=>{
          console.log('el valor cmabio',value)
            let index = element.getAttribute('data-index')
           
            console.log('el index',index)
            Ordercart.changeQuyCart(index,value,()=>{
              //this.update()
              setTimeout(() => {
                console.log('89089898')
                this.update()
              }, 400);
              
            })
            
        });
        
    }
    if(element.classList.contains("itemM__box__removeProduct")) {
        e.preventDefault();
        e.stopImmediatePropagation()
        element.closest('.itemM__box');
        let updateC = this.update
        console.log(this.update)
        let index = element.getAttribute('data-index'),
            qy = element.getAttribute('data-qy')
            Ordercart.removeItem(index,qy,async (orderForm)=>{
                element.closest('.itemM__box').remove()
                setTimeout(()=>{
                  this.update()
                },600)
                
                
                //openAction()
            })
        
    }

  }
  openAction(action){
    const miniCartCont = document.getElementById('minicart'),
    body = document.body
    if (action == 'open') {
        miniCartCont.classList.add('minicart-open')
        body.classList.add('open-minicart')
    }else if(action == 'toggle'){
        miniCartCont.classList.toggle('minicart-open')
        body.classList.toggle('open-minicart')
    }else {
        miniCartCont.classList.remove('minicart-open')
        body.classList.remove('open-minicart')
    }

  }
  async update(){
    let order = await Ordercart.miniCart()
    this.setState({
      products: order.items,
      totals: order.totals,
      itemTotals: order.tItems
    })
  }


}
export default MinicartObj;