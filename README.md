### USAGE
* Go to www.marmot.com and add at least 2 products to your cart.
* Return to www.marmot.com.
* Open the JavaScript console (Mac: press `⌘ + j`).
* Paste the code found in snippet.js and press `enter`.
* Scroll down to bottom of the page to initiate trigger.
  * Note: You must get to the bottom 10% of the screen, but for large windows where the 10% point falls below the top of the screen when you hit bottom, just hitting bottom will initiate the trigger as well.
* Once overlay appears, there is the following displayed:
  * Quantity of items in the cart.
  * Estimated dollar total of cart.
  * Images of items in cart.
    * Note: If there are 2 or more of the same item in the cart, the image appears only once.
  * `CLOSE` button closes the overlay.
  * `SEE CART` button takes user to www.marmot.com/cart to view cart.
* Once closed, overlay can be triggered again by scrolling back up and back down again.

### BONUS

Here are the ways I dealt with items less than or more than 2:
  * Currently the snippet grabs all items in cart regardless of quantity of items and handles 0 items in cart as well.
  * The info box that displays on the overlay will expand to accommodate multiple rows of images.
