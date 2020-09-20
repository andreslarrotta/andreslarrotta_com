import easydropdown from 'easydropdown'
import Ordercart from './ordercart'
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
class SmartFilter {
  constructor(options) {
    let defaults = {
      pageLimit: null,
      scrollInfinito: true,
      loadMoreWithButton: false,
      loadContent: ".showcases__grid[id^=ResultItems]>.showcases__grid",
      classGrid: ".showcases__grid",
      linksMenu: ".search-single-navigator",
      insertMenuAfter: ".search-multiple-navigator h3:first",
      selectOrderCustom: true,
      selectORderDivAppend: null,
      departamentBodyclass: "page-departamento",
      departamentListProduct: true,
      categoryBodyClass: "page-category",
      buscaBodyClass: "page-busca",
      title: 'Tus Filtros',
      clearPrepend: false,
      compare: false,
      divMultiSelect:true,
      divMultiSelectDiv:null,
      callbackGeneral: function () {},
      callbackShowcases: function () {}
    };

    this.options = extend(defaults, options);
    this.state = {
      last: false,
      valuesSelects:[],
      updateValuesSelects:false,
      buscaPUrl: '',
      currentPage: 2,
      moreResults: true,
      morePaginate:false
    }
    this.pageLimit = this.options.pageLimit
    this.scrollInfinito = this.options.scrollInfinito
    this.loadMoreWithButton = this.options.loadMoreWithButton
    this.loadContent = document.querySelector(this.options.loadContent)
    this.classGrid = this.options.classGrid
    this.linksMenu = this.options.linksMenu
    this.insertMenuAfter = this.options.insertMenuAfter
    this.selectOrderCustom = this.options.selectOrderCustom
    this.selectORderDivAppend = document.querySelector(this.options.selectORderDivAppend);
    this.departamentBodyclass = this.options.departamentBodyclass
    this.departamentListProduct = this.options.departamentListProduct
    this.categoryBodyClass = this.options.categoryBodyClass
    this.buscaBodyClass = this.options.buscaBodyClass
    this.compare = this.options.compare

    this.callbackGeneral = this.options.callbackGeneral
    this.callbackShowcases = this.options.callbackShowcases

    this.selecHtml = `<select name="oderbyFilter" id="orderbyFilterSelect">
        <option value="">Ordenar por</option>
        <option value="OrderByPriceASC">Precio más bajo</option>
        <option value="OrderByPriceDESC">Precio más alto</option>
        <option value="OrderByNameASC">A - Z</option>
        <option value="OrderByNameDESC">Z - A</option>
        <option value="OrderByReleaseDateDESC">Fecha de Lanzamiento</option>
        <option value="OrderByBestDiscountDESC">Mejor descuento</option>
        </select>
    `
    this.searchMultipleNavigator = document.querySelector('.search-multiple-navigator')
    this.searchSingleNavigator = document.querySelector('.search-single-navigator')
    this.contSelectLabel = `
                <div class="search__multiple__selected">
                        
                        <div class="search__multiple__selected__action">
                          
                            <button id="prevAction" class="prevAction">
                              prev
                            </button>
                            <button id="nextAction" class="nextAction">
                              next
                            </button>
                          
                          <div id="search__multiple__selected__action__list" class="search__multiple__selected__action__list">
                          </div>

                        </div>
                        <a href="#" id="cleanFilters" class="search__multiple__selected__clearSelectAll">
                                Limpiar Filtros
                        </a>

                </div>
            `
    this.moreResults = true
    this.currentPage = 2
    this.divMultiSelect = this.options.divMultiSelect,
    this.divMultiSelectDiv = document.querySelector(this.options.divMultiSelectDiv),
    this.init()
  }
  init() {
    //opciones para departamento
    this.optionsCategoryOrDepartaments()
    

    
    

  }
  optionsCategoryOrDepartaments(){
   
    if(document.body.classList.contains(this.departamentBodyclass)){
      console.log('entro a departamento',document.body.classList.contains(this.departamentBodyclass))
      if(!this.departamentListProduct){
        console.log('departamento completo');
        this.cleanFilter()
        this.createSelect();
        if(this.divMultiSelect){
          
          this.multiSelectHtml()
        }
        this.setState({buscaPUrl:this.getSearchUrl(),morePaginate:true},false)
        this.scrollInfinitoInit()
        this.loadMoreWithButtonR()
      }else{
        console.log('departamento slingle')
        this.cleanFilter()
      }
    }

    //validacion para categprias{
    if(!document.body.classList.contains(this.departamentListProduct) && document.body.classList.contains(this.categoryBodyClass) || document.body.classList.contains(this.buscaBodyClass)){
      console.log('listin produc')
        this.cleanFilter()
        this.createSelect();
        if(this.divMultiSelect){
          
          this.multiSelectHtml()
        }
        this.setState({buscaPUrl:this.getSearchUrl(),morePaginate:true},false)
        this.scrollInfinitoInit()
        this.loadMoreWithButtonR()
    }
    
  }
  render(booleanRender){
    console.log('el estado es',this.state)
    if(booleanRender){
      this.ajaxRender()
    }
    if(this.divMultiSelect){
      this.addToSelect()
    }
    
    
    
  }
  setState(newState,booleanRender) {
    Object.assign(this.state, newState);
    
    this.render(booleanRender);
    
  }
  ajaxRender(){
   

    let request = new XMLHttpRequest();
    request.open('GET', this.state.buscaPUrl, true);
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        let data = request.responseText;
        if (data.trim().length < 1) {
          this.setState({moreResults:false,morePaginate:false,currentPage:2},false)
          console.log("There is no more results for page")
          document.getElementById('loadMoreContentBtn').style.opacity = ' 0.6'
          document.getElementById('loadMoreContentBtn').innerHTML = 'No hay mas productos'
        } else {
          if (this.state.last) {
            let container = document.implementation.createHTMLDocument().documentElement;
            container.innerHTML = data;
            this.callbackGeneral();
            this.callbackShowcases(container)
            
          
            var nodeList = container.querySelector(this.classGrid).innerHTML;
            
            this.loadContent.innerHTML = nodeList

            
          } else {
            let container = document.implementation.createHTMLDocument().documentElement;
            container.innerHTML = data;
            this.callbackGeneral();
            this.callbackShowcases(container)

            var nodeList = container.querySelector(this.classGrid).innerHTML;

            this.loadContent.insertAdjacentHTML('beforeend', nodeList)

            

            
          }

        }
      } 
    };
    request.send();
    if(this.state.morePaginate){
      let currentPage = this.state.currentPage + 1
      console.log('cambio el current',currentPage)
      this.setState({currentPage:currentPage},false)
    }
    
   
    
  }
  getSearchUrl(){
    let url;
    let preg = /\/buscapagina\?.+&PageNumber=/i,
      pregCollection = /\/paginaprateleira\?.+PageNumber=/i


    $("script:not([src])").each(function () {
      var content = this.innerHTML;
      if (content.indexOf("buscapagina") > -1) {
        url = preg.exec(content);
        return false;
      } else if (content.indexOf("paginaprateleira") > -1) {
        url = pregCollection.exec(content);
        return false;
      }
    });

    if (typeof url === "object" && typeof url[0] !== "undefined")
      return url[0].replace("paginaprateleira", 'buscapagina');
    else {
      log("No se puede encontrar la URL de búsqueda de la página. \ N Intente agregar .js al final de la página. \n[Método: getSearchUrl]");
      return "";
    }

  }
  cleanFilter() {
    
    if (this.searchSingleNavigator) {
      let subcategories = this.searchSingleNavigator.querySelectorAll('h4,h5,h3')
      if (this.searchSingleNavigator.querySelector('ul.Faixa.de.preço')) {
        //oculta links de precios
        this.searchSingleNavigator.querySelector('h5.HideFaixa-de-preco').style.display = 'none';
        this.searchSingleNavigator.querySelector('ul.Faixa.de.preço').style.display = 'none';
      }
      //limpiar numeros de link en search-single-navigator
      console.log('subcategorias',subcategories)
      subcategories.forEach(ele => {

        let links = ele.querySelector('a')
        if(links){
          let text = links.textContent
          text = text.replace(/\([0-9]+\)/ig, " ")
          links.textContent = text;
        }
         
        //console.log(ele.nextElementSibling.tagName)
        if (ele.nextElementSibling && ele.nextElementSibling.tagName == 'UL') {
          let linkSubs = ele.nextElementSibling.querySelectorAll('a')
          for (let element of linkSubs) {

            let text = element.textContent

            text = text.replace(/\([0-9]+\)/ig, " ")

            element.textContent = text;

          }
        }


      })
    }
    if (this.searchMultipleNavigator) {
      let fieldsetsMultiple = this.searchMultipleNavigator.querySelectorAll('fieldset')
      fieldsetsMultiple.forEach((ele) => {
        let fieldH5 = ele.querySelector('h5'),
          inputs = ele.querySelectorAll('input'),
          divIn = ele.querySelector('div'),
          breadcump = document.querySelector('.breadCrumbSec'),
          titlePage = document.querySelector('.categorySection__top__titleDescp'),
          bodyPage = document.querySelector('.categorySection__mainCont'),
          hideFilterAreas = [breadcump, titlePage, bodyPage]

        
        if(fieldH5.textContent == 'Rango de precios'){
          fieldH5.textContent = 'Precio'
          fieldH5.parentElement.classList.add('rango-precio')
        }
        for (let element of inputs) {

          let label = element.parentElement,
            text = label.textContent
          text = text.replace(/\([0-9]+\)/ig, "")
          label.textContent = text;
          label.insertAdjacentElement('afterbegin', element);
          label.classList.add(`fil-${text.replace(/\s/g, "")}`);
          label.setAttribute('data-value', `${text.replace(/\s/g, "")}`);

          element.addEventListener('change', this.actionChecbox.bind(this))
          //console.log('inpurts',element)
        }
        divIn.classList.add('close__div')
        fieldH5.insertAdjacentHTML('beforeend','<span class="filter__icon__tab"></span>')
        fieldH5.addEventListener('click', (e) => {
          e.preventDefault()
          this.closeDivsFilter()
          if(e.target.classList.contains('active__panel')){
            fieldH5.classList.remove('active__panel')
            fieldH5.nextElementSibling.classList.add('close__div')
          }else{
            fieldH5.classList.add('active__panel')
            fieldH5.nextElementSibling.classList.remove('close__div')
          }
        })
        hideFilterAreas.forEach((ele) => {
          ele.addEventListener('click', () => {
            if(fieldH5.classList.contains('active__panel')){
              fieldH5.classList.remove('active__panel')
              fieldH5.nextElementSibling.classList.add('close__div')
            }
          })
        })
      })
    }

  }
  closeDivsFilter(){
    this.searchMultipleNavigator.querySelectorAll('fieldset').forEach(ele=>{
          
          ele.querySelector('div').classList.add('close__div')
    })
  }
  actionChecbox(e){
    let checkbox = e.target,
        fq = checkbox.getAttribute('rel'),
        textValueSect =  checkbox.parentElement.getAttribute('data-value'),
        last = false
       
        this.currentPage = 2

        if(document.getElementById('cleanFilters')){
          document.getElementById('cleanFilters').style.display = 'block'
        }
        if (e.target.checked == true){
          let newbuscaPUrl = `${this.state.buscaPUrl.replace(`&PS`, `&${fq}&PS`).replace(/pagenumber\=[0-9]*/i, "PageNumber=1")}`,
          newSelect = [...this.state.valuesSelects, textValueSect]
          e.target.parentElement.classList.add('checkeado');
          console.log('hshhshs',newbuscaPUrl)
          
          this.setState({last:true,valuesSelects:newSelect,updateValuesSelects:true,buscaPUrl:newbuscaPUrl,moreResults:true,currentPage:2},true)
          
        }else{
          let newbuscaPUrl = `${this.state.buscaPUrl.replace(`&${fq}`, '').replace(/pagenumber\=[0-9]*/i, "PageNumber=1")}`,
          removeSelects = this.state.valuesSelects.filter(item => item != textValueSect)
          
          e.target.parentElement.classList.remove('checkeado')
          this.setState({last:true,valuesSelects:removeSelects,updateValuesSelects:false,buscaPUrl:newbuscaPUrl,moreResults:true,currentPage:2},true)
        }
        document.getElementById('loadMoreContentBtn').style.opacity = ' 1'
    document.getElementById('loadMoreContentBtn').innerHTML = 'Cargar más productos'
       
  }
  getUrlParameter(name, url) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
  createSelect(){
   
    if(this.selectOrderCustom){
      this.selectORderDivAppend.insertAdjacentHTML('beforeend',this.selecHtml)
      const orderBy = easydropdown('#orderbyFilterSelect', {
        callbacks: {
          onSelect: value => {

            this.changeSelectOrder(value)
          }
        }
      });

    }
  }
  changeSelectOrder(value){
    if(value == ""){
      let last = false,
          newbuscaPUrl =  this.state.buscaPUrl.replace('&O=/\?*/&PS=.', `&O=${value}&PS=`).replace(/pagenumber\=[0-9]*/i, "PageNumber=1")
          
          this.setState({last:last,updateValuesSelects:false,buscaPUrl:newbuscaPUrl,currentPage:2,moreResults:true,morePaginate:true},true)

    }else{
      let last = true,
        urlParams = new URLSearchParams(this.state.buscaPUrl);
        if (urlParams.has('O')){
          let valPar = this.getUrlParameter('O', this.state.buscaPUrl),
          newbuscaPUrl =  this.state.buscaPUrl.replace(`&O=${valPar}`, `&O=${value}`).replace(/pagenumber\=[0-9]*/i, "PageNumber=1")
          console.log('select1')
          this.setState({last:last,updateValuesSelects:false,buscaPUrl:newbuscaPUrl,currentPage:2,moreResults:true,morePaginate:false},true)
        }else{
          let newbuscaPUrl =  this.state.buscaPUrl.replace('&PS=', `&O=${value}&PS=`).replace(/pagenumber\=[0-9]*/i, "PageNumber=1")
          console.log('select2')
          this.setState({last:last,buscaPUrl:newbuscaPUrl,currentPage:2,moreResults:true,morePaginate:false},true)
        }
    }
    document.getElementById('loadMoreContentBtn').style.opacity = ' 1'
    document.getElementById('loadMoreContentBtn').innerHTML = 'Cargar más productos'
  }
  multiSelectHtml(){
   
    if(this.divMultiSelectDiv){
      this.divMultiSelectDiv.insertAdjacentHTML('beforeend',this.contSelectLabel)
      document.querySelector('.search__multiple__selected').addEventListener('click', this.actionMultiple)

    }
  }
  actionMultiple(e) {
    
    if (e.target.hasAttribute('data-value')) {
      e.preventDefault()
      
      let value = e.target.getAttribute('data-value'),
        elementSelected = document.querySelector(`.search-multiple-navigator label.checkeado[data-value*="${value}"]`)
      elementSelected.click();

    }
    if (e.target.id == 'cleanFilters') {
      e.preventDefault()
      let elementSelected = document.querySelectorAll('.search-multiple-navigator label.checkeado'),
          index = 4;
      
      for (let element of elementSelected) {
        setTimeout(function () {
          element.click();
        }, 600 + index)
        index = index * 4
      }
    }

    if(e.target.id == 'nextAction'){
      document.querySelector('#search__multiple__selected__action__list').scrollLeft += 20;
    }
    if(e.target.id == 'prevAction'){
      document.querySelector('#search__multiple__selected__action__list').scrollLeft -= 20;
    }
    

  }
  addToSelect() {
    let  buttonHtml = '',
    searchMultiple = document.querySelector('.search__multiple__selected'),
          constButton = searchMultiple.querySelector('#search__multiple__selected__action__list')

    if(this.state.valuesSelects.length > 0){
      console.log('estaso',this.state.valuesSelects)
      this.state.valuesSelects.forEach((ele,i)=>{
        buttonHtml += `
        <button type="button" data-value="${ele}" class="button">${ele}</button>
        `
        
      })
     
      searchMultiple.querySelector('#search__multiple__selected__action__list').innerHTML = buttonHtml;
      searchMultiple.querySelector('#cleanFilters').style.display = 'block'
      console.log('evalueee',constButton.offsetWidth < constButton.scrollWidth)
      if(constButton.offsetWidth < constButton.scrollWidth){
        searchMultiple.querySelector('#prevAction').style.display = 'block'
        searchMultiple.querySelector('#nextAction').style.display = 'block'
      }else{
        searchMultiple.querySelector('#prevAction').style.display = 'none'
        searchMultiple.querySelector('#nextAction').style.display = 'none'
      }
     
    }else{
      searchMultiple.querySelector('#search__multiple__selected__action__list').innerHTML = '';
      searchMultiple.querySelector('#cleanFilters').style.display = 'none'
      searchMultiple.querySelector('#prevAction').style.display = 'none'
        searchMultiple.querySelector('#nextAction').style.display = 'none'
    }
  }
  scrollInfinitoInit(){
   
    if(this.scrollInfinito){
      window.addEventListener('scroll',()=>{
       console.log('scroll funciona')
        if(this.state.moreResults){
          
          if (window.scrollY > (this.loadContent.offsetHeight + this.loadContent.offsetTop - 440)){
            //console.log('haciendo scolrr1')
            let newbuscaPUrl = `${this.state.buscaPUrl.replace(/pagenumber\=[0-9]*/i, "PageNumber=" + this.state.currentPage)}`
            this.setState({last:false,buscaPUrl:newbuscaPUrl,morePaginate:true},true)
            
          }
        }
      })
    }
  }
  loadMoreWithButtonR(){
    if(this.loadMoreWithButton){
      let itemsLoad = document.querySelectorAll('.showcases__grid[id^="ResultItems"] ul').length,
          totalItems = document.querySelector('.resultado-busca-numero .value').textContent,
          btnHtml = `<div class="smartFilter__loadMoreContent">
        <p><span id="itemsLength">${itemsLoad}</span> de <span id="itemsTotal">${totalItems}</span> Productos</p>
        <a href="#" id="loadMoreContentBtn" class="smartFilter__loadMoreContent__btn">
          Cargar más productos
        </a>
      </div>`

      if (totalItems > 20) {
        this.loadContent.insertAdjacentHTML('afterend',btnHtml)
      }

      document.getElementById('loadMoreContentBtn').addEventListener('click',(e)=>{
        e.preventDefault()
       
        setTimeout(() => {
            if (totalItems == document.querySelectorAll('.categorySection__mainCont__showcases ul').length -2) {
              document.getElementById('loadMoreContentBtn').style.opacity = ' 0.6'
              document.getElementById('loadMoreContentBtn').innerHTML = 'No hay mas productos'
            }
          }, 2000)
          
          let newbuscaPUrl = `${this.state.buscaPUrl.replace(/pagenumber\=[0-9]*/i, "PageNumber=" + this.state.currentPage)}`
          this.setState({last:false,buscaPUrl:newbuscaPUrl,morePaginate:true},true)
          setTimeout(()=>{
            document.getElementById('itemsLength').textContent = document.querySelectorAll('.categorySection__mainCont__showcases ul').length -2
          },900)
      })
      
    }
  }










}

export default SmartFilter;