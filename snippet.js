let showing = false
$(window).scroll(function () {
  // If browser window is large/full-screen, it might not be able to scroll to bottom 10% point,
  // so trigger also works on document.height() - window.height()
  const bottomTenPercentHeight = $(document).height() * .9
  const lowestScrollPoint = $(document).height() - $(window).height()
  const triggerPoint = Math.min(bottomTenPercentHeight, lowestScrollPoint)

  if ($(window).scrollTop() >= triggerPoint) {
    if (showing) return
    showing = true

    showInfoModal()
  }
});

const showInfoModal = () => {
  $.get( "/cart", function( data ) {
    let doc = $.parseHTML( data )
    let cart = {
      itemCount: getTotalItemsInCart(doc),
      total: getCartTotal(doc),
      images: getImages(doc),
    }

    const $overlay = buildOverlay()
    const $transparentOverlay = buildTransparentOverlay()
    $transparentOverlay.append(buildInfoBox(cart, $overlay, $transparentOverlay))
    $(document.body).append($overlay)
    $($overlay).fadeTo( 500 , 0.8, () => {
      $(document.body).append($transparentOverlay)
    })
  })
}

//***** FETCH CART DETAILS *****//
// TOTAL ITEMS - returns integer
const getTotalItemsInCart = (doc) => {
  const nodes = Array.from($(doc).find('.input-change-value'))
  return nodes.reduce( (sum, item) => sum + parseInt(item.value), 0)
}

// CART TOTAL DOLLARS - returns string of form "$685.00"
const getCartTotal = (doc) => {
  const node = Array.from($(doc).find('tr.order-total').find('td.order-value'))[0]
  return (node) ? node.innerText : '$0.00'
}

// Item images - returns array of img nodes
const getImages = (doc) => {
  const nodes = Array.from($(doc).find('td.item-image').find('a').find('img'))
  return (nodes.length > 0) ? nodes : []
}

//***** BUILD OVERLAYS *****//
const overlayCss = {
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

const buildOverlay = () => {
  return $('<div></div>')
  .css(overlayCss).css({
    background: "#000",
    opacity:    "0",
  })
}
// This transparent overlay holds the info box and allows info box to be opaque
const buildTransparentOverlay = () => {
  return $('<div></div>')
  .css(overlayCss).css({
    background: "rgba(0, 0, 0, 0)",
  })
}

//***** BUILD INFO BOX *****//
const buildInfoBox = (cart, overlay, transparentOverlay) => {
  $box = $('<div></div>')
  $box.css({
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
  })

  //***** INFO CONTENTS *****//
  const $ul = $('<ul></ul>')

  // HEADER
  const header = $("<h3>Your Cart</h3>")
  header.css({
    "font-weight": "600",
    "flex": "0 0 100%",
    "font-size": "30px",
    "font-family": "normal 20px/30px ars_maquette_prolight,sans-serif",
    "margin-bottom": "5px",
  })
  $box.append(header)

  // INFO (itemCount and total)
  const $info =  $(`<li><b>Quantity:</b> ${cart.itemCount}</li><li><b>Estimated Total:</b> ${cart.total}</li>`)
  $info.css({"line-height": "2"})
  $ul.append($info)
  $ul.css({ "font-size": "20px", margin: "auto", "text-align": "left"})


  // IMAGES
  const $imageDiv = $('<div></div>').css({ "text-align": "center"})
  cart.images.forEach(node => $imageDiv.append(node))
  $ul.append($imageDiv)

  $box.append($ul)

  // BUTTONS
  const buttonStyle = {
    padding:        "14px 30px",
    "font-family":  "ars_maquette_probold,sans-serif",
    color:          "black",
    "font-size":    "12px",
    display:        "inline-block",
    "text-align":   "center",
    margin:         "5px",
    width:          "80%",
    "text-transform":   "uppercase",
    "background-color": "#ddd",
  }

  const buildButton = (text, handler) => {
    const $button = $(`<button>${text}</button>`)
    $button.css(buttonStyle)
    $button.hover((e) => {
      $(e.target).css({"background-color":"red", color: "white"})
    }, (e) => {
      $(e.target).css({"background-color": "#ddd", color: "black"});
    })
    $button.click(handler)
    return $button
  }

  const $closeButton = buildButton('CLOSE', () => {
    overlay.remove()
    transparentOverlay.remove()
    showing = false
  })

  const $cartButton = buildButton('SEE CART', () => {
    window.location = "/cart"
  })

  const $buttonsDiv = $('<div></div>')
  $buttonsDiv.append($cartButton)
  $buttonsDiv.append($closeButton)
  $ul.after($buttonsDiv)

  return $box
}
