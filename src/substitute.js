/**
 * @param  {Node} node    - The target DOM Node.
 * @return {void}
 */
function replaceText (node) {

  if (node.noteType === Node.TEXT_NODE)
    return;

  if (node.nodeType === Node.ELEMENT_NODE) {
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType.

    // Because DOM manipulation is slow, we don't want to keep setting
    // textContent after every replacement. Instead, manipulate a copy of
    // this string outside of the DOM and then perform the manipulation
    // once, at the end.
    
    if(node.nodeName == "SPAN") {
      let attrs = node.attributes;
      let elem = node;

      if(attrs && attrs.hasOwnProperty('data-wyr')) {
        let link = atob(attrs['data-wyr'].value);
        let innhtm = elem.innerHTML;
        elem.outerHTML = '<a href="' + link + '" target="_blank" title="' + link + '">' + innhtm + '</a>';
      }  
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      replaceText(node.childNodes[i]);
    }
  }
}

// Start the recursion from the body tag.
replaceText(document.body);

// Now monitor the DOM for additions and substitute into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // This DOM change was new nodes being added. Run our substitution
      // algorithm on each newly added node.
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const newNode = mutation.addedNodes[i];
        replaceText(newNode);
      }
    }
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});
