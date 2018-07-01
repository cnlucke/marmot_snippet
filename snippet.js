//***** CSS *****//
const OVERLAYCSS = {
  width:      "100%",
  height:     "100%",
  top:        "0",
  left:       "0",
  "z-index":  "100",
  position:   "fixed",
  display:    "flex",
  "justify-content":  "center",
  "align-items":      "center",
  "text-align":       "center",
}

const BOXCSS = {
  width:        "400px",
  color:        "black",
  display:      "block",
  margin:       "0 auto",
  padding:      "10px 25px",
  border:       "#a0a0a0 solid 5px",
  display:      "flex",
  "flex-wrap":  "wrap",
  "z-index":    "102",
  "min-height": "300px",
  "text-align": "center",
  "background-color": "white",
  "justify-content":  "center",
  "align-items":      "center",
  "font": "ars_maquette_probold,sans-serif",
}

const HEADERCSS = {
  "font-weight": "600",
  "flex": "0 0 100%",
  "font-size": "30px",
  "font-family": "normal 20px/30px ars_maquette_prolight,sans-serif",
  "margin-bottom": "5px",
}

const BUTTONCSS = {
  padding:        "14px 30px",
  "font-family":  "ars_maquette_probold,sans-serif",
  color:          "black",
  "font-size":    "12px",
  display:        "inline-block",
  "text-align":   "center",
  margin:         "5px",
  width:          "80%",
  "background-color": "#ddd",
}

class Cart {
  constructor() {
    this.total = 0
    this.itemCount = []
    this.images = []
  }

  fetch(done) {
    $.get( "/cart", (data) => {
      const doc = $.parseHTML( data )
      this.itemCount = this.getTotalItemsInCart(doc)
      this.total = this.getCartTotal(doc)
      this.images = this.getImages(doc)
      done(this)
    })
  }

  getNode(doc, selector) {
    return Array.from($(doc).find(selector))
  }
  // TOTAL ITEMS - returns integer
  getTotalItemsInCart(doc) {
    const nodes = this.getNode(doc, '.input-change-value')
    return nodes.reduce( (sum, item) => sum + parseInt(item.value), 0)
  }

  // CART TOTAL DOLLARS - returns string of form "$685.00"
  getCartTotal(doc) {
    const node = this.getNode(doc, 'tr.order-total td.order-value')[0]
    return (node) ? node.innerText : '$0.00'
  }

  // Item images - returns array of img nodes
  getImages(doc) {
    const nodes = this.getNode(doc ,'td.item-image a img')
    return (nodes.length > 0) ? nodes : []
  }
}

class InfoModal {
  constructor() {
    this.cart = new Cart()
    this.overlay = null
    this.transparentOverlay = null
    this.showing = false
  }

  show() {
    if (this.showing) return
    this.showing = true
    this.cart.fetch(() => this.render())
  }

  render() {
    this.overlay = this.buildOverlay()
    this.transparentOverlay = this.buildTransparentOverlay()
    this.transparentOverlay.append(this.buildBox())
    $(document.body).append(this.overlay)
    $(this.overlay).fadeTo( 500 , 0.8, () => {
      $(document.body).append(this.transparentOverlay)
    })
  }

  close() {
    if (!this.showing) return
    this.showing = false
    this.overlay.remove()
    this.transparentOverlay.remove()
  }

  buildOverlay() {
    return $('<div></div>')
    .css(OVERLAYCSS).css({
      background: "#000",
      opacity:    "0",
    })
  }

  // This transparent overlay allows info box to remain opaque
  buildTransparentOverlay() {
    return $('<div></div>')
    .css(OVERLAYCSS).css({
      background: "rgba(0, 0, 0, 0)",
    })
  }

  //***** BUILD INFO BOX *****//
  buildBox() {
    const $box = $('<div></div>')
    $box.css(BOXCSS)

    // HEADER
    const $header = $("<h3>Your Cart</h3>")
    $header.css(HEADERCSS)
    $box.append($header)

    // CART INFO AND IMAGES
    const $info = this.buildCartInfo()
    $info.append(this.buildCartImages())
    $box.append($info)

    // BUTTONS
    const $buttonsDiv = $('<div></div>')
    const $cartButton = this.buildButton('SEE CART', () => {
      window.location = "/cart"
    })
    const $closeButton = this.buildButton('CLOSE', () => this.close())
    $buttonsDiv.append($cartButton)
    $buttonsDiv.append($closeButton)
    $info.after($buttonsDiv)

    return $box
  }

  buildCartInfo() {
    const $ul = $('<ul></ul>')
    const $info =  $(`<li><b>Quantity:</b> ${this.cart.itemCount}</li>` +
                    `<li><b>Estimated Total:</b> ${this.cart.total}</li>`)
    $info.css({"line-height": "2"})
    $ul.append($info)
    $ul.css({ "font-size": "20px", margin: "auto", "text-align": "left"})
    return $ul
  }

  buildCartImages() {
    const $imageDiv = $('<div></div>').css({ "text-align": "center"})
    this.cart.images.forEach(node => $imageDiv.append(node))
    return $imageDiv
  }

  buildButton(text, handler) {
    const $button = $(`<button>${text}</button>`)
    $button.css(BUTTONCSS)
    $button.hover((e) => {
      $(e.target).css({"background-color":"red", color: "white"})
    }, (e) => {
      $(e.target).css({"background-color": "#ddd", color: "black"});
    })
    $button.click(handler)
    return $button
  }
}

const infoModal = new InfoModal()

// TRIGGER
$(window).scroll(function () {
  // If browser window is large/full-screen, it might not be able to scroll to bottom 10% point,
  // so trigger also works on document.height() - window.height()
  const bottomTenPercentHeight = $(document).height() * .9
  const lowestScrollPoint = $(document).height() - $(window).height()
  const triggerPoint = Math.min(bottomTenPercentHeight, lowestScrollPoint)

  if ($(window).scrollTop() >= triggerPoint) {
    infoModal.show()
  }
});
