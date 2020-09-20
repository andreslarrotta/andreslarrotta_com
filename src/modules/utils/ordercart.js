
class Ordercart {
  constructor() {


  }
  //funcion que crea tagstring template
  static templater(strings, ...keys) {
    return function (data) {
      let temp = strings.slice();

      keys.forEach((key, i) => {
        temp[i] = temp[i] + data[key];
      });

      return temp.join('');
    }
  }
  //funcion para obtener el paraemtro de una url
  static getParameterByName(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  //funcion para actulizar el parametro de una url
  static updateQueryStringParameter(uri, key, value) {
    let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    let separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
      return uri + separator + key + "=" + value;
    }
  }
  static currency(amount, decimalCount = 0, decimal = ".", thousands = ".") {
    //console.log(amount)
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      //console.log(e)
    }
  }
  static buttonsChangeQ(element, callback = false) {
    let type = element.getAttribute('data-type');
    let fieldName = element.getAttribute('data-field');

    let input = document.querySelector(`input[name="${fieldName}"]`);
    let currentVal = parseInt(input.value);
    let final = null
    if (!isNaN(currentVal)) {
      if (type == 'minus') {
        if (currentVal > input.getAttribute('min')) {
          input.value = currentVal - 1;
          input.dispatchEvent(new Event("change"));
          final = input.value
        }
        if (currentVal == input.getAttribute('min')) {

        }
      } else if (type == 'plus') {
        if (currentVal < input.getAttribute('max')) {
          input.value = currentVal + 1;
          input.dispatchEvent(new Event("change"));
          final = input.value
        }
        if (currentVal == input.getAttribute('max')) {

        }
      }
    } else {
      input.value = 0;
      final = input.value
    }

    if(callback != false){
      callback(final)
    }

    


  }
  static quantityChanged(element) {
    let minValue = parseInt(element.target.getAttribute('min'));
    let maxValue = parseInt(element.target.getAttribute('min'));
    let valueCu = parseInt(element.target.value);
    let name = element.target.getAttribute('name');
    if (valueCu <= minValue) {
      element.target.value = minValue;
    }
    if (valueCu >= maxValue) {
      element.target.value = maxValue;
    }
  }
  static changeQuyCart(indexItem,value,callback){
    vtexjs.checkout.getOrderForm()
    .then(function(orderForm) {
      let item = orderForm.items[indexItem],
        updateItem = {
        index: indexItem,
        quantity: value
      };
      return vtexjs.checkout.updateItems([updateItem], null, false);
    })
    .done(function(orderForm) {
      callback()
      
    });
  }
  //funcion de minicart
  static async miniCart() {
    //ejecuta el objeto vtexjs y su funcion getOrderForm
    let orderForm = await vtexjs.checkout.getOrderForm()
    let output = {
      items: orderForm.items,
      totals: {
        total: orderForm.value,
        discounts: orderForm.totalizers.filter(item => item.id == "Discounts"),
        shipping: orderForm.totalizers.filter(item => item.id == "Shipping"),
      },
      tItems: orderForm.items.length
    }
    return output;


  }
  /* 
      funcion para agregar productos al carro
          recibe como parametro
              href= la url que se encuentra en el boton de comprar asincronicamente
              qty= la cantidad de productos que s evan a comprar
              callback= funcion que se ejecuta despues de agregar los items al minicart
  */
  static singleAddCart(href, qty, callback) {
    let nHref = Ordercart.updateQueryStringParameter(href, "qty", qty);
    let skuId = Ordercart.getParameterByName(nHref, "sku");
    var item = {
      id: skuId,
      quantity: qty,
      seller: '1'
    };
    vtexjs.checkout.addToCart([item], null, 1)
      .done(function(orderForm) {
        callback(orderForm)
      });
    return false;
  }
  static removeItem(itemIndex,quantity,callback){
        
    vtexjs.checkout.getOrderForm().then(function(orderForm) {
        var item = orderForm.items[itemIndex];
        var itemsToRemove = [
        {
            "index": itemIndex,
            "quantity": quantity,
        }
        ]
        return vtexjs.checkout.removeItems(itemsToRemove);
    })
    .done(function(orderForm) {
        ///alert('Producto Eliminado');
        //console.log(orderForm);
        callback(orderForm)
    });
}

  static removeCents(string) {
    let nString = string.replace(',00', '');
    return nString;
  }
  static getSku(href) {
    let skuId = Ordercart.getParameterByName(href, "sku");
    return skuId
  }


}
export default Ordercart;