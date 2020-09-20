import easydropdown from 'easydropdown'
import Ordercart from './ordercart'
class CalculateShiping{
    constructor(urlData,divContainer){
        this.data = null
        this.form = `
            <button id="formShipingClose">
                <span class="icon-fl-icon-fl-close"></span>
            </button>
            <form class="formShiping">
                <select id="departamentoSelect">
                    <option value="" data-placeholder>Departamento</option>
                </select>
                <select id="ciudadSelect1">
                    <option value="" data-placeholder>Ciudad</option> 
                </select>
                <div class="result">
                <p style="display:none;">El valor del envío para <span class="ciudad"></span> es de <span class="valor"></span></p>
                </div>
                <p>El valor aquí mostrado es aproximado, depende del número de unidades, forma de pago y demás productos agregados.</p>
                <h3 style="display:none;">Lo sentimos pero no hacemos envios a tu ciudad</h3>
            </form>
        </div>
        `
        this.urlData = urlData
        this.divContainer = document.querySelector(divContainer)
        this.selectDepartamento = null
        this.selectCity = null
        this.optionDepartament = ''
        this.init()
    }
    async init(){
        this.data = await this.getDat()
        //console.log(this.data)
        this.divContainer.insertAdjacentHTML('beforeend', this.form);
        this.selectDepartamento = document.getElementById('departamentoSelect')
        this.selectCity = document.getElementById('ciudadSelect1')

        for (let [key, value] of Object.entries(this.data)){
            this.optionDepartament += `
            <option value="${key}">${key}</option>
        `

        }
        this.selectDepartamento.insertAdjacentHTML('beforeend', this.optionDepartament)
        const dep = easydropdown(this.selectDepartamento, {
            callbacks: {
              onSelect: value => {
                
                this.departamentChange(value)
              }
            },
            behavior: {
                liveUpdates: true,
                maxVisibleItems:4
            }
        });
        const city = easydropdown(this.selectCity, {
            callbacks: {
              onSelect: value => {
                ////console.log(event)
                this.getShiping(value)
              }
            },
            behavior: {
                liveUpdates: true,
                maxVisibleItems:4
            }
        });
        document.getElementById('formShipingClose').addEventListener('click',(e)=>{
            e.preventDefault()
            document.getElementById('calculateShipingCont').classList.remove('active')
            document.getElementById('shipingCalculate').classList.remove('active')

        })
        
        
        
  
    }
    async getDat(){
        const response = await fetch(this.urlData, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "cache-control": "no-cache",
            }
          });
          const json = await response.json();
        
          return json;
    }
    departamentChange(valueDep){
        let citys 
        for (let [key, value] of Object.entries(this.data)){
           if(key == valueDep){
               citys = value
           }
        

        }
        this.cityChange(citys)
       

        ////console.log(document.getElementById('departamentoSelect').value)
    }
    cityChange(citys){
        this.optionDepartament = ''
        citys.forEach(element => {
            this.optionDepartament += `
                <option value="${element.codigoPostal}-${element.nombreCiudad}">${element.nombreCiudad}</option>
            `
        });
        this.selectCity.innerHTML = '<option value="" data-placeholder>Ciudad</option> '
        this.selectCity.insertAdjacentHTML('beforeend',this.optionDepartament)
    }
    getShiping(value){
        if(value != '' && value != undefined){
            const items = [{
                id       : skuJson.skus[0].sku,
                quantity : 1,
                seller   : '1'
           }],
            arrValue = value.split('-'),
            postalCode = arrValue[0],
            country = 'COL'
           
            vtexjs.checkout.simulateShipping(items, postalCode, country).done(function(result) {
                //console.log(result.logisticsInfo[0].slas.length)
               if(result.logisticsInfo[0].slas.length >= 1){
                document.querySelector('.formShiping .ciudad').innerHTML = arrValue[1]
                document.querySelector('.formShiping .result p').style.display = 'block'
                document.querySelector('.formShiping h3').style.display = 'none'
                if(result.logisticsInfo[0].slas.length < 2){
                    document.querySelector('.formShiping .valor').innerHTML = '$ ' +Ordercart.currency(parseInt(result.logisticsInfo[0].slas[0].price.toString().substring(0, result.logisticsInfo[0].slas[0].price.toString().length-2)))
                }else if(result.logisticsInfo[0].slas.length >= 2){
                    document.querySelector('.formShiping .valor').innerHTML = '$ ' +Ordercart.currency(parseInt(result.logisticsInfo[0].slas[1].price.toString().substring(0, result.logisticsInfo[0].slas[1].price.toString().length-2)))
                }
                
                
               }else{
                document.querySelector('.formShiping .result p').style.display = 'none'
                document.querySelector('.formShiping  h3').style.display = 'block'
               }
                
           });
        }
        
    }
}
export default CalculateShiping;