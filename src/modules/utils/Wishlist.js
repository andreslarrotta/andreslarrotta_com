class WishlistAdd {
  constructor(sku = null, callback = null) {
    //recibo el sku
    this.sku = sku
    this.callback = callback
    //funcion que consulta el mail en la order
    this.init()

  }
  async init() {

    let infoData = await this.getMail()

    if (!infoData) {
      document.querySelector('.ajax-content-loader a#login').click()
    } else {
      let addSku = await this.addSku(infoData, this.sku)


    }
  }
  async getMail() {
    let orderForm = await vtexjs.checkout.getOrderForm()
    if (orderForm.clientProfileData == null) {
      return false
    } else {
      if (orderForm.clientProfileData.email == null) {

        return false;
      } else {
        vtexjs.checkout.getProfileByEmail(orderForm.clientProfileData.email);
        return this.getProfile(orderForm.clientProfileData.email);
      }
    }


  }
  async getProfile(email) {
    const response = await fetch(`https://${location.hostname}/api/dataentities/CL/search?email=${email}&_fields=id,email,wishlist`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "cache-control": "no-cache",
      }
    });
    const json = await response.json();


    if (Object.keys(json).length == 0) {

      let jsonAdd = [{
        id: null,
        email: email,
        wishlist: null
      }]

      return jsonAdd
    } else {
      return json
    }


  }
  async addSku(infoData, sku) {

    if (infoData[0].wishlist == null) {

      let jsonAdd = [{
        email: infoData[0].email,
        id: infoData[0].id,
        wishlist: [{
          sku: sku
        }]
      }]

      const send = await this.sendList(jsonAdd)
      return send
    } else {
      let exist = false,
        jsonAdd = [{
          email: infoData[0].email,
          id: infoData[0].id,
          wishlist: infoData[0].wishlist
        }]
      for (let item of infoData[0].wishlist) {
        if (item.sku == this.sku) {
          exist = true;
          break;

        }
      }
      if (!exist) {

        jsonAdd[0].wishlist.push({
          sku: sku
        })

      }
      const send = await this.sendList(jsonAdd)
      return send


    }

  }
  async sendList(json) {


    if (json[0].id == null) {
      delete json[0].id
    }

    //console.log(json)
    const responset = await fetch(`https://${location.hostname}/api/dataentities/CL/documents`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "cache-control": "no-cache",
      },
      body: JSON.stringify(json[0])
    })
    const list = await responset.json();
    if (list.hasOwnProperty('Id')) {
      this.callback(true)
      return true

    } else {
      this.callback(false)
      return false
    }
  }


}
class WishlistGet extends WishlistAdd {
  constructor() {
    super()
    this.data = null

  }
  async init() {
  }
  async get() {
    let infoData = await super.getMail()
    this.data = infoData
    return infoData
  }
  remove(sku) {

    let index = this.data[0].wishlist.findIndex(item => item.sku === sku)
    this.data[0].wishlist.splice(index, 1)

    return this.data
  }

}
export {
  WishlistAdd,
  WishlistGet

};
