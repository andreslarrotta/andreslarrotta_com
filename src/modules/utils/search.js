import Ordercart from './ordercart';
import mediaQ from './mediaqueries'
import {installMents} from './installMents'
class Search{
    constructor(formId){
        this.form = document.querySelector(`${formId}`)
        this.state = {
            words:[],
            products:[]
        }
        this.divWords =  document.createElement('div')
        this.divProducts = document.createElement('div')
        this.init()
    }
    async init(){
       
        this.form.querySelector('input').addEventListener('keyup',async (e)=>{
            let value = e.target.value
            if(value.length>0){
                let response = await this.autoComplete(value)
                this.searchInfo(response)
               console.log('respuesta bsucador',response)
                
            }else{
                this.setState({words:[],products:[]}) 
                
            }
                
                
                
                
        })
        this.form.addEventListener('submit',(e)=>{
            e.preventDefault();
            let value = this.form.querySelector('input').value

            if(value.length > 0){
                window.location.replace(`/${value}`);
            }
            
        })
        this.form.insertAdjacentHTML('beforeend',`<div id="resultsAutoComplete" class="resultsAutoComplete">
            <div class="resultsAutoComplete__grid">
                <div id="resultsAutoComplete__words" class="resultsAutoComplete__words"></div>
                <div  class="resultsAutoComplete__products">
                <h4 class="resultsAutoComplete__products__title">Relacionados</h4>
                    <div id="resultsAutoComplete__products__list" class="resultsAutoComplete__products__list">
                    </div>
                </div>
            
            </div>

        </div>`);
    }
    setState(newsState){  
        Object.assign(this.state,newsState);
        this.render()
    }
    setHtml(){
        const {words,products} = this.state,
            divWords =  this.form.querySelector('#resultsAutoComplete__words'),
            divProducts = this.form.querySelector('#resultsAutoComplete__products__list'),
            parentAuto = this.form.querySelector('#resultsAutoComplete')
        let articleWords = '',
            articleProducts = ''
              
        //console.log('words es',words)
        if(words[0] == 'undefined'){
            divWords.innerHTML = '';
        }else{
            if(words[0].length > 0){
                parentAuto.classList.add('active')
                if (mediaQ('(max-width: 760px)')){
                    document.body.classList.add('searchopen')
                }
                divWords.innerHTML = '';
               
                divWords.innerHTML = words[0].map((word)=>{
                    //console.log('el word',word)
                    return `
                    <article>
                        <a href="${word.url}">${word.name}</a>
                    <article/>
                
                `
                }).join('')
    
                
               
            }else{
                divWords.innerHTML = '';
                parentAuto.classList.remove('active')
                if (mediaQ('(max-width: 760px)')){
                    document.body.classList.remove('searchopen')
                }
            }
        }
        
        
        if(products.length> 0){
            divProducts.innerHTML = ''
            divProducts.innerHTML = products.map((product)=>{
                let bestPrice,LastPrice
                if(product.price ==  product.listPrice){
                    bestPrice = `<span class="resultsAutoComplete__products__price-best">$${Ordercart.currency(parseInt(product.price))}</span>` 
                    LastPrice = ''               
                }else{
                    bestPrice = `<span class="resultsAutoComplete__products__price-best">$${Ordercart.currency(parseInt(product.price))}</span>`
                    LastPrice = `<span class="resultsAutoComplete__products__price-old">$${Ordercart.currency(parseInt(product.listPrice))}</span>`
                }
                let objInstall = installMents(product.price,false,true)
                
                return `
                <article class="resultsAutoComplete__products__item">
                   <a href="${product.href}">
                        <div class="resultsAutoComplete__products__image">
                            <figure>
                                <img src="${product.productImage}"/>
                            </figure>
                        </div>
                        <div class="resultsAutoComplete__products__descp">
                                <h5 class="resultsAutoComplete__products__name">${product.productName}</h5>
                                <p class="resultsAutoComplete__products__installments">
                                    <span class="iconx icon-mefia"></span> 
                                    ${objInstall.cuota} cuotas de<strong>  $ ${Ordercart.currency(objInstall.price)}</strong>
                                </p>
                                <p class="resultsAutoComplete__products__price">
                                    ${bestPrice}
                                    ${LastPrice}    
                                </p>
                        </div>
                    </a>
                </article>
            `
            }).join('');

        }else{
            divProducts.innerHTML = ''
        }
                
    }
    render(){
        this.setHtml();
        //console.log('render',this.state)
    }
    searchInfo(respAuto){
        if(respAuto.itemsReturned.length > 0){
            let itemWords = []
           respAuto.itemsReturned.forEach(async (item) => {
              if(item.thumbUrl == null){
                  
                  itemWords.push({name:item.name,url:item.href})
                  this.state.words = []    
                    
                let neWord = [...this.state.words, itemWords]
                  this.setState({words:neWord})
              }else{
                    let products = await this.porductApi(item.items[0].productId)
                   
                    if(products.length > 0){
                        
                        if(this.state.products.filter(e => e.id === products[0].productId).length < 1){
                            //console.log('hahaha',products[0].items[0].sellers[0])
                            let productItem = {
                                id:products[0].productId,
                                href:item.href,
                                productName: products[0].productName,
                                productImage: item.thumbUrl.replace('-25-25','-200-200'),
                                price: products[0].items[0].sellers[0].commertialOffer.Price,
                                listPrice:products[0].items[0].sellers[0].commertialOffer.ListPrice,
                                numberInstallments:products[0].items[0].sellers[0].commertialOffer.Installments[9].NumberOfInstallments,
                                valueInstallments:products[0].items[0].sellers[0].commertialOffer.Installments[9].Value

                            },
                            newStack = [...this.state.products, productItem]
                            this.setState({products:newStack})
                        }
                       
                    }
                    
              }
           });
        }
    }
    async autoComplete(searchString){
        const response = await fetch(`/buscaautocomplete/?productNameContains=${searchString}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "cache-control": "no-cache",
            }
          });
          const json = await response.json();
        
          return json;
    }
    async porductApi(id){
        const response = await fetch(`/api/catalog_system/pub/products/search/?fq=productId:${id}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "cache-control": "no-cache",
            }
          });
          const json = await response.json();
        
          return json;
    }


}
export default Search;