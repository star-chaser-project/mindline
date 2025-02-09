// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/lit-html/lib/directive.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirective = exports.directive = void 0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */
const directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};
exports.directive = directive;
const isDirective = o => {
  return typeof o === 'function' && directives.has(o);
};
exports.isDirective = isDirective;
},{}],"../node_modules/lit-html/lib/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reparentNodes = exports.removeNodes = exports.isCEPolyfill = void 0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = exports.isCEPolyfill = typeof window !== 'undefined' && window.customElements != null && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
 * into another container (could be the same container), before `before`. If
 * `before` is null, it appends the nodes to the container.
 */
const reparentNodes = (container, start, end = null, before = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.insertBefore(start, before);
    start = n;
  }
};
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
exports.reparentNodes = reparentNodes;
const removeNodes = (container, start, end = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.removeChild(start);
    start = n;
  }
};
exports.removeNodes = removeNodes;
},{}],"../node_modules/lit-html/lib/part.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nothing = exports.noChange = void 0;
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = exports.noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = exports.nothing = {};
},{}],"../node_modules/lit-html/lib/template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeMarker = exports.markerRegex = exports.marker = exports.lastAttributeNameRegex = exports.isTemplatePartActive = exports.createMarker = exports.boundAttributeSuffix = exports.Template = void 0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = exports.marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = exports.nodeMarker = `<!--${marker}-->`;
const markerRegex = exports.markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = exports.boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */
class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    const nodesToRemove = [];
    const stack = [];
    // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
    const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
    // Keeps track of the last index associated with a part. We try to delete
    // unnecessary nodes, but we never want to associate two different parts
    // to the same index. They must have a constant node between.
    let lastPartIndex = 0;
    let index = -1;
    let partIndex = 0;
    const {
      strings,
      values: {
        length
      }
    } = result;
    while (partIndex < length) {
      const node = walker.nextNode();
      if (node === null) {
        // We've exhausted the content inside a nested template element.
        // Because we still have parts (the outer for-loop), we know:
        // - There is a template in the stack
        // - The walker will find a nextNode outside the template
        walker.currentNode = stack.pop();
        continue;
      }
      index++;
      if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
        if (node.hasAttributes()) {
          const attributes = node.attributes;
          const {
            length
          } = attributes;
          // Per
          // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
          // attributes are not guaranteed to be returned in document order.
          // In particular, Edge/IE can return them out of order, so we cannot
          // assume a correspondence between part index and attribute index.
          let count = 0;
          for (let i = 0; i < length; i++) {
            if (endsWith(attributes[i].name, boundAttributeSuffix)) {
              count++;
            }
          }
          while (count-- > 0) {
            // Get the template literal section leading up to the first
            // expression in this attribute
            const stringForPart = strings[partIndex];
            // Find the attribute name
            const name = lastAttributeNameRegex.exec(stringForPart)[2];
            // Find the corresponding attribute
            // All bound attributes have had a suffix added in
            // TemplateResult#getHTML to opt out of special attribute
            // handling. To look up the attribute value we also need to add
            // the suffix.
            const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
            const attributeValue = node.getAttribute(attributeLookupName);
            node.removeAttribute(attributeLookupName);
            const statics = attributeValue.split(markerRegex);
            this.parts.push({
              type: 'attribute',
              index,
              name,
              strings: statics
            });
            partIndex += statics.length - 1;
          }
        }
        if (node.tagName === 'TEMPLATE') {
          stack.push(node);
          walker.currentNode = node.content;
        }
      } else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
        const data = node.data;
        if (data.indexOf(marker) >= 0) {
          const parent = node.parentNode;
          const strings = data.split(markerRegex);
          const lastIndex = strings.length - 1;
          // Generate a new text node for each literal section
          // These nodes are also used as the markers for node parts
          for (let i = 0; i < lastIndex; i++) {
            let insert;
            let s = strings[i];
            if (s === '') {
              insert = createMarker();
            } else {
              const match = lastAttributeNameRegex.exec(s);
              if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
              }
              insert = document.createTextNode(s);
            }
            parent.insertBefore(insert, node);
            this.parts.push({
              type: 'node',
              index: ++index
            });
          }
          // If there's no text, we must insert a comment to mark our place.
          // Else, we can trust it will stick around after cloning.
          if (strings[lastIndex] === '') {
            parent.insertBefore(createMarker(), node);
            nodesToRemove.push(node);
          } else {
            node.data = strings[lastIndex];
          }
          // We have a part for each match found
          partIndex += lastIndex;
        }
      } else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
        if (node.data === marker) {
          const parent = node.parentNode;
          // Add a new marker node to be the startNode of the Part if any of
          // the following are true:
          //  * We don't have a previousSibling
          //  * The previousSibling is already the start of a previous part
          if (node.previousSibling === null || index === lastPartIndex) {
            index++;
            parent.insertBefore(createMarker(), node);
          }
          lastPartIndex = index;
          this.parts.push({
            type: 'node',
            index
          });
          // If we don't have a nextSibling, keep this node so we have an end.
          // Else, we can remove it to save future costs.
          if (node.nextSibling === null) {
            node.data = '';
          } else {
            nodesToRemove.push(node);
            index--;
          }
          partIndex++;
        } else {
          let i = -1;
          while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
            // Comment node has a binding marker inside, make an inactive part
            // The binding won't work, but subsequent bindings will
            // TODO (justinfagnani): consider whether it's even worth it to
            // make bindings in comments work
            this.parts.push({
              type: 'node',
              index: -1
            });
            partIndex++;
          }
        }
      }
    }
    // Remove text binding nodes after the walk to not disturb the TreeWalker
    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }
}
exports.Template = Template;
const endsWith = (str, suffix) => {
  const index = str.length - suffix.length;
  return index >= 0 && str.slice(index) === suffix;
};
const isTemplatePartActive = part => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
exports.isTemplatePartActive = isTemplatePartActive;
const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
exports.createMarker = createMarker;
const lastAttributeNameRegex = exports.lastAttributeNameRegex =
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
},{}],"../node_modules/lit-html/lib/template-instance.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateInstance = void 0;
var _dom = require("./dom.js");
var _template = require("./template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
  constructor(template, processor, options) {
    this.__parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }
  update(values) {
    let i = 0;
    for (const part of this.__parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }
      i++;
    }
    for (const part of this.__parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }
  _clone() {
    // There are a number of steps in the lifecycle of a template instance's
    // DOM fragment:
    //  1. Clone - create the instance fragment
    //  2. Adopt - adopt into the main document
    //  3. Process - find part markers and create parts
    //  4. Upgrade - upgrade custom elements
    //  5. Update - set node, attribute, property, etc., values
    //  6. Connect - connect to the document. Optional and outside of this
    //     method.
    //
    // We have a few constraints on the ordering of these steps:
    //  * We need to upgrade before updating, so that property values will pass
    //    through any property setters.
    //  * We would like to process before upgrading so that we're sure that the
    //    cloned fragment is inert and not disturbed by self-modifying DOM.
    //  * We want custom elements to upgrade even in disconnected fragments.
    //
    // Given these constraints, with full custom elements support we would
    // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
    //
    // But Safari does not implement CustomElementRegistry#upgrade, so we
    // can not implement that order and still have upgrade-before-update and
    // upgrade disconnected fragments. So we instead sacrifice the
    // process-before-upgrade constraint, since in Custom Elements v1 elements
    // must not modify their light DOM in the constructor. We still have issues
    // when co-existing with CEv0 elements like Polymer 1, and with polyfills
    // that don't strictly adhere to the no-modification rule because shadow
    // DOM, which may be created in the constructor, is emulated by being placed
    // in the light DOM.
    //
    // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
    // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
    // in one step.
    //
    // The Custom Elements v1 polyfill supports upgrade(), so the order when
    // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
    // Connect.
    const fragment = _dom.isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const stack = [];
    const parts = this.template.parts;
    // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
    const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
    let partIndex = 0;
    let nodeIndex = 0;
    let part;
    let node = walker.nextNode();
    // Loop through all the nodes and parts of a template
    while (partIndex < parts.length) {
      part = parts[partIndex];
      if (!(0, _template.isTemplatePartActive)(part)) {
        this.__parts.push(undefined);
        partIndex++;
        continue;
      }
      // Progress the tree walker until we find our next part's node.
      // Note that multiple parts may share the same node (attribute parts
      // on a single element), so this loop may not run at all.
      while (nodeIndex < part.index) {
        nodeIndex++;
        if (node.nodeName === 'TEMPLATE') {
          stack.push(node);
          walker.currentNode = node.content;
        }
        if ((node = walker.nextNode()) === null) {
          // We've exhausted the content inside a nested template element.
          // Because we still have parts (the outer for-loop), we know:
          // - There is a template in the stack
          // - The walker will find a nextNode outside the template
          walker.currentNode = stack.pop();
          node = walker.nextNode();
        }
      }
      // We've arrived at our part's node.
      if (part.type === 'node') {
        const part = this.processor.handleTextExpression(this.options);
        part.insertAfterNode(node.previousSibling);
        this.__parts.push(part);
      } else {
        this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
      }
      partIndex++;
    }
    if (_dom.isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }
    return fragment;
  }
}
exports.TemplateInstance = TemplateInstance;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/template-result.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateResult = exports.SVGTemplateResult = void 0;
var _dom = require("./dom.js");
var _template = require("./template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module lit-html
 */

/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = window.trustedTypes && trustedTypes.createPolicy('lit-html', {
  createHTML: s => s
});
const commentMarker = ` ${_template.marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */
  getHTML() {
    const l = this.strings.length - 1;
    let html = '';
    let isCommentBinding = false;
    for (let i = 0; i < l; i++) {
      const s = this.strings[i];
      // For each binding we want to determine the kind of marker to insert
      // into the template source before it's parsed by the browser's HTML
      // parser. The marker type is based on whether the expression is in an
      // attribute, text, or comment position.
      //   * For node-position bindings we insert a comment with the marker
      //     sentinel as its text content, like <!--{{lit-guid}}-->.
      //   * For attribute bindings we insert just the marker sentinel for the
      //     first binding, so that we support unquoted attribute bindings.
      //     Subsequent bindings can use a comment marker because multi-binding
      //     attributes must be quoted.
      //   * For comment bindings we insert just the marker sentinel so we don't
      //     close the comment.
      //
      // The following code scans the template source, but is *not* an HTML
      // parser. We don't need to track the tree structure of the HTML, only
      // whether a binding is inside a comment, and if not, if it appears to be
      // the first binding in an attribute.
      const commentOpen = s.lastIndexOf('<!--');
      // We're in comment position if we have a comment open with no following
      // comment close. Because <-- can appear in an attribute value there can
      // be false positives.
      isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf('-->', commentOpen + 1) === -1;
      // Check to see if we have an attribute-like sequence preceding the
      // expression. This can match "name=value" like structures in text,
      // comments, and attribute values, so there can be false-positives.
      const attributeMatch = _template.lastAttributeNameRegex.exec(s);
      if (attributeMatch === null) {
        // We're only in this branch if we don't have a attribute-like
        // preceding sequence. For comments, this guards against unusual
        // attribute values like <div foo="<!--${'bar'}">. Cases like
        // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
        // below.
        html += s + (isCommentBinding ? commentMarker : _template.nodeMarker);
      } else {
        // For attributes we use just a marker sentinel, and also append a
        // $lit$ suffix to the name to opt-out of attribute-specific parsing
        // that IE and Edge do for style and certain SVG attributes.
        html += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + _template.boundAttributeSuffix + attributeMatch[3] + _template.marker;
      }
    }
    html += this.strings[l];
    return html;
  }
  getTemplateElement() {
    const template = document.createElement('template');
    let value = this.getHTML();
    if (policy !== undefined) {
      // this is secure because `this.strings` is a TemplateStringsArray.
      // TODO: validate this when
      // https://github.com/tc39/proposal-array-is-template-object is
      // implemented.
      value = policy.createHTML(value);
    }
    template.innerHTML = value;
    return template;
  }
}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */
exports.TemplateResult = TemplateResult;
class SVGTemplateResult extends TemplateResult {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }
  getTemplateElement() {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild;
    content.removeChild(svgElement);
    (0, _dom.reparentNodes)(content, svgElement.firstChild);
    return template;
  }
}
exports.SVGTemplateResult = SVGTemplateResult;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/parts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPrimitive = exports.isIterable = exports.PropertyPart = exports.PropertyCommitter = exports.NodePart = exports.EventPart = exports.BooleanAttributePart = exports.AttributePart = exports.AttributeCommitter = void 0;
var _directive = require("./directive.js");
var _dom = require("./dom.js");
var _part = require("./part.js");
var _templateInstance = require("./template-instance.js");
var _templateResult = require("./template-result.js");
var _template = require("./template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const isPrimitive = value => {
  return value === null || !(typeof value === 'object' || typeof value === 'function');
};
exports.isPrimitive = isPrimitive;
const isIterable = value => {
  return Array.isArray(value) ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */
exports.isIterable = isIterable;
class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];
    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */
  _createPart() {
    return new AttributePart(this);
  }
  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    const parts = this.parts;
    // If we're assigning an attribute via syntax like:
    //    attr="${foo}"  or  attr=${foo}
    // but not
    //    attr="${foo} ${bar}" or attr="${foo} baz"
    // then we don't want to coerce the attribute value into one long
    // string. Instead we want to just return the value itself directly,
    // so that sanitizeDOMValue can get the actual value rather than
    // String(value)
    // The exception is if v is an array, in which case we do want to smash
    // it together into a string without calling String() on the array.
    //
    // This also allows trusted values (when using TrustedTypes) being
    // assigned to DOM sinks without being stringified in the process.
    if (l === 1 && strings[0] === '' && strings[1] === '') {
      const v = parts[0].value;
      if (typeof v === 'symbol') {
        return String(v);
      }
      if (typeof v === 'string' || !isIterable(v)) {
        return v;
      }
    }
    let text = '';
    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = parts[i];
      if (part !== undefined) {
        const v = part.value;
        if (isPrimitive(v) || !isIterable(v)) {
          text += typeof v === 'string' ? v : String(v);
        } else {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        }
      }
    }
    text += strings[l];
    return text;
  }
  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }
}
/**
 * A Part that controls all or part of an attribute value.
 */
exports.AttributeCommitter = AttributeCommitter;
class AttributePart {
  constructor(committer) {
    this.value = undefined;
    this.committer = committer;
  }
  setValue(value) {
    if (value !== _part.noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value;
      // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().
      if (!(0, _directive.isDirective)(value)) {
        this.committer.dirty = true;
      }
    }
  }
  commit() {
    while ((0, _directive.isDirective)(this.value)) {
      const directive = this.value;
      this.value = _part.noChange;
      directive(this);
    }
    if (this.value === _part.noChange) {
      return;
    }
    this.committer.commit();
  }
}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */
exports.AttributePart = AttributePart;
class NodePart {
  constructor(options) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.options = options;
  }
  /**
   * Appends this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  appendInto(container) {
    this.startNode = container.appendChild((0, _template.createMarker)());
    this.endNode = container.appendChild((0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` node (between `ref` and `ref`'s next
   * sibling). Both `ref` and its next sibling must be static, unchanging nodes
   * such as those that appear in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  appendIntoPart(part) {
    part.__insert(this.startNode = (0, _template.createMarker)());
    part.__insert(this.endNode = (0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */
  insertAfterPart(ref) {
    ref.__insert(this.startNode = (0, _template.createMarker)());
    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }
  setValue(value) {
    this.__pendingValue = value;
  }
  commit() {
    if (this.startNode.parentNode === null) {
      return;
    }
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }
    const value = this.__pendingValue;
    if (value === _part.noChange) {
      return;
    }
    if (isPrimitive(value)) {
      if (value !== this.value) {
        this.__commitText(value);
      }
    } else if (value instanceof _templateResult.TemplateResult) {
      this.__commitTemplateResult(value);
    } else if (value instanceof Node) {
      this.__commitNode(value);
    } else if (isIterable(value)) {
      this.__commitIterable(value);
    } else if (value === _part.nothing) {
      this.value = _part.nothing;
      this.clear();
    } else {
      // Fallback, will render the string representation
      this.__commitText(value);
    }
  }
  __insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }
  __commitNode(value) {
    if (this.value === value) {
      return;
    }
    this.clear();
    this.__insert(value);
    this.value = value;
  }
  __commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value;
    // If `value` isn't already a string, we explicitly convert it here in case
    // it can't be implicitly converted - i.e. it's a symbol.
    const valueAsString = typeof value === 'string' ? value : String(value);
    if (node === this.endNode.previousSibling && node.nodeType === 3 /* Node.TEXT_NODE */) {
      // If we only have a single text node between the markers, we can just
      // set its value, rather than replacing it.
      // TODO(justinfagnani): Can we just check if this.value is primitive?
      node.data = valueAsString;
    } else {
      this.__commitNode(document.createTextNode(valueAsString));
    }
    this.value = value;
  }
  __commitTemplateResult(value) {
    const template = this.options.templateFactory(value);
    if (this.value instanceof _templateInstance.TemplateInstance && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new _templateInstance.TemplateInstance(template, value.processor, this.options);
      const fragment = instance._clone();
      instance.update(value.values);
      this.__commitNode(fragment);
      this.value = instance;
    }
  }
  __commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    }
    // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render
    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;
    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex];
      // If no existing part, create a new one
      if (itemPart === undefined) {
        itemPart = new NodePart(this.options);
        itemParts.push(itemPart);
        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }
      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }
    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }
  clear(startNode = this.startNode) {
    (0, _dom.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }
}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
exports.NodePart = NodePart;
class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this.__pendingValue = undefined;
    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }
    this.element = element;
    this.name = name;
    this.strings = strings;
  }
  setValue(value) {
    this.__pendingValue = value;
  }
  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }
    if (this.__pendingValue === _part.noChange) {
      return;
    }
    const value = !!this.__pendingValue;
    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }
      this.value = value;
    }
    this.__pendingValue = _part.noChange;
  }
}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */
exports.BooleanAttributePart = BooleanAttributePart;
class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }
  _createPart() {
    return new PropertyPart(this);
  }
  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }
    return super._getValue();
  }
  commit() {
    if (this.dirty) {
      this.dirty = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.element[this.name] = this._getValue();
    }
  }
}
exports.PropertyCommitter = PropertyCommitter;
class PropertyPart extends AttributePart {}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
exports.PropertyPart = PropertyPart;
let eventOptionsSupported = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
  try {
    const options = {
      get capture() {
        eventOptionsSupported = true;
        return false;
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener('test', options, options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.removeEventListener('test', options, options);
  } catch (_e) {
    // event options not supported
  }
})();
class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;
    this.__boundHandleEvent = e => this.handleEvent(e);
  }
  setValue(value) {
    this.__pendingValue = value;
  }
  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }
    if (this.__pendingValue === _part.noChange) {
      return;
    }
    const newListener = this.__pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }
    if (shouldAddListener) {
      this.__options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }
    this.value = newListener;
    this.__pendingValue = _part.noChange;
  }
  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }
}
// We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.
exports.EventPart = EventPart;
const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);
},{"./directive.js":"../node_modules/lit-html/lib/directive.js","./dom.js":"../node_modules/lit-html/lib/dom.js","./part.js":"../node_modules/lit-html/lib/part.js","./template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./template-result.js":"../node_modules/lit-html/lib/template-result.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/default-template-processor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = void 0;
var _parts = require("./parts.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];
    if (prefix === '.') {
      const committer = new _parts.PropertyCommitter(element, name.slice(1), strings);
      return committer.parts;
    }
    if (prefix === '@') {
      return [new _parts.EventPart(element, name.slice(1), options.eventContext)];
    }
    if (prefix === '?') {
      return [new _parts.BooleanAttributePart(element, name.slice(1), strings)];
    }
    const committer = new _parts.AttributeCommitter(element, name, strings);
    return committer.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */
  handleTextExpression(options) {
    return new _parts.NodePart(options);
  }
}
exports.DefaultTemplateProcessor = DefaultTemplateProcessor;
const defaultTemplateProcessor = exports.defaultTemplateProcessor = new DefaultTemplateProcessor();
},{"./parts.js":"../node_modules/lit-html/lib/parts.js"}],"../node_modules/lit-html/lib/template-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateCaches = void 0;
exports.templateFactory = templateFactory;
var _template = require("./template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);
  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }
  let template = templateCache.stringsArray.get(result.strings);
  if (template !== undefined) {
    return template;
  }
  // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content
  const key = result.strings.join(_template.marker);
  // Check if we already have a Template for this key
  template = templateCache.keyString.get(key);
  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new _template.Template(result, result.getTemplateElement());
    // Cache the Template for this key
    templateCache.keyString.set(key, template);
  }
  // Cache all future queries for this TemplateStringsArray
  templateCache.stringsArray.set(result.strings, template);
  return template;
}
const templateCaches = exports.templateCaches = new Map();
},{"./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.parts = void 0;
var _dom = require("./dom.js");
var _parts = require("./parts.js");
var _templateFactory = require("./template-factory.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const parts = exports.parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
const render = (result, container, options) => {
  let part = parts.get(container);
  if (part === undefined) {
    (0, _dom.removeNodes)(container, container.firstChild);
    parts.set(container, part = new _parts.NodePart(Object.assign({
      templateFactory: _templateFactory.templateFactory
    }, options)));
    part.appendInto(container);
  }
  part.setValue(result);
  part.commit();
};
exports.render = render;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./parts.js":"../node_modules/lit-html/lib/parts.js","./template-factory.js":"../node_modules/lit-html/lib/template-factory.js"}],"../node_modules/lit-html/lit-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AttributeCommitter", {
  enumerable: true,
  get: function () {
    return _parts.AttributeCommitter;
  }
});
Object.defineProperty(exports, "AttributePart", {
  enumerable: true,
  get: function () {
    return _parts.AttributePart;
  }
});
Object.defineProperty(exports, "BooleanAttributePart", {
  enumerable: true,
  get: function () {
    return _parts.BooleanAttributePart;
  }
});
Object.defineProperty(exports, "DefaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.DefaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "EventPart", {
  enumerable: true,
  get: function () {
    return _parts.EventPart;
  }
});
Object.defineProperty(exports, "NodePart", {
  enumerable: true,
  get: function () {
    return _parts.NodePart;
  }
});
Object.defineProperty(exports, "PropertyCommitter", {
  enumerable: true,
  get: function () {
    return _parts.PropertyCommitter;
  }
});
Object.defineProperty(exports, "PropertyPart", {
  enumerable: true,
  get: function () {
    return _parts.PropertyPart;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.SVGTemplateResult;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function () {
    return _template.Template;
  }
});
Object.defineProperty(exports, "TemplateInstance", {
  enumerable: true,
  get: function () {
    return _templateInstance.TemplateInstance;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.TemplateResult;
  }
});
Object.defineProperty(exports, "createMarker", {
  enumerable: true,
  get: function () {
    return _template.createMarker;
  }
});
Object.defineProperty(exports, "defaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.defaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "directive", {
  enumerable: true,
  get: function () {
    return _directive.directive;
  }
});
exports.html = void 0;
Object.defineProperty(exports, "isDirective", {
  enumerable: true,
  get: function () {
    return _directive.isDirective;
  }
});
Object.defineProperty(exports, "isIterable", {
  enumerable: true,
  get: function () {
    return _parts.isIterable;
  }
});
Object.defineProperty(exports, "isPrimitive", {
  enumerable: true,
  get: function () {
    return _parts.isPrimitive;
  }
});
Object.defineProperty(exports, "isTemplatePartActive", {
  enumerable: true,
  get: function () {
    return _template.isTemplatePartActive;
  }
});
Object.defineProperty(exports, "noChange", {
  enumerable: true,
  get: function () {
    return _part.noChange;
  }
});
Object.defineProperty(exports, "nothing", {
  enumerable: true,
  get: function () {
    return _part.nothing;
  }
});
Object.defineProperty(exports, "parts", {
  enumerable: true,
  get: function () {
    return _render.parts;
  }
});
Object.defineProperty(exports, "removeNodes", {
  enumerable: true,
  get: function () {
    return _dom.removeNodes;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "reparentNodes", {
  enumerable: true,
  get: function () {
    return _dom.reparentNodes;
  }
});
exports.svg = void 0;
Object.defineProperty(exports, "templateCaches", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateCaches;
  }
});
Object.defineProperty(exports, "templateFactory", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateFactory;
  }
});
var _defaultTemplateProcessor = require("./lib/default-template-processor.js");
var _templateResult = require("./lib/template-result.js");
var _directive = require("./lib/directive.js");
var _dom = require("./lib/dom.js");
var _part = require("./lib/part.js");
var _parts = require("./lib/parts.js");
var _render = require("./lib/render.js");
var _templateFactory = require("./lib/template-factory.js");
var _templateInstance = require("./lib/template-instance.js");
var _template = require("./lib/template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 *
 * Main lit-html module.
 *
 * Main exports:
 *
 * -  [[html]]
 * -  [[svg]]
 * -  [[render]]
 *
 * @packageDocumentation
 */
/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */

// TODO(justinfagnani): remove line when we get NodePart moving methods

// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.4.1');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new _templateResult.TemplateResult(strings, values, 'html', _defaultTemplateProcessor.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */
exports.html = html;
const svg = (strings, ...values) => new _templateResult.SVGTemplateResult(strings, values, 'svg', _defaultTemplateProcessor.defaultTemplateProcessor);
exports.svg = svg;
},{"./lib/default-template-processor.js":"../node_modules/lit-html/lib/default-template-processor.js","./lib/template-result.js":"../node_modules/lit-html/lib/template-result.js","./lib/directive.js":"../node_modules/lit-html/lib/directive.js","./lib/dom.js":"../node_modules/lit-html/lib/dom.js","./lib/part.js":"../node_modules/lit-html/lib/part.js","./lib/parts.js":"../node_modules/lit-html/lib/parts.js","./lib/render.js":"../node_modules/lit-html/lib/render.js","./lib/template-factory.js":"../node_modules/lit-html/lib/template-factory.js","./lib/template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./lib/template.js":"../node_modules/lit-html/lib/template.js"}],"views/partials/splash.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _litHtml = require("lit-html");
var _templateObject;
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
const splash = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\n  <div class=\"app-splash\">\n    <div class=\"inner\">\n      <img class=\"app-logo\" src=\"/images/logo.svg\" />\n      <sl-spinner style=\"font-size: 2em;\"></sl-spinner>\n    </div>\n  </div>\n"])));
var _default = exports.default = splash;
},{"lit-html":"../node_modules/lit-html/lit-html.js"}],"../node_modules/gsap/gsap-core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapYoyo = exports.wrap = exports.unitize = exports.toArray = exports.splitColor = exports.snap = exports.shuffle = exports.selector = exports.random = exports.pipe = exports.normalize = exports.mapRange = exports.interpolate = exports.gsap = exports.getUnit = exports.distribute = exports.default = exports.clamp = exports._ticker = exports._sortPropTweensByPriority = exports._setDefaults = exports._roundModifier = exports._round = exports._replaceRandom = exports._renderComplexString = exports._removeLinkedListItem = exports._relExp = exports._plugins = exports._parseRelative = exports._numWithUnitExp = exports._numExp = exports._missingPlugin = exports._isUndefined = exports._isString = exports._getSetter = exports._getProperty = exports._getCache = exports._forEachName = exports._config = exports._colorStringFilter = exports._colorExp = exports._checkPlugin = exports.TweenMax = exports.TweenLite = exports.Tween = exports.TimelineMax = exports.TimelineLite = exports.Timeline = exports.Strong = exports.SteppedEase = exports.Sine = exports.Quint = exports.Quart = exports.Quad = exports.PropTween = exports.Power4 = exports.Power3 = exports.Power2 = exports.Power1 = exports.Power0 = exports.Linear = exports.GSCache = exports.Expo = exports.Elastic = exports.Cubic = exports.Circ = exports.Bounce = exports.Back = exports.Animation = void 0;
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/*!
 * GSAP 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var _config = exports._config = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: {
      lineHeight: ""
    }
  },
  _defaults = {
    duration: .5,
    overwrite: false,
    delay: 0
  },
  _suppressOverwrites,
  _reverting,
  _context,
  _bigNum = 1e8,
  _tinyNum = 1 / _bigNum,
  _2PI = Math.PI * 2,
  _HALF_PI = _2PI / 4,
  _gsID = 0,
  _sqrt = Math.sqrt,
  _cos = Math.cos,
  _sin = Math.sin,
  _isString = exports._isString = function _isString(value) {
    return typeof value === "string";
  },
  _isFunction = function _isFunction(value) {
    return typeof value === "function";
  },
  _isNumber = function _isNumber(value) {
    return typeof value === "number";
  },
  _isUndefined = exports._isUndefined = function _isUndefined(value) {
    return typeof value === "undefined";
  },
  _isObject = function _isObject(value) {
    return typeof value === "object";
  },
  _isNotFalse = function _isNotFalse(value) {
    return value !== false;
  },
  _windowExists = function _windowExists() {
    return typeof window !== "undefined";
  },
  _isFuncOrString = function _isFuncOrString(value) {
    return _isFunction(value) || _isString(value);
  },
  _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function () {},
  // note: IE10 has ArrayBuffer, but NOT ArrayBuffer.isView().
  _isArray = Array.isArray,
  _strictNumExp = /(?:-?\.?\d|\.)+/gi,
  //only numbers (including negatives and decimals) but NOT relative values.
  _numExp = exports._numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
  //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
  _numWithUnitExp = exports._numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
  _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
  //duplicate so that while we're looping through matches from exec(), it doesn't contaminate the lastIndex of _numExp which we use to search for colors too.
  _relExp = exports._relExp = /[+-]=-?[.\d]+/,
  _delimitedValueExp = /[^,'"\[\]\s]+/gi,
  // previously /[#\-+.]*\b[a-z\d\-=+%.]+/gi but didn't catch special characters.
  _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
  _globalTimeline,
  _win,
  _coreInitted,
  _doc,
  _globals = {},
  _installScope = {},
  _coreReady,
  _install = function _install(scope) {
    return (_installScope = _merge(scope, _globals)) && gsap;
  },
  _missingPlugin = exports._missingPlugin = function _missingPlugin(property, value) {
    return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
  },
  _warn = function _warn(message, suppress) {
    return !suppress && console.warn(message);
  },
  _addGlobal = function _addGlobal(name, obj) {
    return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
  },
  _emptyFunc = function _emptyFunc() {
    return 0;
  },
  _startAtRevertConfig = {
    suppressEvents: true,
    isStart: true,
    kill: false
  },
  _revertConfigNoKill = {
    suppressEvents: true,
    kill: false
  },
  _revertConfig = {
    suppressEvents: true
  },
  _reservedProps = {},
  _lazyTweens = [],
  _lazyLookup = {},
  _lastRenderedFrame,
  _plugins = exports._plugins = {},
  _effects = {},
  _nextGCFrame = 30,
  _harnessPlugins = [],
  _callbackNames = "",
  _harness = function _harness(targets) {
    var target = targets[0],
      harnessPlugin,
      i;
    _isObject(target) || _isFunction(target) || (targets = [targets]);
    if (!(harnessPlugin = (target._gsap || {}).harness)) {
      // find the first target with a harness. We assume targets passed into an animation will be of similar type, meaning the same kind of harness can be used for them all (performance optimization)
      i = _harnessPlugins.length;
      while (i-- && !_harnessPlugins[i].targetTest(target)) {}
      harnessPlugin = _harnessPlugins[i];
    }
    i = targets.length;
    while (i--) {
      targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
    }
    return targets;
  },
  _getCache = exports._getCache = function _getCache(target) {
    return target._gsap || _harness(toArray(target))[0]._gsap;
  },
  _getProperty = exports._getProperty = function _getProperty(target, property, v) {
    return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
  },
  _forEachName = exports._forEachName = function _forEachName(names, func) {
    return (names = names.split(",")).forEach(func) || names;
  },
  //split a comma-delimited list of names into an array, then run a forEach() function and return the split array (this is just a way to consolidate/shorten some code).
  _round = exports._round = function _round(value) {
    return Math.round(value * 100000) / 100000 || 0;
  },
  _roundPrecise = function _roundPrecise(value) {
    return Math.round(value * 10000000) / 10000000 || 0;
  },
  // increased precision mostly for timing values.
  _parseRelative = exports._parseRelative = function _parseRelative(start, value) {
    var operator = value.charAt(0),
      end = parseFloat(value.substr(2));
    start = parseFloat(start);
    return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
  },
  _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
    //searches one array to find matches for any of the items in the toFind array. As soon as one is found, it returns true. It does NOT return all the matches; it's simply a boolean search.
    var l = toFind.length,
      i = 0;
    for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}
    return i < l;
  },
  _lazyRender = function _lazyRender() {
    var l = _lazyTweens.length,
      a = _lazyTweens.slice(0),
      i,
      tween;
    _lazyLookup = {};
    _lazyTweens.length = 0;
    for (i = 0; i < l; i++) {
      tween = a[i];
      tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
    }
  },
  _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
    _lazyTweens.length && !_reverting && _lazyRender();
    animation.render(time, suppressEvents, force || _reverting && time < 0 && (animation._initted || animation._startAt));
    _lazyTweens.length && !_reverting && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
  },
  _numericIfPossible = function _numericIfPossible(value) {
    var n = parseFloat(value);
    return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
  },
  _passThrough = function _passThrough(p) {
    return p;
  },
  _setDefaults = exports._setDefaults = function _setDefaults(obj, defaults) {
    for (var p in defaults) {
      p in obj || (obj[p] = defaults[p]);
    }
    return obj;
  },
  _setKeyframeDefaults = function _setKeyframeDefaults(excludeDuration) {
    return function (obj, defaults) {
      for (var p in defaults) {
        p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults[p]);
      }
    };
  },
  _merge = function _merge(base, toMerge) {
    for (var p in toMerge) {
      base[p] = toMerge[p];
    }
    return base;
  },
  _mergeDeep = function _mergeDeep(base, toMerge) {
    for (var p in toMerge) {
      p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
    }
    return base;
  },
  _copyExcluding = function _copyExcluding(obj, excluding) {
    var copy = {},
      p;
    for (p in obj) {
      p in excluding || (copy[p] = obj[p]);
    }
    return copy;
  },
  _inheritDefaults = function _inheritDefaults(vars) {
    var parent = vars.parent || _globalTimeline,
      func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults;
    if (_isNotFalse(vars.inherit)) {
      while (parent) {
        func(vars, parent.vars.defaults);
        parent = parent.parent || parent._dp;
      }
    }
    return vars;
  },
  _arraysMatch = function _arraysMatch(a1, a2) {
    var i = a1.length,
      match = i === a2.length;
    while (match && i-- && a1[i] === a2[i]) {}
    return i < 0;
  },
  _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }
    if (lastProp === void 0) {
      lastProp = "_last";
    }
    var prev = parent[lastProp],
      t;
    if (sortBy) {
      t = child[sortBy];
      while (prev && prev[sortBy] > t) {
        prev = prev._prev;
      }
    }
    if (prev) {
      child._next = prev._next;
      prev._next = child;
    } else {
      child._next = parent[firstProp];
      parent[firstProp] = child;
    }
    if (child._next) {
      child._next._prev = child;
    } else {
      parent[lastProp] = child;
    }
    child._prev = prev;
    child.parent = child._dp = parent;
    return child;
  },
  _removeLinkedListItem = exports._removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }
    if (lastProp === void 0) {
      lastProp = "_last";
    }
    var prev = child._prev,
      next = child._next;
    if (prev) {
      prev._next = next;
    } else if (parent[firstProp] === child) {
      parent[firstProp] = next;
    }
    if (next) {
      next._prev = prev;
    } else if (parent[lastProp] === child) {
      parent[lastProp] = prev;
    }
    child._next = child._prev = child.parent = null; // don't delete the _dp just so we can revert if necessary. But parent should be null to indicate the item isn't in a linked list.
  },
  _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
    child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
    child._act = 0;
  },
  _uncache = function _uncache(animation, child) {
    if (animation && (!child || child._end > animation._dur || child._start < 0)) {
      // performance optimization: if a child animation is passed in we should only uncache if that child EXTENDS the animation (its end time is beyond the end)
      var a = animation;
      while (a) {
        a._dirty = 1;
        a = a.parent;
      }
    }
    return animation;
  },
  _recacheAncestors = function _recacheAncestors(animation) {
    var parent = animation.parent;
    while (parent && parent.parent) {
      //sometimes we must force a re-sort of all children and update the duration/totalDuration of all ancestor timelines immediately in case, for example, in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
      parent._dirty = 1;
      parent.totalDuration();
      parent = parent.parent;
    }
    return animation;
  },
  _rewindStartAt = function _rewindStartAt(tween, totalTime, suppressEvents, force) {
    return tween._startAt && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
  },
  _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
    return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
  },
  _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
    return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
  },
  // feed in the totalTime and cycleDuration and it'll return the cycle (iteration minus 1) and if the playhead is exactly at the very END, it will NOT bump up to the next cycle.
  _animationCycle = function _animationCycle(tTime, cycleDuration) {
    var whole = Math.floor(tTime /= cycleDuration);
    return tTime && whole === tTime ? whole - 1 : whole;
  },
  _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
    return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
  },
  _setEnd = function _setEnd(animation) {
    return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
  },
  _alignPlayhead = function _alignPlayhead(animation, totalTime) {
    // adjusts the animation's _start and _end according to the provided totalTime (only if the parent's smoothChildTiming is true and the animation isn't paused). It doesn't do any rendering or forcing things back into parent timelines, etc. - that's what totalTime() is for.
    var parent = animation._dp;
    if (parent && parent.smoothChildTiming && animation._ts) {
      animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
      _setEnd(animation);
      parent._dirty || _uncache(parent, animation); //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
    }
    return animation;
  },
  /*
  _totalTimeToTime = (clampedTotalTime, duration, repeat, repeatDelay, yoyo) => {
  	let cycleDuration = duration + repeatDelay,
  		time = _round(clampedTotalTime % cycleDuration);
  	if (time > duration) {
  		time = duration;
  	}
  	return (yoyo && (~~(clampedTotalTime / cycleDuration) & 1)) ? duration - time : time;
  },
  */
  _postAddChecks = function _postAddChecks(timeline, child) {
    var t;
    if (child._time || !child._dur && child._initted || child._start < timeline._time && (child._dur || !child.add)) {
      // in case, for example, the _start is moved on a tween that has already rendered, or if it's being inserted into a timeline BEFORE where the playhead is currently. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning. Special case: if it's a timeline (has .add() method) and no duration, we can skip rendering because the user may be populating it AFTER adding it to a parent timeline (unconventional, but possible, and we wouldn't want it to get removed if the parent's autoRemoveChildren is true).
      t = _parentToChildTotalTime(timeline.rawTime(), child);
      if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
        child.render(t, true);
      }
    } //if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.

    if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
      //in case any of the ancestors had completed but should now be enabled...
      if (timeline._dur < timeline.duration()) {
        t = timeline;
        while (t._dp) {
          t.rawTime() >= 0 && t.totalTime(t._tTime); //moves the timeline (shifts its startTime) if necessary, and also enables it. If it's currently zero, though, it may not be scheduled to render until later so there's no need to force it to align with the current playhead position. Only move to catch up with the playhead.

          t = t._dp;
        }
      }
      timeline._zTime = -_tinyNum; // helps ensure that the next render() will be forced (crossingStart = true in render()), even if the duration hasn't changed (we're adding a child which would need to get rendered). Definitely an edge case. Note: we MUST do this AFTER the loop above where the totalTime() might trigger a render() because this _addToTimeline() method gets called from the Animation constructor, BEFORE tweens even record their targets, etc. so we wouldn't want things to get triggered in the wrong order.
    }
  },
  _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
    child.parent && _removeFromParent(child);
    child._start = _roundPrecise((_isNumber(position) ? position : position || timeline !== _globalTimeline ? _parsePosition(timeline, position, child) : timeline._time) + child._delay);
    child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
    _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);
    _isFromOrFromStart(child) || (timeline._recent = child);
    skipChecks || _postAddChecks(timeline, child);
    timeline._ts < 0 && _alignPlayhead(timeline, timeline._tTime); // if the timeline is reversed and the new child makes it longer, we may need to adjust the parent's _start (push it back)

    return timeline;
  },
  _scrollTrigger = function _scrollTrigger(animation, trigger) {
    return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
  },
  _attemptInitTween = function _attemptInitTween(tween, time, force, suppressEvents, tTime) {
    _initTween(tween, time, tTime);
    if (!tween._initted) {
      return 1;
    }
    if (!force && tween._pt && !_reverting && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
      _lazyTweens.push(tween);
      tween._lazy = [tTime, suppressEvents];
      return 1;
    }
  },
  _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart(_ref) {
    var parent = _ref.parent;
    return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart(parent));
  },
  // check parent's _lock because when a timeline repeats/yoyos and does its artificial wrapping, we shouldn't force the ratio back to 0
  _isFromOrFromStart = function _isFromOrFromStart(_ref2) {
    var data = _ref2.data;
    return data === "isFromStart" || data === "isStart";
  },
  _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
    var prevRatio = tween.ratio,
      ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1,
      // if the tween or its parent is reversed and the totalTime is 0, we should go to a ratio of 0. Edge case: if a from() or fromTo() stagger tween is placed later in a timeline, the "startAt" zero-duration tween could initially render at a time when the parent timeline's playhead is technically BEFORE where this tween is, so make sure that any "from" and "fromTo" startAt tweens are rendered the first time at a ratio of 1.
      repeatDelay = tween._rDelay,
      tTime = 0,
      pt,
      iteration,
      prevIteration;
    if (repeatDelay && tween._repeat) {
      // in case there's a zero-duration tween that has a repeat with a repeatDelay
      tTime = _clamp(0, tween._tDur, totalTime);
      iteration = _animationCycle(tTime, repeatDelay);
      tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
      if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
        // if iteration changed
        prevRatio = 1 - ratio;
        tween.vars.repeatRefresh && tween._initted && tween.invalidate();
      }
    }
    if (ratio !== prevRatio || _reverting || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
      if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) {
        // if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
        return;
      }
      prevIteration = tween._zTime;
      tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0); // when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

      suppressEvents || (suppressEvents = totalTime && !prevIteration); // if it was rendered previously at exactly 0 (_zTime) and now the playhead is moving away, DON'T fire callbacks otherwise they'll seem like duplicates.

      tween.ratio = ratio;
      tween._from && (ratio = 1 - ratio);
      tween._time = 0;
      tween._tTime = tTime;
      pt = tween._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
      totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
      tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
      tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");
      if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
        ratio && _removeFromParent(tween, 1);
        if (!suppressEvents && !_reverting) {
          _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);
          tween._prom && tween._prom();
        }
      }
    } else if (!tween._zTime) {
      tween._zTime = totalTime;
    }
  },
  _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
    var child;
    if (time > prevTime) {
      child = animation._first;
      while (child && child._start <= time) {
        if (child.data === "isPause" && child._start > prevTime) {
          return child;
        }
        child = child._next;
      }
    } else {
      child = animation._last;
      while (child && child._start >= time) {
        if (child.data === "isPause" && child._start < prevTime) {
          return child;
        }
        child = child._prev;
      }
    }
  },
  _setDuration = function _setDuration(animation, duration, skipUncache, leavePlayhead) {
    var repeat = animation._repeat,
      dur = _roundPrecise(duration) || 0,
      totalProgress = animation._tTime / animation._tDur;
    totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
    animation._dur = dur;
    animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
    totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
    animation.parent && _setEnd(animation);
    skipUncache || _uncache(animation.parent, animation);
    return animation;
  },
  _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
    return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
  },
  _zeroPosition = {
    _start: 0,
    endTime: _emptyFunc,
    totalDuration: _emptyFunc
  },
  _parsePosition = function _parsePosition(animation, position, percentAnimation) {
    var labels = animation.labels,
      recent = animation._recent || _zeroPosition,
      clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur,
      //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
      i,
      offset,
      isPercent;
    if (_isString(position) && (isNaN(position) || position in labels)) {
      //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
      offset = position.charAt(0);
      isPercent = position.substr(-1) === "%";
      i = position.indexOf("=");
      if (offset === "<" || offset === ">") {
        i >= 0 && (position = position.replace(/=/, ""));
        return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
      }
      if (i < 0) {
        position in labels || (labels[position] = clippedDuration);
        return labels[position];
      }
      offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));
      if (isPercent && percentAnimation) {
        offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
      }
      return i > 1 ? _parsePosition(animation, position.substr(0, i - 1), percentAnimation) + offset : clippedDuration + offset;
    }
    return position == null ? clippedDuration : +position;
  },
  _createTweenType = function _createTweenType(type, params, timeline) {
    var isLegacy = _isNumber(params[1]),
      varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
      vars = params[varsIndex],
      irVars,
      parent;
    isLegacy && (vars.duration = params[1]);
    vars.parent = timeline;
    if (type) {
      irVars = vars;
      parent = timeline;
      while (parent && !("immediateRender" in irVars)) {
        // inheritance hasn't happened yet, but someone may have set a default in an ancestor timeline. We could do vars.immediateRender = _isNotFalse(_inheritDefaults(vars).immediateRender) but that'd exact a slight performance penalty because _inheritDefaults() also runs in the Tween constructor. We're paying a small kb price here to gain speed.
        irVars = parent.vars.defaults || {};
        parent = _isNotFalse(parent.vars.inherit) && parent.parent;
      }
      vars.immediateRender = _isNotFalse(irVars.immediateRender);
      type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1]; // "from" vars
    }
    return new Tween(params[0], vars, params[varsIndex + 1]);
  },
  _conditionalReturn = function _conditionalReturn(value, func) {
    return value || value === 0 ? func(value) : func;
  },
  _clamp = function _clamp(min, max, value) {
    return value < min ? min : value > max ? max : value;
  },
  getUnit = exports.getUnit = function getUnit(value, v) {
    return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
  },
  // note: protect against padded numbers as strings, like "100.100". That shouldn't return "00" as the unit. If it's numeric, return no unit.
  clamp = exports.clamp = function clamp(min, max, value) {
    return _conditionalReturn(value, function (v) {
      return _clamp(min, max, v);
    });
  },
  _slice = [].slice,
  _isArrayLike = function _isArrayLike(value, nonEmpty) {
    return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
  },
  _flatten = function _flatten(ar, leaveStrings, accumulator) {
    if (accumulator === void 0) {
      accumulator = [];
    }
    return ar.forEach(function (value) {
      var _accumulator;
      return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
    }) || accumulator;
  },
  //takes any value and returns an array. If it's a string (and leaveStrings isn't true), it'll use document.querySelectorAll() and convert that to an array. It'll also accept iterables like jQuery objects.
  toArray = exports.toArray = function toArray(value, scope, leaveStrings) {
    return _context && !scope && _context.selector ? _context.selector(value) : _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call((scope || _doc).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
  },
  selector = exports.selector = function selector(value) {
    value = toArray(value)[0] || _warn("Invalid scope") || {};
    return function (v) {
      var el = value.current || value.nativeElement || value;
      return toArray(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc.createElement("div") : value);
    };
  },
  shuffle = exports.shuffle = function shuffle(a) {
    return a.sort(function () {
      return .5 - Math.random();
    });
  },
  // alternative that's a bit faster and more reliably diverse but bigger:   for (let j, v, i = a.length; i; j = Math.floor(Math.random() * i), v = a[--i], a[i] = a[j], a[j] = v); return a;
  //for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
  distribute = exports.distribute = function distribute(v) {
    if (_isFunction(v)) {
      return v;
    }
    var vars = _isObject(v) ? v : {
        each: v
      },
      //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
      ease = _parseEase(vars.ease),
      from = vars.from || 0,
      base = parseFloat(vars.base) || 0,
      cache = {},
      isDecimal = from > 0 && from < 1,
      ratios = isNaN(from) || isDecimal,
      axis = vars.axis,
      ratioX = from,
      ratioY = from;
    if (_isString(from)) {
      ratioX = ratioY = {
        center: .5,
        edges: .5,
        end: 1
      }[from] || 0;
    } else if (!isDecimal && ratios) {
      ratioX = from[0];
      ratioY = from[1];
    }
    return function (i, target, a) {
      var l = (a || vars).length,
        distances = cache[l],
        originX,
        originY,
        x,
        y,
        d,
        j,
        max,
        min,
        wrapAt;
      if (!distances) {
        wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];
        if (!wrapAt) {
          max = -_bigNum;
          while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}
          wrapAt < l && wrapAt--;
        }
        distances = cache[l] = [];
        originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
        originY = wrapAt === _bigNum ? 0 : ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
        max = 0;
        min = _bigNum;
        for (j = 0; j < l; j++) {
          x = j % wrapAt - originX;
          y = originY - (j / wrapAt | 0);
          distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
          d > max && (max = d);
          d < min && (min = d);
        }
        from === "random" && shuffle(distances);
        distances.max = max - min;
        distances.min = min;
        distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
        distances.b = l < 0 ? base - l : base;
        distances.u = getUnit(vars.amount || vars.each) || 0; //unit

        ease = ease && l < 0 ? _invertEase(ease) : ease;
      }
      l = (distances[i] - distances.min) / distances.max || 0;
      return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u; //round in order to work around floating point errors
    };
  },
  _roundModifier = exports._roundModifier = function _roundModifier(v) {
    //pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
    var p = Math.pow(10, ((v + "").split(".")[1] || "").length); //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed())

    return function (raw) {
      var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
      return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw)); // n - n % 1 replaces Math.floor() in order to handle negative values properly. For example, Math.floor(-150.00000000000003) is 151!
    };
  },
  snap = exports.snap = function snap(snapTo, value) {
    var isArray = _isArray(snapTo),
      radius,
      is2D;
    if (!isArray && _isObject(snapTo)) {
      radius = isArray = snapTo.radius || _bigNum;
      if (snapTo.values) {
        snapTo = toArray(snapTo.values);
        if (is2D = !_isNumber(snapTo[0])) {
          radius *= radius; //performance optimization so we don't have to Math.sqrt() in the loop.
        }
      } else {
        snapTo = _roundModifier(snapTo.increment);
      }
    }
    return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function (raw) {
      is2D = snapTo(raw);
      return Math.abs(is2D - raw) <= radius ? is2D : raw;
    } : function (raw) {
      var x = parseFloat(is2D ? raw.x : raw),
        y = parseFloat(is2D ? raw.y : 0),
        min = _bigNum,
        closest = 0,
        i = snapTo.length,
        dx,
        dy;
      while (i--) {
        if (is2D) {
          dx = snapTo[i].x - x;
          dy = snapTo[i].y - y;
          dx = dx * dx + dy * dy;
        } else {
          dx = Math.abs(snapTo[i] - x);
        }
        if (dx < min) {
          min = dx;
          closest = i;
        }
      }
      closest = !radius || min <= radius ? snapTo[closest] : raw;
      return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
    });
  },
  random = exports.random = function random(min, max, roundingIncrement, returnFunction) {
    return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function () {
      return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * .99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
    });
  },
  pipe = exports.pipe = function pipe() {
    for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
      functions[_key] = arguments[_key];
    }
    return function (value) {
      return functions.reduce(function (v, f) {
        return f(v);
      }, value);
    };
  },
  unitize = exports.unitize = function unitize(func, unit) {
    return function (value) {
      return func(parseFloat(value)) + (unit || getUnit(value));
    };
  },
  normalize = exports.normalize = function normalize(min, max, value) {
    return mapRange(min, max, 0, 1, value);
  },
  _wrapArray = function _wrapArray(a, wrapper, value) {
    return _conditionalReturn(value, function (index) {
      return a[~~wrapper(index)];
    });
  },
  wrap = exports.wrap = function wrap(min, max, value) {
    // NOTE: wrap() CANNOT be an arrow function! A very odd compiling bug causes problems (unrelated to GSAP).
    var range = max - min;
    return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
      return (range + (value - min) % range) % range + min;
    });
  },
  wrapYoyo = exports.wrapYoyo = function wrapYoyo(min, max, value) {
    var range = max - min,
      total = range * 2;
    return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
      value = (total + (value - min) % total) % total || 0;
      return min + (value > range ? total - value : value);
    });
  },
  _replaceRandom = exports._replaceRandom = function _replaceRandom(value) {
    //replaces all occurrences of random(...) in a string with the calculated random value. can be a range like random(-100, 100, 5) or an array like random([0, 100, 500])
    var prev = 0,
      s = "",
      i,
      nums,
      end,
      isArray;
    while (~(i = value.indexOf("random(", prev))) {
      end = value.indexOf(")", i);
      isArray = value.charAt(i + 7) === "[";
      nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
      s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
      prev = end + 1;
    }
    return s + value.substr(prev, value.length - prev);
  },
  mapRange = exports.mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
    var inRange = inMax - inMin,
      outRange = outMax - outMin;
    return _conditionalReturn(value, function (value) {
      return outMin + ((value - inMin) / inRange * outRange || 0);
    });
  },
  interpolate = exports.interpolate = function interpolate(start, end, progress, mutate) {
    var func = isNaN(start + end) ? 0 : function (p) {
      return (1 - p) * start + p * end;
    };
    if (!func) {
      var isString = _isString(start),
        master = {},
        p,
        i,
        interpolators,
        l,
        il;
      progress === true && (mutate = 1) && (progress = null);
      if (isString) {
        start = {
          p: start
        };
        end = {
          p: end
        };
      } else if (_isArray(start) && !_isArray(end)) {
        interpolators = [];
        l = start.length;
        il = l - 2;
        for (i = 1; i < l; i++) {
          interpolators.push(interpolate(start[i - 1], start[i])); //build the interpolators up front as a performance optimization so that when the function is called many times, it can just reuse them.
        }
        l--;
        func = function func(p) {
          p *= l;
          var i = Math.min(il, ~~p);
          return interpolators[i](p - i);
        };
        progress = end;
      } else if (!mutate) {
        start = _merge(_isArray(start) ? [] : {}, start);
      }
      if (!interpolators) {
        for (p in end) {
          _addPropTween.call(master, start, p, "get", end[p]);
        }
        func = function func(p) {
          return _renderPropTweens(p, master) || (isString ? start.p : start);
        };
      }
    }
    return _conditionalReturn(progress, func);
  },
  _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
    //used for nextLabel() and previousLabel()
    var labels = timeline.labels,
      min = _bigNum,
      p,
      distance,
      label;
    for (p in labels) {
      distance = labels[p] - fromTime;
      if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
        label = p;
        min = distance;
      }
    }
    return label;
  },
  _callback = function _callback(animation, type, executeLazyFirst) {
    var v = animation.vars,
      callback = v[type],
      prevContext = _context,
      context = animation._ctx,
      params,
      scope,
      result;
    if (!callback) {
      return;
    }
    params = v[type + "Params"];
    scope = v.callbackScope || animation;
    executeLazyFirst && _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.

    context && (_context = context);
    result = params ? callback.apply(scope, params) : callback.call(scope);
    _context = prevContext;
    return result;
  },
  _interrupt = function _interrupt(animation) {
    _removeFromParent(animation);
    animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting);
    animation.progress() < 1 && _callback(animation, "onInterrupt");
    return animation;
  },
  _quickTween,
  _registerPluginQueue = [],
  _createPlugin = function _createPlugin(config) {
    if (!config) return;
    config = !config.name && config["default"] || config; // UMD packaging wraps things oddly, so for example MotionPathHelper becomes {MotionPathHelper:MotionPathHelper, default:MotionPathHelper}.

    if (_windowExists() || config.headless) {
      // edge case: some build tools may pass in a null/undefined value
      var name = config.name,
        isFunc = _isFunction(config),
        Plugin = name && !isFunc && config.init ? function () {
          this._props = [];
        } : config,
        //in case someone passes in an object that's not a plugin, like CustomEase
        instanceDefaults = {
          init: _emptyFunc,
          render: _renderPropTweens,
          add: _addPropTween,
          kill: _killPropTweensOf,
          modifier: _addPluginModifier,
          rawVars: 0
        },
        statics = {
          targetTest: 0,
          get: 0,
          getSetter: _getSetter,
          aliases: {},
          register: 0
        };
      _wake();
      if (config !== Plugin) {
        if (_plugins[name]) {
          return;
        }
        _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics)); //static methods

        _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics))); //instance methods

        _plugins[Plugin.prop = name] = Plugin;
        if (config.targetTest) {
          _harnessPlugins.push(Plugin);
          _reservedProps[name] = 1;
        }
        name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin"; //for the global name. "motionPath" should become MotionPathPlugin
      }
      _addGlobal(name, Plugin);
      config.register && config.register(gsap, Plugin, PropTween);
    } else {
      _registerPluginQueue.push(config);
    }
  },
  /*
   * --------------------------------------------------------------------------------------
   * COLORS
   * --------------------------------------------------------------------------------------
   */
  _255 = 255,
  _colorLookup = {
    aqua: [0, _255, _255],
    lime: [0, _255, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, _255],
    navy: [0, 0, 128],
    white: [_255, _255, _255],
    olive: [128, 128, 0],
    yellow: [_255, _255, 0],
    orange: [_255, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [_255, 0, 0],
    pink: [_255, 192, 203],
    cyan: [0, _255, _255],
    transparent: [_255, _255, _255, 0]
  },
  // possible future idea to replace the hard-coded color name values - put this in the ticker.wake() where we set the _doc:
  // let ctx = _doc.createElement("canvas").getContext("2d");
  // _forEachName("aqua,lime,silver,black,maroon,teal,blue,navy,white,olive,yellow,orange,gray,purple,green,red,pink,cyan", color => {ctx.fillStyle = color; _colorLookup[color] = splitColor(ctx.fillStyle)});
  _hue = function _hue(h, m1, m2) {
    h += h < 0 ? 1 : h > 1 ? -1 : 0;
    return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
  },
  splitColor = exports.splitColor = function splitColor(v, toHSL, forceAlpha) {
    var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
      r,
      g,
      b,
      h,
      s,
      l,
      max,
      min,
      d,
      wasHSL;
    if (!a) {
      if (v.substr(-1) === ",") {
        //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
        v = v.substr(0, v.length - 1);
      }
      if (_colorLookup[v]) {
        a = _colorLookup[v];
      } else if (v.charAt(0) === "#") {
        if (v.length < 6) {
          //for shorthand like #9F0 or #9F0F (could have alpha)
          r = v.charAt(1);
          g = v.charAt(2);
          b = v.charAt(3);
          v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
        }
        if (v.length === 9) {
          // hex with alpha, like #fd5e53ff
          a = parseInt(v.substr(1, 6), 16);
          return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
        }
        v = parseInt(v.substr(1), 16);
        a = [v >> 16, v >> 8 & _255, v & _255];
      } else if (v.substr(0, 3) === "hsl") {
        a = wasHSL = v.match(_strictNumExp);
        if (!toHSL) {
          h = +a[0] % 360 / 360;
          s = +a[1] / 100;
          l = +a[2] / 100;
          g = l <= .5 ? l * (s + 1) : l + s - l * s;
          r = l * 2 - g;
          a.length > 3 && (a[3] *= 1); //cast as number

          a[0] = _hue(h + 1 / 3, r, g);
          a[1] = _hue(h, r, g);
          a[2] = _hue(h - 1 / 3, r, g);
        } else if (~v.indexOf("=")) {
          //if relative values are found, just return the raw strings with the relative prefixes in place.
          a = v.match(_numExp);
          forceAlpha && a.length < 4 && (a[3] = 1);
          return a;
        }
      } else {
        a = v.match(_strictNumExp) || _colorLookup.transparent;
      }
      a = a.map(Number);
    }
    if (toHSL && !wasHSL) {
      r = a[0] / _255;
      g = a[1] / _255;
      b = a[2] / _255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60;
      }
      a[0] = ~~(h + .5);
      a[1] = ~~(s * 100 + .5);
      a[2] = ~~(l * 100 + .5);
    }
    forceAlpha && a.length < 4 && (a[3] = 1);
    return a;
  },
  _colorOrderData = function _colorOrderData(v) {
    // strips out the colors from the string, finds all the numeric slots (with units) and returns an array of those. The Array also has a "c" property which is an Array of the index values where the colors belong. This is to help work around issues where there's a mis-matched order of color/numeric data like drop-shadow(#f00 0px 1px 2px) and drop-shadow(0x 1px 2px #f00). This is basically a helper function used in _formatColors()
    var values = [],
      c = [],
      i = -1;
    v.split(_colorExp).forEach(function (v) {
      var a = v.match(_numWithUnitExp) || [];
      values.push.apply(values, a);
      c.push(i += a.length + 1);
    });
    values.c = c;
    return values;
  },
  _formatColors = function _formatColors(s, toHSL, orderMatchData) {
    var result = "",
      colors = (s + result).match(_colorExp),
      type = toHSL ? "hsla(" : "rgba(",
      i = 0,
      c,
      shell,
      d,
      l;
    if (!colors) {
      return s;
    }
    colors = colors.map(function (color) {
      return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
    });
    if (orderMatchData) {
      d = _colorOrderData(s);
      c = orderMatchData.c;
      if (c.join(result) !== d.c.join(result)) {
        shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
        l = shell.length - 1;
        for (; i < l; i++) {
          result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
        }
      }
    }
    if (!shell) {
      shell = s.split(_colorExp);
      l = shell.length - 1;
      for (; i < l; i++) {
        result += shell[i] + colors[i];
      }
    }
    return result + shell[l];
  },
  _colorExp = exports._colorExp = function () {
    var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
      //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.,
      p;
    for (p in _colorLookup) {
      s += "|" + p + "\\b";
    }
    return new RegExp(s + ")", "gi");
  }(),
  _hslExp = /hsl[a]?\(/,
  _colorStringFilter = exports._colorStringFilter = function _colorStringFilter(a) {
    var combined = a.join(" "),
      toHSL;
    _colorExp.lastIndex = 0;
    if (_colorExp.test(combined)) {
      toHSL = _hslExp.test(combined);
      a[1] = _formatColors(a[1], toHSL);
      a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1])); // make sure the order of numbers/colors match with the END value.

      return true;
    }
  },
  /*
   * --------------------------------------------------------------------------------------
   * TICKER
   * --------------------------------------------------------------------------------------
   */
  _tickerActive,
  _ticker = exports._ticker = function () {
    var _getTime = Date.now,
      _lagThreshold = 500,
      _adjustedLag = 33,
      _startTime = _getTime(),
      _lastUpdate = _startTime,
      _gap = 1000 / 240,
      _nextTime = _gap,
      _listeners = [],
      _id,
      _req,
      _raf,
      _self,
      _delta,
      _i,
      _tick = function _tick(v) {
        var elapsed = _getTime() - _lastUpdate,
          manual = v === true,
          overlap,
          dispatch,
          time,
          frame;
        (elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
        _lastUpdate += elapsed;
        time = _lastUpdate - _startTime;
        overlap = time - _nextTime;
        if (overlap > 0 || manual) {
          frame = ++_self.frame;
          _delta = time - _self.time * 1000;
          _self.time = time = time / 1000;
          _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
          dispatch = 1;
        }
        manual || (_id = _req(_tick)); //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.

        if (dispatch) {
          for (_i = 0; _i < _listeners.length; _i++) {
            // use _i and check _listeners.length instead of a variable because a listener could get removed during the loop, and if that happens to an element less than the current index, it'd throw things off in the loop.
            _listeners[_i](time, _delta, frame, v);
          }
        }
      };
    _self = {
      time: 0,
      frame: 0,
      tick: function tick() {
        _tick(true);
      },
      deltaRatio: function deltaRatio(fps) {
        return _delta / (1000 / (fps || 60));
      },
      wake: function wake() {
        if (_coreReady) {
          if (!_coreInitted && _windowExists()) {
            _win = _coreInitted = window;
            _doc = _win.document || {};
            _globals.gsap = gsap;
            (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);
            _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});
            _registerPluginQueue.forEach(_createPlugin);
          }
          _raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
          _id && _self.sleep();
          _req = _raf || function (f) {
            return setTimeout(f, _nextTime - _self.time * 1000 + 1 | 0);
          };
          _tickerActive = 1;
          _tick(2);
        }
      },
      sleep: function sleep() {
        (_raf ? cancelAnimationFrame : clearTimeout)(_id);
        _tickerActive = 0;
        _req = _emptyFunc;
      },
      lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
        _lagThreshold = threshold || Infinity; // zero should be interpreted as basically unlimited

        _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
      },
      fps: function fps(_fps) {
        _gap = 1000 / (_fps || 240);
        _nextTime = _self.time * 1000 + _gap;
      },
      add: function add(callback, once, prioritize) {
        var func = once ? function (t, d, f, v) {
          callback(t, d, f, v);
          _self.remove(func);
        } : callback;
        _self.remove(callback);
        _listeners[prioritize ? "unshift" : "push"](func);
        _wake();
        return func;
      },
      remove: function remove(callback, i) {
        ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1) && _i >= i && _i--;
      },
      _listeners: _listeners
    };
    return _self;
  }(),
  _wake = function _wake() {
    return !_tickerActive && _ticker.wake();
  },
  //also ensures the core classes are initialized.

  /*
  * -------------------------------------------------
  * EASING
  * -------------------------------------------------
  */
  _easeMap = {},
  _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
  _quotesExp = /["']/g,
  _parseObjectInString = function _parseObjectInString(value) {
    //takes a string like "{wiggles:10, type:anticipate})" and turns it into a real object. Notice it ends in ")" and includes the {} wrappers. This is because we only use this function for parsing ease configs and prioritized optimization rather than reusability.
    var obj = {},
      split = value.substr(1, value.length - 3).split(":"),
      key = split[0],
      i = 1,
      l = split.length,
      index,
      val,
      parsedVal;
    for (; i < l; i++) {
      val = split[i];
      index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
      parsedVal = val.substr(0, index);
      obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
      key = val.substr(index + 1).trim();
    }
    return obj;
  },
  _valueInParentheses = function _valueInParentheses(value) {
    var open = value.indexOf("(") + 1,
      close = value.indexOf(")"),
      nested = value.indexOf("(", open);
    return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
  },
  _configEaseFromString = function _configEaseFromString(name) {
    //name can be a string like "elastic.out(1,0.5)", and pass in _easeMap as obj and it'll parse it out and call the actual function like _easeMap.Elastic.easeOut.config(1,0.5). It will also parse custom ease strings as long as CustomEase is loaded and registered (internally as _easeMap._CE).
    var split = (name + "").split("("),
      ease = _easeMap[split[0]];
    return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
  },
  _invertEase = function _invertEase(ease) {
    return function (p) {
      return 1 - ease(1 - p);
    };
  },
  // allow yoyoEase to be set in children and have those affected when the parent/ancestor timeline yoyos.
  _propagateYoyoEase = function _propagateYoyoEase(timeline, isYoyo) {
    var child = timeline._first,
      ease;
    while (child) {
      if (child instanceof Timeline) {
        _propagateYoyoEase(child, isYoyo);
      } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
        if (child.timeline) {
          _propagateYoyoEase(child.timeline, isYoyo);
        } else {
          ease = child._ease;
          child._ease = child._yEase;
          child._yEase = ease;
          child._yoyo = isYoyo;
        }
      }
      child = child._next;
    }
  },
  _parseEase = function _parseEase(ease, defaultEase) {
    return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
  },
  _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
    if (easeOut === void 0) {
      easeOut = function easeOut(p) {
        return 1 - easeIn(1 - p);
      };
    }
    if (easeInOut === void 0) {
      easeInOut = function easeInOut(p) {
        return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
      };
    }
    var ease = {
        easeIn: easeIn,
        easeOut: easeOut,
        easeInOut: easeInOut
      },
      lowercaseName;
    _forEachName(names, function (name) {
      _easeMap[name] = _globals[name] = ease;
      _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
      for (var p in ease) {
        _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
      }
    });
    return ease;
  },
  _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
    return function (p) {
      return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
    };
  },
  _configElastic = function _configElastic(type, amplitude, period) {
    var p1 = amplitude >= 1 ? amplitude : 1,
      //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
      p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
      p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
      easeOut = function easeOut(p) {
        return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
      },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
        return 1 - easeOut(1 - p);
      } : _easeInOutFromOut(easeOut);
    p2 = _2PI / p2; //precalculate to optimize

    ease.config = function (amplitude, period) {
      return _configElastic(type, amplitude, period);
    };
    return ease;
  },
  _configBack = function _configBack(type, overshoot) {
    if (overshoot === void 0) {
      overshoot = 1.70158;
    }
    var easeOut = function easeOut(p) {
        return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
      },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
        return 1 - easeOut(1 - p);
      } : _easeInOutFromOut(easeOut);
    ease.config = function (overshoot) {
      return _configBack(type, overshoot);
    };
    return ease;
  }; // a cheaper (kb and cpu) but more mild way to get a parameterized weighted ease by feeding in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEase = ratio => {
// 	let y = 0.5 + ratio / 2;
// 	return p => (2 * (1 - p) * p * y + p * p);
// },
// a stronger (but more expensive kb/cpu) parameterized weighted ease that lets you feed in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEaseStrong = ratio => {
// 	ratio = .5 + ratio / 2;
// 	let o = 1 / 3 * (ratio < .5 ? ratio : 1 - ratio),
// 		b = ratio - o,
// 		c = ratio + o;
// 	return p => p === 1 ? p : 3 * b * (1 - p) * (1 - p) * p + 3 * c * (1 - p) * p * p + p * p * p;
// };

_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
  var power = i < 5 ? i + 1 : i;
  _insertEase(name + ",Power" + (power - 1), i ? function (p) {
    return Math.pow(p, power);
  } : function (p) {
    return p;
  }, function (p) {
    return 1 - Math.pow(1 - p, power);
  }, function (p) {
    return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
  });
});
_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
(function (n, c) {
  var n1 = 1 / c,
    n2 = 2 * n1,
    n3 = 2.5 * n1,
    easeOut = function easeOut(p) {
      return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
    };
  _insertEase("Bounce", function (p) {
    return 1 - easeOut(1 - p);
  }, easeOut);
})(7.5625, 2.75);
_insertEase("Expo", function (p) {
  return p ? Math.pow(2, 10 * (p - 1)) : 0;
});
_insertEase("Circ", function (p) {
  return -(_sqrt(1 - p * p) - 1);
});
_insertEase("Sine", function (p) {
  return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
});
_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
  config: function config(steps, immediateStart) {
    if (steps === void 0) {
      steps = 1;
    }
    var p1 = 1 / steps,
      p2 = steps + (immediateStart ? 0 : 1),
      p3 = immediateStart ? 1 : 0,
      max = 1 - _tinyNum;
    return function (p) {
      return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
    };
  }
};
_defaults.ease = _easeMap["quad.out"];
_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
  return _callbackNames += name + "," + name + "Params,";
});
/*
 * --------------------------------------------------------------------------------------
 * CACHE
 * --------------------------------------------------------------------------------------
 */

var GSCache = exports.GSCache = function GSCache(target, harness) {
  this.id = _gsID++;
  target._gsap = this;
  this.target = target;
  this.harness = harness;
  this.get = harness ? harness.get : _getProperty;
  this.set = harness ? harness.getSetter : _getSetter;
};
/*
 * --------------------------------------------------------------------------------------
 * ANIMATION
 * --------------------------------------------------------------------------------------
 */

var Animation = exports.Animation = /*#__PURE__*/function () {
  function Animation(vars) {
    this.vars = vars;
    this._delay = +vars.delay || 0;
    if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
      // TODO: repeat: Infinity on a timeline's children must flag that timeline internally and affect its totalDuration, otherwise it'll stop in the negative direction when reaching the start.
      this._rDelay = vars.repeatDelay || 0;
      this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
    }
    this._ts = 1;
    _setDuration(this, +vars.duration, 1, 1);
    this.data = vars.data;
    if (_context) {
      this._ctx = _context;
      _context.data.push(this);
    }
    _tickerActive || _ticker.wake();
  }
  var _proto = Animation.prototype;
  _proto.delay = function delay(value) {
    if (value || value === 0) {
      this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
      this._delay = value;
      return this;
    }
    return this._delay;
  };
  _proto.duration = function duration(value) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
  };
  _proto.totalDuration = function totalDuration(value) {
    if (!arguments.length) {
      return this._tDur;
    }
    this._dirty = 0;
    return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
  };
  _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
    _wake();
    if (!arguments.length) {
      return this._tTime;
    }
    var parent = this._dp;
    if (parent && parent.smoothChildTiming && this._ts) {
      _alignPlayhead(this, _totalTime);
      !parent._dp || parent.parent || _postAddChecks(parent, this); // edge case: if this is a child of a timeline that already completed, for example, we must re-activate the parent.
      //in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The start of that child would get pushed out, but one of the ancestors may have completed.

      while (parent && parent.parent) {
        if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
          parent.totalTime(parent._tTime, true);
        }
        parent = parent.parent;
      }
      if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
        //if the animation doesn't have a parent, put it back into its last parent (recorded as _dp for exactly cases like this). Limit to parents with autoRemoveChildren (like globalTimeline) so that if the user manually removes an animation from a timeline and then alters its playhead, it doesn't get added back in.
        _addToTimeline(this._dp, this, this._start - this._delay);
      }
    }
    if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
      // check for _ptLookup on a Tween instance to ensure it has actually finished being instantiated, otherwise if this.reverse() gets called in the Animation constructor, it could trigger a render() here even though the _targets weren't populated, thus when _init() is called there won't be any PropTweens (it'll act like the tween is non-functional)
      this._ts || (this._pTime = _totalTime); // otherwise, if an animation is paused, then the playhead is moved back to zero, then resumed, it'd revert back to the original time at the pause
      //if (!this._lock) { // avoid endless recursion (not sure we need this yet or if it's worth the performance hit)
      //   this._lock = 1;

      _lazySafeRender(this, _totalTime, suppressEvents); //   this._lock = 0;
      //}
    }
    return this;
  };
  _proto.time = function time(value, suppressEvents) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time; // note: if the modulus results in 0, the playhead could be exactly at the end or the beginning, and we always defer to the END with a non-zero value, otherwise if you set the time() to the very end (duration()), it would render at the START!
  };
  _proto.totalProgress = function totalProgress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0;
  };
  _proto.progress = function progress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  };
  _proto.iteration = function iteration(value, suppressEvents) {
    var cycleDuration = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
  } // potential future addition:
  // isPlayingBackwards() {
  // 	let animation = this,
  // 		orientation = 1; // 1 = forward, -1 = backward
  // 	while (animation) {
  // 		orientation *= animation.reversed() || (animation.repeat() && !(animation.iteration() & 1)) ? -1 : 1;
  // 		animation = animation.parent;
  // 	}
  // 	return orientation < 0;
  // }
  ;
  _proto.timeScale = function timeScale(value, suppressEvents) {
    if (!arguments.length) {
      return this._rts === -_tinyNum ? 0 : this._rts; // recorded timeScale. Special case: if someone calls reverse() on an animation with timeScale of 0, we assign it -_tinyNum to remember it's reversed.
    }
    if (this._rts === value) {
      return this;
    }
    var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime; // make sure to do the parentToChildTotalTime() BEFORE setting the new _ts because the old one must be used in that calculation.
    // future addition? Up side: fast and minimal file size. Down side: only works on this animation; if a timeline is reversed, for example, its childrens' onReverse wouldn't get called.
    //(+value < 0 && this._rts >= 0) && _callback(this, "onReverse", true);
    // prioritize rendering where the parent's playhead lines up instead of this._tTime because there could be a tween that's animating another tween's timeScale in the same rendering loop (same parent), thus if the timeScale tween renders first, it would alter _start BEFORE _tTime was set on that tick (in the rendering loop), effectively freezing it until the timeScale tween finishes.

    this._rts = +value || 0;
    this._ts = this._ps || value === -_tinyNum ? 0 : this._rts; // _ts is the functional timeScale which would be 0 if the animation is paused.

    this.totalTime(_clamp(-Math.abs(this._delay), this._tDur, tTime), suppressEvents !== false);
    _setEnd(this); // if parent.smoothChildTiming was false, the end time didn't get updated in the _alignPlayhead() method, so do it here.

    return _recacheAncestors(this);
  };
  _proto.paused = function paused(value) {
    if (!arguments.length) {
      return this._ps;
    }
    if (this._ps !== value) {
      this._ps = value;
      if (value) {
        this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()); // if the pause occurs during the delay phase, make sure that's factored in when resuming.

        this._ts = this._act = 0; // _ts is the functional timeScale, so a paused tween would effectively have a timeScale of 0. We record the "real" timeScale as _rts (recorded time scale)
      } else {
        _wake();
        this._ts = this._rts; //only defer to _pTime (pauseTime) if tTime is zero. Remember, someone could pause() an animation, then scrub the playhead and resume(). If the parent doesn't have smoothChildTiming, we render at the rawTime() because the startTime won't get updated.

        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum)); // edge case: animation.progress(1).pause().play() wouldn't render again because the playhead is already at the end, but the call to totalTime() below will add it back to its parent...and not remove it again (since removing only happens upon rendering at a new time). Offsetting the _tTime slightly is done simply to cause the final render in totalTime() that'll pop it off its timeline (if autoRemoveChildren is true, of course). Check to make sure _zTime isn't -_tinyNum to avoid an edge case where the playhead is pushed to the end but INSIDE a tween/callback, the timeline itself is paused thus halting rendering and leaving a few unrendered. When resuming, it wouldn't render those otherwise.
      }
    }
    return this;
  };
  _proto.startTime = function startTime(value) {
    if (arguments.length) {
      this._start = value;
      var parent = this.parent || this._dp;
      parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
      return this;
    }
    return this._start;
  };
  _proto.endTime = function endTime(includeRepeats) {
    return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  };
  _proto.rawTime = function rawTime(wrapRepeats) {
    var parent = this.parent || this._dp; // _dp = detached parent

    return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
  };
  _proto.revert = function revert(config) {
    if (config === void 0) {
      config = _revertConfig;
    }
    var prevIsReverting = _reverting;
    _reverting = config;
    if (this._initted || this._startAt) {
      this.timeline && this.timeline.revert(config);
      this.totalTime(-0.01, config.suppressEvents);
    }
    this.data !== "nested" && config.kill !== false && this.kill();
    _reverting = prevIsReverting;
    return this;
  };
  _proto.globalTime = function globalTime(rawTime) {
    var animation = this,
      time = arguments.length ? rawTime : animation.rawTime();
    while (animation) {
      time = animation._start + time / (Math.abs(animation._ts) || 1);
      animation = animation._dp;
    }
    return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time; // the _startAt tweens for .fromTo() and .from() that have immediateRender should always be FIRST in the timeline (important for context.revert()). "_sat" stands for _startAtTween, referring to the parent tween that created the _startAt. We must discern if that tween had immediateRender so that we can know whether or not to prioritize it in revert().
  };
  _proto.repeat = function repeat(value) {
    if (arguments.length) {
      this._repeat = value === Infinity ? -2 : value;
      return _onUpdateTotalDuration(this);
    }
    return this._repeat === -2 ? Infinity : this._repeat;
  };
  _proto.repeatDelay = function repeatDelay(value) {
    if (arguments.length) {
      var time = this._time;
      this._rDelay = value;
      _onUpdateTotalDuration(this);
      return time ? this.time(time) : this;
    }
    return this._rDelay;
  };
  _proto.yoyo = function yoyo(value) {
    if (arguments.length) {
      this._yoyo = value;
      return this;
    }
    return this._yoyo;
  };
  _proto.seek = function seek(position, suppressEvents) {
    return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
  };
  _proto.restart = function restart(includeDelay, suppressEvents) {
    return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
  };
  _proto.play = function play(from, suppressEvents) {
    from != null && this.seek(from, suppressEvents);
    return this.reversed(false).paused(false);
  };
  _proto.reverse = function reverse(from, suppressEvents) {
    from != null && this.seek(from || this.totalDuration(), suppressEvents);
    return this.reversed(true).paused(false);
  };
  _proto.pause = function pause(atTime, suppressEvents) {
    atTime != null && this.seek(atTime, suppressEvents);
    return this.paused(true);
  };
  _proto.resume = function resume() {
    return this.paused(false);
  };
  _proto.reversed = function reversed(value) {
    if (arguments.length) {
      !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0)); // in case timeScale is zero, reversing would have no effect so we use _tinyNum.

      return this;
    }
    return this._rts < 0;
  };
  _proto.invalidate = function invalidate() {
    this._initted = this._act = 0;
    this._zTime = -_tinyNum;
    return this;
  };
  _proto.isActive = function isActive() {
    var parent = this.parent || this._dp,
      start = this._start,
      rawTime;
    return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
  };
  _proto.eventCallback = function eventCallback(type, callback, params) {
    var vars = this.vars;
    if (arguments.length > 1) {
      if (!callback) {
        delete vars[type];
      } else {
        vars[type] = callback;
        params && (vars[type + "Params"] = params);
        type === "onUpdate" && (this._onUpdate = callback);
      }
      return this;
    }
    return vars[type];
  };
  _proto.then = function then(onFulfilled) {
    var self = this;
    return new Promise(function (resolve) {
      var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
        _resolve = function _resolve() {
          var _then = self.then;
          self.then = null; // temporarily null the then() method to avoid an infinite loop (see https://github.com/greensock/GSAP/issues/322)

          _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
          resolve(f);
          self.then = _then;
        };
      if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
        _resolve();
      } else {
        self._prom = _resolve;
      }
    });
  };
  _proto.kill = function kill() {
    _interrupt(this);
  };
  return Animation;
}();
_setDefaults(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: false,
  parent: null,
  _initted: false,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _ps: false,
  _rts: 1
});
/*
 * -------------------------------------------------
 * TIMELINE
 * -------------------------------------------------
 */

var Timeline = exports.TimelineLite = exports.TimelineMax = exports.Timeline = /*#__PURE__*/function (_Animation) {
  _inheritsLoose(Timeline, _Animation);
  function Timeline(vars, position) {
    var _this;
    if (vars === void 0) {
      vars = {};
    }
    _this = _Animation.call(this, vars) || this;
    _this.labels = {};
    _this.smoothChildTiming = !!vars.smoothChildTiming;
    _this.autoRemoveChildren = !!vars.autoRemoveChildren;
    _this._sort = _isNotFalse(vars.sortChildren);
    _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
    vars.reversed && _this.reverse();
    vars.paused && _this.paused(true);
    vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
    return _this;
  }
  var _proto2 = Timeline.prototype;
  _proto2.to = function to(targets, vars, position) {
    _createTweenType(0, arguments, this);
    return this;
  };
  _proto2.from = function from(targets, vars, position) {
    _createTweenType(1, arguments, this);
    return this;
  };
  _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
    _createTweenType(2, arguments, this);
    return this;
  };
  _proto2.set = function set(targets, vars, position) {
    vars.duration = 0;
    vars.parent = this;
    _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
    vars.immediateRender = !!vars.immediateRender;
    new Tween(targets, vars, _parsePosition(this, position), 1);
    return this;
  };
  _proto2.call = function call(callback, params, position) {
    return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
  } //ONLY for backward compatibility! Maybe delete?
  ;
  _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.duration = duration;
    vars.stagger = vars.stagger || stagger;
    vars.onComplete = onCompleteAll;
    vars.onCompleteParams = onCompleteAllParams;
    vars.parent = this;
    new Tween(targets, vars, _parsePosition(this, position));
    return this;
  };
  _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.runBackwards = 1;
    _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
    return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
  };
  _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
    toVars.startAt = fromVars;
    _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
    return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
  };
  _proto2.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
      tDur = this._dirty ? this.totalDuration() : this._tDur,
      dur = this._dur,
      tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime),
      // if a paused timeline is resumed (or its _start is updated for another reason...which rounds it), that could result in the playhead shifting a **tiny** amount and a zero-duration child at that spot may get rendered at a different ratio, like its totalTime in render() may be 1e-17 instead of 0, for example.
      crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
      time,
      child,
      next,
      iteration,
      cycleDuration,
      prevPaused,
      pauseTween,
      timeScale,
      prevStart,
      prevIteration,
      yoyo,
      isYoyo;
    this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
    if (tTime !== this._tTime || force || crossingStart) {
      if (prevTime !== this._time && dur) {
        //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
        tTime += this._time - prevTime;
        totalTime += this._time - prevTime;
      }
      time = tTime;
      prevStart = this._start;
      timeScale = this._ts;
      prevPaused = !timeScale;
      if (crossingStart) {
        dur || (prevTime = this._zTime); //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

        (totalTime || !suppressEvents) && (this._zTime = totalTime);
      }
      if (this._repeat) {
        //adjust the time for repeats and yoyos
        yoyo = this._yoyo;
        cycleDuration = dur + this._rDelay;
        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }
        time = _roundPrecise(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (tTime === tDur) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);
          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }
          time > dur && (time = dur);
        }
        prevIteration = _animationCycle(this._tTime, cycleDuration);
        !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration); // edge case - if someone does addPause() at the very beginning of a repeating timeline, that pause is technically at the same spot as the end which causes this._time to get set to 0 when the totalTime would normally place the playhead at the end. See https://gsap.com/forums/topic/23823-closing-nav-animation-not-working-on-ie-and-iphone-6-maybe-other-older-browser/?tab=comments#comment-113005 also, this._tTime - prevIteration * cycleDuration - this._dur <= 0 just checks to make sure it wasn't previously in the "repeatDelay" portion

        if (yoyo && iteration & 1) {
          time = dur - time;
          isYoyo = 1;
        }
        /*
        make sure children at the end/beginning of the timeline are rendered properly. If, for example,
        a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
        would get translated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
        could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
        we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
        ensure that zero-duration tweens at the very beginning or end of the Timeline work.
        */

        if (iteration !== prevIteration && !this._lock) {
          var rewinding = yoyo && prevIteration & 1,
            doesWrap = rewinding === (yoyo && iteration & 1);
          iteration < prevIteration && (rewinding = !rewinding);
          prevTime = rewinding ? 0 : tTime % dur ? dur : tTime; // if the playhead is landing exactly at the end of an iteration, use that totalTime rather than only the duration, otherwise it'll skip the 2nd render since it's effectively at the same time.

          this._lock = 1;
          this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
          this._tTime = tTime; // if a user gets the iteration() inside the onRepeat, for example, it should be accurate.

          !suppressEvents && this.parent && _callback(this, "onRepeat");
          this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
          if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
            // if prevTime is 0 and we render at the very end, _time will be the end, thus won't match. So in this edge case, prevTime won't match _time but that's okay. If it gets killed in the onRepeat, eject as well.
            return this;
          }
          dur = this._dur; // in case the duration changed in the onRepeat

          tDur = this._tDur;
          if (doesWrap) {
            this._lock = 2;
            prevTime = rewinding ? dur : -0.0001;
            this.render(prevTime, true);
            this.vars.repeatRefresh && !isYoyo && this.invalidate();
          }
          this._lock = 0;
          if (!this._ts && !prevPaused) {
            return this;
          } //in order for yoyoEase to work properly when there's a stagger, we must swap out the ease in each sub-tween.

          _propagateYoyoEase(this, isYoyo);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2) {
        pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
        if (pauseTween) {
          tTime -= time - (time = pauseTween._start);
        }
      }
      this._tTime = tTime;
      this._time = time;
      this._act = !timeScale; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

      if (!this._initted) {
        this._onUpdate = this.vars.onUpdate;
        this._initted = 1;
        this._zTime = totalTime;
        prevTime = 0; // upon init, the playhead should always go forward; someone could invalidate() a completed timeline and then if they restart(), that would make child tweens render in reverse order which could lock in the wrong starting values if they build on each other, like tl.to(obj, {x: 100}).to(obj, {x: 0}).
      }
      if (!prevTime && time && !suppressEvents && !iteration) {
        _callback(this, "onStart");
        if (this._tTime !== tTime) {
          // in case the onStart triggered a render at a different spot, eject. Like if someone did animation.pause(0.5) or something inside the onStart.
          return this;
        }
      }
      if (time >= prevTime && totalTime >= 0) {
        child = this._first;
        while (child) {
          next = child._next;
          if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }
            child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = -_tinyNum); // it didn't finish rendering, so flag zTime as negative so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }
          child = next;
        }
      } else {
        child = this._last;
        var adjustedTime = totalTime < 0 ? totalTime : time; //when the playhead goes backward beyond the start of this timeline, we must pass that information down to the child animations so that zero-duration tweens know whether to render their starting or ending values.

        while (child) {
          next = child._prev;
          if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }
            child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting && (child._initted || child._startAt)); // if reverting, we should always force renders of initted tweens (but remember that .fromTo() or .from() may have a _startAt but not _initted yet). If, for example, a .fromTo() tween with a stagger (which creates an internal timeline) gets reverted BEFORE some of its child tweens render for the first time, it may not properly trigger them to revert.

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum); // it didn't finish rendering, so adjust zTime so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }
          child = next;
        }
      }
      if (pauseTween && !suppressEvents) {
        this.pause();
        pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
        if (this._ts) {
          //the callback resumed playback! So since we may have held back the playhead due to where the pause is positioned, go ahead and jump to where it's SUPPOSED to be (if no pause happened).
          this._start = prevStart; //if the pause was at an earlier time and the user resumed in the callback, it could reposition the timeline (changing its startTime), throwing things off slightly, so we make sure the _start doesn't shift.

          _setEnd(this);
          return this.render(totalTime, suppressEvents, force);
        }
      }
      this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
      if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
        // remember, a child's callback may alter this timeline's playhead or timeScale which is why we need to add some of these checks.
        (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
          _callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }
    return this;
  };
  _proto2.add = function add(child, position) {
    var _this2 = this;
    _isNumber(position) || (position = _parsePosition(this, position, child));
    if (!(child instanceof Animation)) {
      if (_isArray(child)) {
        child.forEach(function (obj) {
          return _this2.add(obj, position);
        });
        return this;
      }
      if (_isString(child)) {
        return this.addLabel(child, position);
      }
      if (_isFunction(child)) {
        child = Tween.delayedCall(0, child);
      } else {
        return this;
      }
    }
    return this !== child ? _addToTimeline(this, child, position) : this; //don't allow a timeline to be added to itself as a child!
  };
  _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
    if (nested === void 0) {
      nested = true;
    }
    if (tweens === void 0) {
      tweens = true;
    }
    if (timelines === void 0) {
      timelines = true;
    }
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = -_bigNum;
    }
    var a = [],
      child = this._first;
    while (child) {
      if (child._start >= ignoreBeforeTime) {
        if (child instanceof Tween) {
          tweens && a.push(child);
        } else {
          timelines && a.push(child);
          nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
        }
      }
      child = child._next;
    }
    return a;
  };
  _proto2.getById = function getById(id) {
    var animations = this.getChildren(1, 1, 1),
      i = animations.length;
    while (i--) {
      if (animations[i].vars.id === id) {
        return animations[i];
      }
    }
  };
  _proto2.remove = function remove(child) {
    if (_isString(child)) {
      return this.removeLabel(child);
    }
    if (_isFunction(child)) {
      return this.killTweensOf(child);
    }
    _removeLinkedListItem(this, child);
    if (child === this._recent) {
      this._recent = this._last;
    }
    return _uncache(this);
  };
  _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
    if (!arguments.length) {
      return this._tTime;
    }
    this._forcing = 1;
    if (!this._dp && this._ts) {
      //special case for the global timeline (or any other that has no parent or detached parent).
      this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
    }
    _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
    this._forcing = 0;
    return this;
  };
  _proto2.addLabel = function addLabel(label, position) {
    this.labels[label] = _parsePosition(this, position);
    return this;
  };
  _proto2.removeLabel = function removeLabel(label) {
    delete this.labels[label];
    return this;
  };
  _proto2.addPause = function addPause(position, callback, params) {
    var t = Tween.delayedCall(0, callback || _emptyFunc, params);
    t.data = "isPause";
    this._hasPause = 1;
    return _addToTimeline(this, t, _parsePosition(this, position));
  };
  _proto2.removePause = function removePause(position) {
    var child = this._first;
    position = _parsePosition(this, position);
    while (child) {
      if (child._start === position && child.data === "isPause") {
        _removeFromParent(child);
      }
      child = child._next;
    }
  };
  _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    var tweens = this.getTweensOf(targets, onlyActive),
      i = tweens.length;
    while (i--) {
      _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
    }
    return this;
  };
  _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
    var a = [],
      parsedTargets = toArray(targets),
      child = this._first,
      isGlobalTime = _isNumber(onlyActive),
      // a number is interpreted as a global time. If the animation spans
      children;
    while (child) {
      if (child instanceof Tween) {
        if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
          // note: if this is for overwriting, it should only be for tweens that aren't paused and are initted.
          a.push(child);
        }
      } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
        a.push.apply(a, children);
      }
      child = child._next;
    }
    return a;
  } // potential future feature - targets() on timelines
  // targets() {
  // 	let result = [];
  // 	this.getChildren(true, true, false).forEach(t => result.push(...t.targets()));
  // 	return result.filter((v, i) => result.indexOf(v) === i);
  // }
  ;
  _proto2.tweenTo = function tweenTo(position, vars) {
    vars = vars || {};
    var tl = this,
      endTime = _parsePosition(tl, position),
      _vars = vars,
      startAt = _vars.startAt,
      _onStart = _vars.onStart,
      onStartParams = _vars.onStartParams,
      immediateRender = _vars.immediateRender,
      initted,
      tween = Tween.to(tl, _setDefaults({
        ease: vars.ease || "none",
        lazy: false,
        immediateRender: false,
        time: endTime,
        overwrite: "auto",
        duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
        onStart: function onStart() {
          tl.pause();
          if (!initted) {
            var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
            tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
            initted = 1;
          }
          _onStart && _onStart.apply(tween, onStartParams || []); //in case the user had an onStart in the vars - we don't want to overwrite it.
        }
      }, vars));
    return immediateRender ? tween.render(0) : tween;
  };
  _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
    return this.tweenTo(toPosition, _setDefaults({
      startAt: {
        time: _parsePosition(this, fromPosition)
      }
    }, vars));
  };
  _proto2.recent = function recent() {
    return this._recent;
  };
  _proto2.nextLabel = function nextLabel(afterTime) {
    if (afterTime === void 0) {
      afterTime = this._time;
    }
    return _getLabelInDirection(this, _parsePosition(this, afterTime));
  };
  _proto2.previousLabel = function previousLabel(beforeTime) {
    if (beforeTime === void 0) {
      beforeTime = this._time;
    }
    return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
  };
  _proto2.currentLabel = function currentLabel(value) {
    return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
  };
  _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = 0;
    }
    var child = this._first,
      labels = this.labels,
      p;
    while (child) {
      if (child._start >= ignoreBeforeTime) {
        child._start += amount;
        child._end += amount;
      }
      child = child._next;
    }
    if (adjustLabels) {
      for (p in labels) {
        if (labels[p] >= ignoreBeforeTime) {
          labels[p] += amount;
        }
      }
    }
    return _uncache(this);
  };
  _proto2.invalidate = function invalidate(soft) {
    var child = this._first;
    this._lock = 0;
    while (child) {
      child.invalidate(soft);
      child = child._next;
    }
    return _Animation.prototype.invalidate.call(this, soft);
  };
  _proto2.clear = function clear(includeLabels) {
    if (includeLabels === void 0) {
      includeLabels = true;
    }
    var child = this._first,
      next;
    while (child) {
      next = child._next;
      this.remove(child);
      child = next;
    }
    this._dp && (this._time = this._tTime = this._pTime = 0);
    includeLabels && (this.labels = {});
    return _uncache(this);
  };
  _proto2.totalDuration = function totalDuration(value) {
    var max = 0,
      self = this,
      child = self._last,
      prevStart = _bigNum,
      prev,
      start,
      parent;
    if (arguments.length) {
      return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
    }
    if (self._dirty) {
      parent = self.parent;
      while (child) {
        prev = child._prev; //record it here in case the tween changes position in the sequence...

        child._dirty && child.totalDuration(); //could change the tween._startTime, so make sure the animation's cache is clean before analyzing it.

        start = child._start;
        if (start > prevStart && self._sort && child._ts && !self._lock) {
          //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
          self._lock = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add().

          _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
        } else {
          prevStart = start;
        }
        if (start < 0 && child._ts) {
          //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
          max -= start;
          if (!parent && !self._dp || parent && parent.smoothChildTiming) {
            self._start += start / self._ts;
            self._time -= start;
            self._tTime -= start;
          }
          self.shiftChildren(-start, false, -1e999);
          prevStart = 0;
        }
        child._end > max && child._ts && (max = child._end);
        child = prev;
      }
      _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);
      self._dirty = 0;
    }
    return self._tDur;
  };
  Timeline.updateRoot = function updateRoot(time) {
    if (_globalTimeline._ts) {
      _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
      _lastRenderedFrame = _ticker.frame;
    }
    if (_ticker.frame >= _nextGCFrame) {
      _nextGCFrame += _config.autoSleep || 120;
      var child = _globalTimeline._first;
      if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
        while (child && !child._ts) {
          child = child._next;
        }
        child || _ticker.sleep();
      }
    }
  };
  return Timeline;
}(Animation);
_setDefaults(Timeline.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
    //note: we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
    var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
      index = 0,
      matchIndex = 0,
      result,
      startNums,
      color,
      endNum,
      chunk,
      startNum,
      hasRandom,
      a;
    pt.b = start;
    pt.e = end;
    start += ""; //ensure values are strings

    end += "";
    if (hasRandom = ~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }
    if (stringFilter) {
      a = [start, end];
      stringFilter(a, target, prop); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.

      start = a[0];
      end = a[1];
    }
    startNums = start.match(_complexStringNumExp) || [];
    while (result = _complexStringNumExp.exec(end)) {
      endNum = result[0];
      chunk = end.substring(index, result.index);
      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(") {
        color = 1;
      }
      if (endNum !== startNums[matchIndex++]) {
        startNum = parseFloat(startNums[matchIndex - 1]) || 0; //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.

        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
          m: color && color < 4 ? Math.round : 0
        };
        index = _complexStringNumExp.lastIndex;
      }
    }
    pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)

    pt.fp = funcParam;
    if (_relExp.test(end) || hasRandom) {
      pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
    }
    this._pt = pt; //start the linked list with this new PropTween. Remember, we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.

    return pt;
  },
  _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
    _isFunction(end) && (end = end(index || 0, target, targets));
    var currentValue = target[prop],
      parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
      setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
      pt;
    if (_isString(end)) {
      if (~end.indexOf("random(")) {
        end = _replaceRandom(end);
      }
      if (end.charAt(1) === "=") {
        pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
        if (pt || pt === 0) {
          // to avoid isNaN, like if someone passes in a value like "!= whatever"
          end = pt;
        }
      }
    }
    if (!optional || parsedStart !== end || _forceAllPropTweens) {
      if (!isNaN(parsedStart * end) && end !== "") {
        // fun fact: any number multiplied by "" is evaluated as the number 0!
        pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
        funcParam && (pt.fp = funcParam);
        modifier && pt.modifier(modifier, this, target);
        return this._pt = pt;
      }
      !currentValue && !(prop in target) && _missingPlugin(prop, end);
      return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
    }
  },
  //creates a copy of the vars object and processes any function-based values (putting the resulting values directly into the copy) as well as strings with "random()" in them. It does NOT process relative values.
  _processVars = function _processVars(vars, index, target, targets, tween) {
    _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
    if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
      return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
    }
    var copy = {},
      p;
    for (p in vars) {
      copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
    }
    return copy;
  },
  _checkPlugin = exports._checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
    var plugin, pt, ptLookup, i;
    if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
      tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
      if (tween !== _quickTween) {
        ptLookup = tween._ptLookup[tween._targets.indexOf(target)]; //note: we can't use tween._ptLookup[index] because for staggered tweens, the index from the fullTargets array won't match what it is in each individual tween that spawns from the stagger.

        i = plugin._props.length;
        while (i--) {
          ptLookup[plugin._props[i]] = pt;
        }
      }
    }
    return plugin;
  },
  _overwritingTween,
  //store a reference temporarily so we can avoid overwriting itself.
  _forceAllPropTweens,
  _initTween = function _initTween(tween, time, tTime) {
    var vars = tween.vars,
      ease = vars.ease,
      startAt = vars.startAt,
      immediateRender = vars.immediateRender,
      lazy = vars.lazy,
      onUpdate = vars.onUpdate,
      runBackwards = vars.runBackwards,
      yoyoEase = vars.yoyoEase,
      keyframes = vars.keyframes,
      autoRevert = vars.autoRevert,
      dur = tween._dur,
      prevStartAt = tween._startAt,
      targets = tween._targets,
      parent = tween.parent,
      fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets,
      autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites,
      tl = tween.timeline,
      cleanVars,
      i,
      p,
      pt,
      target,
      hasPriority,
      gsData,
      harness,
      plugin,
      ptLookup,
      index,
      harnessVars,
      overwritten;
    tl && (!keyframes || !ease) && (ease = "none");
    tween._ease = _parseEase(ease, _defaults.ease);
    tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;
    if (yoyoEase && tween._yoyo && !tween._repeat) {
      //there must have been a parent timeline with yoyo:true that is currently in its yoyo phase, so flip the eases.
      yoyoEase = tween._yEase;
      tween._yEase = tween._ease;
      tween._ease = yoyoEase;
    }
    tween._from = !tl && !!vars.runBackwards; //nested timelines should never run backwards - the backwards-ness is in the child tweens.

    if (!tl || keyframes && !vars.stagger) {
      //if there's an internal timeline, skip all the parsing because we passed that task down the chain.
      harness = targets[0] ? _getCache(targets[0]).harness : 0;
      harnessVars = harness && vars[harness.prop]; //someone may need to specify CSS-specific values AND non-CSS values, like if the element has an "x" property plus it's a standard DOM element. We allow people to distinguish by wrapping plugin-specific stuff in a css:{} object for example.

      cleanVars = _copyExcluding(vars, _reservedProps);
      if (prevStartAt) {
        prevStartAt._zTime < 0 && prevStartAt.progress(1); // in case it's a lazy startAt that hasn't rendered yet.

        time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig); // if it's a "startAt" (not "from()" or runBackwards: true), we only need to do a shallow revert (keep transforms cached in CSSPlugin)
        // don't just _removeFromParent(prevStartAt.render(-1, true)) because that'll leave inline styles. We're creating a new _startAt for "startAt" tweens that re-capture things to ensure that if the pre-tween values changed since the tween was created, they're recorded.

        prevStartAt._lazy = 0;
      }
      if (startAt) {
        _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
          data: "isStart",
          overwrite: false,
          parent: parent,
          immediateRender: true,
          lazy: !prevStartAt && _isNotFalse(lazy),
          startAt: null,
          delay: 0,
          onUpdate: onUpdate && function () {
            return _callback(tween, "onUpdate");
          },
          stagger: 0
        }, startAt))); //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, from, to).fromTo(e, to, from);

        tween._startAt._dp = 0; // don't allow it to get put back into root timeline! Like when revert() is called and totalTime() gets set.

        tween._startAt._sat = tween; // used in globalTime(). _sat stands for _startAtTween

        time < 0 && (_reverting || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill); // rare edge case, like if a render is forced in the negative direction of a non-initted tween.

        if (immediateRender) {
          if (dur && time <= 0 && tTime <= 0) {
            // check tTime here because in the case of a yoyo tween whose playhead gets pushed to the end like tween.progress(1), we should allow it through so that the onComplete gets fired properly.
            time && (tween._zTime = time);
            return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a Timeline, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
          }
        }
      } else if (runBackwards && dur) {
        //from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
        if (!prevStartAt) {
          time && (immediateRender = false); //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0

          p = _setDefaults({
            overwrite: false,
            data: "isFromStart",
            //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
            lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
            immediateRender: immediateRender,
            //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
            stagger: 0,
            parent: parent //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
          }, cleanVars);
          harnessVars && (p[harness.prop] = harnessVars); // in case someone does something like .from(..., {css:{}})

          _removeFromParent(tween._startAt = Tween.set(targets, p));
          tween._startAt._dp = 0; // don't allow it to get put back into root timeline!

          tween._startAt._sat = tween; // used in globalTime()

          time < 0 && (_reverting ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
          tween._zTime = time;
          if (!immediateRender) {
            _initTween(tween._startAt, _tinyNum, _tinyNum); //ensures that the initial values are recorded
          } else if (!time) {
            return;
          }
        }
      }
      tween._pt = tween._ptCache = 0;
      lazy = dur && _isNotFalse(lazy) || lazy && !dur;
      for (i = 0; i < targets.length; i++) {
        target = targets[i];
        gsData = target._gsap || _harness(targets)[i]._gsap;
        tween._ptLookup[i] = ptLookup = {};
        _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)

        index = fullTargets === targets ? i : fullTargets.indexOf(target);
        if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
          tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
          plugin._props.forEach(function (name) {
            ptLookup[name] = pt;
          });
          plugin.priority && (hasPriority = 1);
        }
        if (!harness || harnessVars) {
          for (p in cleanVars) {
            if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
              plugin.priority && (hasPriority = 1);
            } else {
              ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
            }
          }
        }
        tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
        if (autoOverwrite && tween._pt) {
          _overwritingTween = tween;
          _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time)); // make sure the overwriting doesn't overwrite THIS tween!!!

          overwritten = !tween.parent;
          _overwritingTween = 0;
        }
        tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
      }
      hasPriority && _sortPropTweensByPriority(tween);
      tween._onInit && tween._onInit(tween); //plugins like RoundProps must wait until ALL of the PropTweens are instantiated. In the plugin's init() function, it sets the _onInit on the tween instance. May not be pretty/intuitive, but it's fast and keeps file size down.
    }
    tween._onUpdate = onUpdate;
    tween._initted = (!tween._op || tween._pt) && !overwritten; // if overwrittenProps resulted in the entire tween being killed, do NOT flag it as initted or else it may render for one tick.

    keyframes && time <= 0 && tl.render(_bigNum, true, true); // if there's a 0% keyframe, it'll render in the "before" state for any staggered/delayed animations thus when the following tween initializes, it'll use the "before" state instead of the "after" state as the initial values.
  },
  _updatePropTweens = function _updatePropTweens(tween, property, value, start, startIsRelative, ratio, time, skipRecursion) {
    var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property],
      pt,
      rootPT,
      lookup,
      i;
    if (!ptCache) {
      ptCache = tween._ptCache[property] = [];
      lookup = tween._ptLookup;
      i = tween._targets.length;
      while (i--) {
        pt = lookup[i][property];
        if (pt && pt.d && pt.d._pt) {
          // it's a plugin, so find the nested PropTween
          pt = pt.d._pt;
          while (pt && pt.p !== property && pt.fp !== property) {
            // "fp" is functionParam for things like setting CSS variables which require .setProperty("--var-name", value)
            pt = pt._next;
          }
        }
        if (!pt) {
          // there is no PropTween associated with that property, so we must FORCE one to be created and ditch out of this
          // if the tween has other properties that already rendered at new positions, we'd normally have to rewind to put them back like tween.render(0, true) before forcing an _initTween(), but that can create another edge case like tweening a timeline's progress would trigger onUpdates to fire which could move other things around. It's better to just inform users that .resetTo() should ONLY be used for tweens that already have that property. For example, you can't gsap.to(...{ y: 0 }) and then tween.restTo("x", 200) for example.
          _forceAllPropTweens = 1; // otherwise, when we _addPropTween() and it finds no change between the start and end values, it skips creating a PropTween (for efficiency...why tween when there's no difference?) but in this case we NEED that PropTween created so we can edit it.

          tween.vars[property] = "+=0";
          _initTween(tween, time);
          _forceAllPropTweens = 0;
          return skipRecursion ? _warn(property + " not eligible for reset") : 1; // if someone tries to do a quickTo() on a special property like borderRadius which must get split into 4 different properties, that's not eligible for .resetTo().
        }
        ptCache.push(pt);
      }
    }
    i = ptCache.length;
    while (i--) {
      rootPT = ptCache[i];
      pt = rootPT._pt || rootPT; // complex values may have nested PropTweens. We only accommodate the FIRST value.

      pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
      pt.c = value - pt.s;
      rootPT.e && (rootPT.e = _round(value) + getUnit(rootPT.e)); // mainly for CSSPlugin (end value)

      rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b)); // (beginning value)
    }
  },
  _addAliasesToVars = function _addAliasesToVars(targets, vars) {
    var harness = targets[0] ? _getCache(targets[0]).harness : 0,
      propertyAliases = harness && harness.aliases,
      copy,
      p,
      i,
      aliases;
    if (!propertyAliases) {
      return vars;
    }
    copy = _merge({}, vars);
    for (p in propertyAliases) {
      if (p in copy) {
        aliases = propertyAliases[p].split(",");
        i = aliases.length;
        while (i--) {
          copy[aliases[i]] = copy[p];
        }
      }
    }
    return copy;
  },
  // parses multiple formats, like {"0%": {x: 100}, {"50%": {x: -20}} and { x: {"0%": 100, "50%": -20} }, and an "ease" can be set on any object. We populate an "allProps" object with an Array for each property, like {x: [{}, {}], y:[{}, {}]} with data for each property tween. The objects have a "t" (time), "v", (value), and "e" (ease) property. This allows us to piece together a timeline later.
  _parseKeyframe = function _parseKeyframe(prop, obj, allProps, easeEach) {
    var ease = obj.ease || easeEach || "power1.inOut",
      p,
      a;
    if (_isArray(obj)) {
      a = allProps[prop] || (allProps[prop] = []); // t = time (out of 100), v = value, e = ease

      obj.forEach(function (value, i) {
        return a.push({
          t: i / (obj.length - 1) * 100,
          v: value,
          e: ease
        });
      });
    } else {
      for (p in obj) {
        a = allProps[p] || (allProps[p] = []);
        p === "ease" || a.push({
          t: parseFloat(prop),
          v: obj[p],
          e: ease
        });
      }
    }
  },
  _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
    return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
  },
  _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
  _staggerPropsToSkip = {};
_forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function (name) {
  return _staggerPropsToSkip[name] = 1;
});
/*
 * --------------------------------------------------------------------------------------
 * TWEEN
 * --------------------------------------------------------------------------------------
 */

var Tween = exports.TweenLite = exports.TweenMax = exports.Tween = /*#__PURE__*/function (_Animation2) {
  _inheritsLoose(Tween, _Animation2);
  function Tween(targets, vars, position, skipInherit) {
    var _this3;
    if (typeof vars === "number") {
      position.duration = vars;
      vars = position;
      position = null;
    }
    _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
    var _this3$vars = _this3.vars,
      duration = _this3$vars.duration,
      delay = _this3$vars.delay,
      immediateRender = _this3$vars.immediateRender,
      stagger = _this3$vars.stagger,
      overwrite = _this3$vars.overwrite,
      keyframes = _this3$vars.keyframes,
      defaults = _this3$vars.defaults,
      scrollTrigger = _this3$vars.scrollTrigger,
      yoyoEase = _this3$vars.yoyoEase,
      parent = vars.parent || _globalTimeline,
      parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets),
      tl,
      i,
      copy,
      l,
      p,
      curTarget,
      staggerFunc,
      staggerVarsToMerge;
    _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config.nullTargetWarn) || [];
    _this3._ptLookup = []; //PropTween lookup. An array containing an object for each target, having keys for each tweening property

    _this3._overwrite = overwrite;
    if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
      vars = _this3.vars;
      tl = _this3.timeline = new Timeline({
        data: "nested",
        defaults: defaults || {},
        targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
      }); // we need to store the targets because for staggers and keyframes, we end up creating an individual tween for each but function-based values need to know the index and the whole Array of targets.

      tl.kill();
      tl.parent = tl._dp = _assertThisInitialized(_this3);
      tl._start = 0;
      if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        l = parsedTargets.length;
        staggerFunc = stagger && distribute(stagger);
        if (_isObject(stagger)) {
          //users can pass in callbacks like onStart/onComplete in the stagger object. These should fire with each individual tween.
          for (p in stagger) {
            if (~_staggerTweenProps.indexOf(p)) {
              staggerVarsToMerge || (staggerVarsToMerge = {});
              staggerVarsToMerge[p] = stagger[p];
            }
          }
        }
        for (i = 0; i < l; i++) {
          copy = _copyExcluding(vars, _staggerPropsToSkip);
          copy.stagger = 0;
          yoyoEase && (copy.yoyoEase = yoyoEase);
          staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
          curTarget = parsedTargets[i]; //don't just copy duration or delay because if they're a string or function, we'd end up in an infinite loop because _isFuncOrString() would evaluate as true in the child tweens, entering this loop, etc. So we parse the value straight from vars and default to 0.

          copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
          copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
          if (!stagger && l === 1 && copy.delay) {
            // if someone does delay:"random(1, 5)", repeat:-1, for example, the delay shouldn't be inside the repeat.
            _this3._delay = delay = copy.delay;
            _this3._start += delay;
            copy.delay = 0;
          }
          tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
          tl._ease = _easeMap.none;
        }
        tl.duration() ? duration = delay = 0 : _this3.timeline = 0; // if the timeline's duration is 0, we don't need a timeline internally!
      } else if (keyframes) {
        _inheritDefaults(_setDefaults(tl.vars.defaults, {
          ease: "none"
        }));
        tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
        var time = 0,
          a,
          kf,
          v;
        if (_isArray(keyframes)) {
          keyframes.forEach(function (frame) {
            return tl.to(parsedTargets, frame, ">");
          });
          tl.duration(); // to ensure tl._dur is cached because we tap into it for performance purposes in the render() method.
        } else {
          copy = {};
          for (p in keyframes) {
            p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
          }
          for (p in copy) {
            a = copy[p].sort(function (a, b) {
              return a.t - b.t;
            });
            time = 0;
            for (i = 0; i < a.length; i++) {
              kf = a[i];
              v = {
                ease: kf.e,
                duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
              };
              v[p] = kf.v;
              tl.to(parsedTargets, v, time);
              time += v.duration;
            }
          }
          tl.duration() < duration && tl.to({}, {
            duration: duration - tl.duration()
          }); // in case keyframes didn't go to 100%
        }
      }
      duration || _this3.duration(duration = tl.duration());
    } else {
      _this3.timeline = 0; //speed optimization, faster lookups (no going up the prototype chain)
    }
    if (overwrite === true && !_suppressOverwrites) {
      _overwritingTween = _assertThisInitialized(_this3);
      _globalTimeline.killTweensOf(parsedTargets);
      _overwritingTween = 0;
    }
    _addToTimeline(parent, _assertThisInitialized(_this3), position);
    vars.reversed && _this3.reverse();
    vars.paused && _this3.paused(true);
    if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
      _this3._tTime = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)

      _this3.render(Math.max(0, -delay) || 0); //in case delay is negative
    }
    scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
    return _this3;
  }
  var _proto3 = Tween.prototype;
  _proto3.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
      tDur = this._tDur,
      dur = this._dur,
      isNegative = totalTime < 0,
      tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime,
      time,
      pt,
      iteration,
      cycleDuration,
      prevIteration,
      isYoyo,
      ratio,
      timeline,
      yoyoEase;
    if (!dur) {
      _renderZeroDurationTween(this, totalTime, suppressEvents, force);
    } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative) {
      //this senses if we're crossing over the start time, in which case we must record _zTime and force the render, but we do it in this lengthy conditional way for performance reasons (usually we can skip the calculations): this._initted && (this._zTime < 0) !== (totalTime < 0)
      time = tTime;
      timeline = this.timeline;
      if (this._repeat) {
        //adjust the time for repeats and yoyos
        cycleDuration = dur + this._rDelay;
        if (this._repeat < -1 && isNegative) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }
        time = _roundPrecise(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (tTime === tDur) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);
          if (iteration && iteration === _roundPrecise(tTime / cycleDuration)) {
            time = dur;
            iteration--;
          }
          time > dur && (time = dur);
        }
        isYoyo = this._yoyo && iteration & 1;
        if (isYoyo) {
          yoyoEase = this._yEase;
          time = dur - time;
        }
        prevIteration = _animationCycle(this._tTime, cycleDuration);
        if (time === prevTime && !force && this._initted && iteration === prevIteration) {
          //could be during the repeatDelay part. No need to render and fire callbacks.
          this._tTime = tTime;
          return this;
        }
        if (iteration !== prevIteration) {
          timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo); //repeatRefresh functionality

          if (this.vars.repeatRefresh && !isYoyo && !this._lock && this._time !== cycleDuration && this._initted) {
            // this._time will === cycleDuration when we render at EXACTLY the end of an iteration. Without this condition, it'd often do the repeatRefresh render TWICE (again on the very next tick).
            this._lock = force = 1; //force, otherwise if lazy is true, the _attemptInitTween() will return and we'll jump out and get caught bouncing on each tick.

            this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
          }
        }
      }
      if (!this._initted) {
        if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
          this._tTime = 0; // in constructor if immediateRender is true, we set _tTime to -_tinyNum to have the playhead cross the starting point but we can't leave _tTime as a negative number.

          return this;
        }
        if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) {
          // rare edge case - during initialization, an onUpdate in the _startAt (.fromTo()) might force this tween to render at a different spot in which case we should ditch this render() call so that it doesn't revert the values. But we also don't want to dump if we're doing a repeatRefresh render!
          return this;
        }
        if (dur !== this._dur) {
          // while initting, a plugin like InertiaPlugin might alter the duration, so rerun from the start to ensure everything renders as it should.
          return this.render(totalTime, suppressEvents, force);
        }
      }
      this._tTime = tTime;
      this._time = time;
      if (!this._act && this._ts) {
        this._act = 1; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

        this._lazy = 0;
      }
      this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
      if (this._from) {
        this.ratio = ratio = 1 - ratio;
      }
      if (time && !prevTime && !suppressEvents && !iteration) {
        _callback(this, "onStart");
        if (this._tTime !== tTime) {
          // in case the onStart triggered a render at a different spot, eject. Like if someone did animation.pause(0.5) or something inside the onStart.
          return this;
        }
      }
      pt = this._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
      timeline && timeline.render(totalTime < 0 ? totalTime : timeline._dur * timeline._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
      if (this._onUpdate && !suppressEvents) {
        isNegative && _rewindStartAt(this, totalTime, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.

        _callback(this, "onUpdate");
      }
      this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");
      if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
        isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
        (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if we're rendering at exactly a time of 0, as there could be autoRevert values that should get set on the next tick (if the playhead goes backward beyond the startTime, negative totalTime). Don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
          // if prevTime and tTime are zero, we shouldn't fire the onReverseComplete. This could happen if you gsap.to(... {paused:true}).play();
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }
    return this;
  };
  _proto3.targets = function targets() {
    return this._targets;
  };
  _proto3.invalidate = function invalidate(soft) {
    // "soft" gives us a way to clear out everything EXCEPT the recorded pre-"from" portion of from() tweens. Otherwise, for example, if you tween.progress(1).render(0, true true).invalidate(), the "from" values would persist and then on the next render, the from() tweens would initialize and the current value would match the "from" values, thus animate from the same value to the same value (no animation). We tap into this in ScrollTrigger's refresh() where we must push a tween to completion and then back again but honor its init state in case the tween is dependent on another tween further up on the page.
    (!soft || !this.vars.runBackwards) && (this._startAt = 0);
    this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
    this._ptLookup = [];
    this.timeline && this.timeline.invalidate(soft);
    return _Animation2.prototype.invalidate.call(this, soft);
  };
  _proto3.resetTo = function resetTo(property, value, start, startIsRelative, skipRecursion) {
    _tickerActive || _ticker.wake();
    this._ts || this.play();
    var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts),
      ratio;
    this._initted || _initTween(this, time);
    ratio = this._ease(time / this._dur); // don't just get tween.ratio because it may not have rendered yet.
    // possible future addition to allow an object with multiple values to update, like tween.resetTo({x: 100, y: 200}); At this point, it doesn't seem worth the added kb given the fact that most users will likely opt for the convenient gsap.quickTo() way of interacting with this method.
    // if (_isObject(property)) { // performance optimization
    // 	for (p in property) {
    // 		if (_updatePropTweens(this, p, property[p], value ? value[p] : null, start, ratio, time)) {
    // 			return this.resetTo(property, value, start, startIsRelative); // if a PropTween wasn't found for the property, it'll get forced with a re-initialization so we need to jump out and start over again.
    // 		}
    // 	}
    // } else {

    if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time, skipRecursion)) {
      return this.resetTo(property, value, start, startIsRelative, 1); // if a PropTween wasn't found for the property, it'll get forced with a re-initialization so we need to jump out and start over again.
    } //}

    _alignPlayhead(this, 0);
    this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
    return this.render(0);
  };
  _proto3.kill = function kill(targets, vars) {
    if (vars === void 0) {
      vars = "all";
    }
    if (!targets && (!vars || vars === "all")) {
      this._lazy = this._pt = 0;
      return this.parent ? _interrupt(this) : this;
    }
    if (this.timeline) {
      var tDur = this.timeline.totalDuration();
      this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this); // if nothing is left tweening, interrupt.

      this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1); // if a nested tween is killed that changes the duration, it should affect this tween's duration. We must use the ratio, though, because sometimes the internal timeline is stretched like for keyframes where they don't all add up to whatever the parent tween's duration was set to.

      return this;
    }
    var parsedTargets = this._targets,
      killingTargets = targets ? toArray(targets) : parsedTargets,
      propTweenLookup = this._ptLookup,
      firstPT = this._pt,
      overwrittenProps,
      curLookup,
      curOverwriteProps,
      props,
      p,
      pt,
      i;
    if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
      vars === "all" && (this._pt = 0);
      return _interrupt(this);
    }
    overwrittenProps = this._op = this._op || [];
    if (vars !== "all") {
      //so people can pass in a comma-delimited list of property names
      if (_isString(vars)) {
        p = {};
        _forEachName(vars, function (name) {
          return p[name] = 1;
        });
        vars = p;
      }
      vars = _addAliasesToVars(parsedTargets, vars);
    }
    i = parsedTargets.length;
    while (i--) {
      if (~killingTargets.indexOf(parsedTargets[i])) {
        curLookup = propTweenLookup[i];
        if (vars === "all") {
          overwrittenProps[i] = vars;
          props = curLookup;
          curOverwriteProps = {};
        } else {
          curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
          props = vars;
        }
        for (p in props) {
          pt = curLookup && curLookup[p];
          if (pt) {
            if (!("kill" in pt.d) || pt.d.kill(p) === true) {
              _removeLinkedListItem(this, pt, "_pt");
            }
            delete curLookup[p];
          }
          if (curOverwriteProps !== "all") {
            curOverwriteProps[p] = 1;
          }
        }
      }
    }
    this._initted && !this._pt && firstPT && _interrupt(this); //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.

    return this;
  };
  Tween.to = function to(targets, vars) {
    return new Tween(targets, vars, arguments[2]);
  };
  Tween.from = function from(targets, vars) {
    return _createTweenType(1, arguments);
  };
  Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
    return new Tween(callback, 0, {
      immediateRender: false,
      lazy: false,
      overwrite: false,
      delay: delay,
      onComplete: callback,
      onReverseComplete: callback,
      onCompleteParams: params,
      onReverseCompleteParams: params,
      callbackScope: scope
    }); // we must use onReverseComplete too for things like timeline.add(() => {...}) which should be triggered in BOTH directions (forward and reverse)
  };
  Tween.fromTo = function fromTo(targets, fromVars, toVars) {
    return _createTweenType(2, arguments);
  };
  Tween.set = function set(targets, vars) {
    vars.duration = 0;
    vars.repeatDelay || (vars.repeat = 0);
    return new Tween(targets, vars);
  };
  Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    return _globalTimeline.killTweensOf(targets, props, onlyActive);
  };
  return Tween;
}(Animation);
_setDefaults(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
}); //add the pertinent timeline methods to Tween instances so that users can chain conveniently and create a timeline automatically. (removed due to concerns that it'd ultimately add to more confusion especially for beginners)
// _forEachName("to,from,fromTo,set,call,add,addLabel,addPause", name => {
// 	Tween.prototype[name] = function() {
// 		let tl = new Timeline();
// 		return _addToTimeline(tl, this)[name].apply(tl, toArray(arguments));
// 	}
// });
//for backward compatibility. Leverage the timeline calls.

_forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
  Tween[name] = function () {
    var tl = new Timeline(),
      params = _slice.call(arguments, 0);
    params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
    return tl[name].apply(tl, params);
  };
});
/*
 * --------------------------------------------------------------------------------------
 * PROPTWEEN
 * --------------------------------------------------------------------------------------
 */

var _setterPlain = function _setterPlain(target, property, value) {
    return target[property] = value;
  },
  _setterFunc = function _setterFunc(target, property, value) {
    return target[property](value);
  },
  _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
    return target[property](data.fp, value);
  },
  _setterAttribute = function _setterAttribute(target, property, value) {
    return target.setAttribute(property, value);
  },
  _getSetter = exports._getSetter = function _getSetter(target, property) {
    return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
  },
  _renderPlain = function _renderPlain(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1000000) / 1000000, data);
  },
  _renderBoolean = function _renderBoolean(ratio, data) {
    return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
  },
  _renderComplexString = exports._renderComplexString = function _renderComplexString(ratio, data) {
    var pt = data._pt,
      s = "";
    if (!ratio && data.b) {
      //b = beginning string
      s = data.b;
    } else if (ratio === 1 && data.e) {
      //e = ending string
      s = data.e;
    } else {
      while (pt) {
        s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s; //we use the "p" property for the text inbetween (like a suffix). And in the context of a complex string, the modifier (m) is typically just Math.round(), like for RGB colors.

        pt = pt._next;
      }
      s += data.c; //we use the "c" of the PropTween to store the final chunk of non-numeric text.
    }
    data.set(data.t, data.p, s, data);
  },
  _renderPropTweens = function _renderPropTweens(ratio, data) {
    var pt = data._pt;
    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
  },
  _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
    var pt = this._pt,
      next;
    while (pt) {
      next = pt._next;
      pt.p === property && pt.modifier(modifier, tween, target);
      pt = next;
    }
  },
  _killPropTweensOf = function _killPropTweensOf(property) {
    var pt = this._pt,
      hasNonDependentRemaining,
      next;
    while (pt) {
      next = pt._next;
      if (pt.p === property && !pt.op || pt.op === property) {
        _removeLinkedListItem(this, pt, "_pt");
      } else if (!pt.dep) {
        hasNonDependentRemaining = 1;
      }
      pt = next;
    }
    return !hasNonDependentRemaining;
  },
  _setterWithModifier = function _setterWithModifier(target, property, value, data) {
    data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
  },
  _sortPropTweensByPriority = exports._sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
    var pt = parent._pt,
      next,
      pt2,
      first,
      last; //sorts the PropTween linked list in order of priority because some plugins need to do their work after ALL of the PropTweens were created (like RoundPropsPlugin and ModifiersPlugin)

    while (pt) {
      next = pt._next;
      pt2 = first;
      while (pt2 && pt2.pr > pt.pr) {
        pt2 = pt2._next;
      }
      if (pt._prev = pt2 ? pt2._prev : last) {
        pt._prev._next = pt;
      } else {
        first = pt;
      }
      if (pt._next = pt2) {
        pt2._prev = pt;
      } else {
        last = pt;
      }
      pt = next;
    }
    parent._pt = first;
  }; //PropTween key: t = target, p = prop, r = renderer, d = data, s = start, c = change, op = overwriteProperty (ONLY populated when it's different than p), pr = priority, _next/_prev for the linked list siblings, set = setter, m = modifier, mSet = modifierSetter (the original setter, before a modifier was added)

var PropTween = exports.PropTween = /*#__PURE__*/function () {
  function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
    this.t = target;
    this.s = start;
    this.c = change;
    this.p = prop;
    this.r = renderer || _renderPlain;
    this.d = data || this;
    this.set = setter || _setterPlain;
    this.pr = priority || 0;
    this._next = next;
    if (next) {
      next._prev = this;
    }
  }
  var _proto4 = PropTween.prototype;
  _proto4.modifier = function modifier(func, tween, target) {
    this.mSet = this.mSet || this.set; //in case it was already set (a PropTween can only have one modifier)

    this.set = _setterWithModifier;
    this.m = func;
    this.mt = target; //modifier target

    this.tween = tween;
  };
  return PropTween;
}(); //Initialization tasks

_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function (name) {
  return _reservedProps[name] = 1;
});
_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: false,
  defaults: _defaults,
  autoRemoveChildren: true,
  id: "root",
  smoothChildTiming: true
});
_config.stringFilter = _colorStringFilter;
var _media = [],
  _listeners = {},
  _emptyArray = [],
  _lastMediaTime = 0,
  _contextID = 0,
  _dispatch = function _dispatch(type) {
    return (_listeners[type] || _emptyArray).map(function (f) {
      return f();
    });
  },
  _onMediaChange = function _onMediaChange() {
    var time = Date.now(),
      matches = [];
    if (time - _lastMediaTime > 2) {
      _dispatch("matchMediaInit");
      _media.forEach(function (c) {
        var queries = c.queries,
          conditions = c.conditions,
          match,
          p,
          anyMatch,
          toggled;
        for (p in queries) {
          match = _win.matchMedia(queries[p]).matches; // Firefox doesn't update the "matches" property of the MediaQueryList object correctly - it only does so as it calls its change handler - so we must re-create a media query here to ensure it's accurate.

          match && (anyMatch = 1);
          if (match !== conditions[p]) {
            conditions[p] = match;
            toggled = 1;
          }
        }
        if (toggled) {
          c.revert();
          anyMatch && matches.push(c);
        }
      });
      _dispatch("matchMediaRevert");
      matches.forEach(function (c) {
        return c.onMatch(c, function (func) {
          return c.add(null, func);
        });
      });
      _lastMediaTime = time;
      _dispatch("matchMedia");
    }
  };
var Context = /*#__PURE__*/function () {
  function Context(func, scope) {
    this.selector = scope && selector(scope);
    this.data = [];
    this._r = []; // returned/cleanup functions

    this.isReverted = false;
    this.id = _contextID++; // to work around issues that frameworks like Vue cause by making things into Proxies which make it impossible to do something like _media.indexOf(this) because "this" would no longer refer to the Context instance itself - it'd refer to a Proxy! We needed a way to identify the context uniquely

    func && this.add(func);
  }
  var _proto5 = Context.prototype;
  _proto5.add = function add(name, func, scope) {
    // possible future addition if we need the ability to add() an animation to a context and for whatever reason cannot create that animation inside of a context.add(() => {...}) function.
    // if (name && _isFunction(name.revert)) {
    // 	this.data.push(name);
    // 	return (name._ctx = this);
    // }
    if (_isFunction(name)) {
      scope = func;
      func = name;
      name = _isFunction;
    }
    var self = this,
      f = function f() {
        var prev = _context,
          prevSelector = self.selector,
          result;
        prev && prev !== self && prev.data.push(self);
        scope && (self.selector = selector(scope));
        _context = self;
        result = func.apply(self, arguments);
        _isFunction(result) && self._r.push(result);
        _context = prev;
        self.selector = prevSelector;
        self.isReverted = false;
        return result;
      };
    self.last = f;
    return name === _isFunction ? f(self, function (func) {
      return self.add(null, func);
    }) : name ? self[name] = f : f;
  };
  _proto5.ignore = function ignore(func) {
    var prev = _context;
    _context = null;
    func(this);
    _context = prev;
  };
  _proto5.getTweens = function getTweens() {
    var a = [];
    this.data.forEach(function (e) {
      return e instanceof Context ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
    });
    return a;
  };
  _proto5.clear = function clear() {
    this._r.length = this.data.length = 0;
  };
  _proto5.kill = function kill(revert, matchMedia) {
    var _this4 = this;
    if (revert) {
      (function () {
        var tweens = _this4.getTweens(),
          i = _this4.data.length,
          t;
        while (i--) {
          // Flip plugin tweens are very different in that they should actually be pushed to their end. The plugin replaces the timeline's .revert() method to do exactly that. But we also need to remove any of those nested tweens inside the flip timeline so that they don't get individually reverted.
          t = _this4.data[i];
          if (t.data === "isFlip") {
            t.revert();
            t.getChildren(true, true, false).forEach(function (tween) {
              return tweens.splice(tweens.indexOf(tween), 1);
            });
          }
        } // save as an object so that we can cache the globalTime for each tween to optimize performance during the sort

        tweens.map(function (t) {
          return {
            g: t._dur || t._delay || t._sat && !t._sat.vars.immediateRender ? t.globalTime(0) : -Infinity,
            t: t
          };
        }).sort(function (a, b) {
          return b.g - a.g || -Infinity;
        }).forEach(function (o) {
          return o.t.revert(revert);
        }); // note: all of the _startAt tweens should be reverted in reverse order that they were created, and they'll all have the same globalTime (-1) so the " || -1" in the sort keeps the order properly.

        i = _this4.data.length;
        while (i--) {
          // make sure we loop backwards so that, for example, SplitTexts that were created later on the same element get reverted first
          t = _this4.data[i];
          if (t instanceof Timeline) {
            if (t.data !== "nested") {
              t.scrollTrigger && t.scrollTrigger.revert();
              t.kill(); // don't revert() the timeline because that's duplicating efforts since we already reverted all the tweens
            }
          } else {
            !(t instanceof Tween) && t.revert && t.revert(revert);
          }
        }
        _this4._r.forEach(function (f) {
          return f(revert, _this4);
        });
        _this4.isReverted = true;
      })();
    } else {
      this.data.forEach(function (e) {
        return e.kill && e.kill();
      });
    }
    this.clear();
    if (matchMedia) {
      var i = _media.length;
      while (i--) {
        // previously, we checked _media.indexOf(this), but some frameworks like Vue enforce Proxy objects that make it impossible to get the proper result that way, so we must use a unique ID number instead.
        _media[i].id === this.id && _media.splice(i, 1);
      }
    }
  };
  _proto5.revert = function revert(config) {
    this.kill(config || {});
  };
  return Context;
}();
var MatchMedia = /*#__PURE__*/function () {
  function MatchMedia(scope) {
    this.contexts = [];
    this.scope = scope;
    _context && _context.data.push(this);
  }
  var _proto6 = MatchMedia.prototype;
  _proto6.add = function add(conditions, func, scope) {
    _isObject(conditions) || (conditions = {
      matches: conditions
    });
    var context = new Context(0, scope || this.scope),
      cond = context.conditions = {},
      mq,
      p,
      active;
    _context && !context.selector && (context.selector = _context.selector); // in case a context is created inside a context. Like a gsap.matchMedia() that's inside a scoped gsap.context()

    this.contexts.push(context);
    func = context.add("onMatch", func);
    context.queries = conditions;
    for (p in conditions) {
      if (p === "all") {
        active = 1;
      } else {
        mq = _win.matchMedia(conditions[p]);
        if (mq) {
          _media.indexOf(context) < 0 && _media.push(context);
          (cond[p] = mq.matches) && (active = 1);
          mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
        }
      }
    }
    active && func(context, function (f) {
      return context.add(null, f);
    });
    return this;
  } // refresh() {
  // 	let time = _lastMediaTime,
  // 		media = _media;
  // 	_lastMediaTime = -1;
  // 	_media = this.contexts;
  // 	_onMediaChange();
  // 	_lastMediaTime = time;
  // 	_media = media;
  // }
  ;
  _proto6.revert = function revert(config) {
    this.kill(config || {});
  };
  _proto6.kill = function kill(revert) {
    this.contexts.forEach(function (c) {
      return c.kill(revert, true);
    });
  };
  return MatchMedia;
}();
/*
 * --------------------------------------------------------------------------------------
 * GSAP
 * --------------------------------------------------------------------------------------
 */

var _gsap = {
  registerPlugin: function registerPlugin() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    args.forEach(function (config) {
      return _createPlugin(config);
    });
  },
  timeline: function timeline(vars) {
    return new Timeline(vars);
  },
  getTweensOf: function getTweensOf(targets, onlyActive) {
    return _globalTimeline.getTweensOf(targets, onlyActive);
  },
  getProperty: function getProperty(target, property, unit, uncache) {
    _isString(target) && (target = toArray(target)[0]); //in case selector text or an array is passed in

    var getter = _getCache(target || {}).get,
      format = unit ? _passThrough : _numericIfPossible;
    unit === "native" && (unit = "");
    return !target ? target : !property ? function (property, unit, uncache) {
      return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
  },
  quickSetter: function quickSetter(target, property, unit) {
    target = toArray(target);
    if (target.length > 1) {
      var setters = target.map(function (t) {
          return gsap.quickSetter(t, property, unit);
        }),
        l = setters.length;
      return function (value) {
        var i = l;
        while (i--) {
          setters[i](value);
        }
      };
    }
    target = target[0] || {};
    var Plugin = _plugins[property],
      cache = _getCache(target),
      p = cache.harness && (cache.harness.aliases || {})[property] || property,
      // in case it's an alias, like "rotate" for "rotation".
      setter = Plugin ? function (value) {
        var p = new Plugin();
        _quickTween._pt = 0;
        p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
        p.render(1, p);
        _quickTween._pt && _renderPropTweens(1, _quickTween);
      } : cache.set(target, p);
    return Plugin ? setter : function (value) {
      return setter(target, p, unit ? value + unit : value, cache, 1);
    };
  },
  quickTo: function quickTo(target, property, vars) {
    var _merge2;
    var tween = gsap.to(target, _merge((_merge2 = {}, _merge2[property] = "+=0.1", _merge2.paused = true, _merge2), vars || {})),
      func = function func(value, start, startIsRelative) {
        return tween.resetTo(property, value, start, startIsRelative);
      };
    func.tween = tween;
    return func;
  },
  isTweening: function isTweening(targets) {
    return _globalTimeline.getTweensOf(targets, true).length > 0;
  },
  defaults: function defaults(value) {
    value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
    return _mergeDeep(_defaults, value || {});
  },
  config: function config(value) {
    return _mergeDeep(_config, value || {});
  },
  registerEffect: function registerEffect(_ref3) {
    var name = _ref3.name,
      effect = _ref3.effect,
      plugins = _ref3.plugins,
      defaults = _ref3.defaults,
      extendTimeline = _ref3.extendTimeline;
    (plugins || "").split(",").forEach(function (pluginName) {
      return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
    });
    _effects[name] = function (targets, vars, tl) {
      return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
    };
    if (extendTimeline) {
      Timeline.prototype[name] = function (targets, vars, position) {
        return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
      };
    }
  },
  registerEase: function registerEase(name, ease) {
    _easeMap[name] = _parseEase(ease);
  },
  parseEase: function parseEase(ease, defaultEase) {
    return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
  },
  getById: function getById(id) {
    return _globalTimeline.getById(id);
  },
  exportRoot: function exportRoot(vars, includeDelayedCalls) {
    if (vars === void 0) {
      vars = {};
    }
    var tl = new Timeline(vars),
      child,
      next;
    tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
    _globalTimeline.remove(tl);
    tl._dp = 0; //otherwise it'll get re-activated when adding children and be re-introduced into _globalTimeline's linked list (then added to itself).

    tl._time = tl._tTime = _globalTimeline._time;
    child = _globalTimeline._first;
    while (child) {
      next = child._next;
      if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
        _addToTimeline(tl, child, child._start - child._delay);
      }
      child = next;
    }
    _addToTimeline(_globalTimeline, tl, 0);
    return tl;
  },
  context: function context(func, scope) {
    return func ? new Context(func, scope) : _context;
  },
  matchMedia: function matchMedia(scope) {
    return new MatchMedia(scope);
  },
  matchMediaRefresh: function matchMediaRefresh() {
    return _media.forEach(function (c) {
      var cond = c.conditions,
        found,
        p;
      for (p in cond) {
        if (cond[p]) {
          cond[p] = false;
          found = 1;
        }
      }
      found && c.revert();
    }) || _onMediaChange();
  },
  addEventListener: function addEventListener(type, callback) {
    var a = _listeners[type] || (_listeners[type] = []);
    ~a.indexOf(callback) || a.push(callback);
  },
  removeEventListener: function removeEventListener(type, callback) {
    var a = _listeners[type],
      i = a && a.indexOf(callback);
    i >= 0 && a.splice(i, 1);
  },
  utils: {
    wrap: wrap,
    wrapYoyo: wrapYoyo,
    distribute: distribute,
    random: random,
    snap: snap,
    normalize: normalize,
    getUnit: getUnit,
    clamp: clamp,
    splitColor: splitColor,
    toArray: toArray,
    selector: selector,
    mapRange: mapRange,
    pipe: pipe,
    unitize: unitize,
    interpolate: interpolate,
    shuffle: shuffle
  },
  install: _install,
  effects: _effects,
  ticker: _ticker,
  updateRoot: Timeline.updateRoot,
  plugins: _plugins,
  globalTimeline: _globalTimeline,
  core: {
    PropTween: PropTween,
    globals: _addGlobal,
    Tween: Tween,
    Timeline: Timeline,
    Animation: Animation,
    getCache: _getCache,
    _removeLinkedListItem: _removeLinkedListItem,
    reverting: function reverting() {
      return _reverting;
    },
    context: function context(toAdd) {
      if (toAdd && _context) {
        _context.data.push(toAdd);
        toAdd._ctx = _context;
      }
      return _context;
    },
    suppressOverwrites: function suppressOverwrites(value) {
      return _suppressOverwrites = value;
    }
  }
};
_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
  return _gsap[name] = Tween[name];
});
_ticker.add(Timeline.updateRoot);
_quickTween = _gsap.to({}, {
  duration: 0
}); // ---- EXTRA PLUGINS --------------------------------------------------------

var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
    var pt = plugin._pt;
    while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
      pt = pt._next;
    }
    return pt;
  },
  _addModifiers = function _addModifiers(tween, modifiers) {
    var targets = tween._targets,
      p,
      i,
      pt;
    for (p in modifiers) {
      i = targets.length;
      while (i--) {
        pt = tween._ptLookup[i][p];
        if (pt && (pt = pt.d)) {
          if (pt._pt) {
            // is a plugin
            pt = _getPluginPropTween(pt, p);
          }
          pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
        }
      }
    }
  },
  _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
    return {
      name: name,
      rawVars: 1,
      //don't pre-process function-based values or "random()" strings.
      init: function init(target, vars, tween) {
        tween._onInit = function (tween) {
          var temp, p;
          if (_isString(vars)) {
            temp = {};
            _forEachName(vars, function (name) {
              return temp[name] = 1;
            }); //if the user passes in a comma-delimited list of property names to roundProps, like "x,y", we round to whole numbers.

            vars = temp;
          }
          if (modifier) {
            temp = {};
            for (p in vars) {
              temp[p] = modifier(vars[p]);
            }
            vars = temp;
          }
          _addModifiers(tween, vars);
        };
      }
    };
  }; //register core plugins

var gsap = exports.default = exports.gsap = _gsap.registerPlugin({
  name: "attr",
  init: function init(target, vars, tween, index, targets) {
    var p, pt, v;
    this.tween = tween;
    for (p in vars) {
      v = target.getAttribute(p) || "";
      pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
      pt.op = p;
      pt.b = v; // record the beginning value so we can revert()

      this._props.push(p);
    }
  },
  render: function render(ratio, data) {
    var pt = data._pt;
    while (pt) {
      _reverting ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d); // if reverting, go back to the original (pt.b)

      pt = pt._next;
    }
  }
}, {
  name: "endArray",
  init: function init(target, value) {
    var i = value.length;
    while (i--) {
      this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
    }
  }
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap; //to prevent the core plugins from being dropped via aggressive tree shaking, we must include them in the variable declaration in this way.

Tween.version = Timeline.version = gsap.version = "3.12.5";
_coreReady = 1;
_windowExists() && _wake();
var Power0 = exports.Power0 = _easeMap.Power0,
  Power1 = exports.Power1 = _easeMap.Power1,
  Power2 = exports.Power2 = _easeMap.Power2,
  Power3 = exports.Power3 = _easeMap.Power3,
  Power4 = exports.Power4 = _easeMap.Power4,
  Linear = exports.Linear = _easeMap.Linear,
  Quad = exports.Quad = _easeMap.Quad,
  Cubic = exports.Cubic = _easeMap.Cubic,
  Quart = exports.Quart = _easeMap.Quart,
  Quint = exports.Quint = _easeMap.Quint,
  Strong = exports.Strong = _easeMap.Strong,
  Elastic = exports.Elastic = _easeMap.Elastic,
  Back = exports.Back = _easeMap.Back,
  SteppedEase = exports.SteppedEase = _easeMap.SteppedEase,
  Bounce = exports.Bounce = _easeMap.Bounce,
  Sine = exports.Sine = _easeMap.Sine,
  Expo = exports.Expo = _easeMap.Expo,
  Circ = exports.Circ = _easeMap.Circ;

//export some internal methods/orojects for use in CSSPlugin so that we can externalize that file and allow custom builds that exclude it.
},{}],"../node_modules/gsap/CSSPlugin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.checkPrefix = exports._getBBox = exports._createElement = exports.CSSPlugin = void 0;
var _gsapCore = require("./gsap-core.js");
/*!
 * CSSPlugin 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */

var _win,
  _doc,
  _docElement,
  _pluginInitted,
  _tempDiv,
  _tempDivStyler,
  _recentSetterPlugin,
  _reverting,
  _windowExists = function _windowExists() {
    return typeof window !== "undefined";
  },
  _transformProps = {},
  _RAD2DEG = 180 / Math.PI,
  _DEG2RAD = Math.PI / 180,
  _atan2 = Math.atan2,
  _bigNum = 1e8,
  _capsExp = /([A-Z])/g,
  _horizontalExp = /(left|right|width|margin|padding|x)/i,
  _complexExp = /[\s,\(]\S/,
  _propertyAliases = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity"
  },
  _renderCSSProp = function _renderCSSProp(ratio, data) {
    return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
  },
  _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
    return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
  },
  _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
    return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u : data.b, data);
  },
  //if units change, we need a way to render the original unit/value when the tween goes all the way back to the beginning (ratio:0)
  _renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
    var value = data.s + data.c * ratio;
    data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
  },
  _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
    return data.set(data.t, data.p, ratio ? data.e : data.b, data);
  },
  _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
    return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
  },
  _setterCSSStyle = function _setterCSSStyle(target, property, value) {
    return target.style[property] = value;
  },
  _setterCSSProp = function _setterCSSProp(target, property, value) {
    return target.style.setProperty(property, value);
  },
  _setterTransform = function _setterTransform(target, property, value) {
    return target._gsap[property] = value;
  },
  _setterScale = function _setterScale(target, property, value) {
    return target._gsap.scaleX = target._gsap.scaleY = value;
  },
  _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache.scaleX = cache.scaleY = value;
    cache.renderTransform(ratio, cache);
  },
  _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
    var cache = target._gsap;
    cache[property] = value;
    cache.renderTransform(ratio, cache);
  },
  _transformProp = "transform",
  _transformOriginProp = _transformProp + "Origin",
  _saveStyle = function _saveStyle(property, isNotCSS) {
    var _this = this;
    var target = this.target,
      style = target.style,
      cache = target._gsap;
    if (property in _transformProps && style) {
      this.tfm = this.tfm || {};
      if (property !== "transform") {
        property = _propertyAliases[property] || property;
        ~property.indexOf(",") ? property.split(",").forEach(function (a) {
          return _this.tfm[a] = _get(target, a);
        }) : this.tfm[property] = cache.x ? cache[property] : _get(target, property); // note: scale would map to "scaleX,scaleY", thus we loop and apply them both.

        property === _transformOriginProp && (this.tfm.zOrigin = cache.zOrigin);
      } else {
        return _propertyAliases.transform.split(",").forEach(function (p) {
          return _saveStyle.call(_this, p, isNotCSS);
        });
      }
      if (this.props.indexOf(_transformProp) >= 0) {
        return;
      }
      if (cache.svg) {
        this.svgo = target.getAttribute("data-svg-origin");
        this.props.push(_transformOriginProp, isNotCSS, "");
      }
      property = _transformProp;
    }
    (style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
  },
  _removeIndependentTransforms = function _removeIndependentTransforms(style) {
    if (style.translate) {
      style.removeProperty("translate");
      style.removeProperty("scale");
      style.removeProperty("rotate");
    }
  },
  _revertStyle = function _revertStyle() {
    var props = this.props,
      target = this.target,
      style = target.style,
      cache = target._gsap,
      i,
      p;
    for (i = 0; i < props.length; i += 3) {
      // stored like this: property, isNotCSS, value
      props[i + 1] ? target[props[i]] = props[i + 2] : props[i + 2] ? style[props[i]] = props[i + 2] : style.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp, "-$1").toLowerCase());
    }
    if (this.tfm) {
      for (p in this.tfm) {
        cache[p] = this.tfm[p];
      }
      if (cache.svg) {
        cache.renderTransform();
        target.setAttribute("data-svg-origin", this.svgo || "");
      }
      i = _reverting();
      if ((!i || !i.isStart) && !style[_transformProp]) {
        _removeIndependentTransforms(style);
        if (cache.zOrigin && style[_transformOriginProp]) {
          style[_transformOriginProp] += " " + cache.zOrigin + "px"; // since we're uncaching, we must put the zOrigin back into the transformOrigin so that we can pull it out accurately when we parse again. Otherwise, we'd lose the z portion of the origin since we extract it to protect from Safari bugs.

          cache.zOrigin = 0;
          cache.renderTransform();
        }
        cache.uncache = 1; // if it's a startAt that's being reverted in the _initTween() of the core, we don't need to uncache transforms. This is purely a performance optimization.
      }
    }
  },
  _getStyleSaver = function _getStyleSaver(target, properties) {
    var saver = {
      target: target,
      props: [],
      revert: _revertStyle,
      save: _saveStyle
    };
    target._gsap || _gsapCore.gsap.core.getCache(target); // just make sure there's a _gsap cache defined because we read from it in _saveStyle() and it's more efficient to just check it here once.

    properties && properties.split(",").forEach(function (p) {
      return saver.save(p);
    });
    return saver;
  },
  _supports3D,
  _createElement = exports._createElement = function _createElement(type, ns) {
    var e = _doc.createElementNS ? _doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc.createElement(type); //some servers swap in https for http in the namespace which can break things, making "style" inaccessible.

    return e && e.style ? e : _doc.createElement(type); //some environments won't allow access to the element's style when created with a namespace in which case we default to the standard createElement() to work around the issue. Also note that when GSAP is embedded directly inside an SVG file, createElement() won't allow access to the style object in Firefox (see https://gsap.com/forums/topic/20215-problem-using-tweenmax-in-standalone-self-containing-svg-file-err-cannot-set-property-csstext-of-undefined/).
  },
  _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
    var cs = getComputedStyle(target);
    return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || ""; //css variables may not need caps swapped out for dashes and lowercase.
  },
  _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
  _checkPropPrefix = exports.checkPrefix = function _checkPropPrefix(property, element, preferPrefix) {
    var e = element || _tempDiv,
      s = e.style,
      i = 5;
    if (property in s && !preferPrefix) {
      return property;
    }
    property = property.charAt(0).toUpperCase() + property.substr(1);
    while (i-- && !(_prefixes[i] + property in s)) {}
    return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
  },
  _initCore = function _initCore() {
    if (_windowExists() && window.document) {
      _win = window;
      _doc = _win.document;
      _docElement = _doc.documentElement;
      _tempDiv = _createElement("div") || {
        style: {}
      };
      _tempDivStyler = _createElement("div");
      _transformProp = _checkPropPrefix(_transformProp);
      _transformOriginProp = _transformProp + "Origin";
      _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0"; //make sure to override certain properties that may contaminate measurements, in case the user has overreaching style sheets.

      _supports3D = !!_checkPropPrefix("perspective");
      _reverting = _gsapCore.gsap.core.reverting;
      _pluginInitted = 1;
    }
  },
  _getBBoxHack = function _getBBoxHack(swapIfPossible) {
    //works around issues in some browsers (like Firefox) that don't correctly report getBBox() on SVG elements inside a <defs> element and/or <mask>. We try creating an SVG, adding it to the documentElement and toss the element in there so that it's definitely part of the rendering tree, then grab the bbox and if it works, we actually swap out the original getBBox() method for our own that does these extra steps whenever getBBox is needed. This helps ensure that performance is optimal (only do all these extra steps when absolutely necessary...most elements don't need it).
    var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
      oldParent = this.parentNode,
      oldSibling = this.nextSibling,
      oldCSS = this.style.cssText,
      bbox;
    _docElement.appendChild(svg);
    svg.appendChild(this);
    this.style.display = "block";
    if (swapIfPossible) {
      try {
        bbox = this.getBBox();
        this._gsapBBox = this.getBBox; //store the original

        this.getBBox = _getBBoxHack;
      } catch (e) {}
    } else if (this._gsapBBox) {
      bbox = this._gsapBBox();
    }
    if (oldParent) {
      if (oldSibling) {
        oldParent.insertBefore(this, oldSibling);
      } else {
        oldParent.appendChild(this);
      }
    }
    _docElement.removeChild(svg);
    this.style.cssText = oldCSS;
    return bbox;
  },
  _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
    var i = attributesArray.length;
    while (i--) {
      if (target.hasAttribute(attributesArray[i])) {
        return target.getAttribute(attributesArray[i]);
      }
    }
  },
  _getBBox = exports._getBBox = function _getBBox(target) {
    var bounds;
    try {
      bounds = target.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
    } catch (error) {
      bounds = _getBBoxHack.call(target, true);
    }
    bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true)); //some browsers (like Firefox) misreport the bounds if the element has zero width and height (it just assumes it's at x:0, y:0), thus we need to manually grab the position in that case.

    return bounds && !bounds.width && !bounds.x && !bounds.y ? {
      x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
      y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
      width: 0,
      height: 0
    } : bounds;
  },
  _isSVG = function _isSVG(e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
  },
  //reports if the element is an SVG on which getBBox() actually works
  _removeProperty = function _removeProperty(target, property) {
    if (property) {
      var style = target.style,
        first2Chars;
      if (property in _transformProps && property !== _transformOriginProp) {
        property = _transformProp;
      }
      if (style.removeProperty) {
        first2Chars = property.substr(0, 2);
        if (first2Chars === "ms" || property.substr(0, 6) === "webkit") {
          //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
          property = "-" + property;
        }
        style.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp, "-$1").toLowerCase());
      } else {
        //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
        style.removeAttribute(property);
      }
    }
  },
  _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
    var pt = new _gsapCore.PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
    plugin._pt = pt;
    pt.b = beginning;
    pt.e = end;
    plugin._props.push(property);
    return pt;
  },
  _nonConvertibleUnits = {
    deg: 1,
    rad: 1,
    turn: 1
  },
  _nonStandardLayouts = {
    grid: 1,
    flex: 1
  },
  //takes a single value like 20px and converts it to the unit specified, like "%", returning only the numeric amount.
  _convertToUnit = function _convertToUnit(target, property, value, unit) {
    var curValue = parseFloat(value) || 0,
      curUnit = (value + "").trim().substr((curValue + "").length) || "px",
      // some browsers leave extra whitespace at the beginning of CSS variables, hence the need to trim()
      style = _tempDiv.style,
      horizontal = _horizontalExp.test(property),
      isRootSVG = target.tagName.toLowerCase() === "svg",
      measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
      amount = 100,
      toPixels = unit === "px",
      toPercent = unit === "%",
      px,
      parent,
      cache,
      isSVG;
    if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
      return curValue;
    }
    curUnit !== "px" && !toPixels && (curValue = _convertToUnit(target, property, value, "px"));
    isSVG = target.getCTM && _isSVG(target);
    if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
      px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
      return (0, _gsapCore._round)(toPercent ? curValue / px * amount : curValue / 100 * px);
    }
    style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
    parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
    if (isSVG) {
      parent = (target.ownerSVGElement || {}).parentNode;
    }
    if (!parent || parent === _doc || !parent.appendChild) {
      parent = _doc.body;
    }
    cache = parent._gsap;
    if (cache && toPercent && cache.width && horizontal && cache.time === _gsapCore._ticker.time && !cache.uncache) {
      return (0, _gsapCore._round)(curValue / cache.width * amount);
    } else {
      if (toPercent && (property === "height" || property === "width")) {
        // if we're dealing with width/height that's inside a container with padding and/or it's a flexbox/grid container, we must apply it to the target itself rather than the _tempDiv in order to ensure complete accuracy, factoring in the parent's padding.
        var v = target.style[property];
        target.style[property] = amount + unit;
        px = target[measureProperty];
        v ? target.style[property] = v : _removeProperty(target, property);
      } else {
        (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
        parent === target && (style.position = "static"); // like for borderRadius, if it's a % we must have it relative to the target itself but that may not have position: relative or position: absolute in which case it'd go up the chain until it finds its offsetParent (bad). position: static protects against that.

        parent.appendChild(_tempDiv);
        px = _tempDiv[measureProperty];
        parent.removeChild(_tempDiv);
        style.position = "absolute";
      }
      if (horizontal && toPercent) {
        cache = (0, _gsapCore._getCache)(parent);
        cache.time = _gsapCore._ticker.time;
        cache.width = parent[measureProperty];
      }
    }
    return (0, _gsapCore._round)(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
  },
  _get = function _get(target, property, unit, uncache) {
    var value;
    _pluginInitted || _initCore();
    if (property in _propertyAliases && property !== "transform") {
      property = _propertyAliases[property];
      if (~property.indexOf(",")) {
        property = property.split(",")[0];
      }
    }
    if (_transformProps[property] && property !== "transform") {
      value = _parseTransform(target, uncache);
      value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
    } else {
      value = target.style[property];
      if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
        value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || (0, _gsapCore._getProperty)(target, property) || (property === "opacity" ? 1 : 0); // note: some browsers, like Firefox, don't report borderRadius correctly! Instead, it only reports every corner like  borderTopLeftRadius
      }
    }
    return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
  },
  _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
    // note: we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
    if (!start || start === "none") {
      // some browsers like Safari actually PREFER the prefixed property and mis-report the unprefixed value like clipPath (BUG). In other words, even though clipPath exists in the style ("clipPath" in target.style) and it's set in the CSS properly (along with -webkit-clip-path), Safari reports clipPath as "none" whereas WebkitClipPath reports accurately like "ellipse(100% 0% at 50% 0%)", so in this case we must SWITCH to using the prefixed property instead. See https://gsap.com/forums/topic/18310-clippath-doesnt-work-on-ios/
      var p = _checkPropPrefix(prop, target, 1),
        s = p && _getComputedProperty(target, p, 1);
      if (s && s !== start) {
        prop = p;
        start = s;
      } else if (prop === "borderColor") {
        start = _getComputedProperty(target, "borderTopColor"); // Firefox bug: always reports "borderColor" as "", so we must fall back to borderTopColor. See https://gsap.com/forums/topic/24583-how-to-return-colors-that-i-had-after-reverse/
      }
    }
    var pt = new _gsapCore.PropTween(this._pt, target.style, prop, 0, 1, _gsapCore._renderComplexString),
      index = 0,
      matchIndex = 0,
      a,
      result,
      startValues,
      startNum,
      color,
      startValue,
      endValue,
      endNum,
      chunk,
      endUnit,
      startUnit,
      endValues;
    pt.b = start;
    pt.e = end;
    start += ""; // ensure values are strings

    end += "";
    if (end === "auto") {
      startValue = target.style[prop];
      target.style[prop] = end;
      end = _getComputedProperty(target, prop) || end;
      startValue ? target.style[prop] = startValue : _removeProperty(target, prop);
    }
    a = [start, end];
    (0, _gsapCore._colorStringFilter)(a); // pass an array with the starting and ending values and let the filter do whatever it needs to the values. If colors are found, it returns true and then we must match where the color shows up order-wise because for things like boxShadow, sometimes the browser provides the computed values with the color FIRST, but the user provides it with the color LAST, so flip them if necessary. Same for drop-shadow().

    start = a[0];
    end = a[1];
    startValues = start.match(_gsapCore._numWithUnitExp) || [];
    endValues = end.match(_gsapCore._numWithUnitExp) || [];
    if (endValues.length) {
      while (result = _gsapCore._numWithUnitExp.exec(end)) {
        endValue = result[0];
        chunk = end.substring(index, result.index);
        if (color) {
          color = (color + 1) % 5;
        } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
          color = 1;
        }
        if (endValue !== (startValue = startValues[matchIndex++] || "")) {
          startNum = parseFloat(startValue) || 0;
          startUnit = startValue.substr((startNum + "").length);
          endValue.charAt(1) === "=" && (endValue = (0, _gsapCore._parseRelative)(startNum, endValue) + startUnit);
          endNum = parseFloat(endValue);
          endUnit = endValue.substr((endNum + "").length);
          index = _gsapCore._numWithUnitExp.lastIndex - endUnit.length;
          if (!endUnit) {
            //if something like "perspective:300" is passed in and we must add a unit to the end
            endUnit = endUnit || _gsapCore._config.units[prop] || startUnit;
            if (index === end.length) {
              end += endUnit;
              pt.e += endUnit;
            }
          }
          if (startUnit !== endUnit) {
            startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
          } // these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.

          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
            //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
            s: startNum,
            c: endNum - startNum,
            m: color && color < 4 || prop === "zIndex" ? Math.round : 0
          };
        }
      }
      pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)
    } else {
      pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
    }
    _gsapCore._relExp.test(end) && (pt.e = 0); //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).

    this._pt = pt; //start the linked list with this new PropTween. Remember, we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within another plugin too, thus "this" would refer to the plugin.

    return pt;
  },
  _keywordToPercent = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%"
  },
  _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
    var split = value.split(" "),
      x = split[0],
      y = split[1] || "50%";
    if (x === "top" || x === "bottom" || y === "left" || y === "right") {
      //the user provided them in the wrong order, so flip them
      value = x;
      x = y;
      y = value;
    }
    split[0] = _keywordToPercent[x] || x;
    split[1] = _keywordToPercent[y] || y;
    return split.join(" ");
  },
  _renderClearProps = function _renderClearProps(ratio, data) {
    if (data.tween && data.tween._time === data.tween._dur) {
      var target = data.t,
        style = target.style,
        props = data.u,
        cache = target._gsap,
        prop,
        clearTransforms,
        i;
      if (props === "all" || props === true) {
        style.cssText = "";
        clearTransforms = 1;
      } else {
        props = props.split(",");
        i = props.length;
        while (--i > -1) {
          prop = props[i];
          if (_transformProps[prop]) {
            clearTransforms = 1;
            prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
          }
          _removeProperty(target, prop);
        }
      }
      if (clearTransforms) {
        _removeProperty(target, _transformProp);
        if (cache) {
          cache.svg && target.removeAttribute("transform");
          _parseTransform(target, 1); // force all the cached values back to "normal"/identity, otherwise if there's another tween that's already set to render transforms on this element, it could display the wrong values.

          cache.uncache = 1;
          _removeIndependentTransforms(style);
        }
      }
    }
  },
  // note: specialProps should return 1 if (and only if) they have a non-zero priority. It indicates we need to sort the linked list.
  _specialProps = {
    clearProps: function clearProps(plugin, target, property, endValue, tween) {
      if (tween.data !== "isFromStart") {
        var pt = plugin._pt = new _gsapCore.PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
        pt.u = endValue;
        pt.pr = -10;
        pt.tween = tween;
        plugin._props.push(property);
        return 1;
      }
    }
    /* className feature (about 0.4kb gzipped).
    , className(plugin, target, property, endValue, tween) {
    	let _renderClassName = (ratio, data) => {
    			data.css.render(ratio, data.css);
    			if (!ratio || ratio === 1) {
    				let inline = data.rmv,
    					target = data.t,
    					p;
    				target.setAttribute("class", ratio ? data.e : data.b);
    				for (p in inline) {
    					_removeProperty(target, p);
    				}
    			}
    		},
    		_getAllStyles = (target) => {
    			let styles = {},
    				computed = getComputedStyle(target),
    				p;
    			for (p in computed) {
    				if (isNaN(p) && p !== "cssText" && p !== "length") {
    					styles[p] = computed[p];
    				}
    			}
    			_setDefaults(styles, _parseTransform(target, 1));
    			return styles;
    		},
    		startClassList = target.getAttribute("class"),
    		style = target.style,
    		cssText = style.cssText,
    		cache = target._gsap,
    		classPT = cache.classPT,
    		inlineToRemoveAtEnd = {},
    		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
    		changingVars = {},
    		startVars = _getAllStyles(target),
    		transformRelated = /(transform|perspective)/i,
    		endVars, p;
    	if (classPT) {
    		classPT.r(1, classPT.d);
    		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
    	}
    	target.setAttribute("class", data.e);
    	endVars = _getAllStyles(target, true);
    	target.setAttribute("class", startClassList);
    	for (p in endVars) {
    		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
    			changingVars[p] = endVars[p];
    			if (!style[p] && style[p] !== "0") {
    				inlineToRemoveAtEnd[p] = 1;
    			}
    		}
    	}
    	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
    	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
    		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
    	}
    	_parseTransform(target, true); //to clear the caching of transforms
    	data.css = new gsap.plugins.css();
    	data.css.init(target, changingVars, tween);
    	plugin._props.push(...data.css._props);
    	return 1;
    }
    */
  },
  /*
   * --------------------------------------------------------------------------------------
   * TRANSFORMS
   * --------------------------------------------------------------------------------------
   */
  _identity2DMatrix = [1, 0, 0, 1, 0, 0],
  _rotationalProperties = {},
  _isNullTransform = function _isNullTransform(value) {
    return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
  },
  _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
    var matrixString = _getComputedProperty(target, _transformProp);
    return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_gsapCore._numExp).map(_gsapCore._round);
  },
  _getMatrix = function _getMatrix(target, force2D) {
    var cache = target._gsap || (0, _gsapCore._getCache)(target),
      style = target.style,
      matrix = _getComputedTransformMatrixAsArray(target),
      parent,
      nextSibling,
      temp,
      addedToDOM;
    if (cache.svg && target.getAttribute("transform")) {
      temp = target.transform.baseVal.consolidate().matrix; //ensures that even complex values like "translate(50,60) rotate(135,0,0)" are parsed because it mashes it into a matrix.

      matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
      return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
    } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
      //note: if offsetParent is null, that means the element isn't in the normal document flow, like if it has display:none or one of its ancestors has display:none). Firefox returns null for getComputedStyle() if the element is in an iframe that has display:none. https://bugzilla.mozilla.org/show_bug.cgi?id=548397
      //browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none". Firefox and Microsoft browsers have a partial bug where they'll report transforms even if display:none BUT not any percentage-based values like translate(-50%, 8px) will be reported as if it's translate(0, 8px).
      temp = style.display;
      style.display = "block";
      parent = target.parentNode;
      if (!parent || !target.offsetParent) {
        // note: in 3.3.0 we switched target.offsetParent to _doc.body.contains(target) to avoid [sometimes unnecessary] MutationObserver calls but that wasn't adequate because there are edge cases where nested position: fixed elements need to get reparented to accurately sense transforms. See https://github.com/greensock/GSAP/issues/388 and https://github.com/greensock/GSAP/issues/375
        addedToDOM = 1; //flag

        nextSibling = target.nextElementSibling;
        _docElement.appendChild(target); //we must add it to the DOM in order to get values properly
      }
      matrix = _getComputedTransformMatrixAsArray(target);
      temp ? style.display = temp : _removeProperty(target, "display");
      if (addedToDOM) {
        nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
      }
    }
    return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
  },
  _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
    var cache = target._gsap,
      matrix = matrixArray || _getMatrix(target, true),
      xOriginOld = cache.xOrigin || 0,
      yOriginOld = cache.yOrigin || 0,
      xOffsetOld = cache.xOffset || 0,
      yOffsetOld = cache.yOffset || 0,
      a = matrix[0],
      b = matrix[1],
      c = matrix[2],
      d = matrix[3],
      tx = matrix[4],
      ty = matrix[5],
      originSplit = origin.split(" "),
      xOrigin = parseFloat(originSplit[0]) || 0,
      yOrigin = parseFloat(originSplit[1]) || 0,
      bounds,
      determinant,
      x,
      y;
    if (!originIsAbsolute) {
      bounds = _getBBox(target);
      xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
      yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin); // if (!("xOrigin" in cache) && (xOrigin || yOrigin)) { // added in 3.12.3, reverted in 3.12.4; requires more exploration
      // 	xOrigin -= bounds.x;
      // 	yOrigin -= bounds.y;
      // }
    } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
      //if it's zero (like if scaleX and scaleY are zero), skip it to avoid errors with dividing by zero.
      x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
      y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
      xOrigin = x;
      yOrigin = y; // theory: we only had to do this for smoothing and it assumes that the previous one was not originIsAbsolute.
    }
    if (smooth || smooth !== false && cache.smooth) {
      tx = xOrigin - xOriginOld;
      ty = yOrigin - yOriginOld;
      cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
      cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
    } else {
      cache.xOffset = cache.yOffset = 0;
    }
    cache.xOrigin = xOrigin;
    cache.yOrigin = yOrigin;
    cache.smooth = !!smooth;
    cache.origin = origin;
    cache.originIsAbsolute = !!originIsAbsolute;
    target.style[_transformOriginProp] = "0px 0px"; //otherwise, if someone sets  an origin via CSS, it will likely interfere with the SVG transform attribute ones (because remember, we're baking the origin into the matrix() value).

    if (pluginToAddPropTweensTo) {
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
      _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
    }
    target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
  },
  _parseTransform = function _parseTransform(target, uncache) {
    var cache = target._gsap || new _gsapCore.GSCache(target);
    if ("x" in cache && !uncache && !cache.uncache) {
      return cache;
    }
    var style = target.style,
      invertedScaleX = cache.scaleX < 0,
      px = "px",
      deg = "deg",
      cs = getComputedStyle(target),
      origin = _getComputedProperty(target, _transformOriginProp) || "0",
      x,
      y,
      z,
      scaleX,
      scaleY,
      rotation,
      rotationX,
      rotationY,
      skewX,
      skewY,
      perspective,
      xOrigin,
      yOrigin,
      matrix,
      angle,
      cos,
      sin,
      a,
      b,
      c,
      d,
      a12,
      a22,
      t1,
      t2,
      t3,
      a13,
      a23,
      a33,
      a42,
      a43,
      a32;
    x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
    scaleX = scaleY = 1;
    cache.svg = !!(target.getCTM && _isSVG(target));
    if (cs.translate) {
      // accommodate independent transforms by combining them into normal ones.
      if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") {
        style[_transformProp] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp] !== "none" ? cs[_transformProp] : "");
      }
      style.scale = style.rotate = style.translate = "none";
    }
    matrix = _getMatrix(target, cache.svg);
    if (cache.svg) {
      if (cache.uncache) {
        // if cache.uncache is true (and maybe if origin is 0,0), we need to set element.style.transformOrigin = (cache.xOrigin - bbox.x) + "px " + (cache.yOrigin - bbox.y) + "px". Previously we let the data-svg-origin stay instead, but when introducing revert(), it complicated things.
        t2 = target.getBBox();
        origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
        t1 = "";
      } else {
        t1 = !uncache && target.getAttribute("data-svg-origin"); //  Remember, to work around browser inconsistencies we always force SVG elements' transformOrigin to 0,0 and offset the translation accordingly.
      }
      _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
    }
    xOrigin = cache.xOrigin || 0;
    yOrigin = cache.yOrigin || 0;
    if (matrix !== _identity2DMatrix) {
      a = matrix[0]; //a11

      b = matrix[1]; //a21

      c = matrix[2]; //a31

      d = matrix[3]; //a41

      x = a12 = matrix[4];
      y = a22 = matrix[5]; //2D matrix

      if (matrix.length === 6) {
        scaleX = Math.sqrt(a * a + b * b);
        scaleY = Math.sqrt(d * d + c * c);
        rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).

        skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
        skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
        if (cache.svg) {
          x -= xOrigin - (xOrigin * a + yOrigin * c);
          y -= yOrigin - (xOrigin * b + yOrigin * d);
        } //3D matrix
      } else {
        a32 = matrix[6];
        a42 = matrix[7];
        a13 = matrix[8];
        a23 = matrix[9];
        a33 = matrix[10];
        a43 = matrix[11];
        x = matrix[12];
        y = matrix[13];
        z = matrix[14];
        angle = _atan2(a32, a33);
        rotationX = angle * _RAD2DEG; //rotationX

        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a12 * cos + a13 * sin;
          t2 = a22 * cos + a23 * sin;
          t3 = a32 * cos + a33 * sin;
          a13 = a12 * -sin + a13 * cos;
          a23 = a22 * -sin + a23 * cos;
          a33 = a32 * -sin + a33 * cos;
          a43 = a42 * -sin + a43 * cos;
          a12 = t1;
          a22 = t2;
          a32 = t3;
        } //rotationY

        angle = _atan2(-c, a33);
        rotationY = angle * _RAD2DEG;
        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a * cos - a13 * sin;
          t2 = b * cos - a23 * sin;
          t3 = c * cos - a33 * sin;
          a43 = d * sin + a43 * cos;
          a = t1;
          b = t2;
          c = t3;
        } //rotationZ

        angle = _atan2(b, a);
        rotation = angle * _RAD2DEG;
        if (angle) {
          cos = Math.cos(angle);
          sin = Math.sin(angle);
          t1 = a * cos + b * sin;
          t2 = a12 * cos + a22 * sin;
          b = b * cos - a * sin;
          a22 = a22 * cos - a12 * sin;
          a = t1;
          a12 = t2;
        }
        if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
          //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
          rotationX = rotation = 0;
          rotationY = 180 - rotationY;
        }
        scaleX = (0, _gsapCore._round)(Math.sqrt(a * a + b * b + c * c));
        scaleY = (0, _gsapCore._round)(Math.sqrt(a22 * a22 + a32 * a32));
        angle = _atan2(a12, a22);
        skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
        perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
      }
      if (cache.svg) {
        //sense if there are CSS transforms applied on an SVG element in which case we must overwrite them when rendering. The transform attribute is more reliable cross-browser, but we can't just remove the CSS ones because they may be applied in a CSS rule somewhere (not just inline).
        t1 = target.getAttribute("transform");
        cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
        t1 && target.setAttribute("transform", t1);
      }
    }
    if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
      if (invertedScaleX) {
        scaleX *= -1;
        skewX += rotation <= 0 ? 180 : -180;
        rotation += rotation <= 0 ? 180 : -180;
      } else {
        scaleY *= -1;
        skewX += skewX <= 0 ? 180 : -180;
      }
    }
    uncache = uncache || cache.uncache;
    cache.x = x - ((cache.xPercent = x && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
    cache.y = y - ((cache.yPercent = y && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
    cache.z = z + px;
    cache.scaleX = (0, _gsapCore._round)(scaleX);
    cache.scaleY = (0, _gsapCore._round)(scaleY);
    cache.rotation = (0, _gsapCore._round)(rotation) + deg;
    cache.rotationX = (0, _gsapCore._round)(rotationX) + deg;
    cache.rotationY = (0, _gsapCore._round)(rotationY) + deg;
    cache.skewX = skewX + deg;
    cache.skewY = skewY + deg;
    cache.transformPerspective = perspective + px;
    if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || !uncache && cache.zOrigin || 0) {
      style[_transformOriginProp] = _firstTwoOnly(origin);
    }
    cache.xOffset = cache.yOffset = 0;
    cache.force3D = _gsapCore._config.force3D;
    cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
    cache.uncache = 0;
    return cache;
  },
  _firstTwoOnly = function _firstTwoOnly(value) {
    return (value = value.split(" "))[0] + " " + value[1];
  },
  //for handling transformOrigin values, stripping out the 3rd dimension
  _addPxTranslate = function _addPxTranslate(target, start, value) {
    var unit = (0, _gsapCore.getUnit)(start);
    return (0, _gsapCore._round)(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
  },
  _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
    cache.z = "0px";
    cache.rotationY = cache.rotationX = "0deg";
    cache.force3D = 0;
    _renderCSSTransforms(ratio, cache);
  },
  _zeroDeg = "0deg",
  _zeroPx = "0px",
  _endParenthesis = ") ",
  _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
    var _ref = cache || this,
      xPercent = _ref.xPercent,
      yPercent = _ref.yPercent,
      x = _ref.x,
      y = _ref.y,
      z = _ref.z,
      rotation = _ref.rotation,
      rotationY = _ref.rotationY,
      rotationX = _ref.rotationX,
      skewX = _ref.skewX,
      skewY = _ref.skewY,
      scaleX = _ref.scaleX,
      scaleY = _ref.scaleY,
      transformPerspective = _ref.transformPerspective,
      force3D = _ref.force3D,
      target = _ref.target,
      zOrigin = _ref.zOrigin,
      transforms = "",
      use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true; // Safari has a bug that causes it not to render 3D transform-origin values properly, so we force the z origin to 0, record it in the cache, and then do the math here to offset the translate values accordingly (basically do the 3D transform-origin part manually)

    if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
      var angle = parseFloat(rotationY) * _DEG2RAD,
        a13 = Math.sin(angle),
        a33 = Math.cos(angle),
        cos;
      angle = parseFloat(rotationX) * _DEG2RAD;
      cos = Math.cos(angle);
      x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
      y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
      z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
    }
    if (transformPerspective !== _zeroPx) {
      transforms += "perspective(" + transformPerspective + _endParenthesis;
    }
    if (xPercent || yPercent) {
      transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
    }
    if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
      transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
    }
    if (rotation !== _zeroDeg) {
      transforms += "rotate(" + rotation + _endParenthesis;
    }
    if (rotationY !== _zeroDeg) {
      transforms += "rotateY(" + rotationY + _endParenthesis;
    }
    if (rotationX !== _zeroDeg) {
      transforms += "rotateX(" + rotationX + _endParenthesis;
    }
    if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
      transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
    }
    if (scaleX !== 1 || scaleY !== 1) {
      transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
    }
    target.style[_transformProp] = transforms || "translate(0, 0)";
  },
  _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
    var _ref2 = cache || this,
      xPercent = _ref2.xPercent,
      yPercent = _ref2.yPercent,
      x = _ref2.x,
      y = _ref2.y,
      rotation = _ref2.rotation,
      skewX = _ref2.skewX,
      skewY = _ref2.skewY,
      scaleX = _ref2.scaleX,
      scaleY = _ref2.scaleY,
      target = _ref2.target,
      xOrigin = _ref2.xOrigin,
      yOrigin = _ref2.yOrigin,
      xOffset = _ref2.xOffset,
      yOffset = _ref2.yOffset,
      forceCSS = _ref2.forceCSS,
      tx = parseFloat(x),
      ty = parseFloat(y),
      a11,
      a21,
      a12,
      a22,
      temp;
    rotation = parseFloat(rotation);
    skewX = parseFloat(skewX);
    skewY = parseFloat(skewY);
    if (skewY) {
      //for performance reasons, we combine all skewing into the skewX and rotation values. Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of 10 degrees.
      skewY = parseFloat(skewY);
      skewX += skewY;
      rotation += skewY;
    }
    if (rotation || skewX) {
      rotation *= _DEG2RAD;
      skewX *= _DEG2RAD;
      a11 = Math.cos(rotation) * scaleX;
      a21 = Math.sin(rotation) * scaleX;
      a12 = Math.sin(rotation - skewX) * -scaleY;
      a22 = Math.cos(rotation - skewX) * scaleY;
      if (skewX) {
        skewY *= _DEG2RAD;
        temp = Math.tan(skewX - skewY);
        temp = Math.sqrt(1 + temp * temp);
        a12 *= temp;
        a22 *= temp;
        if (skewY) {
          temp = Math.tan(skewY);
          temp = Math.sqrt(1 + temp * temp);
          a11 *= temp;
          a21 *= temp;
        }
      }
      a11 = (0, _gsapCore._round)(a11);
      a21 = (0, _gsapCore._round)(a21);
      a12 = (0, _gsapCore._round)(a12);
      a22 = (0, _gsapCore._round)(a22);
    } else {
      a11 = scaleX;
      a22 = scaleY;
      a21 = a12 = 0;
    }
    if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
      tx = _convertToUnit(target, "x", x, "px");
      ty = _convertToUnit(target, "y", y, "px");
    }
    if (xOrigin || yOrigin || xOffset || yOffset) {
      tx = (0, _gsapCore._round)(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
      ty = (0, _gsapCore._round)(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
    }
    if (xPercent || yPercent) {
      //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the translation to simulate it.
      temp = target.getBBox();
      tx = (0, _gsapCore._round)(tx + xPercent / 100 * temp.width);
      ty = (0, _gsapCore._round)(ty + yPercent / 100 * temp.height);
    }
    temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
    target.setAttribute("transform", temp);
    forceCSS && (target.style[_transformProp] = temp); //some browsers prioritize CSS transforms over the transform attribute. When we sense that the user has CSS transforms applied, we must overwrite them this way (otherwise some browser simply won't render the transform attribute changes!)
  },
  _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue) {
    var cap = 360,
      isString = (0, _gsapCore._isString)(endValue),
      endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
      change = endNum - startNum,
      finalValue = startNum + change + "deg",
      direction,
      pt;
    if (isString) {
      direction = endValue.split("_")[1];
      if (direction === "short") {
        change %= cap;
        if (change !== change % (cap / 2)) {
          change += change < 0 ? cap : -cap;
        }
      }
      if (direction === "cw" && change < 0) {
        change = (change + cap * _bigNum) % cap - ~~(change / cap) * cap;
      } else if (direction === "ccw" && change > 0) {
        change = (change - cap * _bigNum) % cap - ~~(change / cap) * cap;
      }
    }
    plugin._pt = pt = new _gsapCore.PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
    pt.e = finalValue;
    pt.u = "deg";
    plugin._props.push(property);
    return pt;
  },
  _assign = function _assign(target, source) {
    // Internet Explorer doesn't have Object.assign(), so we recreate it here.
    for (var p in source) {
      target[p] = source[p];
    }
    return target;
  },
  _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
    //for handling cases where someone passes in a whole transform string, like transform: "scale(2, 3) rotate(20deg) translateY(30em)"
    var startCache = _assign({}, target._gsap),
      exclude = "perspective,force3D,transformOrigin,svgOrigin",
      style = target.style,
      endCache,
      p,
      startValue,
      endValue,
      startNum,
      endNum,
      startUnit,
      endUnit;
    if (startCache.svg) {
      startValue = target.getAttribute("transform");
      target.setAttribute("transform", "");
      style[_transformProp] = transforms;
      endCache = _parseTransform(target, 1);
      _removeProperty(target, _transformProp);
      target.setAttribute("transform", startValue);
    } else {
      startValue = getComputedStyle(target)[_transformProp];
      style[_transformProp] = transforms;
      endCache = _parseTransform(target, 1);
      style[_transformProp] = startValue;
    }
    for (p in _transformProps) {
      startValue = startCache[p];
      endValue = endCache[p];
      if (startValue !== endValue && exclude.indexOf(p) < 0) {
        //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
        startUnit = (0, _gsapCore.getUnit)(startValue);
        endUnit = (0, _gsapCore.getUnit)(endValue);
        startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
        endNum = parseFloat(endValue);
        plugin._pt = new _gsapCore.PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
        plugin._pt.u = endUnit || 0;
        plugin._props.push(p);
      }
    }
    _assign(endCache, startCache);
  }; // handle splitting apart padding, margin, borderWidth, and borderRadius into their 4 components. Firefox, for example, won't report borderRadius correctly - it will only do borderTopLeftRadius and the other corners. We also want to handle paddingTop, marginLeft, borderRightWidth, etc.

(0, _gsapCore._forEachName)("padding,margin,Width,Radius", function (name, index) {
  var t = "Top",
    r = "Right",
    b = "Bottom",
    l = "Left",
    props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function (side) {
      return index < 2 ? name + side : "border" + side + name;
    });
  _specialProps[index > 1 ? "border" + name : name] = function (plugin, target, property, endValue, tween) {
    var a, vars;
    if (arguments.length < 4) {
      // getter, passed target, property, and unit (from _get())
      a = props.map(function (prop) {
        return _get(plugin, prop, property);
      });
      vars = a.join(" ");
      return vars.split(a[0]).length === 5 ? a[0] : vars;
    }
    a = (endValue + "").split(" ");
    vars = {};
    props.forEach(function (prop, i) {
      return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
    });
    plugin.init(target, vars, tween);
  };
});
var CSSPlugin = exports.default = exports.CSSPlugin = {
  name: "css",
  register: _initCore,
  targetTest: function targetTest(target) {
    return target.style && target.nodeType;
  },
  init: function init(target, vars, tween, index, targets) {
    var props = this._props,
      style = target.style,
      startAt = tween.vars.startAt,
      startValue,
      endValue,
      endNum,
      startNum,
      type,
      specialProp,
      p,
      startUnit,
      endUnit,
      relative,
      isTransformRelated,
      transformPropTween,
      cache,
      smooth,
      hasPriority,
      inlineProps;
    _pluginInitted || _initCore(); // we may call init() multiple times on the same plugin instance, like when adding special properties, so make sure we don't overwrite the revert data or inlineProps

    this.styles = this.styles || _getStyleSaver(target);
    inlineProps = this.styles.props;
    this.tween = tween;
    for (p in vars) {
      if (p === "autoRound") {
        continue;
      }
      endValue = vars[p];
      if (_gsapCore._plugins[p] && (0, _gsapCore._checkPlugin)(p, vars, tween, index, target, targets)) {
        // plugins
        continue;
      }
      type = typeof endValue;
      specialProp = _specialProps[p];
      if (type === "function") {
        endValue = endValue.call(tween, index, target, targets);
        type = typeof endValue;
      }
      if (type === "string" && ~endValue.indexOf("random(")) {
        endValue = (0, _gsapCore._replaceRandom)(endValue);
      }
      if (specialProp) {
        specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
      } else if (p.substr(0, 2) === "--") {
        //CSS variable
        startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
        endValue += "";
        _gsapCore._colorExp.lastIndex = 0;
        if (!_gsapCore._colorExp.test(startValue)) {
          // colors don't have units
          startUnit = (0, _gsapCore.getUnit)(startValue);
          endUnit = (0, _gsapCore.getUnit)(endValue);
        }
        endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
        this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
        props.push(p);
        inlineProps.push(p, 0, style[p]);
      } else if (type !== "undefined") {
        if (startAt && p in startAt) {
          // in case someone hard-codes a complex value as the start, like top: "calc(2vh / 2)". Without this, it'd use the computed value (always in px)
          startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
          (0, _gsapCore._isString)(startValue) && ~startValue.indexOf("random(") && (startValue = (0, _gsapCore._replaceRandom)(startValue));
          (0, _gsapCore.getUnit)(startValue + "") || startValue === "auto" || (startValue += _gsapCore._config.units[p] || (0, _gsapCore.getUnit)(_get(target, p)) || ""); // for cases when someone passes in a unitless value like {x: 100}; if we try setting translate(100, 0px) it won't work.

          (startValue + "").charAt(1) === "=" && (startValue = _get(target, p)); // can't work with relative values
        } else {
          startValue = _get(target, p);
        }
        startNum = parseFloat(startValue);
        relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
        relative && (endValue = endValue.substr(2));
        endNum = parseFloat(endValue);
        if (p in _propertyAliases) {
          if (p === "autoAlpha") {
            //special case where we control the visibility along with opacity. We still allow the opacity value to pass through and get tweened.
            if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
              //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
              startNum = 0;
            }
            inlineProps.push("visibility", 0, style.visibility);
            _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
          }
          if (p !== "scale" && p !== "transform") {
            p = _propertyAliases[p];
            ~p.indexOf(",") && (p = p.split(",")[0]);
          }
        }
        isTransformRelated = p in _transformProps; //--- TRANSFORM-RELATED ---

        if (isTransformRelated) {
          this.styles.save(p);
          if (!transformPropTween) {
            cache = target._gsap;
            cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform); // if, for example, gsap.set(... {transform:"translateX(50vw)"}), the _get() call doesn't parse the transform, thus cache.renderTransform won't be set yet so force the parsing of the transform here.

            smooth = vars.smoothOrigin !== false && cache.smooth;
            transformPropTween = this._pt = new _gsapCore.PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1); //the first time through, create the rendering PropTween so that it runs LAST (in the linked list, we keep adding to the beginning)

            transformPropTween.dep = 1; //flag it as dependent so that if things get killed/overwritten and this is the only PropTween left, we can safely kill the whole tween.
          }
          if (p === "scale") {
            this._pt = new _gsapCore.PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? (0, _gsapCore._parseRelative)(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
            this._pt.u = 0;
            props.push("scaleY", p);
            p += "X";
          } else if (p === "transformOrigin") {
            inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
            endValue = _convertKeywordsToPercentages(endValue); //in case something like "left top" or "bottom right" is passed in. Convert to percentages.

            if (cache.svg) {
              _applySVGOrigin(target, endValue, 0, smooth, 0, this);
            } else {
              endUnit = parseFloat(endValue.split(" ")[2]) || 0; //handle the zOrigin separately!

              endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
              _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
            }
            continue;
          } else if (p === "svgOrigin") {
            _applySVGOrigin(target, endValue, 1, smooth, 0, this);
            continue;
          } else if (p in _rotationalProperties) {
            _addRotationalPropTween(this, cache, p, startNum, relative ? (0, _gsapCore._parseRelative)(startNum, relative + endValue) : endValue);
            continue;
          } else if (p === "smoothOrigin") {
            _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
            continue;
          } else if (p === "force3D") {
            cache[p] = endValue;
            continue;
          } else if (p === "transform") {
            _addRawTransformPTs(this, endValue, target);
            continue;
          }
        } else if (!(p in style)) {
          p = _checkPropPrefix(p) || p;
        }
        if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
          startUnit = (startValue + "").substr((startNum + "").length);
          endNum || (endNum = 0); // protect against NaN

          endUnit = (0, _gsapCore.getUnit)(endValue) || (p in _gsapCore._config.units ? _gsapCore._config.units[p] : startUnit);
          startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
          this._pt = new _gsapCore.PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, (relative ? (0, _gsapCore._parseRelative)(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
          this._pt.u = endUnit || 0;
          if (startUnit !== endUnit && endUnit !== "%") {
            //when the tween goes all the way back to the beginning, we need to revert it to the OLD/ORIGINAL value (with those units). We record that as a "b" (beginning) property and point to a render method that handles that. (performance optimization)
            this._pt.b = startValue;
            this._pt.r = _renderCSSPropWithBeginning;
          }
        } else if (!(p in style)) {
          if (p in target) {
            //maybe it's not a style - it could be a property added directly to an element in which case we'll try to animate that.
            this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
          } else if (p !== "parseTransform") {
            (0, _gsapCore._missingPlugin)(p, endValue);
            continue;
          }
        } else {
          _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
        }
        isTransformRelated || (p in style ? inlineProps.push(p, 0, style[p]) : inlineProps.push(p, 1, startValue || target[p]));
        props.push(p);
      }
    }
    hasPriority && (0, _gsapCore._sortPropTweensByPriority)(this);
  },
  render: function render(ratio, data) {
    if (data.tween._time || !_reverting()) {
      var pt = data._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
    } else {
      data.styles.revert();
    }
  },
  get: _get,
  aliases: _propertyAliases,
  getSetter: function getSetter(target, property, plugin) {
    //returns a setter function that accepts target, property, value and applies it accordingly. Remember, properties like "x" aren't as simple as target.style.property = value because they've got to be applied to a proxy object and then merged into a transform string in a renderer.
    var p = _propertyAliases[property];
    p && p.indexOf(",") < 0 && (property = p);
    return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !(0, _gsapCore._isUndefined)(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : (0, _gsapCore._getSetter)(target, property);
  },
  core: {
    _removeProperty: _removeProperty,
    _getMatrix: _getMatrix
  }
};
_gsapCore.gsap.utils.checkPrefix = _checkPropPrefix;
_gsapCore.gsap.core.getStyleSaver = _getStyleSaver;
(function (positionAndScale, rotation, others, aliases) {
  var all = (0, _gsapCore._forEachName)(positionAndScale + "," + rotation + "," + others, function (name) {
    _transformProps[name] = 1;
  });
  (0, _gsapCore._forEachName)(rotation, function (name) {
    _gsapCore._config.units[name] = "deg";
    _rotationalProperties[name] = 1;
  });
  _propertyAliases[all[13]] = positionAndScale + "," + rotation;
  (0, _gsapCore._forEachName)(aliases, function (name) {
    var split = name.split(":");
    _propertyAliases[split[1]] = all[split[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
(0, _gsapCore._forEachName)("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
  _gsapCore._config.units[name] = "px";
});
_gsapCore.gsap.registerPlugin(CSSPlugin);
},{"./gsap-core.js":"../node_modules/gsap/gsap-core.js"}],"../node_modules/gsap/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Back", {
  enumerable: true,
  get: function () {
    return _gsapCore.Back;
  }
});
Object.defineProperty(exports, "Bounce", {
  enumerable: true,
  get: function () {
    return _gsapCore.Bounce;
  }
});
Object.defineProperty(exports, "CSSPlugin", {
  enumerable: true,
  get: function () {
    return _CSSPlugin.CSSPlugin;
  }
});
Object.defineProperty(exports, "Circ", {
  enumerable: true,
  get: function () {
    return _gsapCore.Circ;
  }
});
Object.defineProperty(exports, "Cubic", {
  enumerable: true,
  get: function () {
    return _gsapCore.Cubic;
  }
});
Object.defineProperty(exports, "Elastic", {
  enumerable: true,
  get: function () {
    return _gsapCore.Elastic;
  }
});
Object.defineProperty(exports, "Expo", {
  enumerable: true,
  get: function () {
    return _gsapCore.Expo;
  }
});
Object.defineProperty(exports, "Linear", {
  enumerable: true,
  get: function () {
    return _gsapCore.Linear;
  }
});
Object.defineProperty(exports, "Power0", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power0;
  }
});
Object.defineProperty(exports, "Power1", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power1;
  }
});
Object.defineProperty(exports, "Power2", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power2;
  }
});
Object.defineProperty(exports, "Power3", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power3;
  }
});
Object.defineProperty(exports, "Power4", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power4;
  }
});
Object.defineProperty(exports, "Quad", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quad;
  }
});
Object.defineProperty(exports, "Quart", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quart;
  }
});
Object.defineProperty(exports, "Quint", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quint;
  }
});
Object.defineProperty(exports, "Sine", {
  enumerable: true,
  get: function () {
    return _gsapCore.Sine;
  }
});
Object.defineProperty(exports, "SteppedEase", {
  enumerable: true,
  get: function () {
    return _gsapCore.SteppedEase;
  }
});
Object.defineProperty(exports, "Strong", {
  enumerable: true,
  get: function () {
    return _gsapCore.Strong;
  }
});
Object.defineProperty(exports, "TimelineLite", {
  enumerable: true,
  get: function () {
    return _gsapCore.TimelineLite;
  }
});
Object.defineProperty(exports, "TimelineMax", {
  enumerable: true,
  get: function () {
    return _gsapCore.TimelineMax;
  }
});
Object.defineProperty(exports, "TweenLite", {
  enumerable: true,
  get: function () {
    return _gsapCore.TweenLite;
  }
});
exports.gsap = exports.default = exports.TweenMax = void 0;
var _gsapCore = require("./gsap-core.js");
var _CSSPlugin = require("./CSSPlugin.js");
var gsapWithCSS = exports.default = exports.gsap = _gsapCore.gsap.registerPlugin(_CSSPlugin.CSSPlugin) || _gsapCore.gsap,
  // to protect from tree shaking
  TweenMaxWithCSS = exports.TweenMax = gsapWithCSS.core.Tween;
},{"./gsap-core.js":"../node_modules/gsap/gsap-core.js","./CSSPlugin.js":"../node_modules/gsap/CSSPlugin.js"}],"Toast.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("./App"));
var _litHtml = require("lit-html");
var _gsap = require("gsap");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Toast {
  static init() {
    this.showDuration = 2.5;
    // create container element
    this.containerEl = document.createElement('div');
    this.containerEl.id = 'toasts';
    // append to <body>
    document.body.appendChild(this.containerEl);
  }
  static show(content) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    if (!content) return;
    // create element
    const toastEl = document.createElement('div');
    toastEl.className = 'toast-entry';
    if (type != "") toastEl.classList.add('is-error');
    toastEl.innerText = content;

    // appened to container
    this.containerEl.appendChild(toastEl);

    // animate using gsap
    const tl = _gsap.gsap.timeline();
    tl.from(toastEl, {
      y: 60,
      opacity: 0,
      duration: 0.3,
      ease: "power3.out"
    });
    tl.to(toastEl, {
      marginTop: -50,
      opacity: 0,
      delay: this.showDuration,
      duration: 0.3,
      onComplete: () => {
        toastEl.remove();
      }
    });
  }
}
exports.default = Toast;
},{"./App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","gsap":"../node_modules/gsap/index.js"}],"Auth.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("./App"));
var _Router = _interopRequireWildcard(require("./Router"));
var _splash = _interopRequireDefault(require("./views/partials/splash"));
var _litHtml = require("lit-html");
var _Toast = _interopRequireDefault(require("./Toast"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class Auth {
  constructor() {
    // 1. Initialize currentUser from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  // Store userData in currentUser and localStorage
  setCurrentUser(userData) {
    this.currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }
  clearCurrentUser() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
  isLoggedIn() {
    return this.currentUser && Object.keys(this.currentUser).length > 0;
  }
  async signUp(userData) {
    let fail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const response = await fetch("".concat(_App.default.apiBase, "/user"), {
      method: 'POST',
      body: userData
    });
    if (!response.ok) {
      const err = await response.json();
      if (err) console.log(err);
      _Toast.default.show("Problem getting user: ".concat(response.status));
      if (typeof fail == 'function') fail();
    }
    _Toast.default.show('Account created, please sign in');
    (0, _Router.gotoRoute)('/signin');
  }
  async signIn(userData) {
    let fail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    console.log('userData being sent:', userData); // Debug log
    const response = await fetch("".concat(_App.default.apiBase, "/auth/signin"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const err = await response.json();
      if (err) console.log(err);
      _Toast.default.show("Problem signing in: ".concat(err.message), 'error');
      if (typeof fail == 'function') fail();
      return;
    }

    // sign in success
    const data = await response.json();
    _Toast.default.show("Welcome ".concat(data.user.firstName));

    // 2. Save access token to localStorage
    localStorage.setItem('accessToken', data.accessToken);

    // 3. Set currentUser to include both user details AND the token
    this.setCurrentUser(_objectSpread(_objectSpread({}, data.user), {}, {
      token: data.accessToken // <--- Include the token property
    }));
    _Router.default.init();
    if (data.user.newUser === true) {
      (0, _Router.gotoRoute)('/guide');
    } else {
      (0, _Router.gotoRoute)('/');
    }
  }
  async check(success) {
    // 4. Show splash screen while loading
    (0, _litHtml.render)(_splash.default, _App.default.rootEl);

    // 5. If there's no accessToken in localStorage, redirect to home
    if (!localStorage.accessToken) {
      (0, _Router.gotoRoute)('/');
      return;
    }

    // 6. Validate token via backend
    const response = await fetch("".concat(_App.default.apiBase, "/auth/validate"), {
      method: 'GET',
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken)
      }
    });
    if (!response.ok) {
      const err = await response.json();
      if (err) console.log(err);
      localStorage.removeItem('accessToken');
      _Toast.default.show("session expired, please sign in");
      (0, _Router.gotoRoute)('/signin');
      return;
    }

    // 7. Token is valid; get user data
    const data = await response.json();

    // 8. Merge user data with the existing token from localStorage
    //    so currentUser still has the token.
    this.currentUser = _objectSpread(_objectSpread({}, data.user), {}, {
      token: localStorage.getItem('accessToken')
    }) || null;

    // 9. Run success callback
    success();
  }
  signOut() {
    _Toast.default.show("You are signed out");
    this.currentUser = null;
    localStorage.removeItem('accessToken');
    (0, _Router.gotoRoute)('/');
  }
}
var _default = exports.default = new Auth();
},{"./App":"App.js","./Router":"Router.js","./views/partials/splash":"views/partials/splash.js","lit-html":"../node_modules/lit-html/lit-html.js","./Toast":"Toast.js"}],"Utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _gsap = _interopRequireDefault(require("gsap"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Utils {
  isMobile() {
    let viewportWidth = window.innerWidth;
    if (viewportWidth <= 768) {
      return true;
    } else {
      return false;
    }
  }
  pageIntroAnim() {
    const pageContent = document.querySelector('.page-content');
    if (!pageContent) return;
    _gsap.default.fromTo(pageContent, {
      opacity: 0,
      y: -12
    }, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: 0.3
    });
  }
}
var _default = exports.default = new Utils();
},{"gsap":"../node_modules/gsap/index.js"}],"views/pages/home.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("./../../App"));
var _litHtml = require("lit-html");
var _Router = require("./../../Router");
var _Auth = _interopRequireDefault(require("./../../Auth"));
var _Utils = _interopRequireDefault(require("./../../Utils"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
class HomeView {
  init() {
    console.log('HomeView.init');
    document.title = 'Home';
    this.render();
    _Utils.default.pageIntroAnim();
  }
  // Image adapted from Canva – Accessed on December 18, 2024
  // Animation - from https://shoelace.style/components/animation
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      ", "\n\n    <div class=\"page-content home-page\">\n        <section class=\"home-banner\">\n            <h1>Empower </br>Your </br>Life</h1>\n            <picture>\n              <source srcset=\"images/home/home-hero-image-360.webp\" media=\"(max-width: 480px)\">\n              <source srcset=\"images/home/home-hero-image-768.webp\" media=\"(max-width: 768px)\">\n              <source srcset=\"images/home/home-hero-image-1024.webp\" media=\"(min-width: 769px)\">\n              <img id=\"heroImage\" src=\"images/home/home-hero-image-1024.webp\" alt=\"banner image of a girl meditating\">\n            </picture>\n            <h2>HARNESS YOUR POTENTIAL</h2>\n        </section>\n       <section class=\"nav-page\">\n        <h3>Ways to deal with...</h3>\n          <div class=\"button-group\">\n            <sl-button class=\"home-bth-Mental-Health\" @click=", ">Mental Health</sl-button>\n            <sl-button class=\"home-bth-mindfulness\" @click=", ">Mindfulness</sl-button>\n            <sl-button class=\"home-bth-resources\" @click=", ">Resources</sl-button>\n          </div>\n        </section> \n      </div>\n     \n    "])), _Auth.default.isLoggedIn() ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<va-app-header user=", "></va-app-header>"])), JSON.stringify(_Auth.default.currentUser)) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<va-public-header></va-public-header>"]))), () => (0, _Router.gotoRoute)('/mentalHealth'), () => (0, _Router.gotoRoute)('/mindfulness'), () => (0, _Router.gotoRoute)('/resources'));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new HomeView();
},{"./../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","./../../Router":"Router.js","./../../Auth":"Auth.js","./../../Utils":"Utils.js"}],"views/pages/404.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("./../../App"));
var _litHtml = require("lit-html");
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
// Image - adapted from Microsoft PowerPoint – Accessed on 18 November 2024
class FourOFourView {
  init() {
    console.log('FourOFourView.init');
    document.title = '404 File not found';
    this.render();
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral([";   \n    ", " \n      <div class=\"calign\">\n        <p></p>\n        <h1>Oops!</h1>\n        <p>Sorry, we couldn't find that.</p>\n        <img src=\"/images/404-error-dinosaur-1024.png\">\n      </div>\n    "])), Auth.isLoggedIn() ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<va-app-header user=", "></va-app-header>"])), JSON.stringify(Auth.currentUser)) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<va-public-header></va-public-header>"]))));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new FourOFourView();
},{"./../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js"}],"../node_modules/lit-html/lib/modify-template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertNodeIntoTemplate = insertNodeIntoTemplate;
exports.removeNodesFromTemplate = removeNodesFromTemplate;
var _template = require("./template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */
function removeNodesFromTemplate(template, nodesToRemove) {
  const {
    element: {
      content
    },
    parts
  } = template;
  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts);
  let part = parts[partIndex];
  let nodeIndex = -1;
  let removeCount = 0;
  const nodesToRemoveInTemplate = [];
  let currentRemovingNode = null;
  while (walker.nextNode()) {
    nodeIndex++;
    const node = walker.currentNode;
    // End removal if stepped past the removing node
    if (node.previousSibling === currentRemovingNode) {
      currentRemovingNode = null;
    }
    // A node to remove was found in the template
    if (nodesToRemove.has(node)) {
      nodesToRemoveInTemplate.push(node);
      // Track node we're removing
      if (currentRemovingNode === null) {
        currentRemovingNode = node;
      }
    }
    // When removing, increment count by which to adjust subsequent part indices
    if (currentRemovingNode !== null) {
      removeCount++;
    }
    while (part !== undefined && part.index === nodeIndex) {
      // If part is in a removed node deactivate it by setting index to -1 or
      // adjust the index as needed.
      part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
      // go to the next active part.
      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
      part = parts[partIndex];
    }
  }
  nodesToRemoveInTemplate.forEach(n => n.parentNode.removeChild(n));
}
const countNodes = node => {
  let count = node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ ? 0 : 1;
  const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
  while (walker.nextNode()) {
    count++;
  }
  return count;
};
const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
  for (let i = startIndex + 1; i < parts.length; i++) {
    const part = parts[i];
    if ((0, _template.isTemplatePartActive)(part)) {
      return i;
    }
  }
  return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */
function insertNodeIntoTemplate(template, node, refNode = null) {
  const {
    element: {
      content
    },
    parts
  } = template;
  // If there's no refNode, then put node at end of template.
  // No part indices need to be shifted in this case.
  if (refNode === null || refNode === undefined) {
    content.appendChild(node);
    return;
  }
  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts);
  let insertCount = 0;
  let walkerIndex = -1;
  while (walker.nextNode()) {
    walkerIndex++;
    const walkerNode = walker.currentNode;
    if (walkerNode === refNode) {
      insertCount = countNodes(node);
      refNode.parentNode.insertBefore(node, refNode);
    }
    while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
      // If we've inserted the node, simply adjust all subsequent parts
      if (insertCount > 0) {
        while (partIndex !== -1) {
          parts[partIndex].index += insertCount;
          partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }
        return;
      }
      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
    }
  }
}
},{"./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/shady-render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml.TemplateResult;
  }
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _litHtml.html;
  }
});
exports.shadyTemplateFactory = exports.render = void 0;
Object.defineProperty(exports, "svg", {
  enumerable: true,
  get: function () {
    return _litHtml.svg;
  }
});
var _dom = require("./dom.js");
var _modifyTemplate = require("./modify-template.js");
var _render = require("./render.js");
var _templateFactory = require("./template-factory.js");
var _templateInstance = require("./template-instance.js");
var _template = require("./template.js");
var _litHtml = require("../lit-html.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Module to add shady DOM/shady CSS polyfill support to lit-html template
 * rendering. See the [[render]] method for details.
 *
 * @packageDocumentation
 */
/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */

// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
let compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === 'undefined') {
  compatibleShadyCSSVersion = false;
} else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
  console.warn(`Incompatible ShadyCSS version detected. ` + `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` + `@webcomponents/shadycss@1.3.1.`);
  compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory = scopeName => result => {
  const cacheKey = getTemplateCacheKey(result.type, scopeName);
  let templateCache = _templateFactory.templateCaches.get(cacheKey);
  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    _templateFactory.templateCaches.set(cacheKey, templateCache);
  }
  let template = templateCache.stringsArray.get(result.strings);
  if (template !== undefined) {
    return template;
  }
  const key = result.strings.join(_template.marker);
  template = templateCache.keyString.get(key);
  if (template === undefined) {
    const element = result.getTemplateElement();
    if (compatibleShadyCSSVersion) {
      window.ShadyCSS.prepareTemplateDom(element, scopeName);
    }
    template = new _template.Template(result, element);
    templateCache.keyString.set(key, template);
  }
  templateCache.stringsArray.set(result.strings, template);
  return template;
};
exports.shadyTemplateFactory = shadyTemplateFactory;
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */
const removeStylesFromLitTemplates = scopeName => {
  TEMPLATE_TYPES.forEach(type => {
    const templates = _templateFactory.templateCaches.get(getTemplateCacheKey(type, scopeName));
    if (templates !== undefined) {
      templates.keyString.forEach(template => {
        const {
          element: {
            content
          }
        } = template;
        // IE 11 doesn't support the iterable param Set constructor
        const styles = new Set();
        Array.from(content.querySelectorAll('style')).forEach(s => {
          styles.add(s);
        });
        (0, _modifyTemplate.removeNodesFromTemplate)(template, styles);
      });
    }
  });
};
const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */
const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
  shadyRenderSet.add(scopeName);
  // If `renderedDOM` is stamped from a Template, then we need to edit that
  // Template's underlying template element. Otherwise, we create one here
  // to give to ShadyCSS, which still requires one while scoping.
  const templateElement = !!template ? template.element : document.createElement('template');
  // Move styles out of rendered DOM and store.
  const styles = renderedDOM.querySelectorAll('style');
  const {
    length
  } = styles;
  // If there are no styles, skip unnecessary work
  if (length === 0) {
    // Ensure prepareTemplateStyles is called to support adding
    // styles via `prepareAdoptedCssText` since that requires that
    // `prepareTemplateStyles` is called.
    //
    // ShadyCSS will only update styles containing @apply in the template
    // given to `prepareTemplateStyles`. If no lit Template was given,
    // ShadyCSS will not be able to update uses of @apply in any relevant
    // template. However, this is not a problem because we only create the
    // template for the purpose of supporting `prepareAdoptedCssText`,
    // which doesn't support @apply at all.
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    return;
  }
  const condensedStyle = document.createElement('style');
  // Collect styles into a single style. This helps us make sure ShadyCSS
  // manipulations will not prevent us from being able to fix up template
  // part indices.
  // NOTE: collecting styles is inefficient for browsers but ShadyCSS
  // currently does this anyway. When it does not, this should be changed.
  for (let i = 0; i < length; i++) {
    const style = styles[i];
    style.parentNode.removeChild(style);
    condensedStyle.textContent += style.textContent;
  }
  // Remove styles from nested templates in this scope.
  removeStylesFromLitTemplates(scopeName);
  // And then put the condensed style into the "root" template passed in as
  // `template`.
  const content = templateElement.content;
  if (!!template) {
    (0, _modifyTemplate.insertNodeIntoTemplate)(template, condensedStyle, content.firstChild);
  } else {
    content.insertBefore(condensedStyle, content.firstChild);
  }
  // Note, it's important that ShadyCSS gets the template that `lit-html`
  // will actually render so that it can update the style inside when
  // needed (e.g. @apply native Shadow DOM case).
  window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
  const style = content.querySelector('style');
  if (window.ShadyCSS.nativeShadow && style !== null) {
    // When in native Shadow DOM, ensure the style created by ShadyCSS is
    // included in initially rendered output (`renderedDOM`).
    renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
  } else if (!!template) {
    // When no style is left in the template, parts will be broken as a
    // result. To fix this, we put back the style node ShadyCSS removed
    // and then tell lit to remove that node from the template.
    // There can be no style in the template in 2 cases (1) when Shady DOM
    // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
    // is in use ShadyCSS removes the style if it contains no content.
    // NOTE, ShadyCSS creates its own style so we can safely add/remove
    // `condensedStyle` here.
    content.insertBefore(condensedStyle, content.firstChild);
    const removes = new Set();
    removes.add(condensedStyle);
    (0, _modifyTemplate.removeNodesFromTemplate)(template, removes);
  }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */
const render = (result, container, options) => {
  if (!options || typeof options !== 'object' || !options.scopeName) {
    throw new Error('The `scopeName` option is required.');
  }
  const scopeName = options.scopeName;
  const hasRendered = _render.parts.has(container);
  const needsScoping = compatibleShadyCSSVersion && container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ && !!container.host;
  // Handle first render to a scope specially...
  const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
  // On first scope render, render into a fragment; this cannot be a single
  // fragment that is reused since nested renders can occur synchronously.
  const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
  (0, _render.render)(result, renderContainer, Object.assign({
    templateFactory: shadyTemplateFactory(scopeName)
  }, options));
  // When performing first scope render,
  // (1) We've rendered into a fragment so that there's a chance to
  // `prepareTemplateStyles` before sub-elements hit the DOM
  // (which might cause them to render based on a common pattern of
  // rendering in a custom element's `connectedCallback`);
  // (2) Scope the template with ShadyCSS one time only for this scope.
  // (3) Render the fragment into the container and make sure the
  // container knows its `part` is the one we just rendered. This ensures
  // DOM will be re-used on subsequent renders.
  if (firstScopeRender) {
    const part = _render.parts.get(renderContainer);
    _render.parts.delete(renderContainer);
    // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
    // that should apply to `renderContainer` even if the rendered value is
    // not a TemplateInstance. However, it will only insert scoped styles
    // into the document if `prepareTemplateStyles` has already been called
    // for the given scope name.
    const template = part.value instanceof _templateInstance.TemplateInstance ? part.value.template : undefined;
    prepareTemplateStyles(scopeName, renderContainer, template);
    (0, _dom.removeNodes)(container, container.firstChild);
    container.appendChild(renderContainer);
    _render.parts.set(container, part);
  }
  // After elements have hit the DOM, update styling if this is the
  // initial render to this container.
  // This is needed whenever dynamic changes are made so it would be
  // safest to do every render; however, this would regress performance
  // so we leave it up to the user to call `ShadyCSS.styleElement`
  // for dynamic changes.
  if (!hasRendered && needsScoping) {
    window.ShadyCSS.styleElement(container.host);
  }
};
exports.render = render;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./modify-template.js":"../node_modules/lit-html/lib/modify-template.js","./render.js":"../node_modules/lit-html/lib/render.js","./template-factory.js":"../node_modules/lit-html/lib/template-factory.js","./template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./template.js":"../node_modules/lit-html/lib/template.js","../lit-html.js":"../node_modules/lit-html/lit-html.js"}],"../node_modules/@polymer/lit-element/lib/updating-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notEqual = exports.defaultConverter = exports.UpdatingElement = void 0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
const JSCompiler_renameProperty = (prop, _obj) => prop;
/**
 * Returns the property descriptor for a property on this prototype by walking
 * up the prototype chain. Note that we stop just before Object.prototype, which
 * also avoids issues with Symbol polyfills (core-js, get-own-property-symbols),
 * which create accessors for the symbols on Object.prototype.
 */
const descriptorFromPrototype = (name, proto) => {
  if (name in proto) {
    while (proto !== Object.prototype) {
      if (proto.hasOwnProperty(name)) {
        return Object.getOwnPropertyDescriptor(proto, name);
      }
      proto = Object.getPrototypeOf(proto);
    }
  }
  return undefined;
};
const defaultConverter = exports.defaultConverter = {
  toAttribute(value, type) {
    switch (type) {
      case Boolean:
        return value ? '' : null;
      case Object:
      case Array:
        // if the value is `null` or `undefined` pass this through
        // to allow removing/no change behavior.
        return value == null ? value : JSON.stringify(value);
    }
    return value;
  },
  fromAttribute(value, type) {
    switch (type) {
      case Boolean:
        return value !== null;
      case Number:
        return value === null ? null : Number(value);
      case Object:
      case Array:
        return JSON.parse(value);
    }
    return value;
  }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
  // This ensures (old==NaN, value==NaN) always returns false
  return old !== value && (old === old || value === value);
};
exports.notEqual = notEqual;
const defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
const microtaskPromise = Promise.resolve(true);
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
const STATE_HAS_CONNECTED = 1 << 5;
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */
class UpdatingElement extends HTMLElement {
  constructor() {
    super();
    this._updateState = 0;
    this._instanceProperties = undefined;
    this._updatePromise = microtaskPromise;
    this._hasConnectedResolver = undefined;
    /**
     * Map with keys for any properties that have changed since the last
     * update cycle with previous values.
     */
    this._changedProperties = new Map();
    /**
     * Map with keys of properties that should be reflected when updated.
     */
    this._reflectingProperties = undefined;
    this.initialize();
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   */
  static get observedAttributes() {
    // note: piggy backing on this to ensure we're _finalized.
    this._finalize();
    const attributes = [];
    for (const [p, v] of this._classProperties) {
      const attr = this._attributeNameForProperty(p, v);
      if (attr !== undefined) {
        this._attributeToPropertyMap.set(attr, p);
        attributes.push(attr);
      }
    }
    return attributes;
  }
  /**
   * Ensures the private `_classProperties` property metadata is created.
   * In addition to `_finalize` this is also called in `createProperty` to
   * ensure the `@property` decorator can add property metadata.
   */
  /** @nocollapse */
  static _ensureClassProperties() {
    // ensure private storage for property declarations.
    if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
      this._classProperties = new Map();
      // NOTE: Workaround IE11 not supporting Map constructor argument.
      const superProperties = Object.getPrototypeOf(this)._classProperties;
      if (superProperties !== undefined) {
        superProperties.forEach((v, k) => this._classProperties.set(k, v));
      }
    }
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist.
   * The property setter calls the property's `hasChanged` property option
   * or uses a strict identity check to determine whether or not to request
   * an update.
   * @nocollapse
   */
  static createProperty(name, options = defaultPropertyDeclaration) {
    // Note, since this can be called by the `@property` decorator which
    // is called before `_finalize`, we ensure storage exists for property
    // metadata.
    this._ensureClassProperties();
    this._classProperties.set(name, options);
    if (!options.noAccessor) {
      const superDesc = descriptorFromPrototype(name, this.prototype);
      let desc;
      // If there is a super accessor, capture it and "super" to it
      if (superDesc !== undefined && superDesc.set && superDesc.get) {
        const {
          set,
          get
        } = superDesc;
        desc = {
          get() {
            return get.call(this);
          },
          set(value) {
            const oldValue = this[name];
            set.call(this, value);
            this.requestUpdate(name, oldValue);
          },
          configurable: true,
          enumerable: true
        };
      } else {
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        desc = {
          get() {
            return this[key];
          },
          set(value) {
            const oldValue = this[name];
            this[key] = value;
            this.requestUpdate(name, oldValue);
          },
          configurable: true,
          enumerable: true
        };
      }
      Object.defineProperty(this.prototype, name, desc);
    }
  }
  /**
   * Creates property accessors for registered properties and ensures
   * any superclasses are also finalized.
   * @nocollapse
   */
  static _finalize() {
    if (this.hasOwnProperty(JSCompiler_renameProperty('finalized', this)) && this.finalized) {
      return;
    }
    // finalize any superclasses
    const superCtor = Object.getPrototypeOf(this);
    if (typeof superCtor._finalize === 'function') {
      superCtor._finalize();
    }
    this.finalized = true;
    this._ensureClassProperties();
    // initialize Map populated in observedAttributes
    this._attributeToPropertyMap = new Map();
    // make any properties
    // Note, only process "own" properties since this element will inherit
    // any properties defined on the superClass, and finalization ensures
    // the entire prototype chain is finalized.
    if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
      const props = this.properties;
      // support symbols in properties (IE11 does not support this)
      const propKeys = [...Object.getOwnPropertyNames(props), ...(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(props) : [])];
      for (const p of propKeys) {
        // note, use of `any` is due to TypeSript lack of support for symbol in
        // index types
        this.createProperty(p, props[p]);
      }
    }
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */
  static _attributeNameForProperty(name, options) {
    const attribute = options.attribute;
    return attribute === false ? undefined : typeof attribute === 'string' ? attribute : typeof name === 'string' ? name.toLowerCase() : undefined;
  }
  /**
   * Returns true if a property should request an update.
   * Called when a property value is set and uses the `hasChanged`
   * option for the property if present or a strict identity check.
   * @nocollapse
   */
  static _valueHasChanged(value, old, hasChanged = notEqual) {
    return hasChanged(value, old);
  }
  /**
   * Returns the property value for the given attribute value.
   * Called via the `attributeChangedCallback` and uses the property's
   * `converter` or `converter.fromAttribute` property option.
   * @nocollapse
   */
  static _propertyValueFromAttribute(value, options) {
    const type = options.type;
    const converter = options.converter || defaultConverter;
    const fromAttribute = typeof converter === 'function' ? converter : converter.fromAttribute;
    return fromAttribute ? fromAttribute(value, type) : value;
  }
  /**
   * Returns the attribute value for the given property value. If this
   * returns undefined, the property will *not* be reflected to an attribute.
   * If this returns null, the attribute will be removed, otherwise the
   * attribute will be set to the value.
   * This uses the property's `reflect` and `type.toAttribute` property options.
   * @nocollapse
   */
  static _propertyValueToAttribute(value, options) {
    if (options.reflect === undefined) {
      return;
    }
    const type = options.type;
    const converter = options.converter;
    const toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
    return toAttribute(value, type);
  }
  /**
   * Performs element initialization. By default captures any pre-set values for
   * registered properties.
   */
  initialize() {
    this._saveInstanceProperties();
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
   * (<=41), properties created for native platform properties like (`id` or
   * `name`) may not have default values set in the element constructor. On
   * these browsers native properties appear on instances and therefore their
   * default value will overwrite any element default (e.g. if the element sets
   * this.id = 'id' in the constructor, the 'id' will become '' since this is
   * the native platform default).
   */
  _saveInstanceProperties() {
    for (const [p] of this.constructor._classProperties) {
      if (this.hasOwnProperty(p)) {
        const value = this[p];
        delete this[p];
        if (!this._instanceProperties) {
          this._instanceProperties = new Map();
        }
        this._instanceProperties.set(p, value);
      }
    }
  }
  /**
   * Applies previously saved instance properties.
   */
  _applyInstanceProperties() {
    for (const [p, v] of this._instanceProperties) {
      this[p] = v;
    }
    this._instanceProperties = undefined;
  }
  connectedCallback() {
    this._updateState = this._updateState | STATE_HAS_CONNECTED;
    // Ensure connection triggers an update. Updates cannot complete before
    // connection and if one is pending connection the `_hasConnectionResolver`
    // will exist. If so, resolve it to complete the update, otherwise
    // requestUpdate.
    if (this._hasConnectedResolver) {
      this._hasConnectedResolver();
      this._hasConnectedResolver = undefined;
    } else {
      this.requestUpdate();
    }
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   */
  disconnectedCallback() {}
  /**
   * Synchronizes property values when attributes change.
   */
  attributeChangedCallback(name, old, value) {
    if (old !== value) {
      this._attributeToProperty(name, value);
    }
  }
  _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
    const ctor = this.constructor;
    const attr = ctor._attributeNameForProperty(name, options);
    if (attr !== undefined) {
      const attrValue = ctor._propertyValueToAttribute(value, options);
      // an undefined value does not change the attribute.
      if (attrValue === undefined) {
        return;
      }
      // Track if the property is being reflected to avoid
      // setting the property again via `attributeChangedCallback`. Note:
      // 1. this takes advantage of the fact that the callback is synchronous.
      // 2. will behave incorrectly if multiple attributes are in the reaction
      // stack at time of calling. However, since we process attributes
      // in `update` this should not be possible (or an extreme corner case
      // that we'd like to discover).
      // mark state reflecting
      this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
      if (attrValue == null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, attrValue);
      }
      // mark state not reflecting
      this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
    }
  }
  _attributeToProperty(name, value) {
    // Use tracking info to avoid deserializing attribute value if it was
    // just set from a property setter.
    if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
      return;
    }
    const ctor = this.constructor;
    const propName = ctor._attributeToPropertyMap.get(name);
    if (propName !== undefined) {
      const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration;
      // mark state reflecting
      this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
      this[propName] = ctor._propertyValueFromAttribute(value, options);
      // mark state not reflecting
      this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should
   * be called when an element should update based on some state not triggered
   * by setting a property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored. Returns the `updateComplete` Promise which is resolved
   * when the update completes.
   *
   * @param name {PropertyKey} (optional) name of requesting property
   * @param oldValue {any} (optional) old value of requesting property
   * @returns {Promise} A Promise that is resolved when the update completes.
   */
  requestUpdate(name, oldValue) {
    let shouldRequestUpdate = true;
    // if we have a property key, perform property update steps.
    if (name !== undefined && !this._changedProperties.has(name)) {
      const ctor = this.constructor;
      const options = ctor._classProperties.get(name) || defaultPropertyDeclaration;
      if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
        // track old value when changing.
        this._changedProperties.set(name, oldValue);
        // add to reflecting properties set
        if (options.reflect === true && !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
          if (this._reflectingProperties === undefined) {
            this._reflectingProperties = new Map();
          }
          this._reflectingProperties.set(name, options);
        }
        // abort the request if the property should not be considered changed.
      } else {
        shouldRequestUpdate = false;
      }
    }
    if (!this._hasRequestedUpdate && shouldRequestUpdate) {
      this._enqueueUpdate();
    }
    return this.updateComplete;
  }
  /**
   * Sets up the element to asynchronously update.
   */
  async _enqueueUpdate() {
    // Mark state updating...
    this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
    let resolve;
    const previousUpdatePromise = this._updatePromise;
    this._updatePromise = new Promise(res => resolve = res);
    // Ensure any previous update has resolved before updating.
    // This `await` also ensures that property changes are batched.
    await previousUpdatePromise;
    // Make sure the element has connected before updating.
    if (!this._hasConnected) {
      await new Promise(res => this._hasConnectedResolver = res);
    }
    // Allow `performUpdate` to be asynchronous to enable scheduling of updates.
    const result = this.performUpdate();
    // Note, this is to avoid delaying an additional microtask unless we need
    // to.
    if (result != null && typeof result.then === 'function') {
      await result;
    }
    resolve(!this._hasRequestedUpdate);
  }
  get _hasConnected() {
    return this._updateState & STATE_HAS_CONNECTED;
  }
  get _hasRequestedUpdate() {
    return this._updateState & STATE_UPDATE_REQUESTED;
  }
  get hasUpdated() {
    return this._updateState & STATE_HAS_UPDATED;
  }
  /**
   * Performs an element update.
   *
   * You can override this method to change the timing of updates. For instance,
   * to schedule updates to occur just before the next frame:
   *
   * ```
   * protected async performUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.performUpdate();
   * }
   * ```
   */
  performUpdate() {
    // Mixin instance properties once, if they exist.
    if (this._instanceProperties) {
      this._applyInstanceProperties();
    }
    if (this.shouldUpdate(this._changedProperties)) {
      const changedProperties = this._changedProperties;
      this.update(changedProperties);
      this._markUpdated();
      if (!(this._updateState & STATE_HAS_UPDATED)) {
        this._updateState = this._updateState | STATE_HAS_UPDATED;
        this.firstUpdated(changedProperties);
      }
      this.updated(changedProperties);
    } else {
      this._markUpdated();
    }
  }
  _markUpdated() {
    this._changedProperties = new Map();
    this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. This getter can be implemented to
   * await additional state. For example, it is sometimes useful to await a
   * rendered element before fulfilling this Promise. To do this, first await
   * `super.updateComplete` then any subsequent state.
   *
   * @returns {Promise} The Promise returns a boolean that indicates if the
   * update resolved without triggering another update.
   */
  get updateComplete() {
    return this._updatePromise;
  }
  /**
   * Controls whether or not `update` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * * @param _changedProperties Map of changed properties with old values
   */
  shouldUpdate(_changedProperties) {
    return true;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * * @param _changedProperties Map of changed properties with old values
   */
  update(_changedProperties) {
    if (this._reflectingProperties !== undefined && this._reflectingProperties.size > 0) {
      for (const [k, v] of this._reflectingProperties) {
        this._propertyToAttribute(k, this[k], v);
      }
      this._reflectingProperties = undefined;
    }
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * * @param _changedProperties Map of changed properties with old values
   */
  updated(_changedProperties) {}
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * * @param _changedProperties Map of changed properties with old values
   */
  firstUpdated(_changedProperties) {}
}
/**
 * Marks class as having finished creating properties.
 */
exports.UpdatingElement = UpdatingElement;
UpdatingElement.finalized = true;
},{}],"../node_modules/@polymer/lit-element/lib/decorators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryAll = exports.query = exports.property = exports.eventOptions = exports.customElement = void 0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const legacyCustomElement = (tagName, clazz) => {
  window.customElements.define(tagName, clazz);
  // Cast as any because TS doesn't recognize the return type as being a
  // subtype of the decorated class when clazz is typed as
  // `Constructor<HTMLElement>` for some reason.
  // `Constructor<HTMLElement>` is helpful to make sure the decorator is
  // applied to elements however.
  return clazz;
};
const standardCustomElement = (tagName, descriptor) => {
  const {
    kind,
    elements
  } = descriptor;
  return {
    kind,
    elements,
    // This callback is called once the class is otherwise fully defined
    finisher(clazz) {
      window.customElements.define(tagName, clazz);
    }
  };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * @param tagName the name of the custom element to define
 *
 * In TypeScript, the `tagName` passed to `customElement` should be a key of the
 * `HTMLElementTagNameMap` interface. To add your element to the interface,
 * declare the interface in this module:
 *
 *     @customElement('my-element')
 *     export class MyElement extends LitElement {}
 *
 *     declare global {
 *       interface HTMLElementTagNameMap {
 *         'my-element': MyElement;
 *       }
 *     }
 *
 */
const customElement = tagName => classOrDescriptor => typeof classOrDescriptor === 'function' ? legacyCustomElement(tagName, classOrDescriptor) : standardCustomElement(tagName, classOrDescriptor);
exports.customElement = customElement;
const standardProperty = (options, element) => {
  // createProperty() takes care of defining the property, but we still must
  // return some kind of descriptor, so return a descriptor for an unused
  // prototype field. The finisher calls createProperty().
  return {
    kind: 'field',
    key: Symbol(),
    placement: 'own',
    descriptor: {},
    // When @babel/plugin-proposal-decorators implements initializers,
    // do this instead of the initializer below. See:
    // https://github.com/babel/babel/issues/9260 extras: [
    //   {
    //     kind: 'initializer',
    //     placement: 'own',
    //     initializer: descriptor.initializer,
    //   }
    // ],
    initializer() {
      if (typeof element.initializer === 'function') {
        this[element.key] = element.initializer.call(this);
      }
    },
    finisher(clazz) {
      clazz.createProperty(element.key, options);
    }
  };
};
const legacyProperty = (options, proto, name) => {
  proto.constructor.createProperty(name, options);
};
/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A `PropertyDeclaration` may optionally be
 * supplied to configure property features.
 */
const property = options => (protoOrDescriptor, name) => name !== undefined ? legacyProperty(options, protoOrDescriptor, name) : standardProperty(options, protoOrDescriptor);
/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 */
exports.property = property;
const query = exports.query = _query((target, selector) => target.querySelector(selector));
/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 */
const queryAll = exports.queryAll = _query((target, selector) => target.querySelectorAll(selector));
const legacyQuery = (descriptor, proto, name) => {
  Object.defineProperty(proto, name, descriptor);
};
const standardQuery = (descriptor, element) => ({
  kind: 'method',
  placement: 'prototype',
  key: element.key,
  descriptor
});
/**
 * Base-implementation of `@query` and `@queryAll` decorators.
 *
 * @param queryFn exectute a `selector` (ie, querySelector or querySelectorAll)
 * against `target`.
 */
function _query(queryFn) {
  return selector => (protoOrDescriptor, name) => {
    const descriptor = {
      get() {
        return queryFn(this.renderRoot, selector);
      },
      enumerable: true,
      configurable: true
    };
    return name !== undefined ? legacyQuery(descriptor, protoOrDescriptor, name) : standardQuery(descriptor, protoOrDescriptor);
  };
}
const standardEventOptions = (options, element) => {
  return Object.assign({}, element, {
    finisher(clazz) {
      Object.assign(clazz.prototype[element.key], options);
    }
  });
};
const legacyEventOptions = (options, proto, name) => {
  Object.assign(proto[name], options);
};
/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifis event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * @example
 *
 *     class MyElement {
 *
 *       clicked = false;
 *
 *       render() {
 *         return html`<div @click=${this._onClick}`><button></button></div>`;
 *       }
 *
 *       @eventOptions({capture: true})
 *       _onClick(e) {
 *         this.clicked = true;
 *       }
 *     }
 */
const eventOptions = options =>
// Return value typed as any to prevent TypeScript from complaining that
// standard decorator function signature does not match TypeScript decorator
// signature
// TODO(kschaaf): unclear why it was only failing on this decorator and not
// the others
(protoOrDescriptor, name) => name !== undefined ? legacyEventOptions(options, protoOrDescriptor, name) : standardEventOptions(options, protoOrDescriptor);
exports.eventOptions = eventOptions;
},{}],"../node_modules/@polymer/lit-element/lib/css-tag.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportsAdoptingStyleSheets = exports.css = exports.CSSResult = void 0;
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = exports.supportsAdoptingStyleSheets = 'adoptedStyleSheets' in Document.prototype;
class CSSResult {
  constructor(cssText) {
    this.cssText = cssText;
  }
  // Note, this is a getter so that it's lazy. In practice, this means
  // stylesheets are not created until the first element instance is made.
  get styleSheet() {
    if (this._styleSheet === undefined) {
      // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
      // is constructable.
      if (supportsAdoptingStyleSheets) {
        this._styleSheet = new CSSStyleSheet();
        this._styleSheet.replaceSync(this.cssText);
      } else {
        this._styleSheet = null;
      }
    }
    return this._styleSheet;
  }
}
exports.CSSResult = CSSResult;
const textFromCSSResult = value => {
  if (value instanceof CSSResult) {
    return value.cssText;
  } else {
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}.`);
  }
};
const css = (strings, ...values) => {
  const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
  return new CSSResult(cssText);
};
exports.css = css;
},{}],"../node_modules/@polymer/lit-element/lit-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  LitElement: true,
  html: true,
  svg: true,
  TemplateResult: true,
  SVGTemplateResult: true
};
exports.LitElement = void 0;
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml2.SVGTemplateResult;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml2.TemplateResult;
  }
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _litHtml2.html;
  }
});
Object.defineProperty(exports, "svg", {
  enumerable: true,
  get: function () {
    return _litHtml2.svg;
  }
});
var _litHtml = require("lit-html");
var _shadyRender = require("lit-html/lib/shady-render");
var _updatingElement = require("./lib/updating-element.js");
Object.keys(_updatingElement).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _updatingElement[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _updatingElement[key];
    }
  });
});
var _decorators = require("./lib/decorators.js");
Object.keys(_decorators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _decorators[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _decorators[key];
    }
  });
});
var _litHtml2 = require("lit-html/lit-html");
var _cssTag = require("./lib/css-tag.js");
Object.keys(_cssTag).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _cssTag[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cssTag[key];
    }
  });
});
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

class LitElement extends _updatingElement.UpdatingElement {
  /**
   * Array of styles to apply to the element. The styles should be defined
   * using the `css` tag function.
   */
  static get styles() {
    return [];
  }
  static get _uniqueStyles() {
    if (this._styles === undefined) {
      const styles = this.styles;
      // As a performance optimization to avoid duplicated styling that can
      // occur especially when composing via subclassing, de-duplicate styles
      // preserving the last item in the list. The last item is kept to
      // try to preserve cascade order with the assumption that it's most
      // important that last added styles override previous styles.
      const styleSet = styles.reduceRight((set, s) => {
        set.add(s);
        // on IE set.add does not return the set.
        return set;
      }, new Set());
      // Array.form does not work on Set in IE
      this._styles = [];
      styleSet.forEach(v => this._styles.unshift(v));
    }
    return this._styles;
  }
  /**
   * Performs element initialization. By default this calls `createRenderRoot`
   * to create the element `renderRoot` node and captures any pre-set values for
   * registered properties.
   */
  initialize() {
    super.initialize();
    this.renderRoot = this.createRenderRoot();
    // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
    // element's getRootNode(). While this could be done, we're choosing not to
    // support this now since it would require different logic around de-duping.
    if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
      this.adoptStyles();
    }
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   * @returns {Element|DocumentFragment} Returns a node into which to render.
   */
  createRenderRoot() {
    return this.attachShadow({
      mode: 'open'
    });
  }
  /**
   * Applies styling to the element shadowRoot using the `static get styles`
   * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
   * available and will fallback otherwise. When Shadow DOM is polyfilled,
   * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
   * is available but `adoptedStyleSheets` is not, styles are appended to the
   * end of the `shadowRoot` to [mimic spec
   * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
   */
  adoptStyles() {
    const styles = this.constructor._uniqueStyles;
    if (styles.length === 0) {
      return;
    }
    // There are three separate cases here based on Shadow DOM support.
    // (1) shadowRoot polyfilled: use ShadyCSS
    // (2) shadowRoot.adoptedStyleSheets available: use it.
    // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
    // rendering
    if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
      window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map(s => s.cssText), this.localName);
    } else if (_cssTag.supportsAdoptingStyleSheets) {
      this.renderRoot.adoptedStyleSheets = styles.map(s => s.styleSheet);
    } else {
      // This must be done after rendering so the actual style insertion is done
      // in `update`.
      this._needsShimAdoptedStyleSheets = true;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    // Note, first update/render handles styleElement so we only call this if
    // connected after first update.
    if (this.hasUpdated && window.ShadyCSS !== undefined) {
      window.ShadyCSS.styleElement(this);
    }
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * * @param _changedProperties Map of changed properties with old values
   */
  update(changedProperties) {
    super.update(changedProperties);
    const templateResult = this.render();
    if (templateResult instanceof _litHtml.TemplateResult) {
      this.constructor.render(templateResult, this.renderRoot, {
        scopeName: this.localName,
        eventContext: this
      });
    }
    // When native Shadow DOM is used but adoptedStyles are not supported,
    // insert styling after rendering to ensure adoptedStyles have highest
    // priority.
    if (this._needsShimAdoptedStyleSheets) {
      this._needsShimAdoptedStyleSheets = false;
      this.constructor._uniqueStyles.forEach(s => {
        const style = document.createElement('style');
        style.textContent = s.cssText;
        this.renderRoot.appendChild(style);
      });
    }
  }
  /**
   * Invoked on each update to perform rendering tasks. This method must return
   * a lit-html TemplateResult. Setting properties inside this method will *not*
   * trigger the element to update.
   */
  render() {}
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 */
exports.LitElement = LitElement;
LitElement.finalized = true;
/**
 * Render method used to render the lit-html TemplateResult to the element's
 * DOM.
 * @param {TemplateResult} Template to render.
 * @param {Element|DocumentFragment} Node into which to render.
 * @param {String} Element name.
 * @nocollapse
 */
LitElement.render = _shadyRender.render;
},{"lit-html":"../node_modules/lit-html/lit-html.js","lit-html/lib/shady-render":"../node_modules/lit-html/lib/shady-render.js","./lib/updating-element.js":"../node_modules/@polymer/lit-element/lib/updating-element.js","./lib/decorators.js":"../node_modules/@polymer/lit-element/lib/decorators.js","lit-html/lit-html":"../node_modules/lit-html/lit-html.js","./lib/css-tag.js":"../node_modules/@polymer/lit-element/lib/css-tag.js"}],"components/va-public-header.js":[function(require,module,exports) {
"use strict";

var _litElement = require("@polymer/lit-element");
var _Router = require("../Router");
var _App = _interopRequireDefault(require("../App"));
var _templateObject, _templateObject2;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
customElements.define('va-public-header', class PublicHeader extends _litElement.LitElement {
  static get properties() {
    return {
      title: {
        type: String
      }
    };
  }
  firstUpdated() {
    super.firstUpdated();
    this.navActiveLinks();
    console.log('Header initialized with title:', this.title);
  }
  navActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = this.shadowRoot.querySelectorAll('.app-top-nav a, .app-side-menu-items a');
    navLinks.forEach(navLink => {
      if (navLink.href.slice(-1) == '#') return;
      if (navLink.pathname === currentPath) {
        navLink.classList.add('active');
      }
    });
  }
  hamburgerClick() {
    const appMenu = this.shadowRoot.querySelector('.app-side-menu');
    appMenu.show();
  }
  menuClick(e) {
    e.preventDefault();
    const pathname = e.target.closest('a').pathname;
    const appSideMenu = this.shadowRoot.querySelector('.app-side-menu');
    if (appSideMenu) {
      appSideMenu.hide();
      appSideMenu.addEventListener('sl-after-hide', () => {
        (0, _Router.gotoRoute)(pathname);
      });
    }
  }
  handleTitleClick(path, e) {
    e.preventDefault();
    (0, _Router.gotoRoute)(path);
  }
  handleChevronClick(e) {
    e.stopPropagation();
    const details = e.target.closest('sl-details');
    if (details) {
      details.open = !details.open;
    }
  }
  render() {
    return (0, _litElement.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    <style>\n    * {\n        box-sizing: border-box;\n    }\n    \n    .public-header {\n        background: transparent !important;\n        position: fixed;\n        top: 0;\n        right: 0;\n        left: 0;\n        height: var(--public-header-height);\n        display: flex;\n        z-index: 9;\n        align-items: center;\n    }\n    \n    .public-header-main {\n        flex-grow: 1;\n        display: flex-start;\n        align-items: center;\n    }\n    \n    .public-header-main::slotted(h1) {\n        color: #fff;\n    }\n    \n    .app-logo a {\n        color: #fff;\n        text-decoration: none;\n        font-weight: bold;\n        font-size: 1.2em;\n        padding: .6em;\n        display: inline-block;\n    }\n    \n    .app-logo img {\n        width: 90px;\n    }\n    \n    .hamburger-btn::part(base) {\n        color: #fff;\n    }\n    \n    .app-top-nav {\n        display: flex;\n        height: 100%;\n        align-items: center;\n    }\n    \n    .app-top-nav a {\n        display: inline-block;\n        padding: .8em;\n        text-decoration: none;\n        color: #fff;\n    }\n    \n    .app-side-menu-items a {\n        display: block;\n        padding: 0.5em;\n        text-decoration: none;\n        font-size: 1.3em;\n        color: var(--app-header-txt-color);\n        padding-bottom: 0.5em;\n    }\n    \n    .app-side-menu-logo {\n        width: 150px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        top: 1em;\n        display: block;\n    }\n    \n    .page-title {\n        color: var(--public-header-txt-color);\n        margin-right: 0.5em;\n        font-size: var(--public-header-title-font-size);\n    }\n    /* active nav links */\n    \n    .app-top-nav a.active,\n    .menu-item::part(label):hover {\n        color: #fff;\n    }\n    /* right side menu */\n    \n    .right-side-menu {\n        --base-txt-color: #2F1E1F;\n    }\n    /* RESPONSIVE - MOBILE ------------------- */\n    \n    @media all and (max-width: 768px) {\n        .app-top-nav {\n            display: none;\n        }\n    }\n    \n    .user-menu {\n        margin-right: 2em;\n    }\n    \n    sl-details::part(base) {\n        display: block;\n        border: none;\n        padding: 0.65em;\n    }\n    \n    sl-details::part(content) {\n        border: none;\n        padding: 0;\n    }\n    \n    sl-details::part(header) {\n        border: none;\n        padding: 0;\n    }\n    \n    sl-details::part(summary) {\n        color: var(--sl-color-neutral-600);\n        font-size: 1.3em;\n        color: var(--app-header-txt-color);\n    }\n    \n    sl-details::part(base) {\n        border: none;\n    }\n    \n    .menu-expand {\n        font-size: 1.3em;\n        margin-left: 1em;\n        margin-top: 0.5em;\n    }\n    \n    .menu-expand {\n        transition: color 0.3s ease;\n        text-decoration: none;\n    }\n    \n    .menu-expand:hover {\n        color: var(--sl-color-primary-600);\n        padding-left: 1.5em;\n        transition: all 0.5s ease;\n    }\n    \n    .header-logo {\n        cursor: pointer;\n        width: 120px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        position: absolute;\n        top: 15px;\n        left: 5em;\n        z-index: 2;\n    }\n</style>\n\n<header class=\"public-header\">\n    <sl-icon-button class=\"hamburger-btn\" name=\"list\" @click=\"", "\" style=\"font-size: 2em;\"></sl-icon-button>\n    <a href=\"/\" @click=\"", "\"><img class=\"header-logo\" src=\"/images/mindline-white-logo.png\"></a>\n\n    <div class=\"public-header-main\">\n        ", "\n        <slot></slot>\n    </div>\n\n    <nav class=\"app-top-nav\">\n\n        <sl-dropdown class=\"user-menu\">\n            <a slot=\"trigger\" href=\"#\" @click=\"", "\">\n                <sl-avatar style=\"--size: 40px;\">Login</sl-avatar>\n            </a>\n            <sl-menu class=\"right-side-menu\">\n                <sl-menu-item @click=\"", "\">Login</sl-menu-item>\n\n            </sl-menu>\n        </sl-dropdown>\n\n\n    </nav>\n</header>\n\n<sl-drawer class=\"app-side-menu\" placement=\"left\">\n    <div slot=\"label\">\n        <a href=\"/\" @click=\"", "\"><img class=\"app-side-menu-logo\" src=\"/images/logo-mindline-trimmed-no-wording-clr.svg\"></a>\n    </div>\n    <br>\n    <nav class=\"app-side-menu-items\">\n        <a href=\"/\" @click=\"", "\">Home</a>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Mental Health</span>\n            </div>\n            <a class=\"menu-expand\" href=\"#\" @click=", ">Stress</a>\n            <a class=\"menu-expand\" href=\"#\" @click=", ">Anxiety</a>\n            <a class=\"menu-expand\" href=\"#\" @click=", ">Depression</a>\n        </sl-details>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Mindfulness</span>\n            </div>\n            <a class=\"menu-expand\" href=\"#\" @click=", ">Meditation</a>\n            <a class=\"menu-expand\" href=\"#\" @click=", ">Breathing</a>\n            <a class=\"menu-expand\" href=\"#\" @click=", ">Motivation</a>\n        </sl-details>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Resources</span>\n            </div>\n            <a class=\"menu-expand\" href=\"#\" @click=", ">Support</a>\n            <a class=\"menu-expand\" href=\"#\" @click=", ">Services</a>\n            <a class=\"menu-expand\" href=\"#\" @click=", ">Guides</a>\n        </sl-details>\n\n        <a href=\"/about\" @click=\"", "\">About</a>\n\n        <a href=\"/signin\" @click=\"", "\">Profile</a>\n        <a href=\"/signin\" @click=\"", "\">Bookmarks</a>\n        <hr style=\"color: #fff width:10%\">\n\n        <sl-details summary=\"Privacy\">\n            <p>\n                We care about your privacy. Mindline AU will not knowingly give away, sell or provide your personal information \n                to a third party unless you conscent to that or it is required by law. The information that is collected about \n                you allow you the user to bookmark information you would like to come back to at anytime. You can update or change \n                your details at any time. If you wish to be removed from our database, please contact Mindline AU in writing. \n            </p>\n                \n            <p>\n                <strong>Security of Personal Information</strong>\n                Your Personal Information is stored in a manner that reasonably protects it from misuse and loss and from \n                unauthorized access, modification or disclosure\n            </p>\n                \n        </sl-details>\n\n        \n        <sl-details summary=\"T&Cs\">\n            <p>\n                Ok we know this is the boring stuff, but we need to let you know that the content and media on the Mindline AU \n                web application are created and published online for informational purposes only. It is not intended to be \n                a substitute for professional medical advice and should not be relied on as health or personal advice.\n            </p>\n                \n            <p>\n                Always seek the guidance of your doctor or other qualified health professional with any questions you may \n                have regarding your health or a medical condition. Never disregard the advice of a medical professional, or \n                delay in seeking it because of something you have read on this web application.\n            </p>\n\n            <p>\n                If you think you may have a medical emergency, call your doctor, go to the nearest hospital emergency department, \n                or call the emergency services immediately. If you choose to rely on any information provided by Mindline AU, you \n                do so solely at your own risk.\n            </p>\n\n            <p>\n                External (outbound) links to other web applications or educational material (e.g. audio, video, apps\u2026) that \n                are not explicitly created by Mindline AU are followed at your own risk. Under no circumstances is Mindline AU \n                responsible for the claims of third-party web applications or educational providers.\n            </p>\n\n            <p>If you wish to seek clarification on the above matters, please get in touch with Mindline AU.</p>\n                            \n            <p> \n                <strong>Use License</strong>\n                Permission is granted to download materials (information or software) on <i>Mindline</i> AU&apos;s web application \n                for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license \n                you may not:\n            </p>\n                <ul>\n                    <li>modify or copy the materials;</li>\n                    <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>\n                    <li>attempt to decompile or reverse engineer any software contained on <i>Mindline</i> AU&apos;s web application;</li>\n                    <li>remove any copyright or other proprietary notations from the materials; or transfer the materials \n                        to another person\n                    </li> \n                    <li>or \u201Cmirror\u201D the materials on any other server.</li>\n                </ul>    \n                    \n            <p>\n                <strong>Materials Disclaimer</strong>\n                The materials on Mindline AU web application are provided on an as is basis. Clear Head makes no warranties, expressed \n                or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or \n                conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.\n            </p>\n                                \n            <p>\n                Further, Mindline AU does not warrant or make any representations concerning the accuracy, likely results, or reliability \n                of the use of the materials on its web application or otherwise relating to such materials or on any sites linked to this \n                site.\n            </p>\n\n            <p>\n                <strong>Limitations</strong>\n                In no event shall Mindline AU or its suppliers be liable for any damages (including, without limitation, damages \n                for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials \n                on Mindline AU&apos;s web application, even if Mindline AU or a Mindline AU authorised representative has been notified \n                orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied \n                warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.\n            </p>\n\n            <p>    \n                <strong>Accuracy of materials</strong>\n                The materials appearing on Mindline AU web application could include technical, typographical, or photographic \n                errors. Mindline AU does not warrant that any of the materials on its web application are accurate, complete or \n                current. Mindline AU may make changes to the materials contained on its web application at any time without notice. \n                However, Mindline AU is not able to make any commitment when materials are updated.\n            </p>\n\n            <p> \n                <strong>Links</strong>        \n                Mindline AU has not reviewed all of the sites linked to its web application and is not responsible for \n                the contents of any such linked site. The inclusion of any link does not imply endorsement by Mindline AU \n                of the site. Use of any such linked web application is at the user&apos;s own risk.\n            </p>\n\n            </p>\n                <strong>Modifications</strong>\n                Mindline AU may revise these terms and conditions for its web application at any time without notice. \n                By using this web application, you are agreeing to be bound by the then current version of these terms \n                and conditions.\n            </p>\n            \n        </sl-details>\n\n        <sl-details summary=\"Socials\">\n\n            <p>We've done something different and skipped the socials to let you focus on YOU!</p>\n        \n        </sl-details>\n\n\n        <hr style=\"color: #fff width:10%\">\n\n        <a href=\"mailto:hello@mindline.telstra.com.au\">hello@mindline.telstra.com.au</a>\n        <a href=\"tel:1800 034 034\">1800 034 034</a>\n\n\n\n\n\n    </nav>\n</sl-drawer>\n        "])), this.hamburgerClick, _Router.anchorRoute, this.title ? (0, _litElement.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n        <h1 class=\"page-title\">", "</h1> "])), this.title) : "", e => e.preventDefault(), () => (0, _Router.gotoRoute)('/signin'), this.menuClick, this.menuClick, e => this.handleTitleClick('/mentalHealth', e), () => (0, _Router.gotoRoute)('/mentalHealthExpanded?tab=stress'), () => (0, _Router.gotoRoute)('/mentalHealthExpanded?tab=anxiety'), () => (0, _Router.gotoRoute)('/mentalHealthExpanded?tab=depression'), e => this.handleTitleClick('/mindfulness', e), () => (0, _Router.gotoRoute)('/mindfulnessExpanded?tab=meditation'), () => (0, _Router.gotoRoute)('/mindfulnessExpanded?tab=breathing'), () => (0, _Router.gotoRoute)('/mindfulnessExpanded?tab=motivation'), e => this.handleTitleClick('/resources', e), () => (0, _Router.gotoRoute)('/resourcesExpanded?tab=support'), () => (0, _Router.gotoRoute)('/resourcesExpanded?tab=services'), () => (0, _Router.gotoRoute)('/resourcesExpanded?tab=guides'), this.menuClick, this.menuClick, this.menuClick);
  }
});
},{"@polymer/lit-element":"../node_modules/@polymer/lit-element/lit-element.js","../Router":"Router.js","../App":"App.js"}],"views/pages/signin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("./../../App"));
var _litHtml = require("lit-html");
var _Router = require("./../../Router");
var _Auth = _interopRequireDefault(require("./../../Auth"));
var _Utils = _interopRequireDefault(require("./../../Utils"));
require("./../../components/va-public-header.js");
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
class SignInView {
  init() {
    document.title = 'Log in';
    this.render();
    _Utils.default.pageIntroAnim();
  }
  firstUpdated() {
    super.firstUpdated();
    this.navActiveLinks();
    console.log('Header initialized with title:', this.title);
  }
  navActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = this.shadowRoot.querySelectorAll('.app-top-nav a, .app-side-menu-items a');
    navLinks.forEach(navLink => {
      if (navLink.href.slice(-1) == '#') return;
      if (navLink.pathname === currentPath) {
        navLink.classList.add('active');
      }
    });
  }
  hamburgerClick() {
    const appMenu = document.querySelector('.app-side-menu'); // Use document instead of shadowRoot
    if (appMenu) {
      appMenu.show();
    } else {
      console.error('Drawer element not found!');
    }
  }
  menuClick(e) {
    e.preventDefault();
    const pathname = e.target.closest('a').pathname;
    const appSideMenu = this.shadowRoot.querySelector('.app-side-menu');
    // hide appMenu
    appSideMenu.hide();
    appSideMenu.addEventListener('sl-after-hide', () => {
      // goto route after menu is hidden
      (0, _Router.gotoRoute)(pathname);
    });
  }
  handleTitleClick(path, e) {
    e.preventDefault();
    (0, _Router.gotoRoute)(path);
  }
  handleChevronClick(e) {
    e.stopPropagation();
    const details = e.target.closest('sl-details');
    if (details) {
      details.open = !details.open;
    }
  }
  signInSubmitHandler(e) {
    e.preventDefault();
    // Get the FormData from the event
    const formData = e.detail.formData;

    // Convert FormData to a plain object
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log('Converted form data:', data); // Debug: check the converted data

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.setAttribute('loading', '');

    // Sign in using Auth with the plain object data
    _Auth.default.signIn(data, () => {
      submitBtn.removeAttribute('loading');
    });
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["    \n    <style>\n    .signin-background {\n        background-image: url('/images/login/login-background.svg');\n        background-size: cover;\n        background-position: center;\n        background-repeat: no-repeat;\n        height: 100vh;\n        width: 100%;\n        position: fixed;\n        top: 0;\n        left: 0;\n        z-index: -1;\n    }\n    \n    .page-content {\n        display: flex;\n        width: 100%;\n        height: 100vh;\n        /* Full viewport height */\n        margin: 0;\n        padding: 0;\n    }\n    \n    .signon2-container {\n        background-color: rgba(5, 166, 209, 0.8);\n        backdrop-filter: blur(10px);\n        -webkit-backdrop-filter: blur(10px);\n        width: 45%;\n        height: 100%;\n        position: fixed;\n        left: 0;\n        top: 0;\n        margin: 0;\n        padding: 0;\n    }\n    \n    .welcome-box {\n        width: 55%;\n        height: 100%;\n        position: fixed;\n        right: 0;\n        top: 50%;\n        transform: translateY(-50%);\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        flex-direction: column;\n        color: #fff;\n    }\n    \n    .submit-btn::part(base) {\n        background-color: #F4D35E;\n        border-color: #F4D35E;\n        color: #000000;\n        style=padding-bottom: 1em;\n    }\n    \n    .submit-btn::part(base):hover {\n        background-color: #e5c654;\n        border-color: #e5c654;\n    }\n    \n    .submit-btn::part(base):active {\n        background-color: #d6b84a;\n        border-color: #d6b84a;\n    }\n    \n    h2 {\n        text-align: left;\n        width: 250.61px;\n        font-size: 5em;\n    }\n    \n    p {\n        width: 100%;\n        margin-top: 1em;\n    }\n    \n    .app-side-menu-logo {\n        width: 150px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        top: 1em;\n        display: block;\n    }\n    \n    .hamburger-btn::part(base) {\n        color: #fff;\n        position: fixed;\n        top: 1em;\n        left: 1em;\n        z-index: 100;\n    }\n    \n    .app-top-nav {\n        display: flex;\n        height: 100%;\n        align-items: center;\n    }\n    \n    .app-top-nav a {\n        display: inline-block;\n        padding: .8em;\n        text-decoration: none;\n        color: #fff;\n    }\n    \n    .app-side-menu-items a {\n        display: block;\n        padding: 0.5em;\n        text-decoration: none;\n        font-size: 1.3em;\n        color: var(--app-header-txt-color);\n        padding-bottom: 0.5em;\n    }\n    \n    .home-logo {\n        cursor: pointer;\n        width: 150px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        position: absolute;\n        top: 30px;\n        left: 5em;\n        z-index: 2;\n    }\n    \n    .header-logo {\n        cursor: pointer;\n        width: 120px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        position: absolute;\n        top: 40px;\n        left: 21.5em;\n        z-index: 2;\n    }\n    /* active nav links */\n    \n    .app-top-nav a.active,\n    .app-side-menu-items a.active {\n        font-weight: bold;\n    }\n    \n    sl-details::part(summary) {\n        transition: color 0.3s ease;\n    }\n    \n    sl-details::part(summary):hover {\n        color: var(--sl-color-primary-600);\n        cursor: pointer;\n    }\n    \n    .menu-expand {\n        transition: color 0.3s ease;\n        text-decoration: none;\n    }\n    \n    .menu-expand:hover {\n        color: var(--sl-color-primary-600);\n        padding-left: 1.5em;\n        transition: all 0.5s ease;\n    }\n    /* right side menu */\n    \n    .right-side-menu {\n        --base-txt-color: #2F1E1F;\n    }\n    \n    .menu-expand {\n        font-size: 1.3em;\n        margin-left: 1em;\n        margin-top: 0.5em;\n    }\n    \n    sl-drawer::part(label) {\n        padding: 0.6em;\n    }\n</style>\n<div class=\"signin-background\"></div>\n<sl-icon-button class=\"hamburger-btn\" name=\"list\" @click=\"", "\" style=\"font-size: 2em;\"></sl-icon-button>\n\n<sl-drawer class=\"app-side-menu\" placement=\"left\">\n    <div slot=\"label\">\n        <a href=\"/\" @click=\"", "\"><img class=\"app-side-menu-logo\" src=\"/images/logo-mindline-trimmed-no-wording-clr.svg\"></a>\n    </div>\n    <nav class=\"app-side-menu-items\">\n        <a href=\"/\" @click=\"", "\">Home</a>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Mental Health</span>\n            </div>\n            <a class=\"menu-expand\" href=\"\">Stress</a>\n            <a class=\"menu-expand\" href=\"\">Anxiety</a>\n            <a class=\"menu-expand\" href=\"\">Depression</a>\n        </sl-details>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Mindfulness</span>\n            </div>\n            <a class=\"menu-expand\" href=\"\">Meditation</a>\n            <a class=\"menu-expand\" href=\"\">Breathing</a>\n            <a class=\"menu-expand\" href=\"\">Motivation</a>\n        </sl-details>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Resources</span>\n            </div>\n            <a class=\"menu-expand\" href=\"\">Support</a>\n            <a class=\"menu-expand\" href=\"\">Services</a>\n            <a class=\"menu-expand\" href=\"\">Guides</a>\n        </sl-details>\n\n        <a href=\"/favouriteLines\" @click=\"", "\">favourites</a>\n        <a href=\"/about\" @click=\"", "\">About</a>\n        <a href=\"/profile\" @click=\"", "\">Profile</a>\n\n        <hr style=\"color: #fff width:10%\">\n\n        <sl-details summary=\"Privacy\">\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n        </sl-details>\n\n        <sl-details summary=\"T&Cs\">\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n        </sl-details>\n\n        <sl-details summary=\"Socials\">\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n        </sl-details>\n\n        <hr style=\"color: #fff width:10%\">\n\n        <a href=\"mailto:hello@mindline.telstra.com.au\">hello@mindline.telstra.com.au</a>\n        <a href=\"tel:1800 034 034\">1800 034 034</a>\n\n\n\n\n\n    </nav>\n</sl-drawer>\n<div class=\"page-content page-centered\">\n    <div class=\"signon2-container\">\n        <a href=\"/\" @click=\"", "\"><img class=\"header-logo\" src=\"/images/mindline-white-logo.png\"></a>\n        <div class=\"signinup-box\">\n\n            <h1 style=\"padding-bottom: 1em;\">LOG IN</h1>\n            <sl-form class=\"form-signup dark-theme\" @sl-submit=", ">\n                <div class=\"input-group\">\n                    <sl-input size=\"large\" pill style=\"padding-bottom: 1em;\" name=\"email\" type=\"email\" placeholder=\"Email\" required></sl-input>\n                </div>\n                <div class=\"input-group\">\n                    <sl-input size=\"large\" pill style=\"padding-bottom: 4em;\" name=\"password\" type=\"password\" placeholder=\"Password\" required toggle-password></sl-input>\n                </div>\n                <sl-button size=\"large\" pill class=\"submit-btn\" type=\"primary\" submit style=\"width: 100%;\">LOG IN</sl-button>\n            </sl-form>\n            <p>\n                <br>Don\u2019t have an account?</br> <a href=\"/signup\" @click=", ">Sign up</a></p>\n        </div>\n\n\n    </div>\n    <div class=\"welcome-box\">\n        <h2>Hi</h2>\n        <h1>Welcome back!</h1>\n    </div>\n</div>\n    "])), this.hamburgerClick, _Router.anchorRoute, _Router.anchorRoute, e => this.handleTitleClick('/mentalHealth', e), e => this.handleTitleClick('/mindfulness', e), e => this.handleTitleClick('/resources', e), _Router.anchorRoute, _Router.anchorRoute, _Router.anchorRoute, _Router.anchorRoute, this.signInSubmitHandler, _Router.anchorRoute);
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new SignInView();
},{"./../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","./../../Router":"Router.js","./../../Auth":"Auth.js","./../../Utils":"Utils.js","./../../components/va-public-header.js":"components/va-public-header.js"}],"views/pages/signup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("./../../App"));
var _Auth = _interopRequireDefault(require("./../../Auth"));
var _litHtml = require("lit-html");
var _Router = require("./../../Router");
var _Utils = _interopRequireDefault(require("./../../Utils"));
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
class SignUpView {
  init() {
    console.log('SignUpView.init');
    document.title = 'Sign up';
    this.render();
    _Utils.default.pageIntroAnim();
  }
  firstUpdated() {
    super.firstUpdated();
    this.navActiveLinks();
    console.log('Header initialized with title:', this.title);
  }
  navActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = this.shadowRoot.querySelectorAll('.app-top-nav a, .app-side-menu-items a');
    navLinks.forEach(navLink => {
      if (navLink.href.slice(-1) == '#') return;
      if (navLink.pathname === currentPath) {
        navLink.classList.add('active');
      }
    });
  }
  hamburgerClick() {
    const appMenu = document.querySelector('.app-side-menu'); // Use document instead of shadowRoot
    if (appMenu) {
      appMenu.show();
    } else {
      console.error('Drawer element not found!');
    }
  }
  menuClick(e) {
    e.preventDefault();
    const pathname = e.target.closest('a').pathname;
    const appSideMenu = this.shadowRoot.querySelector('.app-side-menu');
    // hide appMenu
    appSideMenu.hide();
    appSideMenu.addEventListener('sl-after-hide', () => {
      // goto route after menu is hidden
      (0, _Router.gotoRoute)(pathname);
    });
  }
  handleTitleClick(path, e) {
    e.preventDefault();
    (0, _Router.gotoRoute)(path);
  }
  handleChevronClick(e) {
    e.stopPropagation();
    const details = e.target.closest('sl-details');
    if (details) {
      details.open = !details.open;
    }
  }
  signUpSubmitHandler(e) {
    e.preventDefault();
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.setAttribute('loading', '');
    const formData = e.detail.formData;

    // sign up using Auth
    _Auth.default.signUp(formData, () => {
      submitBtn.removeAttribute('loading');
    });
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["     \n    <style>\n    .signin-background {\n        background-image: url('/images/login-background.png');\n        background-size: cover;\n        background-position: center;\n        background-repeat: no-repeat;\n        height: 100vh;\n        width: 100%;\n        position: fixed;\n        top: 0;\n        left: 0;\n        z-index: -1;\n    }\n    \n    .page-content {\n        display: flex;\n        width: 100%;\n        height: 100vh;\n        /* Full viewport height */\n        margin: 0;\n        padding: 0;\n    }\n    \n    .signon2-container {\n        background-color: rgba(5, 166, 209, 0.8);\n        backdrop-filter: blur(10px);\n        -webkit-backdrop-filter: blur(10px);\n        width: 45%;\n        height: 100%;\n        position: fixed;\n        left: 0;\n        top: 0;\n        margin: 0;\n        padding: 0;\n    }\n    \n    .welcome-box {\n        width: 55%;\n        height: 100%;\n        position: fixed;\n        right: 0;\n        top: 50%;\n        transform: translateY(-50%);\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        flex-direction: column;\n        color: #fff;\n    }\n    \n    .submit-btn::part(base) {\n        background-color: #F4D35E;\n        border-color: #F4D35E;\n        color: #000000;\n        style=padding-bottom: 1em;\n    }\n    \n    .submit-btn::part(base):hover {\n        background-color: #e5c654;\n        border-color: #e5c654;\n    }\n    \n    .submit-btn::part(base):active {\n        background-color: #d6b84a;\n        border-color: #d6b84a;\n    }\n    \n    h2 {\n        text-align: left;\n        width: 250.61px;\n        font-size: 5em;\n    }\n    \n    p {\n        width: 100%;\n        margin-top: 1em;\n    }\n    \n    .app-side-menu-logo {\n        width: 150px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        top: 1em;\n        display: block;\n    }\n    \n    .hamburger-btn::part(base) {\n        color: #fff;\n        position: fixed;\n        top: 1em;\n        left: 1em;\n        z-index: 100;\n    }\n    \n    .app-top-nav {\n        display: flex;\n        height: 100%;\n        align-items: center;\n    }\n    \n    .app-top-nav a {\n        display: inline-block;\n        padding: .8em;\n        text-decoration: none;\n        color: #fff;\n    }\n    \n    .app-side-menu-items a {\n        display: block;\n        padding: 0.5em;\n        text-decoration: none;\n        font-size: 1.3em;\n        color: var(--app-header-txt-color);\n        padding-bottom: 0.5em;\n    }\n    \n    .home-logo {\n        cursor: pointer;\n        width: 150px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        position: absolute;\n        top: 30px;\n        left: 42%;\n        z-index: 2;\n    }\n    \n    .header-logo {\n        cursor: pointer;\n        width: 120px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        position: absolute;\n        top: 40px;\n        left: 21.5em;\n        z-index: 2;\n    }\n    /* active nav links */\n    \n    .app-top-nav a.active,\n    .app-side-menu-items a.active {\n        font-weight: bold;\n    }\n    \n    sl-details::part(summary) {\n        transition: color 0.3s ease;\n    }\n    \n    sl-details::part(summary):hover {\n        color: var(--sl-color-primary-600);\n        cursor: pointer;\n    }\n    \n    .menu-expand {\n        transition: color 0.3s ease;\n        text-decoration: none;\n    }\n    \n    .menu-expand:hover {\n        color: var(--sl-color-primary-600);\n        padding-left: 1.5em;\n        transition: all 0.5s ease;\n    }\n    /* right side menu */\n    \n    .right-side-menu {\n        --base-txt-color: #2F1E1F;\n    }\n    \n    .menu-expand {\n        font-size: 1.3em;\n        margin-left: 1em;\n        margin-top: 0.5em;\n    }\n    \n    sl-drawer::part(label) {\n        padding: 0.6em;\n    }\n    \n    sl-menu {\n        border-radius: 15px;\n        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n    }\n    \n    sl-menu::part(base) {\n        padding: 8px 16px;\n        margin: 4px;\n        border-radius: 15px;\n    }\n    \n    sl-menu-item:hover::part(base) {\n        background-color: #e2e8f0;\n    }\n</style>\n\n<div class=\"signin-background\"></div>\n<sl-icon-button class=\"hamburger-btn\" name=\"list\" @click=\"", "\" style=\"font-size: 2em;\"></sl-icon-button>\n\n<sl-drawer class=\"app-side-menu\" placement=\"left\">\n    <div slot=\"label\">\n        <a href=\"/\" @click=\"", "\"><img class=\"app-side-menu-logo\" src=\"/images/logo-mindline-trimmed-no-wording-clr.png\"></a>\n    </div>\n    <nav class=\"app-side-menu-items\">\n        <a href=\"/\" @click=\"", "\">Home</a>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Mental Health</span>\n            </div>\n            <a class=\"menu-expand\" href=\"\">Stress</a>\n            <a class=\"menu-expand\" href=\"\">Anxiety</a>\n            <a class=\"menu-expand\" href=\"\">Depression</a>\n        </sl-details>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Mindfulness</span>\n            </div>\n            <a class=\"menu-expand\" href=\"\">Meditation</a>\n            <a class=\"menu-expand\" href=\"\">Breathing</a>\n            <a class=\"menu-expand\" href=\"\">Motivation</a>\n        </sl-details>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Resources</span>\n            </div>\n            <a class=\"menu-expand\" href=\"\">Support</a>\n            <a class=\"menu-expand\" href=\"\">Services</a>\n            <a class=\"menu-expand\" href=\"\">Guides</a>\n        </sl-details>\n\n        <a href=\"/favouriteLines\" @click=\"", "\">favourites</a>\n        <a href=\"/about\" @click=\"", "\">About</a>\n        <a href=\"/profile\" @click=\"", "\">Profile</a>\n\n        <hr style=\"color: #fff width:10%\">\n\n        <sl-details summary=\"Privacy\">\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n        </sl-details>\n\n        <sl-details summary=\"T&Cs\">\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n        </sl-details>\n\n        <sl-details summary=\"Socials\">\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n        </sl-details>\n\n        <hr style=\"color: #fff width:10%\">\n\n        <a href=\"mailto:hello@mindline.telstra.com.au\">hello@mindline.telstra.com.au</a>\n        <a href=\"tel:1800 034 034\">1800 034 034</a>\n\n\n    </nav>\n</sl-drawer>\n\n<div class=\"page-content page-centered\">\n    <div class=\"signon2-container\">\n        <a href=\"/\" @click=\"", "\"><img class=\"header-logo\" src=\"/images/mindline-white-logo.png\"></a>\n        <div class=\"signinup-box\">\n\n            <h1 style=\"padding-bottom: 1em;\">LOG IN</h1>\n            <sl-form class=\"form-signup\" @sl-submit=", ">\n                <div class=\"input-group\">\n                    <sl-input size=\"large\" pill style=\"padding-bottom: 1em;\" name=\"firstName\" type=\"text\" placeholder=\"First name\" required></sl-input>\n                </div>\n                <div class=\"input-group\">\n                    <sl-input size=\"large\" pill style=\"padding-bottom: 1em;\" name=\"lastName\" type=\"text\" placeholder=\"Last name\" required></sl-input>\n                </div>\n                <div class=\"input-group\">\n                    <sl-input size=\"large\" pill style=\"padding-bottom: 1em;\" name=\"email\" type=\"email\" placeholder=\"Email\" required></sl-input>\n                </div>\n                <div class=\"input-group\">\n                    <sl-input size=\"large\" pill style=\"padding-bottom: 1em;\" name=\"password\" type=\"password\" placeholder=\"Password\" required toggle-password></sl-input>\n                </div>\n                <div class=\"input-group\">\n                    <sl-select size=\"large\" pill style=\"padding-bottom: 4em;\" name=\"accessLevel\" placeholder=\"I am a ...\" placement=\"bottom\">\n                        <sl-menu-item value=\"1\">Customer</sl-menu-item>\n                        <sl-menu-item value=\"2\">Mindline Admin</sl-menu-item>\n                    </sl-select>\n                </div>\n                <div>\n                    <sl-button size=\"large\" pill class=\"submit-btn\" type=\"primary\" class=\"submit-btn\" submit style=\"width: 100%;\">SIGN UP</sl-button>\n            </sl-form>\n            <p>Already have an account? <a href=\"/signin\" @click=", ">Sign in</a></p>\n            </div>\n\n        </div>\n    </div>\n    <div class=\"welcome-box\">\n        <h2>Hi</h2>\n        <h1 style=\"width: 240px;\">Tell us more about you!</h1>\n    </div>\n</div>\n    "])), this.hamburgerClick, _Router.anchorRoute, _Router.anchorRoute, e => this.handleTitleClick('/mentalHealth', e), e => this.handleTitleClick('/mindfulness', e), e => this.handleTitleClick('/resources', e), _Router.anchorRoute, _Router.anchorRoute, _Router.anchorRoute, _Router.anchorRoute, this.signUpSubmitHandler, _Router.anchorRoute);
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new SignUpView();
},{"./../../App":"App.js","./../../Auth":"Auth.js","lit-html":"../node_modules/lit-html/lit-html.js","./../../Router":"Router.js","./../../Utils":"Utils.js"}],"../node_modules/moment/moment.js":[function(require,module,exports) {
var define;
var global = arguments[3];
//! moment.js
//! version : 2.30.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return (
            input instanceof Array ||
            Object.prototype.toString.call(input) === '[object Array]'
        );
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return (
            input != null &&
            Object.prototype.toString.call(input) === '[object Object]'
        );
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (hasOwnProp(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return (
            typeof input === 'number' ||
            Object.prototype.toString.call(input) === '[object Number]'
        );
    }

    function isDate(input) {
        return (
            input instanceof Date ||
            Object.prototype.toString.call(input) === '[object Date]'
        );
    }

    function map(arr, fn) {
        var res = [],
            i,
            arrLen = arr.length;
        for (i = 0; i < arrLen; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false,
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        var flags = null,
            parsedParts = false,
            isNowValid = m._d && !isNaN(m._d.getTime());
        if (isNowValid) {
            flags = getParsingFlags(m);
            parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            isNowValid =
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidEra &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.weekdayMismatch &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));
            if (m._strict) {
                isNowValid =
                    isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        } else {
            return isNowValid;
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = (hooks.momentProperties = []),
        updateInProgress = false;

    function copyConfig(to, from) {
        var i,
            prop,
            val,
            momentPropertiesLen = momentProperties.length;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentPropertiesLen > 0) {
            for (i = 0; i < momentPropertiesLen; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return (
            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
        );
    }

    function warn(msg) {
        if (
            hooks.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' &&
            console.warn
        ) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [],
                    arg,
                    i,
                    key,
                    argLen = arguments.length;
                for (i = 0; i < argLen; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (key in arguments[0]) {
                            if (hasOwnProp(arguments[0], key)) {
                                arg += key + ': ' + arguments[0][key] + ', ';
                            }
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(
                    msg +
                        '\nArguments: ' +
                        Array.prototype.slice.call(args).join('') +
                        '\n' +
                        new Error().stack
                );
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return (
            (typeof Function !== 'undefined' && input instanceof Function) ||
            Object.prototype.toString.call(input) === '[object Function]'
        );
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            if (hasOwnProp(config, i)) {
                prop = config[i];
                if (isFunction(prop)) {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' +
                /\d{1,2}/.source
        );
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (
                hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])
            ) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L',
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (
            (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
            absNumber
        );
    }

    var formattingTokens =
            /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        formatFunctions = {},
        formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(
                    func.apply(this, arguments),
                    token
                );
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i])
                    ? array[i].call(mom, format)
                    : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] =
            formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(
                localFormattingTokens,
                replaceLongDateFormatTokens
            );
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A',
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper
            .match(formattingTokens)
            .map(function (tok) {
                if (
                    tok === 'MMMM' ||
                    tok === 'MM' ||
                    tok === 'DD' ||
                    tok === 'dddd'
                ) {
                    return tok.slice(1);
                }
                return tok;
            })
            .join('');

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d',
        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        w: 'a week',
        ww: '%d weeks',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output)
            ? output(number, withoutSuffix, string, isFuture)
            : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {
        D: 'date',
        dates: 'date',
        date: 'date',
        d: 'day',
        days: 'day',
        day: 'day',
        e: 'weekday',
        weekdays: 'weekday',
        weekday: 'weekday',
        E: 'isoWeekday',
        isoweekdays: 'isoWeekday',
        isoweekday: 'isoWeekday',
        DDD: 'dayOfYear',
        dayofyears: 'dayOfYear',
        dayofyear: 'dayOfYear',
        h: 'hour',
        hours: 'hour',
        hour: 'hour',
        ms: 'millisecond',
        milliseconds: 'millisecond',
        millisecond: 'millisecond',
        m: 'minute',
        minutes: 'minute',
        minute: 'minute',
        M: 'month',
        months: 'month',
        month: 'month',
        Q: 'quarter',
        quarters: 'quarter',
        quarter: 'quarter',
        s: 'second',
        seconds: 'second',
        second: 'second',
        gg: 'weekYear',
        weekyears: 'weekYear',
        weekyear: 'weekYear',
        GG: 'isoWeekYear',
        isoweekyears: 'isoWeekYear',
        isoweekyear: 'isoWeekYear',
        w: 'week',
        weeks: 'week',
        week: 'week',
        W: 'isoWeek',
        isoweeks: 'isoWeek',
        isoweek: 'isoWeek',
        y: 'year',
        years: 'year',
        year: 'year',
    };

    function normalizeUnits(units) {
        return typeof units === 'string'
            ? aliases[units] || aliases[units.toLowerCase()]
            : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {
        date: 9,
        day: 11,
        weekday: 11,
        isoWeekday: 11,
        dayOfYear: 4,
        hour: 13,
        millisecond: 16,
        minute: 14,
        month: 8,
        quarter: 7,
        second: 15,
        weekYear: 1,
        isoWeekYear: 1,
        week: 5,
        isoWeek: 5,
        year: 1,
    };

    function getPrioritizedUnits(unitsObj) {
        var units = [],
            u;
        for (u in unitsObj) {
            if (hasOwnProp(unitsObj, u)) {
                units.push({ unit: u, priority: priorities[u] });
            }
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    var match1 = /\d/, //       0 - 9
        match2 = /\d\d/, //      00 - 99
        match3 = /\d{3}/, //     000 - 999
        match4 = /\d{4}/, //    0000 - 9999
        match6 = /[+-]?\d{6}/, // -999999 - 999999
        match1to2 = /\d\d?/, //       0 - 99
        match3to4 = /\d\d\d\d?/, //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
        match1to3 = /\d{1,3}/, //       0 - 999
        match1to4 = /\d{1,4}/, //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
        matchUnsigned = /\d+/, //       0 - inf
        matchSigned = /[+-]?\d+/, //    -inf - inf
        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchWord =
            /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
        match1to2NoLeadingZero = /^[1-9]\d?/, //         1-99
        match1to2HasZero = /^([1-9]\d|\d)/, //           0-99
        regexes;

    regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex)
            ? regex
            : function (isStrict, localeData) {
                  return isStrict && strictRegex ? strictRegex : regex;
              };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(
            s
                .replace('\\', '')
                .replace(
                    /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
                    function (matched, p1, p2, p3, p4) {
                        return p1 || p2 || p3 || p4;
                    }
                )
        );
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback,
            tokenLen;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        tokenLen = token.length;
        for (i = 0; i < tokenLen; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    var YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,
        WEEK = 7,
        WEEKDAY = 8;

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] =
            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        if (!mom.isValid()) {
            return NaN;
        }

        var d = mom._d,
            isUTC = mom._isUTC;

        switch (unit) {
            case 'Milliseconds':
                return isUTC ? d.getUTCMilliseconds() : d.getMilliseconds();
            case 'Seconds':
                return isUTC ? d.getUTCSeconds() : d.getSeconds();
            case 'Minutes':
                return isUTC ? d.getUTCMinutes() : d.getMinutes();
            case 'Hours':
                return isUTC ? d.getUTCHours() : d.getHours();
            case 'Date':
                return isUTC ? d.getUTCDate() : d.getDate();
            case 'Day':
                return isUTC ? d.getUTCDay() : d.getDay();
            case 'Month':
                return isUTC ? d.getUTCMonth() : d.getMonth();
            case 'FullYear':
                return isUTC ? d.getUTCFullYear() : d.getFullYear();
            default:
                return NaN; // Just in case
        }
    }

    function set$1(mom, unit, value) {
        var d, isUTC, year, month, date;

        if (!mom.isValid() || isNaN(value)) {
            return;
        }

        d = mom._d;
        isUTC = mom._isUTC;

        switch (unit) {
            case 'Milliseconds':
                return void (isUTC
                    ? d.setUTCMilliseconds(value)
                    : d.setMilliseconds(value));
            case 'Seconds':
                return void (isUTC ? d.setUTCSeconds(value) : d.setSeconds(value));
            case 'Minutes':
                return void (isUTC ? d.setUTCMinutes(value) : d.setMinutes(value));
            case 'Hours':
                return void (isUTC ? d.setUTCHours(value) : d.setHours(value));
            case 'Date':
                return void (isUTC ? d.setUTCDate(value) : d.setDate(value));
            // case 'Day': // Not real
            //    return void (isUTC ? d.setUTCDay(value) : d.setDay(value));
            // case 'Month': // Not used because we need to pass two variables
            //     return void (isUTC ? d.setUTCMonth(value) : d.setMonth(value));
            case 'FullYear':
                break; // See below ...
            default:
                return; // Just in case
        }

        year = value;
        month = mom.month();
        date = mom.date();
        date = date === 29 && month === 1 && !isLeapYear(year) ? 28 : date;
        void (isUTC
            ? d.setUTCFullYear(year, month, date)
            : d.setFullYear(year, month, date));
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units),
                i,
                prioritizedLen = prioritized.length;
            for (i = 0; i < prioritizedLen; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1
            ? isLeapYear(year)
                ? 29
                : 28
            : 31 - ((modMonth % 7) % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // PARSING

    addRegexToken('M', match1to2, match1to2NoLeadingZero);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths =
            'January_February_March_April_May_June_July_August_September_October_November_December'.split(
                '_'
            ),
        defaultLocaleMonthsShort =
            'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        defaultMonthsShortRegex = matchWord,
        defaultMonthsRegex = matchWord;

    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months)
                ? this._months
                : this._months['standalone'];
        }
        return isArray(this._months)
            ? this._months[m.month()]
            : this._months[
                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                      ? 'format'
                      : 'standalone'
              ][m.month()];
    }

    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort)
            ? this._monthsShort[m.month()]
            : this._monthsShort[
                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
              ][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i,
            ii,
            mom,
            llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp(
                    '^' + this.months(mom, '').replace('.', '') + '$',
                    'i'
                );
                this._shortMonthsParse[i] = new RegExp(
                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                    'i'
                );
            }
            if (!strict && !this._monthsParse[i]) {
                regex =
                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'MMMM' &&
                this._longMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'MMM' &&
                this._shortMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        var month = value,
            date = mom.date();

        date = date < 29 ? date : Math.min(date, daysInMonth(mom.year(), month));
        void (mom._isUTC
            ? mom._d.setUTCMonth(month, date)
            : mom._d.setMonth(month, date));
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict
                ? this._monthsShortStrictRegex
                : this._monthsShortRegex;
        }
    }

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict
                ? this._monthsStrictRegex
                : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            shortP,
            longP;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortP = regexEscape(this.monthsShort(mom, ''));
            longP = regexEscape(this.months(mom, ''));
            shortPieces.push(shortP);
            longPieces.push(longP);
            mixedPieces.push(longP);
            mixedPieces.push(shortP);
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._monthsShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate(y) {
        var date, args;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear,
            resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear,
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek,
            resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear,
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // PARSING

    addRegexToken('w', match1to2, match1to2NoLeadingZero);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2, match1to2NoLeadingZero);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(
        ['w', 'ww', 'W', 'WW'],
        function (input, week, config, token) {
            week[token.substr(0, 1)] = toInt(input);
        }
    );

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6, // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays =
            'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        defaultWeekdaysRegex = matchWord,
        defaultWeekdaysShortRegex = matchWord,
        defaultWeekdaysMinRegex = matchWord;

    function localeWeekdays(m, format) {
        var weekdays = isArray(this._weekdays)
            ? this._weekdays
            : this._weekdays[
                  m && m !== true && this._weekdays.isFormat.test(format)
                      ? 'format'
                      : 'standalone'
              ];
        return m === true
            ? shiftWeekdays(weekdays, this._week.dow)
            : m
              ? weekdays[m.day()]
              : weekdays;
    }

    function localeWeekdaysShort(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : m
              ? this._weekdaysShort[m.day()]
              : this._weekdaysShort;
    }

    function localeWeekdaysMin(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : m
              ? this._weekdaysMin[m.day()]
              : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._shortWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._minWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
            }
            if (!this._weekdaysParse[i]) {
                regex =
                    '^' +
                    this.weekdays(mom, '') +
                    '|^' +
                    this.weekdaysShort(mom, '') +
                    '|^' +
                    this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'dddd' &&
                this._fullWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'ddd' &&
                this._shortWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'dd' &&
                this._minWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        var day = get(this, 'Day');
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict
                ? this._weekdaysStrictRegex
                : this._weekdaysRegex;
        }
    }

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict
                ? this._weekdaysShortStrictRegex
                : this._weekdaysShortRegex;
        }
    }

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict
                ? this._weekdaysMinStrictRegex
                : this._weekdaysMinRegex;
        }
    }

    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = regexEscape(this.weekdaysMin(mom, ''));
            shortp = regexEscape(this.weekdaysShort(mom, ''));
            longp = regexEscape(this.weekdays(mom, ''));
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._weekdaysShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
        this._weekdaysMinStrictRegex = new RegExp(
            '^(' + minPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return (
            '' +
            hFormat.apply(this) +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return (
            '' +
            this.hours() +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(
                this.hours(),
                this.minutes(),
                lowercase
            );
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2, match1to2HasZero);
    addRegexToken('h', match1to2, match1to2NoLeadingZero);
    addRegexToken('k', match1to2, match1to2NoLeadingZero);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
        // Setting the hour should keep the time, because the user explicitly
        // specified which hour they want. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        getSetHour = makeGetSet('Hours', true);

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse,
    };

    // internal storage for locale config files
    var locales = {},
        localeFamilies = {},
        globalLocale;

    function commonPrefix(arr1, arr2) {
        var i,
            minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return i;
            }
        }
        return minl;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (
                    next &&
                    next.length >= j &&
                    commonPrefix(split, next) >= j - 1
                ) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function isLocaleNameSane(name) {
        // Prevent names that look like filesystem paths, i.e contain '/' or '\'
        // Ensure name is available and function returns boolean
        return !!(name && name.match('^[^/\\\\]*$'));
    }

    function loadLocale(name) {
        var oldLocale = null,
            aliasedRequire;
        // TODO: Find a better way to register and load all the locales in Node
        if (
            locales[name] === undefined &&
            typeof module !== 'undefined' &&
            module &&
            module.exports &&
            isLocaleNameSane(name)
        ) {
            try {
                oldLocale = globalLocale._abbr;
                aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {
                // mark as not found to avoid repeating expensive file require call causing high CPU
                // when trying to find en-US, en_US, en-us for every format call
                locales[name] = null; // null means not found
            }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            } else {
                if (typeof console !== 'undefined' && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn(
                        'Locale ' + key + ' not found. Did you forget to load it?'
                    );
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var locale,
                parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple(
                    'defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                );
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config,
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale,
                tmpLocale,
                parentConfig = baseConfig;

            if (locales[name] != null && locales[name].parentLocale != null) {
                // Update existing child locale in-place to avoid memory-leaks
                locales[name].set(mergeConfigs(locales[name]._config, config));
            } else {
                // MERGE
                tmpLocale = loadLocale(name);
                if (tmpLocale != null) {
                    parentConfig = tmpLocale._config;
                }
                config = mergeConfigs(parentConfig, config);
                if (tmpLocale == null) {
                    // updateLocale is called for creating a new locale
                    // Set abbr so it will have a name (getters return
                    // undefined otherwise).
                    config.abbr = name;
                }
                locale = new Locale(config);
                locale.parentLocale = locales[name];
                locales[name] = locale;
            }

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                    if (name === getSetGlobalLocale()) {
                        getSetGlobalLocale(name);
                    }
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow(m) {
        var overflow,
            a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11
                    ? MONTH
                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                      ? DATE
                      : a[HOUR] < 0 ||
                          a[HOUR] > 24 ||
                          (a[HOUR] === 24 &&
                              (a[MINUTE] !== 0 ||
                                  a[SECOND] !== 0 ||
                                  a[MILLISECOND] !== 0))
                        ? HOUR
                        : a[MINUTE] < 0 || a[MINUTE] > 59
                          ? MINUTE
                          : a[SECOND] < 0 || a[SECOND] > 59
                            ? SECOND
                            : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                              ? MILLISECOND
                              : -1;

            if (
                getParsingFlags(m)._overflowDayOfYear &&
                (overflow < YEAR || overflow > DATE)
            ) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex =
            /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        basicIsoRegex =
            /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
            ['YYYY-DDD', /\d{4}-\d{3}/],
            ['YYYY-MM', /\d{4}-\d\d/, false],
            ['YYYYYYMMDD', /[+-]\d{10}/],
            ['YYYYMMDD', /\d{8}/],
            ['GGGG[W]WWE', /\d{4}W\d{3}/],
            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
            ['YYYYDDD', /\d{7}/],
            ['YYYYMM', /\d{6}/, false],
            ['YYYY', /\d{4}/, false],
        ],
        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
            ['HH:mm', /\d\d:\d\d/],
            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
            ['HHmmss', /\d\d\d\d\d\d/],
            ['HHmm', /\d\d\d\d/],
            ['HH', /\d\d/],
        ],
        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 =
            /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        obsOffsets = {
            UT: 0,
            GMT: 0,
            EDT: -4 * 60,
            EST: -5 * 60,
            CDT: -5 * 60,
            CST: -6 * 60,
            MDT: -6 * 60,
            MST: -7 * 60,
            PDT: -7 * 60,
            PST: -8 * 60,
        };

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime,
            dateFormat,
            timeFormat,
            tzFormat,
            isoDatesLen = isoDates.length,
            isoTimesLen = isoTimes.length;

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDatesLen; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimesLen; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    function extractFromRFC2822Strings(
        yearStr,
        monthStr,
        dayStr,
        hourStr,
        minuteStr,
        secondStr
    ) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10),
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s
            .replace(/\([^()]*\)|[\n\t]/g, ' ')
            .replace(/(\s\s+)/g, ' ')
            .replace(/^\s\s*/, '')
            .replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(
                    parsedInput[0],
                    parsedInput[1],
                    parsedInput[2]
                ).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)),
            parsedArray;
        if (match) {
            parsedArray = extractFromRFC2822Strings(
                match[4],
                match[3],
                match[2],
                match[5],
                match[6],
                match[7]
            );
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        if (config._strict) {
            config._isValid = false;
        } else {
            // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config);
        }
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [
                nowValue.getUTCFullYear(),
                nowValue.getUTCMonth(),
                nowValue.getUTCDate(),
            ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            expectedWeekday,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (
                config._dayOfYear > daysInYear(yearToUse) ||
                config._dayOfYear === 0
            ) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] =
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (
            config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0
        ) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(
            null,
            input
        );
        expectedWeekday = config._useUTC
            ? config._d.getUTCDay()
            : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (
            config._w &&
            typeof config._w.d !== 'undefined' &&
            config._w.d !== expectedWeekday
        ) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(
                w.GG,
                config._a[YEAR],
                weekOfYear(createLocal(), 1, 4).year
            );
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0,
            era,
            tokenLen;

        tokens =
            expandFormat(config._f, config._locale).match(formattingTokens) || [];
        tokenLen = tokens.length;
        for (i = 0; i < tokenLen; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(
                    string.indexOf(parsedInput) + parsedInput.length
                );
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver =
            stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (
            config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0
        ) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(
            config._locale,
            config._a[HOUR],
            config._meridiem
        );

        // handle era
        era = getParsingFlags(config).era;
        if (era !== null) {
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,
            scoreToBeat,
            i,
            currentScore,
            validFormatFound,
            bestFormatIsValid = false,
            configfLen = config._f.length;

        if (configfLen === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < configfLen; i++) {
            currentScore = 0;
            validFormatFound = false;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (isValid(tempConfig)) {
                validFormatFound = true;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (!bestFormatIsValid) {
                if (
                    scoreToBeat == null ||
                    currentScore < scoreToBeat ||
                    validFormatFound
                ) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                    if (validFormatFound) {
                        bestFormatIsValid = true;
                    }
                }
            } else {
                if (currentScore < scoreToBeat) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                }
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i),
            dayOrDate = i.day === undefined ? i.date : i.day;
        config._a = map(
            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
            function (obj) {
                return obj && parseInt(obj, 10);
            }
        );

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (format === true || format === false) {
            strict = format;
            format = undefined;
        }

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (
            (isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)
        ) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        ),
        prototypeMax = deprecate(
            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +new Date();
    };

    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
    ];

    function isDurationValid(m) {
        var key,
            unitHasDecimal = false,
            i,
            orderLen = ordering.length;
        for (key in m) {
            if (
                hasOwnProp(m, key) &&
                !(
                    indexOf.call(ordering, key) !== -1 &&
                    (m[key] == null || !isNaN(m[key]))
                )
            ) {
                return false;
            }
        }

        for (i = 0; i < orderLen; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds =
            +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (
                (dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
            ) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset(),
                sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return (
                sign +
                zeroFill(~~(offset / 60), 2) +
                separator +
                zeroFill(~~offset % 60, 2)
            );
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher),
            chunk,
            parts,
            minutes;

        if (matches === null) {
            return null;
        }

        chunk = matches[matches.length - 1] || [];
        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff =
                (isMoment(input) || isDate(input)
                    ? input.valueOf()
                    : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset());
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(
                        this,
                        createDuration(input - offset, 'm'),
                        1,
                        false
                    );
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {},
            other;

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted =
                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoRegex =
            /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months,
            };
        } else if (isNumber(input) || !isNaN(+input)) {
            duration = {};
            if (key) {
                duration[key] = +input;
            } else {
                duration.milliseconds = +input;
            }
        } else if ((match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
            };
        } else if ((match = isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign),
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (
            typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)
        ) {
            diffRes = momentsDifference(
                createLocal(duration.from),
                createLocal(duration.to)
            );

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
            ret._isValid = input._isValid;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months =
            other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(
                    name,
                    'moment().' +
                        name +
                        '(period, number) is deprecated. Please use moment().' +
                        name +
                        '(number, period). ' +
                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                );
                tmp = val;
                val = period;
                period = tmp;
            }

            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add'),
        subtract = createAdder(-1, 'subtract');

    function isString(input) {
        return typeof input === 'string' || input instanceof String;
    }

    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
    function isMomentInput(input) {
        return (
            isMoment(input) ||
            isDate(input) ||
            isString(input) ||
            isNumber(input) ||
            isNumberOrStringArray(input) ||
            isMomentInputObject(input) ||
            input === null ||
            input === undefined
        );
    }

    function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'years',
                'year',
                'y',
                'months',
                'month',
                'M',
                'days',
                'day',
                'd',
                'dates',
                'date',
                'D',
                'hours',
                'hour',
                'h',
                'minutes',
                'minute',
                'm',
                'seconds',
                'second',
                's',
                'milliseconds',
                'millisecond',
                'ms',
            ],
            i,
            property,
            propertyLen = properties.length;

        for (i = 0; i < propertyLen; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function isNumberOrStringArray(input) {
        var arrayTest = isArray(input),
            dataTypeTest = false;
        if (arrayTest) {
            dataTypeTest =
                input.filter(function (item) {
                    return !isNumber(item) && isString(input);
                }).length === 0;
        }
        return arrayTest && dataTypeTest;
    }

    function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'sameDay',
                'nextDay',
                'lastDay',
                'nextWeek',
                'lastWeek',
                'sameElse',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6
            ? 'sameElse'
            : diff < -1
              ? 'lastWeek'
              : diff < 0
                ? 'lastDay'
                : diff < 1
                  ? 'sameDay'
                  : diff < 2
                    ? 'nextDay'
                    : diff < 7
                      ? 'nextWeek'
                      : 'sameElse';
    }

    function calendar$1(time, formats) {
        // Support for single parameter, formats only overload to the calendar function
        if (arguments.length === 1) {
            if (!arguments[0]) {
                time = undefined;
                formats = undefined;
            } else if (isMomentInput(arguments[0])) {
                time = arguments[0];
                formats = undefined;
            } else if (isCalendarSpec(arguments[0])) {
                formats = arguments[0];
                time = undefined;
            }
        }
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse',
            output =
                formats &&
                (isFunction(formats[format])
                    ? formats[format].call(this, now)
                    : formats[format]);

        return this.format(
            output || this.localeData().calendar(format, this, createLocal(now))
        );
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (
            (inclusivity[0] === '('
                ? this.isAfter(localFrom, units)
                : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')'
                ? this.isBefore(localTo, units)
                : !this.isAfter(localTo, units))
        );
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return (
                this.clone().startOf(units).valueOf() <= inputMs &&
                inputMs <= this.clone().endOf(units).valueOf()
            );
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
        }
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true,
            m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(
                m,
                utc
                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                    .toISOString()
                    .replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(
            m,
            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
        );
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment',
            zone = '',
            prefix,
            year,
            datetime,
            suffix;
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        prefix = '[' + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
        datetime = '-MM-DD[T]HH:mm:ss.SSS';
        suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc()
                ? hooks.defaultFormatUtc
                : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ to: this, from: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ from: this, to: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    var MS_PER_SECOND = 1000,
        MS_PER_MINUTE = 60 * MS_PER_SECOND,
        MS_PER_HOUR = 60 * MS_PER_MINUTE,
        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return ((dividend % divisor) + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(
                    this.year(),
                    this.month() - (this.month() % 3),
                    1
                );
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - this.weekday()
                );
                break;
            case 'isoWeek':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - (this.isoWeekday() - 1)
                );
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(
                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                    MS_PER_HOUR
                );
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time =
                    startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3) + 3,
                        1
                    ) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday() + 7
                    ) - 1;
                break;
            case 'isoWeek':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1) + 7
                    ) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time +=
                    MS_PER_HOUR -
                    mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    ) -
                    1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [
            m.year(),
            m.month(),
            m.date(),
            m.hour(),
            m.minute(),
            m.second(),
            m.millisecond(),
        ];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds(),
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict,
        };
    }

    addFormatToken('N', 0, 0, 'eraAbbr');
    addFormatToken('NN', 0, 0, 'eraAbbr');
    addFormatToken('NNN', 0, 0, 'eraAbbr');
    addFormatToken('NNNN', 0, 0, 'eraName');
    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
    addFormatToken('y', ['yy', 2], 0, 'eraYear');
    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

    addRegexToken('N', matchEraAbbr);
    addRegexToken('NN', matchEraAbbr);
    addRegexToken('NNN', matchEraAbbr);
    addRegexToken('NNNN', matchEraName);
    addRegexToken('NNNNN', matchEraNarrow);

    addParseToken(
        ['N', 'NN', 'NNN', 'NNNN', 'NNNNN'],
        function (input, array, config, token) {
            var era = config._locale.erasParse(input, token, config._strict);
            if (era) {
                getParsingFlags(config).era = era;
            } else {
                getParsingFlags(config).invalidEra = input;
            }
        }
    );

    addRegexToken('y', matchUnsigned);
    addRegexToken('yy', matchUnsigned);
    addRegexToken('yyy', matchUnsigned);
    addRegexToken('yyyy', matchUnsigned);
    addRegexToken('yo', matchEraYearOrdinal);

    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
    addParseToken(['yo'], function (input, array, config, token) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
            match = input.match(config._locale._eraYearOrdinalRegex);
        }

        if (config._locale.eraYearOrdinalParse) {
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
            array[YEAR] = parseInt(input, 10);
        }
    });

    function localeEras(m, format) {
        var i,
            l,
            date,
            eras = this._eras || getLocale('en')._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
            switch (typeof eras[i].since) {
                case 'string':
                    // truncate time
                    date = hooks(eras[i].since).startOf('day');
                    eras[i].since = date.valueOf();
                    break;
            }

            switch (typeof eras[i].until) {
                case 'undefined':
                    eras[i].until = +Infinity;
                    break;
                case 'string':
                    // truncate time
                    date = hooks(eras[i].until).startOf('day').valueOf();
                    eras[i].until = date.valueOf();
                    break;
            }
        }
        return eras;
    }

    function localeErasParse(eraName, format, strict) {
        var i,
            l,
            eras = this.eras(),
            name,
            abbr,
            narrow;
        eraName = eraName.toUpperCase();

        for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.toUpperCase();
            abbr = eras[i].abbr.toUpperCase();
            narrow = eras[i].narrow.toUpperCase();

            if (strict) {
                switch (format) {
                    case 'N':
                    case 'NN':
                    case 'NNN':
                        if (abbr === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNN':
                        if (name === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNNN':
                        if (narrow === eraName) {
                            return eras[i];
                        }
                        break;
                }
            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                return eras[i];
            }
        }
    }

    function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? +1 : -1;
        if (year === undefined) {
            return hooks(era.since).year();
        } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
        }
    }

    function getEraName() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].name;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].name;
            }
        }

        return '';
    }

    function getEraNarrow() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].narrow;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].narrow;
            }
        }

        return '';
    }

    function getEraAbbr() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].abbr;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].abbr;
            }
        }

        return '';
    }

    function getEraYear() {
        var i,
            l,
            dir,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1;

            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (
                (eras[i].since <= val && val <= eras[i].until) ||
                (eras[i].until <= val && val <= eras[i].since)
            ) {
                return (
                    (this.year() - hooks(eras[i].since).year()) * dir +
                    eras[i].offset
                );
            }
        }

        return this.year();
    }

    function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNameRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
    }

    function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, '_erasAbbrRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }

    function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNarrowRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }

    function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
    }

    function matchEraName(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
    }

    function matchEraNarrow(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
    }

    function matchEraYearOrdinal(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
    }

    function computeErasParse() {
        var abbrPieces = [],
            namePieces = [],
            narrowPieces = [],
            mixedPieces = [],
            i,
            l,
            erasName,
            erasAbbr,
            erasNarrow,
            eras = this.eras();

        for (i = 0, l = eras.length; i < l; ++i) {
            erasName = regexEscape(eras[i].name);
            erasAbbr = regexEscape(eras[i].abbr);
            erasNarrow = regexEscape(eras[i].narrow);

            namePieces.push(erasName);
            abbrPieces.push(erasAbbr);
            narrowPieces.push(erasNarrow);
            mixedPieces.push(erasName);
            mixedPieces.push(erasAbbr);
            mixedPieces.push(erasNarrow);
        }

        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
        this._erasNarrowRegex = new RegExp(
            '^(' + narrowPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(
        ['gggg', 'ggggg', 'GGGG', 'GGGGG'],
        function (input, week, config, token) {
            week[token.substr(0, 2)] = toInt(input);
        }
    );

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.week(),
            this.weekday() + this.localeData()._week.dow,
            this.localeData()._week.dow,
            this.localeData()._week.doy
        );
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.isoWeek(),
            this.isoWeekday(),
            1,
            4
        );
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null
            ? Math.ceil((this.month() + 1) / 3)
            : this.month((input - 1) * 3 + (this.month() % 3));
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // PARSING

    addRegexToken('D', match1to2, match1to2NoLeadingZero);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict
            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
            : locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear =
            Math.round(
                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
            ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // PARSING

    addRegexToken('m', match1to2, match1to2HasZero);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // PARSING

    addRegexToken('s', match1to2, match1to2HasZero);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token, getSetMillisecond;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }

    getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'Moment<' + this.format() + '>';
        };
    }
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
        'dates accessor is deprecated. Use date instead.',
        getSetDayOfMonth
    );
    proto.months = deprecate(
        'months accessor is deprecated. Use month instead',
        getSetMonth
    );
    proto.years = deprecate(
        'years accessor is deprecated. Use year instead',
        getSetYear
    );
    proto.zone = deprecate(
        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
        getSetZone
    );
    proto.isDSTShifted = deprecate(
        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
        isDaylightSavingTimeShifted
    );

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;

    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale(),
            utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i,
            out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0,
            i,
            out = [];

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: +Infinity,
                offset: 1,
                name: 'Anno Domini',
                narrow: 'AD',
                abbr: 'AD',
            },
            {
                since: '0000-12-31',
                until: -Infinity,
                offset: 1,
                name: 'Before Christ',
                narrow: 'BC',
                abbr: 'BC',
            },
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output =
                    toInt((number % 100) / 10) === 1
                        ? 'th'
                        : b === 1
                          ? 'st'
                          : b === 2
                            ? 'nd'
                            : b === 3
                              ? 'rd'
                              : 'th';
            return number + output;
        },
    });

    // Side effect imports

    hooks.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        getSetGlobalLocale
    );
    hooks.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        getLocale
    );

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds,
            days = this._days,
            months = this._months,
            data = this._data,
            seconds,
            minutes,
            hours,
            years,
            monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (
            !(
                (milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0)
            )
        ) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return (days * 4800) / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return (months * 146097) / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days,
            months,
            milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':
                    return months;
                case 'quarter':
                    return months / 3;
                case 'year':
                    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms'),
        asSeconds = makeAs('s'),
        asMinutes = makeAs('m'),
        asHours = makeAs('h'),
        asDays = makeAs('d'),
        asWeeks = makeAs('w'),
        asMonths = makeAs('M'),
        asQuarters = makeAs('Q'),
        asYears = makeAs('y'),
        valueOf$1 = asMilliseconds;

    function clone$1() {
        return createDuration(this);
    }

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds'),
        seconds = makeGetter('seconds'),
        minutes = makeGetter('minutes'),
        hours = makeGetter('hours'),
        days = makeGetter('days'),
        months = makeGetter('months'),
        years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round,
        thresholds = {
            ss: 44, // a few seconds to seconds
            s: 45, // seconds to minute
            m: 45, // minutes to hour
            h: 22, // hours to day
            d: 26, // days to month/week
            w: null, // weeks to month
            M: 11, // months to year
        };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
        var duration = createDuration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            weeks = round(duration.as('w')),
            years = round(duration.as('y')),
            a =
                (seconds <= thresholds.ss && ['s', seconds]) ||
                (seconds < thresholds.s && ['ss', seconds]) ||
                (minutes <= 1 && ['m']) ||
                (minutes < thresholds.m && ['mm', minutes]) ||
                (hours <= 1 && ['h']) ||
                (hours < thresholds.h && ['hh', hours]) ||
                (days <= 1 && ['d']) ||
                (days < thresholds.d && ['dd', days]);

        if (thresholds.w != null) {
            a =
                a ||
                (weeks <= 1 && ['w']) ||
                (weeks < thresholds.w && ['ww', weeks]);
        }
        a = a ||
            (months <= 1 && ['M']) ||
            (months < thresholds.M && ['MM', months]) ||
            (years <= 1 && ['y']) || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var withSuffix = false,
            th = thresholds,
            locale,
            output;

        if (typeof argWithSuffix === 'object') {
            argThresholds = argWithSuffix;
            argWithSuffix = false;
        }
        if (typeof argWithSuffix === 'boolean') {
            withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === 'object') {
            th = Object.assign({}, thresholds, argThresholds);
            if (argThresholds.s != null && argThresholds.ss == null) {
                th.ss = argThresholds.s - 1;
            }
        }

        locale = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000,
            days = abs$1(this._days),
            months = abs$1(this._months),
            minutes,
            hours,
            years,
            s,
            total = this.asSeconds(),
            totalSign,
            ymSign,
            daysSign,
            hmsSign;

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

        totalSign = total < 0 ? '-' : '';
        ymSign = sign(this._months) !== sign(total) ? '-' : '';
        daysSign = sign(this._days) !== sign(total) ? '-' : '';
        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return (
            totalSign +
            'P' +
            (years ? ymSign + years + 'Y' : '') +
            (months ? ymSign + months + 'M' : '') +
            (days ? daysSign + days + 'D' : '') +
            (hours || minutes || seconds ? 'T' : '') +
            (hours ? hmsSign + hours + 'H' : '') +
            (minutes ? hmsSign + minutes + 'M' : '') +
            (seconds ? hmsSign + s + 'S' : '')
        );
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    proto$2.toIsoString = deprecate(
        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
        toISOString$1
    );
    proto$2.lang = lang;

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    //! moment.js

    hooks.version = '2.30.1';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD', // <input type="date" />
        TIME: 'HH:mm', // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW', // <input type="week" />
        MONTH: 'YYYY-MM', // <input type="month" />
    };

    return hooks;

})));

},{}],"views/pages/profile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("./../../App"));
var _litHtml = require("lit-html");
var _Router = require("./../../Router");
var _Auth = _interopRequireDefault(require("./../../Auth"));
var _Utils = _interopRequireDefault(require("./../../Utils"));
var _moment = _interopRequireDefault(require("moment"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
class ProfileView {
  init() {
    console.log('ProfileView.init');
    document.title = 'Profile';
    this.render();
    _Utils.default.pageIntroAnim();
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      <va-app-header user=\"", "\"></va-app-header>\n      <div class=\"profile-container\">\n        <!-- Left Section -->\n        <div class=\"profile-left\">\n          ", "\n          <h2>", " ", "</h2>\n          <p>", "</p>\n          ", "\n          <p>\n            Updated:\n            ", "\n          </p>\n         <sl-button size=\"large\" pill=\"\" class=\"edit-btn hydrated\" type=\"primary\" \n            class=\"edit-button\"\n            @click=", "\n           >EDIT PROFILE</sl-button>\n        </div>\n\n        <!-- Right Section -->\n        <div class=\"profile-right\">\n          <h1>Hi ", "</h1>\n          <p>All about you</p>\n        </div>\n      </div>\n    "])), JSON.stringify(_Auth.default.currentUser), _Auth.default.currentUser && _Auth.default.currentUser.avatar ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n                <sl-avatar\n                  image=\"", "/images/", "\"\n                ></sl-avatar>\n              "])), _App.default.apiBase, _Auth.default.currentUser.avatar) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<sl-avatar></sl-avatar>"]))), _Auth.default.currentUser.firstName, _Auth.default.currentUser.lastName, _Auth.default.currentUser.email, _Auth.default.currentUser.bio ? (0, _litHtml.html)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n                <h3>Bio</h3>\n                <p>", "</p>\n              "])), _Auth.default.currentUser.bio) : (0, _litHtml.html)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral([""]))), (0, _moment.default)(_Auth.default.currentUser.updatedAt).format('D MMMM YYYY @ h:mm a'), () => (0, _Router.gotoRoute)('/editProfile'), _Auth.default.currentUser.firstName);
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new ProfileView();
},{"./../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","./../../Router":"Router.js","./../../Auth":"Auth.js","./../../Utils":"Utils.js","moment":"../node_modules/moment/moment.js"}],"UserAPI.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("./App"));
var _Auth = _interopRequireDefault(require("./Auth"));
var _Toast = _interopRequireDefault(require("./Toast"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class UserAPI {
  async updateUser(userId, userData) {
    let dataType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'form';
    // validate
    if (!userId || !userData) return;
    let responseHeader;

    // form data
    if (dataType == 'form') {
      // fetch response header normal (form data)
      responseHeader = {
        method: "PUT",
        headers: {
          "Authorization": "Bearer ".concat(localStorage.accessToken)
        },
        body: userData
      };

      // json data
    } else if (dataType == 'json') {
      responseHeader = {
        method: "PUT",
        headers: {
          "Authorization": "Bearer ".concat(localStorage.accessToken),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      };
    }

    // make fetch request to backend
    const response = await fetch("".concat(_App.default.apiBase, "/user/").concat(userId), responseHeader);

    // if response not ok
    if (!response.ok) {
      // console log error
      const err = await response.json();
      if (err) console.log(err);
      // throw error (exit this function)      
      throw new Error('Problem updating user');
    }

    // convert response payload into json - store as data
    const data = await response.json();

    // return data
    return data;
  }
  async getUser(userId) {
    // validate
    if (!userId) return;

    // fetch the json data
    const response = await fetch("".concat(_App.default.apiBase, "/user/").concat(userId), {
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken)
      }
    });

    // if response not ok
    if (!response.ok) {
      // console log error
      const err = await response.json();
      if (err) console.log(err);
      // throw error (exit this function)      
      throw new Error('Problem getting user');
    }

    // convert response payload into json - store as data
    const data = await response.json();

    // return data
    return data;
  }
  async addFavProduct(productId) {
    // validate
    if (!productId) return;

    // fetch the json data
    const response = await fetch("".concat(_App.default.apiBase, "/user/addFavProduct"), {
      method: "PUT",
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken),
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        productId: productId
      })
    });

    // if response not ok
    if (!response.ok) {
      // console log error
      const err = await response.json();
      if (err) console.log(err);
      // throw error (exit this function)      
      throw new Error('Problem adding product to favourites');
    }

    // convert response payload into json - store as data
    const data = await response.json();

    // return data
    return data;
  }
}
var _default = exports.default = new UserAPI();
},{"./App":"App.js","./Auth":"Auth.js","./Toast":"Toast.js"}],"views/pages/editProfile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("./../../App"));
var _litHtml = require("lit-html");
var _Router = require("./../../Router");
var _Auth = _interopRequireDefault(require("./../../Auth"));
var _Utils = _interopRequireDefault(require("./../../Utils"));
var _UserAPI = _interopRequireDefault(require("./../../UserAPI"));
var _Toast = _interopRequireDefault(require("../../Toast"));
var _moment = _interopRequireDefault(require("moment"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
class EditProfileView {
  init() {
    console.log('EditProfileView.init');
    document.title = 'Edit Profile';
    this.user = _Auth.default.currentUser;
    this.render();
    _Utils.default.pageIntroAnim();
    this.getUser();
  }
  async getUser() {
    try {
      this.user = await _UserAPI.default.getUser(_Auth.default.currentUser._id);
      this.render();
    } catch (err) {
      _Toast.default.show(err, 'error');
    }
  }
  firstUpdated() {
    super.firstUpdated();
    this.navActiveLinks();
    console.log('Header initialized with title:', this.title);
  }
  navActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = this.shadowRoot.querySelectorAll('.app-top-nav a, .app-side-menu-items a');
    navLinks.forEach(navLink => {
      if (navLink.href.slice(-1) == '#') return;
      if (navLink.pathname === currentPath) {
        navLink.classList.add('active');
      }
    });
  }
  hamburgerClick() {
    const appMenu = document.querySelector('.app-side-menu'); // Use document instead of shadowRoot
    if (appMenu) {
      appMenu.show();
    } else {
      console.error('Drawer element not found!');
    }
  }
  menuClick(e) {
    e.preventDefault();
    const pathname = e.target.closest('a').pathname;
    const appSideMenu = this.shadowRoot.querySelector('.app-side-menu');
    // hide appMenu
    appSideMenu.hide();
    appSideMenu.addEventListener('sl-after-hide', () => {
      // goto route after menu is hidden
      (0, _Router.gotoRoute)(pathname);
    });
  }
  handleTitleClick(path, e) {
    e.preventDefault();
    (0, _Router.gotoRoute)(path);
  }
  handleChevronClick(e) {
    e.stopPropagation();
    const details = e.target.closest('sl-details');
    if (details) {
      details.open = !details.open;
    }
  }
  async updateProfileSubmitHandler(e) {
    e.preventDefault();
    const formData = e.detail.formData;
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.setAttribute('loading', '');
    try {
      const updatedUser = await _UserAPI.default.updateUser(_Auth.default.currentUser._id, formData);
      delete updatedUser.password;
      this.user = updatedUser;
      _Auth.default.currentUser = updatedUser;
      _Toast.default.show('Profile updated successfully');

      // Wait brief moment for state to update
      setTimeout(() => {
        (0, _Router.gotoRoute)('/profile');
      }, 300);
    } catch (err) {
      console.error('Profile update error:', err);
      _Toast.default.show(err, 'error');
    }
    submitBtn.removeAttribute('loading');
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    <style>\n    .signin-background {\n        background-image: url('/images/login-background.png');\n        background-size: cover;\n        background-position: center;\n        background-repeat: no-repeat;\n        height: 100vh;\n        width: 100%;\n        position: fixed;\n        top: 0;\n        left: 0;\n        z-index: -1;\n    }\n    \n    .page-content {\n        display: flex;\n        width: 100%;\n        height: 100vh;\n        /* Full viewport height */\n        margin: 0;\n        padding: 0;\n    }\n    \n    .signon2-container {\n        background-color: rgba(5, 166, 209, 0.8);\n        backdrop-filter: blur(10px);\n        -webkit-backdrop-filter: blur(10px);\n        width: 45%;\n        height: 100%;\n        position: fixed;\n        left: 0;\n        top: 0;\n        margin: 0;\n        padding: 0;\n    }\n    \n    .welcome-box {\n        width: 55%;\n        height: 100%;\n        position: fixed;\n        right: 0;\n        top: 50%;\n        transform: translateY(-50%);\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        flex-direction: column;\n        color: #fff;\n    }\n    \n    .submit-btn::part(base) {\n        background-color: #F4D35E;\n        border-color: #F4D35E;\n        color: #000000;\n        padding-bottom: 1em;\n        font-family: inherit;\n    }\n    \n    .submit-btn::part(base):hover {\n        background-color: #e5c654;\n        border-color: #e5c654;\n    }\n    \n    .submit-btn::part(base):active {\n        background-color: #d6b84a;\n        border-color: #d6b84a;\n    }\n    \n    h2 {\n        text-align: left;\n        width: 238.61px;\n    }\n    \n    p {\n        width: 100%;\n        margin-top: 1em;\n    }\n    \n    .app-side-menu-logo {\n        width: 150px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        top: 1em;\n        display: block;\n    }\n    \n    .hamburger-btn::part(base) {\n        color: #fff;\n        position: fixed;\n        top: 1em;\n        left: 1em;\n        z-index: 100;\n    }\n    \n    .app-top-nav {\n        display: flex;\n        height: 100%;\n        align-items: center;\n    }\n    \n    .app-top-nav a {\n        display: inline-block;\n        padding: .8em;\n        text-decoration: none;\n        color: #fff;\n    }\n    \n    .user-menu a {\n        text-decoration: none;\n        color: #fff;\n    }\n    \n    .app-side-menu-items a {\n        display: block;\n        padding: 0.5em;\n        text-decoration: none;\n        font-size: 1.3em;\n        color: var(--app-header-txt-color);\n        padding-bottom: 0.5em;\n    }\n    \n    .home-logo {\n        cursor: pointer;\n        width: 150px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        position: absolute;\n        top: 30px;\n        left: 42%;\n        z-index: 2;\n    }\n    \n    .header-logo {\n        cursor: pointer;\n        width: 120px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        position: absolute;\n        top: 40px;\n        left: 21.5em;\n        z-index: 2;\n    }\n    /* active nav links */\n    \n    .app-top-nav a.active,\n    .app-side-menu-items a.active {\n        font-weight: bold;\n    }\n    \n    sl-details::part(summary) {\n        transition: color 0.3s ease;\n    }\n    \n    sl-details::part(summary):hover {\n        color: var(--sl-color-primary-600);\n        cursor: pointer;\n    }\n    \n    .menu-expand {\n        transition: color 0.3s ease;\n        text-decoration: none;\n    }\n    \n    .menu-expand:hover {\n        color: var(--sl-color-primary-600);\n        padding-left: 1.5em;\n        transition: all 0.5s ease;\n    }\n    /* right side menu */\n    \n    .right-side-menu {\n        --base-txt-color: #2F1E1F;\n    }\n    \n    .menu-expand {\n        font-size: 1.3em;\n        margin-left: 1em;\n        margin-top: 0.5em;\n    }\n    \n    sl-drawer::part(label) {\n        padding: 0.6em;\n    }\n    \n    .custom-file-upload {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        font-weight: bold;\n        padding: 6px 12px;\n        cursor: pointer;\n        background-color: #FFFFFF;\n        border-radius: 30px;\n        color: rgb(0, 0, 0);\n        width: 100%;\n        height: 47px;\n        width: 100%;\n    }\n    \n    .custom-file-upload:hover {\n        background-color: #e2e8f0;\n    }\n    \n    .avatar-image {\n        margin-bottom: 1em;\n        width: 150px;\n        /* Set width */\n        height: 150px;\n        /* Fix height typo */\n        --size: 150px;\n        /* Shoelace avatar custom property */\n    }\n    \n    .avatar-image::part(base) {\n        width: 100%;\n        height: 100%;\n        object-fit: cover;\n    }\n    \n    .user-menu {\n        position: absolute;\n        top: 1em;\n        right: 2em;\n        z-index: 9;\n    }\n    \n    .right-side-menu {\n        --base-txt-color: #2F1E1F;\n    }\n</style>\n\n<div class=\"signin-background\"></div>\n<sl-dropdown class=\"user-menu\">\n    <a slot=\"trigger\" href=\"#\" @click=\"", "\">\n        <sl-avatar style=\"--size: 40px;\" image=", "></sl-avatar> ", "\n    </a>\n    <sl-menu class=\"right-side-menu\">\n        <sl-menu-item @click=\"", "\">Profile</sl-menu-item>\n        <sl-menu-item @click=\"", "\">Edit Profile</sl-menu-item>\n        <sl-menu-item @click=\"", "\">Sign Out</sl-menu-item>\n    </sl-menu>\n</sl-dropdown>\n<sl-icon-button class=\"hamburger-btn\" name=\"list\" @click=\"", "\" style=\"font-size: 2em;\"></sl-icon-button>\n<sl-drawer class=\"app-side-menu\" placement=\"left\">\n    <div slot=\"label\">\n        <a href=\"/\" @click=\"", "\"><img class=\"app-side-menu-logo\" src=\"/images/logo-mindline-trimmed-no-wording-clr.png\"></a>\n    </div>\n    <nav class=\"app-side-menu-items\">\n        <a href=\"/\" @click=\"", "\">Home</a>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Mental Health</span>\n            </div>\n            <a class=\"menu-expand\" href=\"\">Stress</a>\n            <a class=\"menu-expand\" href=\"\">Anxiety</a>\n            <a class=\"menu-expand\" href=\"\">Depression</a>\n        </sl-details>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Mindfulness</span>\n            </div>\n            <a class=\"menu-expand\" href=\"\">Meditation</a>\n            <a class=\"menu-expand\" href=\"\">Breathing</a>\n            <a class=\"menu-expand\" href=\"\">Motivation</a>\n        </sl-details>\n        <sl-details>\n            <div slot=\"summary\" class=\"summary-content\">\n                <span class=\"summary-title\" @click=\"", "\">Resources</span>\n            </div>\n            <a class=\"menu-expand\" href=\"\">Support</a>\n            <a class=\"menu-expand\" href=\"\">Services</a>\n            <a class=\"menu-expand\" href=\"\">Guides</a>\n        </sl-details>\n\n        <a href=\"/favouriteLines\" @click=\"", "\">Bookmarks</a>\n        <a href=\"/about\" @click=\"", "\">About</a>\n        <a href=\"/profile\" @click=\"", "\">Profile</a>\n\n        <hr style=\"color: #fff width:10%\">\n\n        <sl-details summary=\"Privacy\">\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n        </sl-details>\n\n        <sl-details summary=\"T&Cs\">\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n        </sl-details>\n\n        <sl-details summary=\"Socials\">\n            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n        </sl-details>\n\n        <hr style=\"color: #fff width:10%\">\n\n        <a href=\"mailto:hello@mindline.telstra.com.au\">hello@mindline.telstra.com.au</a>\n        <a href=\"tel:1800 034 034\">1800 034 034</a>\n\n\n    </nav>\n</sl-drawer>\n\n<div class=\"page-content page-centered\">\n    ", "\n    </div>\n    "])), e => e.preventDefault(), this.user && this.user.avatar ? "".concat(_App.default.apiBase, "/images/").concat(this.user.avatar) : '', this.user && this.user.firstName, () => (0, _Router.gotoRoute)('/profile'), () => (0, _Router.gotoRoute)('/editProfile'), () => _Auth.default.signOut(), this.hamburgerClick, _Router.anchorRoute, _Router.anchorRoute, e => this.handleTitleClick('/mentalHealth', e), e => this.handleTitleClick('/mindfulness', e), e => this.handleTitleClick('/resources', e), _Router.anchorRoute, _Router.anchorRoute, _Router.anchorRoute, this.user == null ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n    <sl-spinner></sl-spinner>\n    "]))) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    <div class=\"signon2-container\">\n        <a @click=\"", "\"><img class=\"header-logo\" src=\"/images/mindline-white-logo.png\"></a>\n        <div class=\"signinup-box\">\n\n\n            <sl-avatar style=\"--size: 200px; margin-bottom: 1em;\" image=\"", "\">\n            </sl-avatar>\n\n            <h1>My Details</h1>\n            <p>Updated: ", "</p>\n            <sl-form class=\"page-form\" @sl-submit=", ">\n                <div class=\"input-group\">\n                    <sl-input size=\"large\" pill style=\"padding-bottom: 1em;\" type=\"text\" name=\"firstName\" value=\"", "\" placeholder=\"First Name\"></sl-input>\n                </div>\n                <div class=\"input-group\">\n                    <sl-input size=\"large\" pill style=\"padding-bottom: 1em;\" type=\"text\" name=\"lastName\" value=\"", "\" placeholder=\"Last Name\"></sl-input>\n                </div>\n                <div class=\"input-group\">\n                    <sl-input size=\"large\" pill style=\"padding-bottom: 1em;\" type=\"text\" name=\"email\" value=\"", "\" placeholder=\"Email Address\"></sl-input>\n                </div>\n\n                <div class=\"input-group\">\n\n                    <label for=\"file-upload\" class=\"custom-file-upload\">\n                        ", "\n                    </label>\n                    <input id=\"file-upload\" type=\"file\" name=\"avatar\" style=\"display: none;\" />\n                </div>\n                <br>\n\n                <sl-button size=\"large\" pill type=\"primary\" style=\"width: 100%;\" class=\"submit-btn\" submit>Update Profile</sl-button>\n\n            </sl-form>\n        </div>\n        "])), () => (0, _Router.gotoRoute)('/'), _Auth.default.currentUser.avatar ? "".concat(_App.default.apiBase, "/images/").concat(_Auth.default.currentUser.avatar) : '', (0, _moment.default)(_Auth.default.currentUser.updatedAt).format('D MMMM YYYY @ h:mm a'), this.updateProfileSubmitHandler.bind(this), this.user.firstName, this.user.lastName, this.user.email, this.user.avatar ? 'Change Avatar' : 'Upload Avatar'));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new EditProfileView();
},{"./../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","./../../Router":"Router.js","./../../Auth":"Auth.js","./../../Utils":"Utils.js","./../../UserAPI":"UserAPI.js","../../Toast":"Toast.js","moment":"../node_modules/moment/moment.js"}],"views/pages/guide.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _UserAPI = _interopRequireDefault(require("./../../UserAPI"));
var _Toast = _interopRequireDefault(require("../../Toast"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
class GuideView {
  init() {
    var _Auth$currentUser;
    document.title = 'Guide';
    this.render();
    _Utils.default.pageIntroAnim();
    if ((_Auth$currentUser = _Auth.default.currentUser) !== null && _Auth$currentUser !== void 0 && _Auth$currentUser.newUser) {
      this.updateCurrentUser();
    }
  }
  async updateCurrentUser() {
    try {
      const updatedUser = await _UserAPI.default.updateUser(_Auth.default.currentUser._id, {
        newUser: false
      });
      _Auth.default.currentUser = updatedUser;
      console.log('user updated');
    } catch (err) {
      _Toast.default.show(err, 'error');
    }
  }
  // Animation - from https://shoelace.style/components/animation/
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      ", "\n      <div class=\"page-content calign\">     \n      <br>\n      <p></p>   \n      <h2 class=\"--base-txt-color\">Welcome ", "!</h2>\n        <p>Here's a quick tour of Mindline AU</p>\n\n        <div class=\"guide-step\">\n          <h4>Search for information about mental health.</h4>\n          <img src=\"images/guide-page-young-lady-holding-mobile-w-bg-360.png\" class=\"responsive-img\" >\n        </div>\n\n        <div class=\"guide-step\">\n          <h4>Save articles, audio and video to Bookmarks.</h4>\n          <img src=\"images/guide-page--young-lady-scratching-head-360.png\" class=\"responsive-img\">\n        </div>\n\n        <div class=\"guide-step\">\n          <h4>Find resources and other options for assistance and support.</h4>\n          <img src=\"images/guide-page-happy-young-lady-on-yellow-bg-360.png\" class=\"responsive-img\" >\n        </div>\n\n        <sl-animation name=\"jello\" duration=\"2000\" play iterations=\"10\"><sl-button type=\"primary\" @click=", ">Okay got it!</sl-button></sl-animation>\n        \n        <p></p>\n\n      </div>      \n    "])), _Auth.default.isLoggedIn() ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<va-app-header user=", "></va-app-header>"])), JSON.stringify(_Auth.default.currentUser)) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<va-public-header></va-public-header>"]))), _Auth.default.currentUser.firstName, () => (0, _Router.gotoRoute)('/'));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new GuideView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js","./../../UserAPI":"UserAPI.js","../../Toast":"Toast.js"}],"views/pages/mentalHealth.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
// Image adapted from Canva – Accessed on December 18, 2024
class mentalHealthView {
  async init() {
    document.title = 'Mental Health';
    await this.render();
    _Utils.default.pageIntroAnim();
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      ", "\n      \n      <div class=\"page-content page-centered\"> \n        <section class=\"banner mental-health\">\n        <div class=\"grphics\">\n          <div class=\"banner-content\"> \n            <div class=\"banner-text\"> \n              <h1>Mental Health</h1>\n              <h2>Because it Matters</h2>\n              </div>\n           <picture>\n              <source srcset=\"images/mental-health/mental-health-hero-360.webp\" media=\"(max-width: 480px)\">\n              <source srcset=\"images/mental-health/mental-health-hero-768.webp\" media=\"(max-width: 768px)\">\n              <source srcset=\"images/mental-health/mental-health-hero-1024.webp\" media=\"(min-width: 769px)\">\n              <img id=\"heroImage\" src=\"images/mental-health/mental-health-hero-1024.webp\" alt=\"Mental Health banner image of a boy meditating\">\n            </picture>  \n          </div>\n        </section>\n  \n        <section class=\"nav-page\">\n          <h3>Ways to deal with...</h3>\n          <div class=\"button-group\">\n          \n\n            <sl-button class=\"stress-page\" type=\"primary\" size=\"large\" @click=", ">Stress</sl-button>\n            <sl-button class=\"anxiety-page\" type=\"primary\" size=\"large\" @click=", ">Anxiety</sl-button>\n            <sl-button class=\"depression-page\" type=\"primary\" size=\"large\" @click=", ">Depression</sl-button>\n\n            </div>\n       </section>\n\n      </div>  \n    "])), _Auth.default.isLoggedIn() ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<va-app-header user=", "></va-app-header>"])), JSON.stringify(_Auth.default.currentUser)) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<va-public-header></va-public-header>"]))), () => (0, _Router.gotoRoute)('/mentalHealthExpanded?tab=stress'), () => (0, _Router.gotoRoute)('/mentalHealthExpanded?tab=anxiety'), () => (0, _Router.gotoRoute)('/mentalHealthExpanded?tab=depression'));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new mentalHealthView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js"}],"views/pages/mentalHealthExpanded.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
// Image adapted from Canva – Accessed on December 18, 2024
class mentalHealthExpandedView {
  constructor() {
    this.articles = new Map(); // Initialize Map
  }
  async fetchArticle(id) {
    try {
      console.log('Fetching article:', id);
      const response = await fetch("".concat(_App.default.apiBase, "/article/").concat(id));
      if (!response.ok) {
        throw new Error("HTTP error! status: ".concat(response.status));
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      // Store the article id in localStorage
      localStorage.setItem("article-".concat(id), data._id);
      return data;
    } catch (err) {
      console.error('Fetch error:', err);
      return null;
    }
  }
  async init() {
    document.title = 'Mental Health Expanded';
    this.articleIds = {
      // these are the articles for the first tab group "stress" //
      why: '677dcb34a6cdde9083351d76',
      deal: '677dcc1c4aea9c354dbd3103',
      signs: '677e60b05c759160209d1111',
      practices: '679af473ccbfff59ce1a142e',
      triggers: '679af4330b0bab1805167cae',
      seek: '679af494ccbfff59ce1a1430',
      questions: '679af4b9ccbfff59ce1a1432'

      // these are the articles for the second tab group "anxiety" //

      // these are te articles fr the thrid tab group "Depression" //
    };
    try {
      await Promise.all(Object.entries(this.articleIds).filter(_ref => {
        let [_, id] = _ref;
        return id;
      }).map(async _ref2 => {
        let [key, id] = _ref2;
        const article = await this.fetchArticle(id);
        if (article) {
          this.articles.set(key, article);
          console.log("Set ".concat(key, " article:"), article);
        }
      }));
      this.render();
      _Utils.default.pageIntroAnim();
      this.setupDialogHandlers();
    } catch (err) {
      console.error('Init error:', err);
    }
  }
  async bookmarkArticle(e, id) {
    e.preventDefault();
    e.stopPropagation();
    console.log("Current user:", _Auth.default.currentUser);
    console.log("Using token:", _Auth.default.currentUser.token);
    if (!_Auth.default.currentUser || !_Auth.default.currentUser.token) {
      alert("You must be logged in to bookmark articles!");
      return;
    }
    try {
      const response = await fetch("".concat(_App.default.apiBase, "/bookmark/").concat(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(_Auth.default.currentUser.token)
        }
      });
      const result = await response.json();
      if (response.ok) {
        alert("Article bookmarked!");
      } else {
        const errMsg = result.message || result.error || "Bookmark failed";
        console.error("Bookmark failed:", errMsg);
        alert(errMsg);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      alert("An error occurred while bookmarking the article.");
    }
  }
  setupDialogHandlers() {
    document.querySelectorAll('.dialog-width').forEach(dialog => {
      dialog.addEventListener('sl-request-close', () => {
        dialog.hide();
      });
      dialog.addEventListener('sl-after-hide', () => {
        const closeButton = dialog.querySelector('sl-button[slot="footer"]');
        if (closeButton) {
          closeButton.addEventListener('click', e => {
            e.stopPropagation();
            dialog.hide();
          });
        }
      });
    });
  }
  openDialog(e) {
    e.stopPropagation();

    // Find the closest sl-dialog inside the clicked element
    const dialog = e.currentTarget.querySelector('sl-dialog');
    if (dialog) {
      dialog.show();
    }
  }
  closeDialog(e) {
    e.stopPropagation();

    // Get the closest sl-dialog to the button clicked
    const dialog = e.target.closest('sl-dialog');
    if (dialog) dialog.hide();
  }
  render() {
    var _this$articles$get, _this$articles$get2, _this$articles$get3, _this$articles$get5, _this$articles$get6, _this$articles$get7, _this$articles$get8, _this$articles$get9, _this$articles$get10, _this$articles$get12, _this$articles$get13, _this$articles$get14, _this$articles$get15, _this$articles$get16, _this$articles$get17, _this$articles$get18, _this$articles$get19, _this$articles$get20, _this$articles$get21, _this$articles$get22, _this$articles$get23, _this$articles$get24, _this$articles$get25, _this$articles$get26, _this$articles$get27, _this$articles$get28, _this$articles$get29, _this$articles$get30, _this$articles$get31, _this$articles$get32, _this$articles$get33, _this$articles$get34, _this$articles$get35, _this$articles$get36, _this$articles$get37, _this$articles$get38, _this$articles$get39, _this$articles$get40, _this$articles$get41, _this$articles$get42, _this$articles$get43, _this$articles$get44, _this$articles$get45, _this$articles$get46, _this$articles$get47, _this$articles$get48, _this$articles$get49, _this$articles$get50, _this$articles$get51, _this$articles$get52, _this$articles$get53, _this$articles$get54, _this$articles$get55, _this$articles$get56, _this$articles$get57, _this$articles$get58, _this$articles$get59, _this$articles$get60, _this$articles$get61, _this$articles$get62, _this$articles$get63, _this$articles$get64, _this$articles$get65;
    console.log('Auth.currentUser:', _Auth.default.currentUser);
    // Get tab from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab') || 'stress'; // default to stress if no tab specified
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n   \n\n    ", "\n      <a href=\"/\" @click=\"", "\"><img class=\"header-logo\" src=\"/images/logo/logo-mindline-no-wording-white-125.png\"></a>      \n      \n      <div class=\"page-content\"> \n        <section class=\"banner mental-health-expanded\">\n        \n        <div class=\"banner-content\">     \n          <h1>Mental Health</h1>\n          <div id=\"bento-tabs\">\n            <sl-tab-group ?active=\"", "\">\n              <sl-tab slot=\"nav\" panel=\"stress\" ?active=\"", "\">Stress</sl-tab>\n              <sl-tab slot=\"nav\" panel=\"anxiety\" ?active=\"", "\">Anxiety</sl-tab>\n              <sl-tab slot=\"nav\" panel=\"depression\" ?active=\"", "\">Depression</sl-tab>\n\n              <!-- this is the first tab content of the menal health page -->\n              <sl-tab-panel name=\"stress\">\n                \n       \n                <div class=\"stress\">\n                \n                  <div class=\"why\" @click=", ">\n                    <img src=\"/images/why-box.png\" class=\"why-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                      ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" \n                        @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                    </sl-dialog>\n                  </div>\n\n                  <div class=\"deal\" @click=", ">\n                    <img src=\"/images/stress-box.png\" class=\"stress-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-full.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"signs\" @click=", ">\n                    <img src=\"/images/signs-box.png\" class=\"signs-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" \n                    @click=", ">Bookmark</sl-button>\n                    \n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                \n                  <div class=\"triggers\" @click=", ">\n                    <img src=\"/images/triggers-box.png\" class=\"triggers-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"practices\" @click=", ">\n                    <img src=\"/images/practices-box.png\" class=\"practices-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                  <div class=\"seek\" @click=", ">\n                  <img src=\"/images/seek-box.png\" class=\"seek-img\">\n                 <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"questions\" @click=", ">\n                  <img src=\"/images/questions-box.png\" class=\"questions-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                </div>\n\n\n\n              </sl-tab-panel>\n\n               <!-- this is the second tab content of the menal health page -->\n              <sl-tab-panel name=\"anxiety\">\n                <div class=\"stress\">\n                \n                  <div class=\"why\" @click=", ">\n                    <img src=\"/images/\" class=\"why-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                      ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                    </sl-dialog>\n                  </div>\n\n                  <div class=\"deal\" @click=", ">\n                    <img src=\"/images/\" class=\"stress-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-full.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"signs\" @click=", ">\n                    <img src=\"/images/\" class=\"signs-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                \n                  <div class=\"triggers\" @click=", ">\n                    <img src=\"/images/\" class=\"triggers-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"practices\" @click=", ">\n                    <img src=\"/images/\" class=\"practices-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                  <div class=\"seek\" @click=", ">\n                  <img src=\"/images/\" class=\"seek-img\">\n                 <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"questions\" @click=", ">\n                  <img src=\"/images/\" class=\"questions-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                </div>\n              </sl-tab-panel>\n\n               <!-- this is the third tab content of the menal health page -->\n              <sl-tab-panel name=\"depression\">\n                <div class=\"stress\">\n                \n                  <div class=\"why\" @click=", ">\n                    <img src=\"/images/why-box.png\" class=\"why-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                      ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                    </sl-dialog>\n                  </div>\n\n                  <div class=\"deal\" @click=", ">\n                    <img src=\"/images/stress-box.png\" class=\"stress-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-full.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"signs\" @click=", ">\n                    <img src=\"/images/signs-box.png\" class=\"signs-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                \n                  <div class=\"triggers\" @click=", ">\n                    <img src=\"/images/triggers-box.png\" class=\"triggers-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"practices\" @click=", ">\n                    <img src=\"/images/practices-box.png\" class=\"practices-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                  <div class=\"seek\" @click=", ">\n                  <img src=\"/images/seek-box.png\" class=\"seek-img\">\n                 <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"questions\" @click=", ">\n                  <img src=\"/images/questions-box.png\" class=\"questions-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                </div>\n              </sl-tab-panel>\n\n            </sl-tab-group>\n          </div>\n        </div>\n        </section>\n          \n      \n      </div>  \n    "])), _Auth.default.isLoggedIn() ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<va-app-header user=", "></va-app-header>"])), JSON.stringify(_Auth.default.currentUser)) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<va-public-header></va-public-header>"]))), _Router.anchorRoute, activeTab, activeTab === 'stress', activeTab === 'anxiety', activeTab === 'depression', this.openDialog, ((_this$articles$get = this.articles.get('why')) === null || _this$articles$get === void 0 ? void 0 : _this$articles$get.title) || 'Loading...', (_this$articles$get2 = this.articles.get('why')) === null || _this$articles$get2 === void 0 ? void 0 : _this$articles$get2.title, ((_this$articles$get3 = this.articles.get('why')) === null || _this$articles$get3 === void 0 ? void 0 : _this$articles$get3.bodyContent) || 'Loading content...', e => {
      var _this$articles$get4;
      const articleId = (_this$articles$get4 = this.articles.get('why')) === null || _this$articles$get4 === void 0 ? void 0 : _this$articles$get4._id;
      console.log("Bookmarking article ID:", articleId);
      this.bookmarkArticle(e, articleId);
    }, this.closeDialog, this.openDialog, ((_this$articles$get5 = this.articles.get('deal')) === null || _this$articles$get5 === void 0 ? void 0 : _this$articles$get5.title) || 'Loading...', (_this$articles$get6 = this.articles.get('deal')) === null || _this$articles$get6 === void 0 ? void 0 : _this$articles$get6.title, ((_this$articles$get7 = this.articles.get('deal')) === null || _this$articles$get7 === void 0 ? void 0 : _this$articles$get7.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get8 = this.articles.get('signs')) === null || _this$articles$get8 === void 0 ? void 0 : _this$articles$get8.title) || 'Loading...', (_this$articles$get9 = this.articles.get('signs')) === null || _this$articles$get9 === void 0 ? void 0 : _this$articles$get9.title, ((_this$articles$get10 = this.articles.get('signs')) === null || _this$articles$get10 === void 0 ? void 0 : _this$articles$get10.bodyContent) || 'Loading content...', e => {
      var _this$articles$get11;
      const articleId = (_this$articles$get11 = this.articles.get('signs')) === null || _this$articles$get11 === void 0 ? void 0 : _this$articles$get11._id;
      console.log("Bookmarking article ID:", articleId);
      this.bookmarkArticle(e, articleId);
    }, this.closeDialog, this.openDialog, ((_this$articles$get12 = this.articles.get('triggers')) === null || _this$articles$get12 === void 0 ? void 0 : _this$articles$get12.title) || 'Loading...', (_this$articles$get13 = this.articles.get('triggers')) === null || _this$articles$get13 === void 0 ? void 0 : _this$articles$get13.title, ((_this$articles$get14 = this.articles.get('triggers')) === null || _this$articles$get14 === void 0 ? void 0 : _this$articles$get14.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get15 = this.articles.get('practices')) === null || _this$articles$get15 === void 0 ? void 0 : _this$articles$get15.title) || 'Loading...', (_this$articles$get16 = this.articles.get('practices')) === null || _this$articles$get16 === void 0 ? void 0 : _this$articles$get16.title, ((_this$articles$get17 = this.articles.get('practices')) === null || _this$articles$get17 === void 0 ? void 0 : _this$articles$get17.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get18 = this.articles.get('seek')) === null || _this$articles$get18 === void 0 ? void 0 : _this$articles$get18.title) || 'Loading...', (_this$articles$get19 = this.articles.get('seek')) === null || _this$articles$get19 === void 0 ? void 0 : _this$articles$get19.title, ((_this$articles$get20 = this.articles.get('seek')) === null || _this$articles$get20 === void 0 ? void 0 : _this$articles$get20.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get21 = this.articles.get('questions')) === null || _this$articles$get21 === void 0 ? void 0 : _this$articles$get21.title) || 'Loading...', (_this$articles$get22 = this.articles.get('questions')) === null || _this$articles$get22 === void 0 ? void 0 : _this$articles$get22.title, ((_this$articles$get23 = this.articles.get('questions')) === null || _this$articles$get23 === void 0 ? void 0 : _this$articles$get23.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get24 = this.articles.get('why')) === null || _this$articles$get24 === void 0 ? void 0 : _this$articles$get24.title) || 'Loading...', (_this$articles$get25 = this.articles.get('why')) === null || _this$articles$get25 === void 0 ? void 0 : _this$articles$get25.title, ((_this$articles$get26 = this.articles.get('why')) === null || _this$articles$get26 === void 0 ? void 0 : _this$articles$get26.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get27 = this.articles.get('deal')) === null || _this$articles$get27 === void 0 ? void 0 : _this$articles$get27.title) || 'Loading...', (_this$articles$get28 = this.articles.get('deal')) === null || _this$articles$get28 === void 0 ? void 0 : _this$articles$get28.title, ((_this$articles$get29 = this.articles.get('deal')) === null || _this$articles$get29 === void 0 ? void 0 : _this$articles$get29.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get30 = this.articles.get('signs')) === null || _this$articles$get30 === void 0 ? void 0 : _this$articles$get30.title) || 'Loading...', (_this$articles$get31 = this.articles.get('signs')) === null || _this$articles$get31 === void 0 ? void 0 : _this$articles$get31.title, ((_this$articles$get32 = this.articles.get('signs')) === null || _this$articles$get32 === void 0 ? void 0 : _this$articles$get32.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get33 = this.articles.get('triggers')) === null || _this$articles$get33 === void 0 ? void 0 : _this$articles$get33.title) || 'Loading...', (_this$articles$get34 = this.articles.get('triggers')) === null || _this$articles$get34 === void 0 ? void 0 : _this$articles$get34.title, ((_this$articles$get35 = this.articles.get('triggers')) === null || _this$articles$get35 === void 0 ? void 0 : _this$articles$get35.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get36 = this.articles.get('practices')) === null || _this$articles$get36 === void 0 ? void 0 : _this$articles$get36.title) || 'Loading...', (_this$articles$get37 = this.articles.get('practices')) === null || _this$articles$get37 === void 0 ? void 0 : _this$articles$get37.title, ((_this$articles$get38 = this.articles.get('practices')) === null || _this$articles$get38 === void 0 ? void 0 : _this$articles$get38.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get39 = this.articles.get('seek')) === null || _this$articles$get39 === void 0 ? void 0 : _this$articles$get39.title) || 'Loading...', (_this$articles$get40 = this.articles.get('seek')) === null || _this$articles$get40 === void 0 ? void 0 : _this$articles$get40.title, ((_this$articles$get41 = this.articles.get('seek')) === null || _this$articles$get41 === void 0 ? void 0 : _this$articles$get41.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get42 = this.articles.get('questions')) === null || _this$articles$get42 === void 0 ? void 0 : _this$articles$get42.title) || 'Loading...', (_this$articles$get43 = this.articles.get('questions')) === null || _this$articles$get43 === void 0 ? void 0 : _this$articles$get43.title, ((_this$articles$get44 = this.articles.get('questions')) === null || _this$articles$get44 === void 0 ? void 0 : _this$articles$get44.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get45 = this.articles.get('why')) === null || _this$articles$get45 === void 0 ? void 0 : _this$articles$get45.title) || 'Loading...', (_this$articles$get46 = this.articles.get('why')) === null || _this$articles$get46 === void 0 ? void 0 : _this$articles$get46.title, ((_this$articles$get47 = this.articles.get('why')) === null || _this$articles$get47 === void 0 ? void 0 : _this$articles$get47.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get48 = this.articles.get('deal')) === null || _this$articles$get48 === void 0 ? void 0 : _this$articles$get48.title) || 'Loading...', (_this$articles$get49 = this.articles.get('deal')) === null || _this$articles$get49 === void 0 ? void 0 : _this$articles$get49.title, ((_this$articles$get50 = this.articles.get('deal')) === null || _this$articles$get50 === void 0 ? void 0 : _this$articles$get50.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get51 = this.articles.get('signs')) === null || _this$articles$get51 === void 0 ? void 0 : _this$articles$get51.title) || 'Loading...', (_this$articles$get52 = this.articles.get('signs')) === null || _this$articles$get52 === void 0 ? void 0 : _this$articles$get52.title, ((_this$articles$get53 = this.articles.get('signs')) === null || _this$articles$get53 === void 0 ? void 0 : _this$articles$get53.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get54 = this.articles.get('triggers')) === null || _this$articles$get54 === void 0 ? void 0 : _this$articles$get54.title) || 'Loading...', (_this$articles$get55 = this.articles.get('triggers')) === null || _this$articles$get55 === void 0 ? void 0 : _this$articles$get55.title, ((_this$articles$get56 = this.articles.get('triggers')) === null || _this$articles$get56 === void 0 ? void 0 : _this$articles$get56.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get57 = this.articles.get('practices')) === null || _this$articles$get57 === void 0 ? void 0 : _this$articles$get57.title) || 'Loading...', (_this$articles$get58 = this.articles.get('practices')) === null || _this$articles$get58 === void 0 ? void 0 : _this$articles$get58.title, ((_this$articles$get59 = this.articles.get('practices')) === null || _this$articles$get59 === void 0 ? void 0 : _this$articles$get59.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get60 = this.articles.get('seek')) === null || _this$articles$get60 === void 0 ? void 0 : _this$articles$get60.title) || 'Loading...', (_this$articles$get61 = this.articles.get('seek')) === null || _this$articles$get61 === void 0 ? void 0 : _this$articles$get61.title, ((_this$articles$get62 = this.articles.get('seek')) === null || _this$articles$get62 === void 0 ? void 0 : _this$articles$get62.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get63 = this.articles.get('questions')) === null || _this$articles$get63 === void 0 ? void 0 : _this$articles$get63.title) || 'Loading...', (_this$articles$get64 = this.articles.get('questions')) === null || _this$articles$get64 === void 0 ? void 0 : _this$articles$get64.title, ((_this$articles$get65 = this.articles.get('questions')) === null || _this$articles$get65 === void 0 ? void 0 : _this$articles$get65.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog);
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new mentalHealthExpandedView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js"}],"views/pages/mindfulness.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
// Image adapted from Canva – Accessed on December 18, 2024
class mindfulnessView {
  init() {
    document.title = 'Mindfulness';
    this.render();
    _Utils.default.pageIntroAnim();
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      ", "\n\n      <div class=\"page-content page-centered\">        \n        <section class=\"banner mindfulness\"> \n        <div class=\"banner-content\"> \n         <div class=\"banner-text\"> \n          <h1>Mindfulness</h1> \n          <h2 class=\"quote\">Be Present</br> Be Peaceful</br> Be You</h2>\n          </div>\n          <picture>\n              <source srcset=\"images/mindfulness/mindfulness-hero-image-360.webp\" media=\"(max-width: 480px)\">\n              <source srcset=\"images/mindfulness/mindfulness-hero-image-500.webp\" media=\"(max-width: 768px)\">\n              <source srcset=\"images/mindfulness/mindfulness-hero-image-1024.webp\" media=\"(min-width: 769px)\">\n              <img id=\"heroImage\" src=\"images/mindfulness/mindfulness-hero-1024.webp\" alt=\"Mental Health banner image of a girl meditating\">\n            </picture>\n          </div>\n        </section>\n        <section class=\"nav-page\">\n        <h3>Ways to Practice...</h3>\n          <div class=\"button-group\">\n          <sl-button class=\"meditation-page\" @click=", ">Meditation</sl-button>\n          <sl-button class=\"breathing-page\" @click=", ">Breathing</sl-button>\n          <sl-button class=\"motivation-page\" @click=", ">Motivation</sl-button>\n          </div>\n       </section>\n      </div>            \n           \n    "])), _Auth.default.isLoggedIn() ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<va-app-header user=", "></va-app-header>"])), JSON.stringify(_Auth.default.currentUser)) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<va-public-header></va-public-header>"]))), () => (0, _Router.gotoRoute)('/mindfulnessExpanded?tab=meditation'), () => (0, _Router.gotoRoute)('/mindfulnessExpanded?tab=breathing'), () => (0, _Router.gotoRoute)('/mindfulnessExpanded?tab=motivation'));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new mindfulnessView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js"}],"views/pages/mindfulnessExpanded.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
// Image adapted from Canva – Accessed on December 18, 2024
class mindfulnessExpandedView {
  constructor() {
    this.articles = new Map(); // Initialize Map
  }
  async fetchArticle(id) {
    try {
      console.log('Fetching article:', id);
      const response = await fetch("".concat(_App.default.apiBase, "/article/").concat(id));
      if (!response.ok) {
        throw new Error("HTTP error! status: ".concat(response.status));
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      // Store the article id in localStorage
      localStorage.setItem("article-".concat(id), data._id);
      return data;
    } catch (err) {
      console.error('Fetch error:', err);
      return null;
    }
  }
  async init() {
    document.title = 'Mindfulness Expanded';
    this.articleIds = {
      // these are the articles for the first tab group "stress" //
      why: '677dcb34a6cdde9083351d76',
      deal: '677dcc1c4aea9c354dbd3103',
      signs: '677e60b05c759160209d1111',
      practices: '679af473ccbfff59ce1a142e',
      triggers: '679af4330b0bab1805167cae',
      seek: '679af494ccbfff59ce1a1430',
      questions: '679af4b9ccbfff59ce1a1432'

      // these are the articles for the second tab group "anxiety" //

      // these are te articles fr the thrid tab group "Depression" //
    };
    try {
      await Promise.all(Object.entries(this.articleIds).filter(_ref => {
        let [_, id] = _ref;
        return id;
      }).map(async _ref2 => {
        let [key, id] = _ref2;
        const article = await this.fetchArticle(id);
        if (article) {
          this.articles.set(key, article);
          console.log("Set ".concat(key, " article:"), article);
        }
      }));
      this.render();
      _Utils.default.pageIntroAnim();
      this.setupDialogHandlers();
    } catch (err) {
      console.error('Init error:', err);
    }
  }
  async bookmarkArticle(e, id) {
    e.preventDefault();
    e.stopPropagation();
    console.log("Current user:", _Auth.default.currentUser);
    console.log("Using token:", _Auth.default.currentUser.token);
    if (!_Auth.default.currentUser || !_Auth.default.currentUser.token) {
      alert("You must be logged in to bookmark articles!");
      return;
    }
    try {
      const response = await fetch("".concat(_App.default.apiBase, "/bookmark/").concat(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(_Auth.default.currentUser.token)
        }
      });
      const result = await response.json();
      if (response.ok) {
        alert("Article bookmarked!");
      } else {
        const errMsg = result.message || result.error || "Bookmark failed";
        console.error("Bookmark failed:", errMsg);
        alert(errMsg);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      alert("An error occurred while bookmarking the article.");
    }
  }
  setupDialogHandlers() {
    document.querySelectorAll('.dialog-width').forEach(dialog => {
      dialog.addEventListener('sl-request-close', () => {
        dialog.hide();
      });
      dialog.addEventListener('sl-after-hide', () => {
        const closeButton = dialog.querySelector('sl-button[slot="footer"]');
        if (closeButton) {
          closeButton.addEventListener('click', e => {
            e.stopPropagation();
            dialog.hide();
          });
        }
      });
    });
  }
  openDialog(e) {
    e.stopPropagation();

    // Find the closest sl-dialog inside the clicked element
    const dialog = e.currentTarget.querySelector('sl-dialog');
    if (dialog) {
      dialog.show();
    }
  }
  closeDialog(e) {
    e.stopPropagation();

    // Get the closest sl-dialog to the button clicked
    const dialog = e.target.closest('sl-dialog');
    if (dialog) dialog.hide();
  }
  render() {
    var _this$articles$get, _this$articles$get2, _this$articles$get3, _this$articles$get5, _this$articles$get6, _this$articles$get7, _this$articles$get8, _this$articles$get9, _this$articles$get10, _this$articles$get11, _this$articles$get12, _this$articles$get13, _this$articles$get14, _this$articles$get15, _this$articles$get16, _this$articles$get17, _this$articles$get18, _this$articles$get19, _this$articles$get20, _this$articles$get21, _this$articles$get22, _this$articles$get23, _this$articles$get24, _this$articles$get25, _this$articles$get26, _this$articles$get27, _this$articles$get28, _this$articles$get29, _this$articles$get30, _this$articles$get31, _this$articles$get32, _this$articles$get33, _this$articles$get34, _this$articles$get35, _this$articles$get36, _this$articles$get37, _this$articles$get38, _this$articles$get39, _this$articles$get40, _this$articles$get41, _this$articles$get42, _this$articles$get43, _this$articles$get44, _this$articles$get45, _this$articles$get46, _this$articles$get47, _this$articles$get48, _this$articles$get49, _this$articles$get50, _this$articles$get51, _this$articles$get52, _this$articles$get53, _this$articles$get54, _this$articles$get55, _this$articles$get56, _this$articles$get57, _this$articles$get58, _this$articles$get59, _this$articles$get60, _this$articles$get61, _this$articles$get62, _this$articles$get63, _this$articles$get64;
    console.log('Auth.currentUser:', _Auth.default.currentUser);
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab') || 'meditation'; // default to stress if no tab specified
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    <style>\n      .banner.mental-health-expanded {\n      height: 100vh; \n      background-color: #30AAF5;\n      /*padding-top: 15%;*/\n    }\n\n    .banner-content {\n      height: 80%;\n      width: 60%;\n    }\n\n    sl-tab-group::part(base) {\n      display: flex;\n      align-items: center;\n      gap: 32px;\n    \n    }\n\n  \n    sl-tab-group::part(nav) {\n    border-bottom: none;\n  }\n\n  sl-tab-group::part(active-tab-indicator) {\n    display: none !important;\n    opacity: 0;\n    visibility: hidden;\n  }\n\n  sl-tab-group::part(tabs) {\n    border-bottom: none;\n  }\n\n  sl-tab::part(base) {\n    border-bottom: none;\n    margin: 0 12px;\n    padding: 12px 24px;\n    font-size: 18px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  }\n\n  sl-tab:not([active])::part(base):hover {\n  font-size: 20px;\n}\n\nsl-tab[active]::part(base) {\n  font-size: 20px;\n  color: #F3C728 !important;\n}\n\n    #bento-tabs {\n      width: 100%;\n      display: flex;\n      justify-content: center;\n      align-items: left;\n    }\n    \n    h1 {\n      margin-bottom: 50px !important;\n      width: 50% !important;\n      margin-left: 13% !important;\n    }\n    \n\n    .why {\n      grid-area: why;\n      width: 193px;\n      height: 193px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .deal {\n      grid-area: deal;\n      width: 361px;\n      height: 193px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .signs {\n      grid-area: signs;\n      width: 193px;\n      height: 411px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .triggers {\n      grid-area: triggers;\n      width: 361px;\n      height: 193px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .practices {\n      grid-area: practices;\n      width: 193px;\n      height: 411px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      margin-left: 168px;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .seek {\n      grid-area: seek;\n      width: 361px;\n      height: 193px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .questions {\n      grid-area: questions;\n      width: 193px;\n      height: 193px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      margin-left: 385px;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n\n.stress {\n  display: grid;\n  grid-template-areas: \n    \"why deal signs\"\n    \"triggers practices practices\"\n    \"seek questions questions\";\n  grid-template-columns: 193px 361px 193px; /* Explicit column widths */\n  grid-template-rows: 193px 193px 193px; /* Fixed row heights */\n  gap: 24px; /* Minimal gap */\n  align-items: start; /* Align items to top */\n  margin-top: 8px;\n}\n\n\n    p {\n      color: #000000;\n    }\n\n    .bookmark, .bookmark-full {\n    position: absolute;\n    width: auto;\n    height: 30px;\n    top: -0.5px;\n    right: 35px;\n    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.3));\n  }\n    \n\n  sl-dialog::part(base) {\n    color: #000000;\n  }\n\n  sl-dialog::part(overlay) {\n    backdrop-filter: blur(8px);\n    background-color: rgba(0, 0, 0, 0.5);\n  }\n\n\n  sl-dialog::part(panel) {\n    border-radius: 35px;\n    z-index: 1000;\n  }\n\n  sl-dialog::part(close-button) {\n    display: none;\n  }\n\n    .why-img {\n      width: 400px; /* Much larger than parent */\n      height: 400px; /* Much larger than parent */\n      position: absolute;\n      z-index: 0;\n      object-fit: cover;\n      transform: translate(-50%, -50%);\n      top: 60%;\n      left: 60%;\n      border-radius: 35px;\n      transition: transform 0.3s ease;\n    }\n\n    .why:hover .why-img {\n      transform: translate(-50%, -50%) scale(1.1);\n    }\n\n    .why p {\n      width: 30%;\n      font-size: 20px;\n      font-weight: 300;\n      margin-left: 10%;\n      z-index: 1;\n    }\n\n    </style>\n\n    \n\n    ", "\n      <a href=\"/\" @click=\"", "\"><img class=\"header-logo\" src=\"/images/logo/logo-mindline-no-wording-white-125.png\"></a>      \n      <div class=\"page-content\"> \n        <section class=\"banner mental-health-expanded\">\n        \n        <div class=\"banner-content\">     \n          <h1>Mindfulness</h1>\n          <div id=\"bento-tabs\">\n            <sl-tab-group ?active=\"", "\">\n              <sl-tab slot=\"nav\" panel=\"meditation\" ?active=\"", "\">Meditation</sl-tab>\n              <sl-tab slot=\"nav\" panel=\"breathing\" ?active=\"", "\">Breathing</sl-tab>\n              <sl-tab slot=\"nav\" panel=\"motivation\" ?active=\"", "\">Motivation</sl-tab>\n\n              <!-- this is the first tab content of the menal health page -->\n              <sl-tab-panel name=\"meditation\">\n                \n       \n                <div class=\"stress\">\n                \n                  <div class=\"why\" @click=", ">\n                    <img src=\"/images/why-box.png\" class=\"why-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                      ", "\n                      <sl-button \n                        slot=\"footer\" \n                        variant=\"primary\" \n                        @click=", ">\n                                              Bookmark\n                      </sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                    </sl-dialog>\n                  </div>\n\n                  <div class=\"deal\" @click=", ">\n                    <img src=\"/images/stress-box.png\" class=\"stress-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-full.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"signs\" @click=", ">\n                    <img src=\"/images/signs-box.png\" class=\"signs-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                \n                  <div class=\"triggers\" @click=", ">\n                    <img src=\"/images/triggers-box.png\" class=\"triggers-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"practices\" @click=", ">\n                    <img src=\"/images/practices-box.png\" class=\"practices-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                  <div class=\"seek\" @click=", ">\n                  <img src=\"/images/seek-box.png\" class=\"seek-img\">\n                 <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"questions\" @click=", ">\n                  <img src=\"/images/questions-box.png\" class=\"questions-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                </div>\n\n\n\n              </sl-tab-panel>\n\n               <!-- this is the second tab content of the menal health page -->\n              <sl-tab-panel name=\"breathing\">\n                <div class=\"stress\">\n                \n                  <div class=\"why\" @click=", ">\n                    <img src=\"/images/\" class=\"why-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                      ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                    </sl-dialog>\n                  </div>\n\n                  <div class=\"deal\" @click=", ">\n                    <img src=\"/images/\" class=\"stress-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-full.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"signs\" @click=", ">\n                    <img src=\"/images/\" class=\"signs-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                \n                  <div class=\"triggers\" @click=", ">\n                    <img src=\"/images/\" class=\"triggers-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"practices\" @click=", ">\n                    <img src=\"/images/\" class=\"practices-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                  <div class=\"seek\" @click=", ">\n                  <img src=\"/images/\" class=\"seek-img\">\n                 <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"questions\" @click=", ">\n                  <img src=\"/images/\" class=\"questions-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                </div>\n              </sl-tab-panel>\n\n               <!-- this is the third tab content of the menal health page -->\n              <sl-tab-panel name=\"motivation\">\n                <div class=\"stress\">\n                \n                  <div class=\"why\" @click=", ">\n                    <img src=\"/images/why-box.png\" class=\"why-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                      ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                    </sl-dialog>\n                  </div>\n\n                  <div class=\"deal\" @click=", ">\n                    <img src=\"/images/stress-box.png\" class=\"stress-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-full.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"signs\" @click=", ">\n                    <img src=\"/images/signs-box.png\" class=\"signs-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                \n                  <div class=\"triggers\" @click=", ">\n                    <img src=\"/images/triggers-box.png\" class=\"triggers-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"practices\" @click=", ">\n                    <img src=\"/images/practices-box.png\" class=\"practices-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                  <div class=\"seek\" @click=", ">\n                  <img src=\"/images/seek-box.png\" class=\"seek-img\">\n                 <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"questions\" @click=", ">\n                  <img src=\"/images/questions-box.png\" class=\"questions-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                </div>\n              </sl-tab-panel>\n\n            </sl-tab-group>\n          </div>\n        </div>\n        </section>\n          \n      \n      </div>  \n    "])), _Auth.default.isLoggedIn() ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<va-app-header user=", "></va-app-header>"])), JSON.stringify(_Auth.default.currentUser)) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<va-public-header></va-public-header>"]))), _Router.anchorRoute, activeTab, activeTab === 'meditation', activeTab === 'breathing', activeTab === 'motivation', this.openDialog, ((_this$articles$get = this.articles.get('why')) === null || _this$articles$get === void 0 ? void 0 : _this$articles$get.title) || 'Loading...', (_this$articles$get2 = this.articles.get('why')) === null || _this$articles$get2 === void 0 ? void 0 : _this$articles$get2.title, ((_this$articles$get3 = this.articles.get('why')) === null || _this$articles$get3 === void 0 ? void 0 : _this$articles$get3.bodyContent) || 'Loading content...', e => {
      var _this$articles$get4;
      const articleId = (_this$articles$get4 = this.articles.get('why')) === null || _this$articles$get4 === void 0 ? void 0 : _this$articles$get4._id;
      console.log("Bookmarking article ID:", articleId);
      this.bookmarkArticle(e, articleId);
    }, this.closeDialog, this.openDialog, ((_this$articles$get5 = this.articles.get('deal')) === null || _this$articles$get5 === void 0 ? void 0 : _this$articles$get5.title) || 'Loading...', (_this$articles$get6 = this.articles.get('deal')) === null || _this$articles$get6 === void 0 ? void 0 : _this$articles$get6.title, ((_this$articles$get7 = this.articles.get('deal')) === null || _this$articles$get7 === void 0 ? void 0 : _this$articles$get7.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get8 = this.articles.get('signs')) === null || _this$articles$get8 === void 0 ? void 0 : _this$articles$get8.title) || 'Loading...', (_this$articles$get9 = this.articles.get('signs')) === null || _this$articles$get9 === void 0 ? void 0 : _this$articles$get9.title, ((_this$articles$get10 = this.articles.get('signs')) === null || _this$articles$get10 === void 0 ? void 0 : _this$articles$get10.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get11 = this.articles.get('triggers')) === null || _this$articles$get11 === void 0 ? void 0 : _this$articles$get11.title) || 'Loading...', (_this$articles$get12 = this.articles.get('triggers')) === null || _this$articles$get12 === void 0 ? void 0 : _this$articles$get12.title, ((_this$articles$get13 = this.articles.get('triggers')) === null || _this$articles$get13 === void 0 ? void 0 : _this$articles$get13.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get14 = this.articles.get('practices')) === null || _this$articles$get14 === void 0 ? void 0 : _this$articles$get14.title) || 'Loading...', (_this$articles$get15 = this.articles.get('practices')) === null || _this$articles$get15 === void 0 ? void 0 : _this$articles$get15.title, ((_this$articles$get16 = this.articles.get('practices')) === null || _this$articles$get16 === void 0 ? void 0 : _this$articles$get16.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get17 = this.articles.get('seek')) === null || _this$articles$get17 === void 0 ? void 0 : _this$articles$get17.title) || 'Loading...', (_this$articles$get18 = this.articles.get('seek')) === null || _this$articles$get18 === void 0 ? void 0 : _this$articles$get18.title, ((_this$articles$get19 = this.articles.get('seek')) === null || _this$articles$get19 === void 0 ? void 0 : _this$articles$get19.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get20 = this.articles.get('questions')) === null || _this$articles$get20 === void 0 ? void 0 : _this$articles$get20.title) || 'Loading...', (_this$articles$get21 = this.articles.get('questions')) === null || _this$articles$get21 === void 0 ? void 0 : _this$articles$get21.title, ((_this$articles$get22 = this.articles.get('questions')) === null || _this$articles$get22 === void 0 ? void 0 : _this$articles$get22.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get23 = this.articles.get('why')) === null || _this$articles$get23 === void 0 ? void 0 : _this$articles$get23.title) || 'Loading...', (_this$articles$get24 = this.articles.get('why')) === null || _this$articles$get24 === void 0 ? void 0 : _this$articles$get24.title, ((_this$articles$get25 = this.articles.get('why')) === null || _this$articles$get25 === void 0 ? void 0 : _this$articles$get25.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get26 = this.articles.get('deal')) === null || _this$articles$get26 === void 0 ? void 0 : _this$articles$get26.title) || 'Loading...', (_this$articles$get27 = this.articles.get('deal')) === null || _this$articles$get27 === void 0 ? void 0 : _this$articles$get27.title, ((_this$articles$get28 = this.articles.get('deal')) === null || _this$articles$get28 === void 0 ? void 0 : _this$articles$get28.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get29 = this.articles.get('signs')) === null || _this$articles$get29 === void 0 ? void 0 : _this$articles$get29.title) || 'Loading...', (_this$articles$get30 = this.articles.get('signs')) === null || _this$articles$get30 === void 0 ? void 0 : _this$articles$get30.title, ((_this$articles$get31 = this.articles.get('signs')) === null || _this$articles$get31 === void 0 ? void 0 : _this$articles$get31.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get32 = this.articles.get('triggers')) === null || _this$articles$get32 === void 0 ? void 0 : _this$articles$get32.title) || 'Loading...', (_this$articles$get33 = this.articles.get('triggers')) === null || _this$articles$get33 === void 0 ? void 0 : _this$articles$get33.title, ((_this$articles$get34 = this.articles.get('triggers')) === null || _this$articles$get34 === void 0 ? void 0 : _this$articles$get34.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get35 = this.articles.get('practices')) === null || _this$articles$get35 === void 0 ? void 0 : _this$articles$get35.title) || 'Loading...', (_this$articles$get36 = this.articles.get('practices')) === null || _this$articles$get36 === void 0 ? void 0 : _this$articles$get36.title, ((_this$articles$get37 = this.articles.get('practices')) === null || _this$articles$get37 === void 0 ? void 0 : _this$articles$get37.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get38 = this.articles.get('seek')) === null || _this$articles$get38 === void 0 ? void 0 : _this$articles$get38.title) || 'Loading...', (_this$articles$get39 = this.articles.get('seek')) === null || _this$articles$get39 === void 0 ? void 0 : _this$articles$get39.title, ((_this$articles$get40 = this.articles.get('seek')) === null || _this$articles$get40 === void 0 ? void 0 : _this$articles$get40.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get41 = this.articles.get('questions')) === null || _this$articles$get41 === void 0 ? void 0 : _this$articles$get41.title) || 'Loading...', (_this$articles$get42 = this.articles.get('questions')) === null || _this$articles$get42 === void 0 ? void 0 : _this$articles$get42.title, ((_this$articles$get43 = this.articles.get('questions')) === null || _this$articles$get43 === void 0 ? void 0 : _this$articles$get43.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get44 = this.articles.get('why')) === null || _this$articles$get44 === void 0 ? void 0 : _this$articles$get44.title) || 'Loading...', (_this$articles$get45 = this.articles.get('why')) === null || _this$articles$get45 === void 0 ? void 0 : _this$articles$get45.title, ((_this$articles$get46 = this.articles.get('why')) === null || _this$articles$get46 === void 0 ? void 0 : _this$articles$get46.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get47 = this.articles.get('deal')) === null || _this$articles$get47 === void 0 ? void 0 : _this$articles$get47.title) || 'Loading...', (_this$articles$get48 = this.articles.get('deal')) === null || _this$articles$get48 === void 0 ? void 0 : _this$articles$get48.title, ((_this$articles$get49 = this.articles.get('deal')) === null || _this$articles$get49 === void 0 ? void 0 : _this$articles$get49.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get50 = this.articles.get('signs')) === null || _this$articles$get50 === void 0 ? void 0 : _this$articles$get50.title) || 'Loading...', (_this$articles$get51 = this.articles.get('signs')) === null || _this$articles$get51 === void 0 ? void 0 : _this$articles$get51.title, ((_this$articles$get52 = this.articles.get('signs')) === null || _this$articles$get52 === void 0 ? void 0 : _this$articles$get52.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get53 = this.articles.get('triggers')) === null || _this$articles$get53 === void 0 ? void 0 : _this$articles$get53.title) || 'Loading...', (_this$articles$get54 = this.articles.get('triggers')) === null || _this$articles$get54 === void 0 ? void 0 : _this$articles$get54.title, ((_this$articles$get55 = this.articles.get('triggers')) === null || _this$articles$get55 === void 0 ? void 0 : _this$articles$get55.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get56 = this.articles.get('practices')) === null || _this$articles$get56 === void 0 ? void 0 : _this$articles$get56.title) || 'Loading...', (_this$articles$get57 = this.articles.get('practices')) === null || _this$articles$get57 === void 0 ? void 0 : _this$articles$get57.title, ((_this$articles$get58 = this.articles.get('practices')) === null || _this$articles$get58 === void 0 ? void 0 : _this$articles$get58.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get59 = this.articles.get('seek')) === null || _this$articles$get59 === void 0 ? void 0 : _this$articles$get59.title) || 'Loading...', (_this$articles$get60 = this.articles.get('seek')) === null || _this$articles$get60 === void 0 ? void 0 : _this$articles$get60.title, ((_this$articles$get61 = this.articles.get('seek')) === null || _this$articles$get61 === void 0 ? void 0 : _this$articles$get61.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get62 = this.articles.get('questions')) === null || _this$articles$get62 === void 0 ? void 0 : _this$articles$get62.title) || 'Loading...', (_this$articles$get63 = this.articles.get('questions')) === null || _this$articles$get63 === void 0 ? void 0 : _this$articles$get63.title, ((_this$articles$get64 = this.articles.get('questions')) === null || _this$articles$get64 === void 0 ? void 0 : _this$articles$get64.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog);
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new mindfulnessExpandedView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js"}],"views/pages/resources.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
// Image adapted from Canva – Accessed on December 18, 2024
class resourcesView {
  init() {
    document.title = 'Resources';
    this.render();
    _Utils.default.pageIntroAnim();
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      ", "\n\n      <div class=\"page-content page-centered\"> \n      <section class=\"banner resources\">\n        <div class =\"banner-content\"> \n          <div class=\"banner-text\"> \n          <h1>Resources</h1>\n          <h2>Supporting You Every Step of the Way.</h2>\n          </div>\n          <picture>\n            <source srcset=\"images/resources/resources-hero-image-360.webp\" media=\"(max-width: 480px)\">\n            <source srcset=\"images/resources/resources-hero-image-768.webp\" media=\"(max-width: 768px)\">\n            <source srcset=\"images/resources/resources-hero-image-1024.webp\" media=\"(min-width: 769px)\">\n            <img id=\"heroImage\" src=\"images/resources/resources-hero-1024.webp\" alt=\"resources banner image of a two women supporting each other\">\n          </picture>\n        </div>\n      </section>\n      <section class=\"nav-page\">\n        <h3>Ways to deal with...</h3>\n          <div class=\"button-group\">\n          <sl-button class=\"support-page\" @click=", ">Support</sl-button>\n          <sl-button class=\"services-page\" @click=", ">Services</sl-button>\n          <sl-button class=\"guides-page\" @click=", ">Guides</sl-button>\n        </div>\n      </section>\n      </div>      \n    "])), _Auth.default.isLoggedIn() ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<va-app-header user=", "></va-app-header>"])), JSON.stringify(_Auth.default.currentUser)) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<va-public-header></va-public-header>"]))), () => (0, _Router.gotoRoute)('/resourcesExpanded?tab=support'), () => (0, _Router.gotoRoute)('/resourcesExpanded?tab=services'), () => (0, _Router.gotoRoute)('/resourcesExpanded?tab=guides'));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new resourcesView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js"}],"views/pages/resourcesExpanded.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
// Image adapted from Canva – Accessed on December 18, 2024
class resourcesExpandedView {
  constructor() {
    this.articles = new Map(); // Initialize Map
  }
  async fetchArticle(id) {
    try {
      console.log('Fetching article:', id);
      const response = await fetch("".concat(_App.default.apiBase, "/article/").concat(id));
      if (!response.ok) {
        throw new Error("HTTP error! status: ".concat(response.status));
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      // Store the article id in localStorage
      localStorage.setItem("article-".concat(id), data._id);
      return data;
    } catch (err) {
      console.error('Fetch error:', err);
      return null;
    }
  }
  async init() {
    document.title = 'Mindfulness Expanded';
    this.articleIds = {
      // these are the articles for the first tab group "stress" //
      why: '677dcb34a6cdde9083351d76',
      deal: '677dcc1c4aea9c354dbd3103',
      signs: '677e60b05c759160209d1111',
      practices: '679af473ccbfff59ce1a142e',
      triggers: '679af4330b0bab1805167cae',
      seek: '679af494ccbfff59ce1a1430',
      questions: '679af4b9ccbfff59ce1a1432'

      // these are the articles for the second tab group "anxiety" //

      // these are te articles fr the thrid tab group "Depression" //
    };
    try {
      await Promise.all(Object.entries(this.articleIds).filter(_ref => {
        let [_, id] = _ref;
        return id;
      }).map(async _ref2 => {
        let [key, id] = _ref2;
        const article = await this.fetchArticle(id);
        if (article) {
          this.articles.set(key, article);
          console.log("Set ".concat(key, " article:"), article);
        }
      }));
      this.render();
      _Utils.default.pageIntroAnim();
      this.setupDialogHandlers();
    } catch (err) {
      console.error('Init error:', err);
    }
  }
  async bookmarkArticle(e, id) {
    e.preventDefault();
    e.stopPropagation();
    console.log("Current user:", _Auth.default.currentUser);
    console.log("Using token:", _Auth.default.currentUser.token);
    if (!_Auth.default.currentUser || !_Auth.default.currentUser.token) {
      alert("You must be logged in to bookmark articles!");
      return;
    }
    try {
      const response = await fetch("".concat(_App.default.apiBase, "/bookmark/").concat(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer ".concat(_Auth.default.currentUser.token)
        }
      });
      const result = await response.json();
      if (response.ok) {
        alert("Article bookmarked!");
      } else {
        const errMsg = result.message || result.error || "Bookmark failed";
        console.error("Bookmark failed:", errMsg);
        alert(errMsg);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      alert("An error occurred while bookmarking the article.");
    }
  }
  setupDialogHandlers() {
    document.querySelectorAll('.dialog-width').forEach(dialog => {
      dialog.addEventListener('sl-request-close', () => {
        dialog.hide();
      });
      dialog.addEventListener('sl-after-hide', () => {
        const closeButton = dialog.querySelector('sl-button[slot="footer"]');
        if (closeButton) {
          closeButton.addEventListener('click', e => {
            e.stopPropagation();
            dialog.hide();
          });
        }
      });
    });
  }
  openDialog(e) {
    e.stopPropagation();

    // Find the closest sl-dialog inside the clicked element
    const dialog = e.currentTarget.querySelector('sl-dialog');
    if (dialog) {
      dialog.show();
    }
  }
  closeDialog(e) {
    e.stopPropagation();

    // Get the closest sl-dialog to the button clicked
    const dialog = e.target.closest('sl-dialog');
    if (dialog) dialog.hide();
  }
  render() {
    var _this$articles$get, _this$articles$get2, _this$articles$get3, _this$articles$get5, _this$articles$get6, _this$articles$get7, _this$articles$get8, _this$articles$get9, _this$articles$get10, _this$articles$get11, _this$articles$get12, _this$articles$get13, _this$articles$get14, _this$articles$get15, _this$articles$get16, _this$articles$get17, _this$articles$get18, _this$articles$get19, _this$articles$get20, _this$articles$get21, _this$articles$get22, _this$articles$get23, _this$articles$get24, _this$articles$get25, _this$articles$get26, _this$articles$get27, _this$articles$get28, _this$articles$get29, _this$articles$get30, _this$articles$get31, _this$articles$get32, _this$articles$get33, _this$articles$get34, _this$articles$get35, _this$articles$get36, _this$articles$get37, _this$articles$get38, _this$articles$get39, _this$articles$get40, _this$articles$get41, _this$articles$get42, _this$articles$get43, _this$articles$get44, _this$articles$get45, _this$articles$get46, _this$articles$get47, _this$articles$get48, _this$articles$get49, _this$articles$get50, _this$articles$get51, _this$articles$get52, _this$articles$get53, _this$articles$get54, _this$articles$get55, _this$articles$get56, _this$articles$get57, _this$articles$get58, _this$articles$get59, _this$articles$get60, _this$articles$get61, _this$articles$get62, _this$articles$get63, _this$articles$get64;
    console.log('Auth.currentUser:', _Auth.default.currentUser);
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab') || 'meditation'; // default to stress if no tab specified
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    <style>\n      .banner.mental-health-expanded {\n      height: 100vh; \n      background-color: #B26DCB;\n      /*padding-top: 15%;*/\n    }\n\n    .banner-content {\n      height: 80%;\n      width: 60%;\n    }\n\n    sl-tab-group::part(base) {\n      display: flex;\n      align-items: center;\n      gap: 32px;\n    \n    }\n\n  \n    sl-tab-group::part(nav) {\n    border-bottom: none;\n  }\n\n  sl-tab-group::part(active-tab-indicator) {\n    display: none !important;\n    opacity: 0;\n    visibility: hidden;\n  }\n\n  sl-tab-group::part(tabs) {\n    border-bottom: none;\n  }\n\n  sl-tab::part(base) {\n    border-bottom: none;\n    margin: 0 12px;\n    padding: 12px 24px;\n    font-size: 18px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  }\n\n  sl-tab:not([active])::part(base):hover {\n  font-size: 20px;\n}\n\nsl-tab[active]::part(base) {\n  font-size: 20px;\n  color: #F3C728 !important;\n}\n\n    #bento-tabs {\n      width: 100%;\n      display: flex;\n      justify-content: center;\n      align-items: left;\n    }\n    \n    h1 {\n      margin-bottom: 50px !important;\n      width: 50% !important;\n      margin-left: 13% !important;\n    }\n    \n\n    .why {\n      grid-area: why;\n      width: 193px;\n      height: 193px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .deal {\n      grid-area: deal;\n      width: 361px;\n      height: 193px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .signs {\n      grid-area: signs;\n      width: 193px;\n      height: 411px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .triggers {\n      grid-area: triggers;\n      width: 361px;\n      height: 193px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .practices {\n      grid-area: practices;\n      width: 193px;\n      height: 411px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      margin-left: 168px;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .seek {\n      grid-area: seek;\n      width: 361px;\n      height: 193px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n    \n    .questions {\n      grid-area: questions;\n      width: 193px;\n      height: 193px;\n      border-radius: 35px;\n      background-color: #FFFFFF;\n      margin-left: 385px;\n      position: relative;\n      display: flex;\n      overflow: hidden;\n      cursor: pointer;\n    }\n\n.stress {\n  display: grid;\n  grid-template-areas: \n    \"why deal signs\"\n    \"triggers practices practices\"\n    \"seek questions questions\";\n  grid-template-columns: 193px 361px 193px; /* Explicit column widths */\n  grid-template-rows: 193px 193px 193px; /* Fixed row heights */\n  gap: 24px; /* Minimal gap */\n  align-items: start; /* Align items to top */\n  margin-top: 8px;\n}\n\n\n    p {\n      color: #000000;\n    }\n\n    .bookmark, .bookmark-full {\n    position: absolute;\n    width: auto;\n    height: 30px;\n    top: -0.5px;\n    right: 35px;\n    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.3));\n  }\n    \n\n  sl-dialog::part(base) {\n    color: #000000;\n  }\n\n  sl-dialog::part(overlay) {\n    backdrop-filter: blur(8px);\n    background-color: rgba(0, 0, 0, 0.5);\n  }\n\n\n  sl-dialog::part(panel) {\n    border-radius: 35px;\n    z-index: 1000;\n  }\n\n  sl-dialog::part(close-button) {\n    display: none;\n  }\n\n    .why-img {\n      width: 400px; /* Much larger than parent */\n      height: 400px; /* Much larger than parent */\n      position: absolute;\n      z-index: 0;\n      object-fit: cover;\n      transform: translate(-50%, -50%);\n      top: 60%;\n      left: 60%;\n      border-radius: 35px;\n      transition: transform 0.3s ease;\n    }\n\n    .why:hover .why-img {\n      transform: translate(-50%, -50%) scale(1.1);\n    }\n\n    .why p {\n      width: 30%;\n      font-size: 20px;\n      font-weight: 300;\n      margin-left: 10%;\n      z-index: 1;\n    }\n\n    </style>\n\n    \n\n    ", "\n      <a href=\"/\" @click=\"", "\"><img class=\"header-logo\" src=\"/images/logo/logo-mindline-no-wording-white-125.png\"></a>      \n      <div class=\"page-content\"> \n        <section class=\"banner mental-health-expanded\">\n        \n        <div class=\"banner-content\">     \n          <h1>Resrouces</h1>\n          <div id=\"bento-tabs\">\n            <sl-tab-group ?active=\"", "\">\n              <sl-tab slot=\"nav\" panel=\"support\" ?active=\"", "\">Support</sl-tab>\n              <sl-tab slot=\"nav\" panel=\"services\" ?active=\"", "\">Services</sl-tab>\n              <sl-tab slot=\"nav\" panel=\"guides\" ?active=\"", "\">Guides</sl-tab>\n\n              <!-- this is the first tab content of the menal health page -->\n              <sl-tab-panel name=\"support\">\n                \n       \n                <div class=\"stress\">\n                \n                  <div class=\"why\" @click=", ">\n                    <img src=\"/images/why-box.png\" class=\"why-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                      ", "\n                      <sl-button \n                        slot=\"footer\" \n                        variant=\"primary\" \n                        @click=", ">\n                                              Bookmark\n                      </sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                    </sl-dialog>\n                  </div>\n\n                  <div class=\"deal\" @click=", ">\n                    <img src=\"/images/stress-box.png\" class=\"stress-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-full.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"signs\" @click=", ">\n                    <img src=\"/images/signs-box.png\" class=\"signs-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                \n                  <div class=\"triggers\" @click=", ">\n                    <img src=\"/images/triggers-box.png\" class=\"triggers-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"practices\" @click=", ">\n                    <img src=\"/images/practices-box.png\" class=\"practices-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                  <div class=\"seek\" @click=", ">\n                  <img src=\"/images/seek-box.png\" class=\"seek-img\">\n                 <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"questions\" @click=", ">\n                  <img src=\"/images/questions-box.png\" class=\"questions-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                </div>\n\n\n\n              </sl-tab-panel>\n\n               <!-- this is the second tab content of the menal health page -->\n              <sl-tab-panel name=\"services\">\n                <div class=\"stress\">\n                \n                  <div class=\"why\" @click=", ">\n                    <img src=\"/images/\" class=\"why-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                      ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                    </sl-dialog>\n                  </div>\n\n                  <div class=\"deal\" @click=", ">\n                    <img src=\"/images/\" class=\"stress-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-full.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"signs\" @click=", ">\n                    <img src=\"/images/\" class=\"signs-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                \n                  <div class=\"triggers\" @click=", ">\n                    <img src=\"/images/\" class=\"triggers-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"practices\" @click=", ">\n                    <img src=\"/images/\" class=\"practices-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                  <div class=\"seek\" @click=", ">\n                  <img src=\"/images/\" class=\"seek-img\">\n                 <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"questions\" @click=", ">\n                  <img src=\"/images/\" class=\"questions-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                </div>\n              </sl-tab-panel>\n\n               <!-- this is the third tab content of the menal health page -->\n              <sl-tab-panel name=\"guides\">\n                <div class=\"stress\">\n                \n                  <div class=\"why\" @click=", ">\n                    <img src=\"/images/why-box.png\" class=\"why-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                      ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                    </sl-dialog>\n                  </div>\n\n                  <div class=\"deal\" @click=", ">\n                    <img src=\"/images/stress-box.png\" class=\"stress-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-full.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                      <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"signs\" @click=", ">\n                    <img src=\"/images/signs-box.png\" class=\"signs-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                \n                  <div class=\"triggers\" @click=", ">\n                    <img src=\"/images/triggers-box.png\" class=\"triggers-img\">\n                    <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"practices\" @click=", ">\n                    <img src=\"/images/practices-box.png\" class=\"practices-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                \n                  <div class=\"seek\" @click=", ">\n                  <img src=\"/images/seek-box.png\" class=\"seek-img\">\n                 <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n\n                  <div class=\"questions\" @click=", ">\n                  <img src=\"/images/questions-box.png\" class=\"questions-img\">\n                      <p>", "</p>\n                    <img src=\"/images/bookmark/bookmark-4.svg\" class=\"bookmark\">\n                    <sl-dialog label=\"", "\" class=\"dialog-width\" style=\"--width: 50vw; --height: 60vh;\">\n                    ", "\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Bookmark</sl-button>\n                    <sl-button slot=\"footer\" variant=\"primary\" @click=", ">Close</sl-button>\n                  </div>\n                </div>\n              </sl-tab-panel>\n\n            </sl-tab-group>\n          </div>\n        </div>\n        </section>\n          \n      \n      </div>  \n    "])), _Auth.default.isLoggedIn() ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<va-app-header user=", "></va-app-header>"])), JSON.stringify(_Auth.default.currentUser)) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<va-public-header></va-public-header>"]))), _Router.anchorRoute, activeTab, activeTab === 'support', activeTab === 'services', activeTab === 'guides', this.openDialog, ((_this$articles$get = this.articles.get('why')) === null || _this$articles$get === void 0 ? void 0 : _this$articles$get.title) || 'Loading...', (_this$articles$get2 = this.articles.get('why')) === null || _this$articles$get2 === void 0 ? void 0 : _this$articles$get2.title, ((_this$articles$get3 = this.articles.get('why')) === null || _this$articles$get3 === void 0 ? void 0 : _this$articles$get3.bodyContent) || 'Loading content...', e => {
      var _this$articles$get4;
      const articleId = (_this$articles$get4 = this.articles.get('why')) === null || _this$articles$get4 === void 0 ? void 0 : _this$articles$get4._id;
      console.log("Bookmarking article ID:", articleId);
      this.bookmarkArticle(e, articleId);
    }, this.closeDialog, this.openDialog, ((_this$articles$get5 = this.articles.get('deal')) === null || _this$articles$get5 === void 0 ? void 0 : _this$articles$get5.title) || 'Loading...', (_this$articles$get6 = this.articles.get('deal')) === null || _this$articles$get6 === void 0 ? void 0 : _this$articles$get6.title, ((_this$articles$get7 = this.articles.get('deal')) === null || _this$articles$get7 === void 0 ? void 0 : _this$articles$get7.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get8 = this.articles.get('signs')) === null || _this$articles$get8 === void 0 ? void 0 : _this$articles$get8.title) || 'Loading...', (_this$articles$get9 = this.articles.get('signs')) === null || _this$articles$get9 === void 0 ? void 0 : _this$articles$get9.title, ((_this$articles$get10 = this.articles.get('signs')) === null || _this$articles$get10 === void 0 ? void 0 : _this$articles$get10.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get11 = this.articles.get('triggers')) === null || _this$articles$get11 === void 0 ? void 0 : _this$articles$get11.title) || 'Loading...', (_this$articles$get12 = this.articles.get('triggers')) === null || _this$articles$get12 === void 0 ? void 0 : _this$articles$get12.title, ((_this$articles$get13 = this.articles.get('triggers')) === null || _this$articles$get13 === void 0 ? void 0 : _this$articles$get13.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get14 = this.articles.get('practices')) === null || _this$articles$get14 === void 0 ? void 0 : _this$articles$get14.title) || 'Loading...', (_this$articles$get15 = this.articles.get('practices')) === null || _this$articles$get15 === void 0 ? void 0 : _this$articles$get15.title, ((_this$articles$get16 = this.articles.get('practices')) === null || _this$articles$get16 === void 0 ? void 0 : _this$articles$get16.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get17 = this.articles.get('seek')) === null || _this$articles$get17 === void 0 ? void 0 : _this$articles$get17.title) || 'Loading...', (_this$articles$get18 = this.articles.get('seek')) === null || _this$articles$get18 === void 0 ? void 0 : _this$articles$get18.title, ((_this$articles$get19 = this.articles.get('seek')) === null || _this$articles$get19 === void 0 ? void 0 : _this$articles$get19.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get20 = this.articles.get('questions')) === null || _this$articles$get20 === void 0 ? void 0 : _this$articles$get20.title) || 'Loading...', (_this$articles$get21 = this.articles.get('questions')) === null || _this$articles$get21 === void 0 ? void 0 : _this$articles$get21.title, ((_this$articles$get22 = this.articles.get('questions')) === null || _this$articles$get22 === void 0 ? void 0 : _this$articles$get22.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get23 = this.articles.get('why')) === null || _this$articles$get23 === void 0 ? void 0 : _this$articles$get23.title) || 'Loading...', (_this$articles$get24 = this.articles.get('why')) === null || _this$articles$get24 === void 0 ? void 0 : _this$articles$get24.title, ((_this$articles$get25 = this.articles.get('why')) === null || _this$articles$get25 === void 0 ? void 0 : _this$articles$get25.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get26 = this.articles.get('deal')) === null || _this$articles$get26 === void 0 ? void 0 : _this$articles$get26.title) || 'Loading...', (_this$articles$get27 = this.articles.get('deal')) === null || _this$articles$get27 === void 0 ? void 0 : _this$articles$get27.title, ((_this$articles$get28 = this.articles.get('deal')) === null || _this$articles$get28 === void 0 ? void 0 : _this$articles$get28.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get29 = this.articles.get('signs')) === null || _this$articles$get29 === void 0 ? void 0 : _this$articles$get29.title) || 'Loading...', (_this$articles$get30 = this.articles.get('signs')) === null || _this$articles$get30 === void 0 ? void 0 : _this$articles$get30.title, ((_this$articles$get31 = this.articles.get('signs')) === null || _this$articles$get31 === void 0 ? void 0 : _this$articles$get31.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get32 = this.articles.get('triggers')) === null || _this$articles$get32 === void 0 ? void 0 : _this$articles$get32.title) || 'Loading...', (_this$articles$get33 = this.articles.get('triggers')) === null || _this$articles$get33 === void 0 ? void 0 : _this$articles$get33.title, ((_this$articles$get34 = this.articles.get('triggers')) === null || _this$articles$get34 === void 0 ? void 0 : _this$articles$get34.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get35 = this.articles.get('practices')) === null || _this$articles$get35 === void 0 ? void 0 : _this$articles$get35.title) || 'Loading...', (_this$articles$get36 = this.articles.get('practices')) === null || _this$articles$get36 === void 0 ? void 0 : _this$articles$get36.title, ((_this$articles$get37 = this.articles.get('practices')) === null || _this$articles$get37 === void 0 ? void 0 : _this$articles$get37.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get38 = this.articles.get('seek')) === null || _this$articles$get38 === void 0 ? void 0 : _this$articles$get38.title) || 'Loading...', (_this$articles$get39 = this.articles.get('seek')) === null || _this$articles$get39 === void 0 ? void 0 : _this$articles$get39.title, ((_this$articles$get40 = this.articles.get('seek')) === null || _this$articles$get40 === void 0 ? void 0 : _this$articles$get40.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get41 = this.articles.get('questions')) === null || _this$articles$get41 === void 0 ? void 0 : _this$articles$get41.title) || 'Loading...', (_this$articles$get42 = this.articles.get('questions')) === null || _this$articles$get42 === void 0 ? void 0 : _this$articles$get42.title, ((_this$articles$get43 = this.articles.get('questions')) === null || _this$articles$get43 === void 0 ? void 0 : _this$articles$get43.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get44 = this.articles.get('why')) === null || _this$articles$get44 === void 0 ? void 0 : _this$articles$get44.title) || 'Loading...', (_this$articles$get45 = this.articles.get('why')) === null || _this$articles$get45 === void 0 ? void 0 : _this$articles$get45.title, ((_this$articles$get46 = this.articles.get('why')) === null || _this$articles$get46 === void 0 ? void 0 : _this$articles$get46.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get47 = this.articles.get('deal')) === null || _this$articles$get47 === void 0 ? void 0 : _this$articles$get47.title) || 'Loading...', (_this$articles$get48 = this.articles.get('deal')) === null || _this$articles$get48 === void 0 ? void 0 : _this$articles$get48.title, ((_this$articles$get49 = this.articles.get('deal')) === null || _this$articles$get49 === void 0 ? void 0 : _this$articles$get49.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get50 = this.articles.get('signs')) === null || _this$articles$get50 === void 0 ? void 0 : _this$articles$get50.title) || 'Loading...', (_this$articles$get51 = this.articles.get('signs')) === null || _this$articles$get51 === void 0 ? void 0 : _this$articles$get51.title, ((_this$articles$get52 = this.articles.get('signs')) === null || _this$articles$get52 === void 0 ? void 0 : _this$articles$get52.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get53 = this.articles.get('triggers')) === null || _this$articles$get53 === void 0 ? void 0 : _this$articles$get53.title) || 'Loading...', (_this$articles$get54 = this.articles.get('triggers')) === null || _this$articles$get54 === void 0 ? void 0 : _this$articles$get54.title, ((_this$articles$get55 = this.articles.get('triggers')) === null || _this$articles$get55 === void 0 ? void 0 : _this$articles$get55.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get56 = this.articles.get('practices')) === null || _this$articles$get56 === void 0 ? void 0 : _this$articles$get56.title) || 'Loading...', (_this$articles$get57 = this.articles.get('practices')) === null || _this$articles$get57 === void 0 ? void 0 : _this$articles$get57.title, ((_this$articles$get58 = this.articles.get('practices')) === null || _this$articles$get58 === void 0 ? void 0 : _this$articles$get58.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get59 = this.articles.get('seek')) === null || _this$articles$get59 === void 0 ? void 0 : _this$articles$get59.title) || 'Loading...', (_this$articles$get60 = this.articles.get('seek')) === null || _this$articles$get60 === void 0 ? void 0 : _this$articles$get60.title, ((_this$articles$get61 = this.articles.get('seek')) === null || _this$articles$get61 === void 0 ? void 0 : _this$articles$get61.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog, this.openDialog, ((_this$articles$get62 = this.articles.get('questions')) === null || _this$articles$get62 === void 0 ? void 0 : _this$articles$get62.title) || 'Loading...', (_this$articles$get63 = this.articles.get('questions')) === null || _this$articles$get63 === void 0 ? void 0 : _this$articles$get63.title, ((_this$articles$get64 = this.articles.get('questions')) === null || _this$articles$get64 === void 0 ? void 0 : _this$articles$get64.bodyContent) || 'Loading content...', this.closeDialog, this.closeDialog);
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new resourcesExpandedView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js"}],"views/pages/favouriteLines.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _Toast = _interopRequireDefault(require("../../Toast"));
var _UserAPI = _interopRequireDefault(require("../../UserAPI"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
// bookmarks = previously favourites
// favouriteBookmarks = previously favouriteProducts
class FavouriteLinesView {
  init() {
    document.title = 'Favourite Lines';
    this.favProducts = null;
    this.render();
    _Utils.default.pageIntroAnim();
    this.getFavProducts();
  }
  async getFavProducts() {
    try {
      const currentUser = await _UserAPI.default.getUser(_Auth.default.currentUser._id);
      this.favProducts = currentUser.favouriteProducts;
      console.log(this.favouriteProducts);
      this.render();
    } catch (err) {
      _Toast.default.show(err, 'error');
    }
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      <va-app-header title=\"\" user=\"", "\">\n      </va-app-header>\n      <div class=\"page-content favourites-page\">   \n        <div class=\"fav-container \"> \n        <h1>Favourites</h1>     \n        <div class=\"fav-list\">\n          <sl-button type=\"primary\" size=\"large\" @click=", ">Add bookmarks </sl-button>\n          <sl-button type=\"primary\" size=\"large\" @click=", ">View My Favourite</sl-button>     \n        </div>\n\n        <hr>\n        <br>\n\n        <p>Page content ...</p>\n\n      </div> \n      <div class=\"favourites-grid\">\n        ", "\n        </div>\n      </div>\n    "])), JSON.stringify(_Auth.default.currentUser), () => (0, _Router.gotoRoute)('/favouriteLines'), () => (0, _Router.gotoRoute)('/favouriteLines'), this.favouriteProducts == null ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n          <sl-spinner></sl-spinner>\n        "]))) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n          ", "\n        "])), this.favProducts.map(product => (0, _litHtml.html)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n            <va-favourite-product class=\"favourite-card\"\n              id=\"", "\"\n              name=\"", "\"\n              description=\"", "\"\n              price=\"", "\"\n              user=\"", "\"\n              favourite=\"", "\" \n              image=\"", "\"\n              milk=\"", "\"\n              shots=\"", "\"\n            >        \n            </va-favourite-product>\n\n          "])), product._id, product.name, product.description, product.price, JSON.stringify(product.user), favourite.product, product.image, product.milk, product.shots))));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new FavouriteLinesView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js","../../Toast":"Toast.js","../../UserAPI":"UserAPI.js"}],"views/pages/about.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
class aboutUsView {
  init() {
    document.title = 'About';
    this.render();
    _Utils.default.pageIntroAnim();
  }

  // Image adapted from Canva – Accessed on December 18, 2024
  // Animation from Shoelace - access September 23, 2024. https://shoelace.style/components/animation
  // <sl-animation name="fadeIn" duration="2000" play iterations="1"></sl-animation>
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      ", "\n\n      <div class=\"page-content\"> \n      <section class=\"banner about\">\n      <div class=\"grphics\">\n          <div class=\"banner-content\"> \n            <h1>About Us</h1>\n            <picture>\n                <source srcset=\"images/about/about-hero-image-360.webp\" media=\"(max-width: 480px)\">\n                <source srcset=\"images/about/about-hero-image-768.webp\" media=\"(max-width: 768px)\">\n                <source srcset=\"images/about/about-hero-image-1024.webp\" media=\"(min-width: 769px)\">\n                <img id=\"heroImage\" src=\"images/about/about-hero-1024.webp\" alt=\"about/about us banner image of a group of young people\">\n              </picture>\n          </div>\n        </div>\n      </section>\n      <section class=\"about-content\">\n        <article class=\"how-we-are\">\n          <h2>How We Are</h2>\n          <p>\n            As a not-for-profit organisation, the team at Mindline AU aims to raise awareness\n            and support for young people to reach their full potential mentally, physically,\n            and emotionally.\n          </p>\n        </article>\n        <article class=\"our-mission\">    \n          <h2>Our Mission</h2>\n          <p>\n            Mindline AU's mission is for young users to have a safe web space to hang out and explore information, resources, \n            and tools that empower them to manage their wellbeing interactively and in a fun way! \n          </p>\n        </article>\n        <article class=\"contact-info\">\n          <h2>Contact Info</h2>\n          <address>\n            <p>\n              <strong><sl-icon name=\"mailbox\"></sl-icon> &nbsp;Address:&nbsp;</strong>10-20 Walkers Rd, Morayfield QLD 4506 (We share our space with Youth Justice) &nbsp;<a href=\"/\" @click=\"", "\"><sl-icon name=\"geo-alt\"><div class=\"location-map\" class=\"responsive-img\" >  \n                <div><iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d677.7431096476914!2d152.94963042937584!3d-27.11253173219729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b93f165fe831745%3A0x644423865a59d123!2sYouth%20Justice!5e1!3m2!1sen!2sau!4v1737785324838!5m2!1sen!2sau\" \n                  width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" \n                  loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\">\n                </iframe></div></sl-icon></a><br>              \n              <strong><sl-icon name=\"telephone\"></sl-icon> &nbsp;Phone:</strong> <a href=\"tel:1800 034 034\"></a><br>\n              <strong><sl-icon name=\"envelope\"></sl-icon> &nbsp;Email:</strong> <a href=\"mailto:hello@mindline.telstra.com.au\">hello@mindline.telstra.com.au</a><br>\n              <strong><sl-icon name=\"globe\"></sl-icon> &nbsp;Web:</strong> <a href=\"https://mindlineau-a3.netlify.app/\">www.mindlineau-A3.netlify.app</a>\n            </p>\n          </address>\n        </article>\n        \n      </section>\n    </div>\n  "])), _Auth.default.isLoggedIn() ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<va-app-header user=", "></va-app-header>"])), JSON.stringify(_Auth.default.currentUser)) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<va-public-header></va-public-header>"]))), _Router.anchorRoute);
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new aboutUsView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js"}],"ProductAPI.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("./App"));
var _Auth = _interopRequireDefault(require("./Auth"));
var _Toast = _interopRequireDefault(require("./Toast"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class ProductAPI {
  async newProduct(formData) {
    // send fetch request
    const response = await fetch("".concat(_App.default.apiBase, "/product"), {
      method: 'POST',
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken)
      },
      body: formData
    });

    // if response not ok
    if (!response.ok) {
      let message = 'Problem adding product';
      if (response.status == 400) {
        const err = await response.json();
        message = err.message;
      }
      // throw error (exit this function)      
      throw new Error(message);
    }

    // convert response payload into json - store as data
    const data = await response.json();

    // return data
    return data;
  }
  async getProducts() {
    // fetch the json data
    const response = await fetch("".concat(_App.default.apiBase, "/product"), {
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken)
      }
    });

    // if response not ok
    if (!response.ok) {
      // console log error
      const err = await response.json();
      if (err) console.log(err);
      // throw error (exit this function)      
      throw new Error('Problem getting product');
    }

    // convert response payload into json - store as data
    const data = await response.json();

    // return data
    return data;
  }
}
var _default = exports.default = new ProductAPI();
},{"./App":"App.js","./Auth":"Auth.js","./Toast":"Toast.js"}],"views/pages/products.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _ProductAPI = _interopRequireDefault(require("../../ProductAPI"));
var _Toast = _interopRequireDefault(require("../../Toast"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
class ProductView {
  init() {
    document.title = 'Products';
    this.product = null;
    this.render();
    _Utils.default.pageIntroAnim();
    this.getProducts();
  }
  async getProducts() {
    try {
      this.products = await _ProductAPI.default.getProducts();
      console.log(this.products);
      this.render();
    } catch (err) {
      _Toast.default.show(err, 'error');
    }
  }

  // hot drink images from https://stock.adobe.com/au/search?k=coffee%20menu
  // iced coffee images from https://www.vectorstock.com/royalty-free-vector/coffee-menu-with-different-ice-drink-types-vector-33242437
  // the map function = for each
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    <va-app-header title=\"Products\" user=\"", "\"></va-app-header>\n    <div class=\"page-content\"> \n      <div class=\"products-container\">\n      <h1>View Products</h1>\n        <div class=\"products-top\"> \n          <div class=\"product-list\">\n              <sl-button type=\"primary\" size=\"large\" @click=", ">View Order</sl-button>\n              <sl-button type=\"primary\" size=\"large\" @click=", ">View Favourites</sl-button>\n              <sl-button class=\"red-btn\" type=\"primary\" size=\"large\" @click=", ">CHECKOUT</sl-button>      \n          </div>\n          \n          <div class=\"takeaway-cups-img\">\n              <img src=\"images/coffee-takeaway-cups-with-text-c.png\" alt=\"Takeaway coffee cup information\" class=\"responsive-img\">\n          </div>  \n\n          </div>\n          <hr>\n          <div class=\"products-grid\">\n            ", "\n      </div>\n       \n\n         \n     </div>\n    "])), JSON.stringify(_Auth.default.currentUser), () => (0, _Router.gotoRoute)('/orders'), () => (0, _Router.gotoRoute)('/favouriteProducts'), () => (0, _Router.gotoRoute)('/orders'), this.products == null ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n              <sl-spinner></sl-spinner>\n            "]))) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n              ", "\n            "])), this.products.map(product => (0, _litHtml.html)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n                <va-product class=\"product-card\"  \n                  id=\"", "\"\n                  name=\"", "\" \n                  description=\"", "\"\n                  price=\"$", "\"\n                  user=\"", "\"\n                  \n                  image=\"", "\"\n                  size=\"", "\"\n                  milk=\"", "\"\n                  shots=\"", "\"\n                >\n                </va-product>\n\n              "])), product._id, product.name, product.description, product.price, JSON.stringify(product.user), product.image, product.size, product.milk, product.shots))));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new ProductView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js","../../ProductAPI":"ProductAPI.js","../../Toast":"Toast.js"}],"views/pages/favouriteProducts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _Toast = _interopRequireDefault(require("./../../Toast"));
var _UserAPI = _interopRequireDefault(require("./../../UserAPI"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
class FavouriteProductsView {
  init() {
    document.title = 'Favourite Products';
    this.favProducts = null;
    this.render();
    _Utils.default.pageIntroAnim();
    this.getFavProducts();
  }
  async getFavProducts() {
    try {
      const currentUser = await _UserAPI.default.getUser(_Auth.default.currentUser._id);
      this.favProducts = currentUser.favouriteProducts;
      console.log(this.favouriteProducts);
      this.render();
    } catch (err) {
      _Toast.default.show(err, 'error');
    }
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      <va-app-header title=\"Favourites Products\" user=\"", "\"></va-app-header>\n      <div class=\"page-content\">   \n        <div class=\"fav-container\">     \n        <h1>Favourites</h1>\n        \n        <div class=\"fav-list\">\n          <sl-button type=\"primary\" size=\"large\" @click=", ">View Order</sl-button>\n          <sl-button type=\"primary\" size=\"large\" @click=", ">View Products</sl-button>\n          <sl-button class=\"red-btn\" type=\"primary\" size=\"large\" @click=", ">CHECKOUT</sl-button>      \n        </div>\n\n        <hr>\n        <br>\n\n        <p>Page content ...</p>\n\n      </div> \n      <div class=\"favourites-grid\">\n        ", "\n        </div>\n      </div>\n    "])), JSON.stringify(_Auth.default.currentUser), () => (0, _Router.gotoRoute)('/orders'), () => (0, _Router.gotoRoute)('/products'), () => (0, _Router.gotoRoute)('/orders'), this.favouriteProducts == null ? (0, _litHtml.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n          <sl-spinner></sl-spinner>\n        "]))) : (0, _litHtml.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n          ", "\n        "])), this.favProducts.map(product => (0, _litHtml.html)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n            <va-favourite-product class=\"favourite-card\"\n              id=\"", "\"\n              name=\"", "\"\n              description=\"", "\"\n              price=\"", "\"\n              user=\"", "\"\n              favourite=\"", "\" \n              image=\"", "\"\n              milk=\"", "\"\n              shots=\"", "\"\n            >        \n            </va-favourite-product>\n\n          "])), product._id, product.name, product.description, product.price, JSON.stringify(product.user), favourite.product, product.image, product.milk, product.shots))));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new FavouriteProductsView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js","./../../Toast":"Toast.js","./../../UserAPI":"UserAPI.js"}],"views/pages/newProduct.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _ProductAPI = _interopRequireDefault(require("../../ProductAPI"));
var _Toast = _interopRequireDefault(require("../../Toast"));
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
class newProductView {
  init() {
    document.title = 'New Product';
    this.render();
    _Utils.default.pageIntroAnim();
  }
  async newProductSubmitHandler(e) {
    // e = event and stops form from reloading the page
    e.preventDefault();
    e.preventDefault();
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.setAttribute('loading', '');
    const formData = e.detail.formData;
    try {
      await _ProductAPI.default.newProduct(formData);
      _Toast.default.show('Product added!');
      submitBtn.removeAttribute('loading');
      // reset form
      // reset text + textarea inputs
      const textInputs = document.querySelectorAll('sl-input, sl-textarea');
      if (textInputs) textInputs.forEach(textInput => textInput.value = null);
      // reset radio inputs
      const radioInputs = document.querySelectorAll('sl-radio');
      if (radioInputs) radioInputs.forEach(radioInput => radioInput.removeAttribute('checked'));
      // reset file input
      const fileInput = document.querySelector('input[type=file');
      if (fileInput) fileInput.value = null;
    } catch (err) {
      _Toast.default.show(err, 'error');
      submitBtn.removeAttribute('loading');
    }
  }
  // // Animation - from https://shoelace.style/components/animation/
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      <va-app-header title=\"Add Product\" user=\"", "\">\n      </va-app-header>\n      <div class=\"page-content\">   \n        <div class=\"new-product-page-container\">     \n          <h1>Add a new Product</h1>\n          <sl-form class=\"page-form\" @sl-submit=", ">\n            <input type=\"hidden\" name=\"user\" value=\"", "\" />\n            <div class=\"input-group\">\n              <sl-input name=\"name\" type=\"text\" placeholder=\"Product Name\" required></sl-input>\n            </div>\n            <div class=\"input-group\">              \n              <sl-input name=\"price\" type=\"text\" placeholder=\"Price\" required>\n                <span slot=\"prefix\">$</span>\n              </sl-input>\n            </div>\n            <div class=\"input-group\">\n              <sl-textarea name=\"description\" rows=\"3\" placeholder=\"Description\"></sl-textarea>\n            </div>\n            <div class=\"input-group\" style=\"margin-bottom: 2em;\">\n              <label><h4>Image<h4></label>\n              <input type=\"file\" name=\"image\" />              \n            </div>\n            <div class=\"input-group\" style=\"margin-bottom: 2em;\">\n              <label><h4>Milk</h4></p>\n              <sl-radio-group label=\"Select milk\" no-fieldset>\n                <sl-radio name=\"milk\" value=\"none\">None</sl-radio> &nbsp;\n                <sl-radio name=\"milk\" value=\"full-cream\">Full cream</sl-radio> &nbsp;\n                <sl-radio name=\"milk\" value=\"hilo\">Hilo</sl-radio> &nbsp;\n                <sl-radio name=\"milk\" value=\"skimmed\">Skimmed</sl-radio> &nbsp;\n                <sl-radio name=\"milk\" value=\"almond\">Almond</sl-radio> &nbsp;\n                <sl-radio name=\"milk\" value=\"oat\">Oat</sl-radio> &nbsp;\n                <sl-radio name=\"milk\" value=\"soy\">Soy</sl-radio> &nbsp;\n              </sl-radio-group>\n            </div>\n            <div class=\"input-group\" style=\"margin-bottom: 2em;\">\n              <label><h4>Size</h4></label>\n              <sl-radio-group label=\"Select size\" no-fieldset>\n                <sl-radio name=\"size\" value=\"small\">Small</sl-radio> &nbsp;\n                <sl-radio name=\"size\" value=\"medium\">Medium</sl-radio> &nbsp;\n                <sl-radio name=\"size\" value=\"large\">Large</sl-radio> &nbsp;\n              </sl-radio-group>\n            </div>\n            <div class=\"input-group\" style=\"margin-bottom: 2em;\">\n              <label><h4>Shots</h4></label>\n              <sl-radio-group label=\"Select size\" no-fieldset>\n                <sl-radio name=\"shots\" value=\"1\">1</sl-radio> &nbsp;\n                <sl-radio name=\"shots\" value=\"2\">2</sl-radio> &nbsp;\n                <sl-radio name=\"shots\" value=\"3\">3</sl-radio> &nbsp;\n              </sl-radio-group>\n            </div>\n            <sl-animation name=\"jello\" duration=\"2000\" play iterations=\"2\">\n              <sl-button type=\"primary\" class=\"submit-btn\" submit>Add Product</sl-button>\n            </sl-animation>\n          </sl-form>\n        </div>\n        \n      </div>      \n    "])), JSON.stringify(_Auth.default.currentUser), this.newProductSubmitHandler, _Auth.default.currentUser._id);
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new newProductView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js","../../ProductAPI":"ProductAPI.js","../../Toast":"Toast.js"}],"views/pages/location.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
class LocationView {
  init() {
    document.title = 'Location';
    this.render();
    _Utils.default.pageIntroAnim();
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      <va-app-header title=\"Location\" user=\"", "\"></va-app-header>\n      <div class=\"page-content\">        \n        <div class=\"location-info\">  \n         <div class=\"current-location\">\n            <br>\n            <p></p>\n            <h1>Currently at</h1>\n            <p>Hyde Park Festival<br>\n              Hyde Park<br>\n              Corner Vincent Street & William Street<br>\n              Perth\n            </p>\n\n            <br><br>\n\n            <hr>\n            \n            <br><br>\n          \n          <div class=\"next-spot\">\n            <h1>Next spot</h1>\n            <p>Perth Royal Show<br>\n              Claremont Showgrounds<br>\n              Claremont\n            </p>\n            <p>22 - 29 November 2024</p>\n          </div>\n        </div>\n        <div class=\"location-map\" class=\"responsive-img\" >  \n          \n          <iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.8410301466956!2d115.85982197578481!3d-31.938073074025386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32bac8b73c3ae5%3A0xf04f0b618f1ddc0!2sHyde%20Park!5e0!3m2!1sen!2sau!4v1731065135897!5m2!1sen!2sau\" \n            width=\"1024\" height=\"600\" style=\"border:0;\" \n            allowfullscreen=\"\" loading=\"lazy\" \n            referrerpolicy=\"no-referrer-when-downgrade\">\n          </iframe>\n      \n\n        </div>\n        <div class=\"event-banner\">\n          <img src=\"/images/event-banner.png\">\n        </div>\n      </div>      \n    "])), JSON.stringify(_Auth.default.currentUser));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new LocationView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js"}],"views/pages/hairdressers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("../../App"));
var _litHtml = require("lit-html");
var _Router = require("../../Router");
var _Auth = _interopRequireDefault(require("../../Auth"));
var _Utils = _interopRequireDefault(require("../../Utils"));
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); } // code not currently in use //
class HairdressersView {
  init() {
    document.title = 'Hairdressers';
    this.render();
    _Utils.default.pageIntroAnim();
  }
  render() {
    const template = (0, _litHtml.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n      <va-app-header title=\"Hairdressers\" user=\"", "\"></va-app-header>\n      <div class=\"page-content\">        \n        <h1>Hairdressers</h1>\n        <p>Page content ...</p>\n        \n      </div>      \n    "])), JSON.stringify(_Auth.default.currentUser));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }
}
var _default = exports.default = new HairdressersView();
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js"}],"Router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anchorRoute = anchorRoute;
exports.default = void 0;
exports.gotoRoute = gotoRoute;
var _home = _interopRequireDefault(require("./views/pages/home"));
var _ = _interopRequireDefault(require("./views/pages/404"));
var _signin = _interopRequireDefault(require("./views/pages/signin"));
var _signup = _interopRequireDefault(require("./views/pages/signup"));
var _profile = _interopRequireDefault(require("./views/pages/profile"));
var _editProfile = _interopRequireDefault(require("./views/pages/editProfile"));
var _guide = _interopRequireDefault(require("./views/pages/guide"));
var _mentalHealth = _interopRequireDefault(require("./views/pages/mentalHealth"));
var _mentalHealthExpanded = _interopRequireDefault(require("./views/pages/mentalHealthExpanded"));
var _mindfulness = _interopRequireDefault(require("./views/pages/mindfulness"));
var _mindfulnessExpanded = _interopRequireDefault(require("./views/pages/mindfulnessExpanded"));
var _resources = _interopRequireDefault(require("./views/pages/resources"));
var _resourcesExpanded = _interopRequireDefault(require("./views/pages/resourcesExpanded"));
var _favouriteLines = _interopRequireDefault(require("./views/pages/favouriteLines"));
var _about = _interopRequireDefault(require("./views/pages/about"));
var _products = _interopRequireDefault(require("./views/pages/products"));
var _favouriteProducts = _interopRequireDefault(require("./views/pages/favouriteProducts"));
var _newProduct = _interopRequireDefault(require("./views/pages/newProduct"));
var _location = _interopRequireDefault(require("./views/pages/location"));
var _hairdressers = _interopRequireDefault(require("./views/pages/hairdressers"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// import views

// define routes
const routes = {
  '/': _home.default,
  '404': _.default,
  '/signin': _signin.default,
  '/signup': _signup.default,
  '/profile': _profile.default,
  '/editProfile': _editProfile.default,
  '/guide': _guide.default,
  '/mentalHealth': _mentalHealth.default,
  '/mentalHealthExpanded': _mentalHealthExpanded.default,
  '/mindfulness': _mindfulness.default,
  '/mindfulnessExpanded': _mindfulnessExpanded.default,
  '/resources': _resources.default,
  '/resourcesExpanded': _resourcesExpanded.default,
  '/favouriteLines': _favouriteLines.default,
  '/about': _about.default,
  '/products': _products.default,
  '/newProduct': _newProduct.default,
  '/favouriteProducts': _favouriteProducts.default,
  '/location': _location.default,
  '/hairdressers': _hairdressers.default
};
class Router {
  constructor() {
    this.routes = routes;
  }
  init() {
    // initial call
    this.route(window.location.pathname);

    // on back/forward
    window.addEventListener('popstate', () => {
      this.route(window.location.pathname);
    });
  }
  route(fullPathname) {
    // extract path without params
    const pathname = fullPathname.split('?')[0];
    const route = this.routes[pathname];
    if (route) {
      // if route exists, run init() of the view
      this.routes[window.location.pathname].init();
    } else {
      // show 404 view instead
      this.routes['404'].init();
    }
  }
  gotoRoute(pathname) {
    window.history.pushState({}, pathname, window.location.origin + pathname);
    this.route(pathname);
  }
}

// create appRouter instance and export
const AppRouter = new Router();
var _default = exports.default = AppRouter; // programmatically load any route
function gotoRoute(pathname) {
  AppRouter.gotoRoute(pathname);
}

// allows anchor <a> links to load routes
function anchorRoute(e) {
  e.preventDefault();
  const pathname = e.target.closest('a').pathname;
  AppRouter.gotoRoute(pathname);
}
},{"./views/pages/home":"views/pages/home.js","./views/pages/404":"views/pages/404.js","./views/pages/signin":"views/pages/signin.js","./views/pages/signup":"views/pages/signup.js","./views/pages/profile":"views/pages/profile.js","./views/pages/editProfile":"views/pages/editProfile.js","./views/pages/guide":"views/pages/guide.js","./views/pages/mentalHealth":"views/pages/mentalHealth.js","./views/pages/mentalHealthExpanded":"views/pages/mentalHealthExpanded.js","./views/pages/mindfulness":"views/pages/mindfulness.js","./views/pages/mindfulnessExpanded":"views/pages/mindfulnessExpanded.js","./views/pages/resources":"views/pages/resources.js","./views/pages/resourcesExpanded":"views/pages/resourcesExpanded.js","./views/pages/favouriteLines":"views/pages/favouriteLines.js","./views/pages/about":"views/pages/about.js","./views/pages/products":"views/pages/products.js","./views/pages/favouriteProducts":"views/pages/favouriteProducts.js","./views/pages/newProduct":"views/pages/newProduct.js","./views/pages/location":"views/pages/location.js","./views/pages/hairdressers":"views/pages/hairdressers.js"}],"App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Router = _interopRequireDefault(require("./Router"));
var _Auth = _interopRequireDefault(require("./Auth"));
var _Toast = _interopRequireDefault(require("./Toast"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class App {
  constructor() {
    this.name = "Mindline";
    this.version = "1.0.0";
    this.apiBase = "https://mindlineau.onrender.com";
    //this.apiBase = "http://localhost:3000";
    this.rootEl = document.getElementById("root");
    this.version = "1.0.0";
  }
  init() {
    console.log("App.init");

    // Toast init
    _Toast.default.init();

    // Authentication check    
    _Auth.default.check(() => {
      // authenticated! init Router
      _Router.default.init();
    });
  }
}
var _default = exports.default = new App();
},{"./Router":"Router.js","./Auth":"Auth.js","./Toast":"Toast.js"}],"components/va-app-header.js":[function(require,module,exports) {
"use strict";

var _litElement = require("@polymer/lit-element");
var _Router = require("./../Router");
var _Auth = _interopRequireDefault(require("./../Auth"));
var _App = _interopRequireDefault(require("./../App"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
// Privacy information adapted from: https://business.vic.gov.au/tools-and-templates/privacy-policy-template
// Terms & Conditions adapted from: https://dataportal.health.gov.au/wps/portal/dataportalcontent/termsandconditions/!ut/p/z1/lZFNT8JAEIb_ihw4bmb6sbA9VjC2IBKiWLoXst0WWEO3pd2g-OvZGo9aw9wm887H-wxw2ADX4qz2wqhKi6PNUz7a0ngeo4_uHBdTH8OA0lVAY2TzMSTfAvwjQgTe3_8GHHgtVQ6pFJ70HNwRhzGf-IJSwihDEmSewEwUmRwFnVpqU5sDpLkwoq4aI453stKm0GaI7aU1RTlEUzRlK3RuC7nqvLQ_l_acwvuNJN3ufklqV4y3znKC0czHp-WrT3GFK_dhGjmIrp1xVsUHrHXVlBbuy43eI4TZfzztw9xmMVns7WRhDkTpXQWbX3BYoXo_nXhogXb0Pg1sbiRal-uSeReiv-6fyWPC2nAwuALLZKub/dz/d5/L2dBISEvZ0FBIS9nQSEh/
customElements.define('va-app-header', class AppHeader extends _litElement.LitElement {
  constructor() {
    super();
  }
  static get properties() {
    return {
      title: {
        type: String
      },
      user: {
        type: Object
      }
    };
  }
  firstUpdated() {
    super.firstUpdated();
    this.navActiveLinks();
  }
  navActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = this.shadowRoot.querySelectorAll('.app-top-nav a, .app-side-menu-items a');
    navLinks.forEach(navLink => {
      if (navLink.href.slice(-1) == '#') return;
      if (navLink.pathname === currentPath) {
        navLink.classList.add('active');
      }
    });
  }
  hamburgerClick() {
    const appMenu = this.shadowRoot.querySelector('.app-side-menu');
    appMenu.show();
  }
  menuClick(e) {
    e.preventDefault();
    const pathname = e.target.closest('a').pathname;
    const appSideMenu = this.shadowRoot.querySelector('.app-side-menu');
    // hide appMenu
    appSideMenu.hide();
    appSideMenu.addEventListener('sl-after-hide', () => {
      // goto route after menu is hidden
      (0, _Router.gotoRoute)(pathname);
    });
  }
  handleTitleClick(path, e) {
    e.preventDefault();
    (0, _Router.gotoRoute)(path);
  }
  handleChevronClick(e) {
    e.stopPropagation();
    const details = e.target.closest('sl-details');
    if (details) {
      details.open = !details.open;
    }
  }
  render() {
    return (0, _litElement.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n   <style>\n    * {\n        box-sizing: border-box;\n    }\n    \n    .app-header {\n        background: transparent;\n        position: fixed;\n        top: 0;\n        right: 0;\n        left: 0;\n        height: var(--app-header-height);\n        color: #fff;\n        display: flex;\n        z-index: 9;\n        box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.2);\n        align-items: center;\n    }\n    \n    .app-header-main {\n        flex-grow: 1;\n        display: flex;\n        align-items: center;\n    }\n    \n    .app-header-main::slotted(h1) {\n        color: #fff;\n    }\n    \n    .app-logo a {\n        color: #fff;\n        text-decoration: none;\n        font-weight: bold;\n        font-size: 1.2em;\n        padding: .6em;\n        display: inline-block;\n    }\n    \n    .app-logo img {\n        width: 90px;\n    }\n    \n    .hamburger-btn::part(base) {\n        color: #fff;\n    }\n    \n    .app-top-nav {\n        display: flex;\n        height: 100%;\n        align-items: center;\n    }\n    \n    .app-top-nav a {\n        display: inline-block;\n        padding: .8em;\n        text-decoration: none;\n        color: #fff;\n    }\n    \n    .app-side-menu-items a {\n        display: block;\n        padding: 0.5em;\n        text-decoration: none;\n        font-size: 1.3em;\n        color: var(--app-header-txt-color);\n        padding-bottom: 0.5em;\n    }\n    \n    .app-side-menu-logo {\n        width: 150px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        top: 1em;\n        display: block;\n    }\n    \n    .page-title {\n        color: var(--app-header-txt-color);\n        margin-right: 0.5em;\n        font-size: var(--app-header-title-font-size);\n    }\n    /* active nav links */\n    \n    .app-top-nav a.active,\n    .menu-item::part(label):hover {\n        color: #fff;\n    }\n    \n    sl-details::part(summary) {\n        transition: color 0.3s ease;\n    }\n    \n    sl-details::part(summary):hover {\n        color: var(--sl-color-primary-600);\n        cursor: pointer;\n    }\n    \n    .menu-expand {\n        transition: color 0.3s ease;\n        text-decoration: none;\n    }\n     .menu-static:hover {\n        color: var(--sl-color-primary-600);\n  }\n    .menu-expand:hover {\n        color: var(--sl-color-primary-600);\n        padding-left: 1.5em;\n        transition: all 0.5s ease;\n    }\n    /* right side menu */\n    \n    .right-side-menu {\n        --base-txt-color: #2F1E1F;\n    }\n    \n    .user-menu {\n        margin-right: 2em;\n    }\n    \n    .menu-expand {\n        font-size: 1.3em;\n        margin-left: 1em;\n        margin-top: 0.5em;\n      }\n\n      sl-drawer::part(label) {\n    padding: 0.6em;\n    \n    \n\n  }\n\n  sl-details::part(base) {\n  display: block;\n  border: none;\n  padding: 0.65em;\n}\n\nsl-details::part(content) {\n  border: none;\n  padding: 0;\n}\n\nsl-details::part(header) {\n  border: none;\n  padding: 0;\n}\n\nsl-details::part(summary) {\n  color: var(--sl-color-neutral-600);\n  font-size: 1.3em;\n  color: var(--app-header-txt-color);\n}\n\nsl-details::part(base) {\n  border: none;\n}\n\n\n      /* RESPONSIVE - MOBILE --------------------- */\n      @media all and (max-width: 768px){       \n        \n\n\n        .app-top-nav {\n            display: none;\n        }\n    }\n    \n    .home-logo {\n        cursor: pointer;\n        width: 150px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        position: absolute;\n        top: 30px;\n        left: 42%;\n        z-index: 2;\n    }\n    \n    .header-logo {\n        cursor: pointer;\n        width: 120px !important;\n        height: auto !important;\n        /* Remove fixed height to maintain aspect ratio */\n        position: absolute;\n        top: 15px;\n        left: 5em;\n        z-index: 2;\n    }\n</style>\n\n    <header class=\"app-header\">\n        <sl-icon-button class=\"hamburger-btn\" name=\"list\" @click=\"", "\" style=\"font-size: 2em;\"></sl-icon-button>\n        <a href=\"/\" @click=\"", "\"><img class=\"header-logo\" src=\"/images/logo/mindline-white-logo.svg\"></a>\n\n        <div class=\"app-header-main\">\n            ", "\n            <slot></slot>\n        </div>\n\n        <nav class=\"app-top-nav\">\n\n            ", " ", "\n\n            <sl-dropdown class=\"user-menu\">\n                <a slot=\"trigger\" href=\"#\" @click=\"", "\">\n                    <sl-avatar style=\"--size: 40px;\" image=", "></sl-avatar> ", "\n                </a>\n                <sl-menu class=\"right-side-menu\">\n                    <sl-menu-item @click=\"", "\">Profile</sl-menu-item>\n                    <sl-menu-item @click=\"", "\">Edit Profile</sl-menu-item>\n                    <sl-menu-item @click=\"", "\">Sign Out</sl-menu-item>\n                </sl-menu>\n            </sl-dropdown>\n        </nav>\n    </header>\n\n    <sl-drawer class=\"app-side-menu\" placement=\"left\">\n        <div slot=\"label\">\n            <a href=\"/\" @click=\"", "\"><img class=\"app-side-menu-logo\" src=\"/images/logo-mindline-trimmed-no-wording-clr.svg\"></a>\n        </div>\n        <br>\n        <nav class=\"app-side-menu-items\">\n            ", " ", "\n\n\n\n\n        </nav>\n    </sl-drawer>\n    "])), this.hamburgerClick, _Router.anchorRoute, this.title ? (0, _litElement.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n            <h1 class=\"page-title\">", "</h1> "])), this.title) : "", this.user.accessLevel == 2 ? (0, _litElement.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n            <a href=\"/newProduct\" @click=\"", "\">Add Bookmarks</a>\n            <a href=\"/orders\" @click=\"", "\">View Bookmarks</a> "])), _Router.anchorRoute, _Router.anchorRoute) : '', this.user.accessLevel == 1 ? (0, _litElement.html)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral([" "]))) : '', e => e.preventDefault(), this.user && this.user.avatar ? "".concat(_App.default.apiBase, "/images/").concat(this.user.avatar) : '', this.user && this.user.firstName, () => (0, _Router.gotoRoute)('/profile'), () => (0, _Router.gotoRoute)('/editProfile'), () => _Auth.default.signOut(), this.menuClick, this.user.accessLevel == 1 ? (0, _litElement.html)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n            <a class=\"menu-static\" href=\"/\" @click=\"", "\">Home</a>\n            <sl-details>\n                <div slot=\"summary\" class=\"summary-content\">\n                    <span class=\"summary-title\" @click=\"", "\">Mental Health</span>\n                </div>\n                <a class=\"menu-expand\" href=\"#\" @click=", ">Stress</a>\n                <a class=\"menu-expand\" href=\"#\" @click=", ">Anxiety</a>\n                <a class=\"menu-expand\" href=\"#\" @click=", ">Depression</a>\n            </sl-details>\n            <sl-details>\n                <div slot=\"summary\" class=\"summary-content\">\n                    <span class=\"summary-title\" @click=\"", "\">Mindfulness</span>\n                </div>\n                <a class=\"menu-expand\" href=\"#\" @click=", ">Meditation</a>\n                <a class=\"menu-expand\" href=\"#\" @click=", ">Breathing</a>\n                <a class=\"menu-expand\" href=\"#\" @click=", ">Motivation</a>\n            </sl-details>\n            <sl-details>\n                <div slot=\"summary\" class=\"summary-content\">\n                    <span class=\"summary-title\" @click=\"", "\">Resources</span>\n                </div>\n                <a class=\"menu-expand\" href=\"#\" @click=", ">Support</a>\n                <a class=\"menu-expand\" href=\"#\" @click=", ">Services</a>\n                <a class=\"menu-expand\" href=\"#\" @click=", ">Guides</a>\n            </sl-details>\n\n            <a class=\"menu-static\" href=\"/about\" @click=\"", "\">About</a>\n\n            <a class=\"menu-static\" href=\"/profile\" @click=\"", "\">Profile</a>\n            <a class=\"menu-static\" href=\"/favouriteLines\" @click=\"", "\">favourites</a>\n            <hr style=\"color: #fff width:10%\">\n\n            <sl-details summary=\"Privacy\">\n                <p>\n                    We care about your privacy. Mindline AU will not knowingly give away, sell or provide your personal information \n                    to a third party unless you conscent to that or it is required by law. The information that is collected about \n                    you allow you the user to bookmark information you would like to come back to at anytime. You can update or change \n                    your details at any time. If you wish to be removed from our database, please contact Mindline AU in writing. \n                </p>\n                \n                <p>\n                    <strong>Security of Personal Information</strong>\n                    Your Personal Information is stored in a manner that reasonably protects it from misuse and loss and from \n                    unauthorized access, modification or disclosure\n                </p>\n                \n            </sl-details>\n\n            <sl-details summary=\"T&Cs\">\n                <p>\n                    Ok we know this is boring stuff, but we need to let you know that the content and media on the Mindline AU \n                    web application are created and published online for informational purposes only. It is not intended to be \n                    a substitute for professional medical advice and should not be relied on as health or personal advice.\n                </p>\n                \n                <p>\n                    Always seek the guidance of your doctor or other qualified health professional with any questions you may \n                    have regarding your health or a medical condition. Never disregard the advice of a medical professional, or \n                    delay in seeking it because of something you have read on this web application.\n                </p>\n\n                <p>\n                    If you think you may have a medical emergency, call your doctor, go to the nearest hospital emergency department, \n                    or call the emergency services immediately. If you choose to rely on any information provided by Mindline AU, you \n                    do so solely at your own risk.\n                </p>\n\n                <p>\n                    External (outbound) links to other web applications or educational material (e.g. video, audio, books, apps\u2026) that \n                    are not explicitly created by Mindline AU are followed at your own risk. Under no circumstances is Mindline AU \n                    responsible for the claims of third-party web applications or educational providers.\n                </p>\n\n                <p>If you wish to seek clarification on the above matters, please get in touch with Mindline AU.</p>\n                            \n                <p> \n                    <strong>Use License</strong>\n                    Permission is granted to download materials (information or software) on <i>Mindline</i> AU&apos;s web application \n                    for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license \n                    you may not:\n                </p>\n                        <ul>\n                            <li>modify or copy the materials;</li>\n                            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>\n                            <li>attempt to decompile or reverse engineer any software contained on <i>Mindline</i> AU&apos;s web application;</li>\n                            <li>remove any copyright or other proprietary notations from the materials; or transfer the materials \n                                to another person\n                            </li> \n                            <li>or \u201Cmirror\u201D the materials on any other server.</li>\n                        </ul>    \n                    \n                <p>\n                    <strong>Materials Disclaimer</strong>\n                    The materials on Mindline AU web application are provided on an as is basis. Clear Head makes no warranties, expressed \n                    or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or \n                    conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.\n                </p>\n                                \n                <p>\n                    Further, Mindline AU does not warrant or make any representations concerning the accuracy, likely results, or reliability \n                    of the use of the materials on its web application or otherwise relating to such materials or on any sites linked to this \n                    site.\n                </p>\n\n                <p>\n                    <strong>Limitations</strong>\n                    In no event shall Mindline AU or its suppliers be liable for any damages (including, without limitation, damages \n                    for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials \n                    on Mindline AU&apos;s web application, even if Mindline AU or a Mindline AU authorised representative has been notified \n                    orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied \n                    warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.\n                </p>\n\n                <p>    \n                    <strong>Accuracy of materials</strong>\n                    The materials appearing on Mindline AU web application could include technical, typographical, or photographic \n                    errors. Mindline AU does not warrant that any of the materials on its web application are accurate, complete or \n                    current. Mindline AU may make changes to the materials contained on its web application at any time without notice. \n                    However, Mindline AU is not able to make any commitment when materials are updated.\n                </p>\n\n                <p> \n                    <strong>Links</strong>        \n                    Mindline AU has not reviewed all of the sites linked to its web application and is not responsible for \n                    the contents of any such linked site. The inclusion of any link does not imply endorsement by Mindline AU \n                    of the site. Use of any such linked web application is at the user&apos;s own risk.\n                </p>\n\n                </p>\n                    <strong>Modifications</strong>\n                    Mindline AU may revise these terms and conditions for its web application at any time without notice. \n                    By using this web application, you are agreeing to be bound by the then current version of these terms \n                    and conditions.\n                </p>\n\n            </sl-details>\n\n            <sl-details summary=\"Socials\">\n                <p>We've done something different and skipped the socials to let you to focus on YOU!</p>\n            </sl-details>\n\n            <hr style=\"color: #fff width:10%\">\n\n            <a href=\"mailto:hello@mindline.telstra.com.au\">hello@mindline.telstra.com.au</a>\n            <a href=\"tel:1800 034 034\">1800 034 034</a> "])), this.menuClick, e => this.handleTitleClick('/mentalHealth', e), () => (0, _Router.gotoRoute)('/mentalHealthExpanded?tab=stress'), () => (0, _Router.gotoRoute)('/mentalHealthExpanded?tab=anxiety'), () => (0, _Router.gotoRoute)('/mentalHealthExpanded?tab=depression'), e => this.handleTitleClick('/mindfulness', e), () => (0, _Router.gotoRoute)('/mindfulnessExpanded?tab=meditation'), () => (0, _Router.gotoRoute)('/mindfulnessExpanded?tab=breathing'), () => (0, _Router.gotoRoute)('/mindfulnessExpanded?tab=motivation'), e => this.handleTitleClick('/resources', e), () => (0, _Router.gotoRoute)('/resourcesExpanded?tab=support'), () => (0, _Router.gotoRoute)('/resourcesExpanded?tab=services'), () => (0, _Router.gotoRoute)('/resourcesExpanded?tab=guides'), this.menuClick, this.menuClick, this.menuClick) : '', this.user.accessLevel == 2 ? (0, _litElement.html)(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n            <a class=\"menu-static\" href=\"/\" @click=\"", "\">Home</a>\n            <sl-details>\n                <div slot=\"summary\" class=\"summary-content\">\n                    <span class=\"summary-title\" @click=\"", "\">Mental Health</span>\n                </div>\n                <a class=\"menu-expand\" href=\"\">Stress</a>\n                <a class=\"menu-expand\" href=\"\">Anxiety</a>\n                <a class=\"menu-expand\" href=\"\">Depression</a>\n            </sl-details>\n            <sl-details>\n                <div slot=\"summary\" class=\"summary-content\">\n                    <span class=\"summary-title\" @click=\"", "\">Mindfulness</span>\n                </div>\n                <a class=\"menu-expand\" href=\"\">Meditation</a>\n                <a class=\"menu-expand\" href=\"\">Breathing</a>\n                <a class=\"menu-expand\" href=\"\">Motivation</a>\n            </sl-details>\n            <sl-details>\n                <div slot=\"summary\" class=\"summary-content\">\n                    <span class=\"summary-title\" @click=\"", "\">Resources</span>\n                </div>\n                <a class=\"menu-expand\" href=\"\">Support</a>\n                <a class=\"menu-expand\" href=\"\">Services</a>\n                <a class=\"menu-expand\" href=\"\">Guides</a>\n            </sl-details>\n            <a class=\"menu-static\" href=\"/favouriteLines\" @click=\"", "\">favourites</a>\n            <a class=\"menu-static\" href=\"/about\" @click=\"", "\">About</a>\n            <a class=\"menu-static\" href=\"/profile\" @click=\"", "\">Profile</a>\n\n            <hr style=\"color: #fff width:10%\">\n\n            <sl-details summary=\"Privacy\">\n                <p>\n                    We care about your privacy. Mindline AU will not knowingly give away, sell or provide your personal information \n                    to a third party unless you conscent to that or it is required by law. The information that is collected about \n                    you allow you the user to bookmark information you would like to come back to at anytime. You can update or change \n                    your details at any time. If you wish to be removed from our database, please contact Mindline AU in writing. \n                </p>\n                \n                <p>\n                    <strong>Security of Personal Information</strong>\n                    Your Personal Information is stored in a manner that reasonably protects it from misuse and loss and from \n                    unauthorized access, modification or disclosure\n                </p>\n\n            </sl-details>\n\n            <sl-details summary=\"T&Cs\">\n                \n                <p>\n                    Ok we know this is the boring stuff, but we need to let you know that the content and media on the Mindline AU \n                    web application are created and published online for informational purposes only. It is not intended to be \n                    a substitute for professional medical advice and should not be relied on as health or personal advice.\n                </p>\n                \n                <p>\n                    Always seek the guidance of your doctor or other qualified health professional with any questions you may \n                    have regarding your health or a medical condition. Never disregard the advice of a medical professional, or \n                    delay in seeking it because of something you have read on this web application.\n                </p>\n\n                <p>\n                    If you think you may have a medical emergency, call your doctor, go to the nearest hospital emergency department, \n                    or call the emergency services immediately. If you choose to rely on any information provided by Mindline AU, you \n                    do so solely at your own risk.\n                </p>\n\n                <p>\n                    External (outbound) links to other web applications or educational material (e.g. video, audio, books, apps\u2026) that \n                    are not explicitly created by Mindline AU are followed at your own risk. Under no circumstances is Mindline AU \n                    responsible for the claims of third-party web applications or educational providers.\n                </p>\n\n                <p>If you wish to seek clarification on the above matters, please get in touch with Mindline AU.</p>\n                            \n                <p> \n                <strong>Use License</strong>\n                    Permission is granted to download materials (information or software) on <i>Mindline</i> AU&apos;s web application \n                    for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license \n                    you may not:\n                </p>\n                    <ul>\n                        <li>modify or copy the materials;</li>\n                        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>\n                        <li>attempt to decompile or reverse engineer any software contained on <i>Mindline</i> AU&apos;s web application;</li>\n                        <li>remove any copyright or other proprietary notations from the materials; or transfer the materials \n                            to another person\n                        </li> \n                        <li>or \u201Cmirror\u201D the materials on any other server.</li>\n                    </ul>    \n                    \n                <p>\n                <strong>Materials Disclaimer</strong>\n                    The materials on Mindline AU web application are provided on an as is basis. Clear Head makes no warranties, expressed \n                    or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or \n                    conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.\n                </p>\n                                \n                <p>\n                    Further, Mindline AU does not warrant or make any representations concerning the accuracy, likely results, or reliability \n                    of the use of the materials on its web application or otherwise relating to such materials or on any sites linked to this \n                    site.\n                </p>\n\n                <p>\n                    <strong>Limitations</strong>\n                    In no event shall Mindline AU or its suppliers be liable for any damages (including, without limitation, damages \n                    for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials \n                    on Mindline AU&apos;s web application, even if Mindline AU or a Mindline AU authorised representative has been notified \n                    orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied \n                    warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.\n                </p>\n\n                <p>    \n                    <strong>Accuracy of materials</strong>\n                    The materials appearing on Mindline AU web application could include technical, typographical, or photographic \n                    errors. Mindline AU does not warrant that any of the materials on its web application are accurate, complete or \n                    current. Mindline AU may make changes to the materials contained on its web application at any time without notice. \n                    However, Mindline AU is not able to make any commitment when materials are updated.\n                </p>\n\n                <p> \n                <strong>Links</strong>        \n                    Mindline AU has not reviewed all of the sites linked to its web application and is not responsible for \n                    the contents of any such linked site. The inclusion of any link does not imply endorsement by Mindline AU \n                    of the site. Use of any such linked web application is at the user&apos;s own risk.\n                </p>\n\n                </p>\n                <strong>Modifications</strong>\n                    Mindline AU may revise these terms and conditions for its web application at any time without notice. \n                    By using this web application, you are agreeing to be bound by the then current version of these terms \n                    and conditions.\n                </p>\n\n            </sl-details>\n\n            <sl-details summary=\"Socials\">\n\n                <p>We've done something different and skipped the socials to let you focus on YOU!</p>\n           \n            </sl-details>\n\n            <hr style=\"color: #fff width:10%\">\n\n            <a href=\"mailto:hello@mindline.telstra.com.au\">hello@mindline.telstra.com.au</a>\n            <a href=\"tel:1800 034 034\">1800 034 034</a> \n            \n        "])), this.menuClick, e => this.handleTitleClick('/mentalHealth', e), e => this.handleTitleClick('/mindfulness', e), e => this.handleTitleClick('/resources', e), this.menuClick, this.menuClick, this.menuClick) : '');
  }
});
},{"@polymer/lit-element":"../node_modules/@polymer/lit-element/lit-element.js","./../Router":"Router.js","./../Auth":"Auth.js","./../App":"App.js"}],"components/va-product.js":[function(require,module,exports) {
"use strict";

var _litElement = require("@polymer/lit-element");
var _litHtml = require("lit-html");
var _Router = require("../Router");
var _Auth = _interopRequireDefault(require("../Auth"));
var _App = _interopRequireDefault(require("../App"));
var _UserAPI = _interopRequireDefault(require("../UserAPI"));
var _Toast = _interopRequireDefault(require("../Toast"));
var _templateObject, _templateObject2;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
customElements.define('va-product', class Product extends _litElement.LitElement {
  constructor() {
    super();
  }
  static get properties() {
    return {
      id: {
        type: String
      },
      name: {
        type: String
      },
      description: {
        type: String
      },
      price: {
        type: String
      },
      user: {
        type: Object
      },
      image: {
        type: String
      },
      size: {
        type: String
      },
      milk: {
        type: String
      },
      shots: {
        type: String
      }
    };
  }
  firstUpdated() {
    super.firstUpdated();
  }
  moreInfoHandler() {
    // create sl-dialog
    const dialogEl = document.createElement('sl-dialog');

    // add className
    dialogEl.className = 'product-dialog';

    // sl-dialog content
    // created new variable to store all the content inside the dialog
    const dialogContent = (0, _litElement.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        <style>\n            .wrap {\n                display: flex;\n                height: 470px;\n            }\n            .image {\n                width: 50%;\n                height: auto;\n                margin-left: 50px;\n                margin-top: 0;\n                padding: 0;\n            }\n            .image img {\n                width: 100%;\n            }\n            .content {\n                padding-left: 1em;\n            }\n            .milk span,\n            .shots span {\n                text-transform: uppercase;\n                font-weight: bold;\n            }\n            .size {\n                font-size: 1.5em;\n                color: var(--brand-color)\n            }\n            .price {\n                font-size: 1.5em;\n                color: var(--brand-color)\n            }\n            </style>\n        <div class=\"wrap\">\n            \n            <div class=\"image\">\n                <img src=\"", "/images/", "\" alt=\"", "\" />\n            </div>\n            <div class=\"content\">\n                <h1>", "</h1>\n                <p>", "</p>\n                <p class=\"price\">", "</p>\n                <p class=\"size\">size: <span>", "</span></p>\n                <p class=\"milk\">milk: <span>", "</span></p>\n                <p class=\"shots\">shots: <span>", "</span></p>\n                \n                <hr style=\"3px\">\n                \n                <sl-button @click=", ">\n                    <sl-icon slot=\"prefix\" style=\"font-size: 24px\" name=\"star-fill\"></sl-icon>\n                    Add to Favourites\n                </sl-button>\n                <sl-button @click=", ">\n                    <sl-icon-button class=\"cart-icon\" name=\"cart3\" style=\"font-size: 24px\" label=\"Add to Cart\" @click=", ">\n                    Add to Cart\n                </sl-icon-button>\n                \n            </div>\n        </div>\n        "])), _App.default.apiBase, this.image, this.name, this.name, this.description, this.price, this.size, this.milk, this.shots, this.addFavHandler.bind(this), this.addCartHandler.bind(this), this.addCartHandler);
    //sl-dialog content

    // actions - where is the html to render (dialogContent) and what element inserting inside the dialog (dialogEl)
    (0, _litHtml.render)(dialogContent, dialogEl);

    // append to document.body to view but still hidden as dialogs are hidden by default
    document.body.append(dialogEl);

    // need to run the show method to see the sl-dialog
    dialogEl.show();

    // on hide delete dialogEl
    dialogEl.addEventListener('sl-after-hide', () => {
      dialogEl.remove();
    });
  }
  async addFavHandler() {
    try {
      await _UserAPI.default.addFavProduct(this.id);
      _Toast.default.show('Product added to favourites');
    } catch (err) {
      _Toast.default.show(err, 'error');
    }
  }
  async addCartHandler() {
    try {
      await _UserAPI.default.addCartProducts(this.id);
      _Toast.default.show('Product added to Order');
    } catch (err) {
      _Toast.default.show(err, 'error');
    }
  }

  // the visuals the user sees in the browser including the styling
  // use .bind(this) when need to bind an event handler in a function to the Class and not to the element, like on the below buttons 
  render() {
    return (0, _litElement.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n        <style>\n            .product-card {\n                box-shadow: 8px 5px 20px rgba(0,0,0.1);\n            }\n        </style>\n        \n       <sl-card>\n        <img slot=\"image\" src=\"", "/images/", "\" />\n        <h2>", "</h2>\n        <h3>", "</h3>\n        <hr>\n        <sl-button @click=", ">More Info</sl-button>\n        <sl-icon-button name=\"star-fill\" style=\"font-size: 24px\" label=\"Add to Favourites\" @click=", "></sl-icon-button>\n        <sl-icon-button name=\"cart3\" style=\"font-size: 24px\" label=\"Add to Cart\" @click=", "></sl-icon-button>\n       </sl-card>\n        \n        "])), _App.default.apiBase, this.image, this.name, this.price, this.moreInfoHandler.bind(this), this.addFavHandler.bind(this), this.addCartHandler.bind(this));
  }
});
},{"@polymer/lit-element":"../node_modules/@polymer/lit-element/lit-element.js","lit-html":"../node_modules/lit-html/lit-html.js","../Router":"Router.js","../Auth":"Auth.js","../App":"App.js","../UserAPI":"UserAPI.js","../Toast":"Toast.js"}],"OrderAPI.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _App = _interopRequireDefault(require("./App"));
var _Auth = _interopRequireDefault(require("./Auth"));
var _Toast = _interopRequireDefault(require("./Toast"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class OrderAPI {
  async newOrder(formData) {
    // send fetch request
    const response = await fetch("".concat(_App.default.apiBase, "/order"), {
      method: 'POST',
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken)
      },
      body: formData
    });

    // if response not ok
    if (!response.ok) {
      let message = 'Problem adding order';
      if (response.status == 400) {
        const err = await response.json();
        message = err.message;
      }
      // throw error (exit this function)      
      throw new Error(message);
    }

    // convert response payload into json - store as data
    const data = await response.json();

    // return data
    return data;
  }
  async addFavProduct(productId, favourite) {
    // validate
    if (!productId) return;

    // fetch the json data
    const response = await fetch("".concat(_App.default.apiBase, "/order/addFavProduct/").concat(productId), {
      method: "PUT",
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken),
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        favourite
      })
    });

    // if response not ok
    if (!response.ok) {
      // console log error
      const err = await response.json();
      if (err) console.log(err);
      // throw error (exit this function)      
      throw new Error('Problem adding product to favourites');
    }

    // convert response payload into json - store as data
    const data = await response.json();

    // return data
    return data;
  }
  async getOrders() {
    console.log("calling orders beginning");
    // fetch the json data
    const response = await fetch("".concat(_App.default.apiBase, "/order"), {
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken)
      }
    });
    console.log("calling orders");
    // if response not ok
    if (!response.ok) {
      // console log error
      const err = await response.json();
      if (err) console.log(err);
      // throw error (exit this function)      
      throw new Error('Problem getting orders');
    }

    // convert response payload into json - store as data
    const data = await response.json();
    console.log("data", data);

    // return data
    return data;
  }
}
var _default = exports.default = new OrderAPI();
},{"./App":"App.js","./Auth":"Auth.js","./Toast":"Toast.js"}],"components/va-order.js":[function(require,module,exports) {
"use strict";

var _litElement = require("@polymer/lit-element");
var _litHtml = require("lit-html");
var _Router = require("../Router");
var _Auth = _interopRequireDefault(require("../Auth"));
var _App = _interopRequireDefault(require("../App"));
var _OrderAPI = _interopRequireDefault(require("../OrderAPI"));
var _Toast = _interopRequireDefault(require("../Toast"));
var _templateObject, _templateObject2, _templateObject3;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
customElements.define('va-order', class Order extends _litElement.LitElement {
  constructor() {
    super();
  }
  static get properties() {
    return {
      id: {
        type: String
      },
      user: {
        type: Object
      },
      product: {
        type: Object
      },
      favourite: {
        type: String
      },
      totalPrice: {
        type: String
      },
      orderTime: {
        type: String
      },
      orderCompleted: {
        type: String
      }
    };
  }
  firstUpdated() {
    super.firstUpdated();
  }
  async addFavHandler() {
    try {
      // Assuming this.favourite holds the current state (true/false as string or boolean)
      const toggleFavourite = this.favourite === "true" ? "false" : "true"; // Toggle value

      // Call API to update the favorite status
      await _OrderAPI.default.addFavProduct(this.id, toggleFavourite);

      // Update local state after successful toggle
      this.favourite = toggleFavourite;

      // Notify the user
      _Toast.default.show("Product ".concat(toggleFavourite === "true" ? 'added to' : 'removed from', " favourites"));
    } catch (err) {
      // Show error message
      _Toast.default.show(err.message || 'Error updating favourites', 'error');
    }
  }

  // the visuals the user sees in the browser including the styling
  // use .bind(this) when need to bind an event handler in a function to the Class and not to the element, like on the button below 
  render() {
    return (0, _litElement.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n        <style>\n            .order-wrap {\n                background: #fff;\n                border-radius: 10px;\n                box-shadow: 8px 5px 20px rgba(0,0,0.1);\n                margin-bottom: 0.5em;\n                padding: 1em;\n                width: 85%;\n                display: flex;\n                gap: 1.5em;\n            }\n\n            .order-items {\n                display: flex;\n                gap: 1.5em;\n            }\n\n\n        </style>\n        <div class=\"order-wrap\">\n            <div class=\"order-img-container\">\n                <img class=\"order-img\" slot=\"image\" src=\"", "/images/", "\" />\n            </div>\n            <div class=\"order-items\">\n                <p class=\"product-name\">Product Name: <br><br> <b><span>", "</span></b></p>\n                <p class=\"favourite-product\">Favourite Product: <br><br> <b><span>", "</span></b></p>\n                <p class=\"product-price\">Product Price: <br><br> <b><span>$", "</b></span></p>\n                \n                <hr>\n\n                <p class=\"order-time\">Time ordered: <br><br> <b><span>", "</b></span></p>\n                <p class=\"order-completed\">Order Completed: <br><br> <b><span>", "</b></span></p>\n                \n                <hr>\n                        \n                <p class=\"total-price\"><b>Order Total: <br> <br> <span>", "</span></b></p></div>\n\n                \n            </div>\n       \n    \n \n  \n        "])), _App.default.apiBase, this.product.image, this.product.name, this.user.favourite == true ? (0, _litElement.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral([" <sl-button @click=", ">\n            \n            Add to Favourites\n            </sl-button>"])), this.addFavHandler.bind(this)) // NEED TO CODE THAT THE FAVOURITE ICON APPEARS ON ADD AND DISAPPEARS WHEN CLICK AGAIN!!!
    : (0, _litElement.html)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<sl-button @click=", ">\n            <sl-icon slot=\"prefix\" name=\"heart-fill\"></sl-icon>\n            Add to Favourites\n            </sl-button>"])), this.addFavHandler.bind(this)), this.product.price, this.orderTime, this.orderCompleted, this.totalPrice);
  }
});
},{"@polymer/lit-element":"../node_modules/@polymer/lit-element/lit-element.js","lit-html":"../node_modules/lit-html/lit-html.js","../Router":"Router.js","../Auth":"Auth.js","../App":"App.js","../OrderAPI":"OrderAPI.js","../Toast":"Toast.js"}],"components/va-checkout.js":[function(require,module,exports) {
"use strict";

var _litElement = require("@polymer/lit-element");
var _litHtml = require("lit-html");
var _Router = require("../Router");
var _Auth = _interopRequireDefault(require("../Auth"));
var _App = _interopRequireDefault(require("../App"));
var _UserAPI = _interopRequireDefault(require("../UserAPI"));
var _Toast = _interopRequireDefault(require("../Toast"));
var _templateObject, _templateObject2;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Code adapted using CoPilot accessed 17 November 2024
class CheckoutBox extends _litElement.LitElement {
  render() {
    return (0, _litElement.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n            <div class=\"checkout-box\">\n                <h2>Checkout</h2>\n                <form @submit=\"", "\">\n                    <label for=\"name\">Name</label>\n                    <input type=\"text\" id=\"name\" name=\"name\" placeholder=\"Your name..\" required>\n                    \n                    <label for=\"email\">Email</label>\n                    <input type=\"email\" id=\"email\" name=\"email\" placeholder=\"Your email..\" required>\n                    \n                    <label for=\"address\">Address</label>\n                    <input type=\"text\" id=\"address\" name=\"address\" placeholder=\"Your address..\" required>\n                    \n                    <label for=\"total\">Total</label>\n                    <input type=\"number\" id=\"total\" name=\"total\" placeholder=\"Total amount..\" required>\n                    \n                    <button type=\"submit\">Place Order</button>\n                </form>\n            </div>\n        "])), this._placeOrder);
  }
  _placeOrder(event) {
    event.preventDefault();
    alert('Order placed successfully!');
  }
}
_defineProperty(CheckoutBox, "styles", (0, _litElement.css)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n        .checkout-box {\n            width: 300px;\n            padding: 20px;\n            border: 1px solid #ccc;\n            border-radius: 10px;\n            box-shadow: 0 0 10px rgba(0,0,0,0.1);\n            margin: 0 auto;\n        }\n        h2 {\n            text-align: center;\n        }\n        input[type=\"text\"],\n        input[type=\"email\"],\n        input[type=\"number\"] {\n            width: 100%;\n            padding: 10px;\n            margin: 10px 0;\n            border: 1px solid #ccc;\n            border-radius: 5px;\n        }\n        button {\n            width: 100%;\n            padding: 10px;\n            background-color: #4CAF50;\n            color: white;\n            border: none;\n            border-radius: 5px;\n            cursor: pointer;\n        }\n        button:hover {\n            background-color: #45a049;\n        }\n    "]))));
customElements.define('checkout-box', CheckoutBox);
},{"@polymer/lit-element":"../node_modules/@polymer/lit-element/lit-element.js","lit-html":"../node_modules/lit-html/lit-html.js","../Router":"Router.js","../Auth":"Auth.js","../App":"App.js","../UserAPI":"UserAPI.js","../Toast":"Toast.js"}],"components/va-favourite-line.js":[function(require,module,exports) {
"use strict";

var _litElement = require("@polymer/lit-element");
var _litHtml = require("lit-html");
var _Router = require("../Router");
var _Auth = _interopRequireDefault(require("../Auth"));
var _App = _interopRequireDefault(require("../App"));
var _UserAPI = _interopRequireDefault(require("../UserAPI"));
var _Toast = _interopRequireDefault(require("../Toast"));
var _FavouriteLines, _templateObject, _templateObject2;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Adapted from CoPilot accessed 18 November 2024
customElements.define('va-favourite-line', (_FavouriteLines = class FavouriteLines extends _litElement.LitElement {
  constructor() {
    super();
    this.products = [{
      id: 1,
      name: 'Product 1',
      favourite: false
    }, {
      id: 2,
      name: 'Product 2',
      favourite: false
    }, {
      id: 3,
      name: 'Product 3',
      favourite: false
    }];
  }
  render() {
    return (0, _litElement.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n            <style>\n                .product-list {\n                    list-style-type: none;\n                    padding: 0;\n                    box-shadow: 8px 5px 20px rgba(0,0,0.1);\n                }\n                .product-item {\n                    padding: 10px;\n                    border-bottom: 1px solid #ccc;\n                    display: flex;\n                    justify-content: space-between;\n                    align-items: center;\n                }\n                .favourite {\n                    color: red;\n                }\n            </style>\n            <ul class=\"product-list\">\n                ", "\n            </ul>\n        "])), this.products.map(product => (0, _litElement.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n                    <li class=\"product-item\">\n                        ", "\n                        ", "\n                        <sl-button @click=\"", "\">\n                            ", "\n                        </sl-button>\n                    </li>\n                "])), this.name, this.product.name, () => this.toggleFavourite(product), favourite.product ? '❤️' : '♡')));
  }
  toggleFavourite(product) {
    favourite.product = !favourite.product;
    this.requestUpdate();
  }
}, _defineProperty(_FavouriteLines, "properties", {
  products: {
    type: Array
  }
}), _FavouriteLines));
},{"@polymer/lit-element":"../node_modules/@polymer/lit-element/lit-element.js","lit-html":"../node_modules/lit-html/lit-html.js","../Router":"Router.js","../Auth":"Auth.js","../App":"App.js","../UserAPI":"UserAPI.js","../Toast":"Toast.js"}],"components/va-favourite-product.js":[function(require,module,exports) {
"use strict";

var _litElement = require("@polymer/lit-element");
var _litHtml = require("lit-html");
var _Router = require("../Router");
var _Auth = _interopRequireDefault(require("../Auth"));
var _App = _interopRequireDefault(require("../App"));
var _UserAPI = _interopRequireDefault(require("../UserAPI"));
var _Toast = _interopRequireDefault(require("../Toast"));
var _FavouriteProducts, _templateObject, _templateObject2;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _taggedTemplateLiteral(e, t) { return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } })); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Adapted from CoPilot accessed 18 November 2024
customElements.define('va-favourite-product', (_FavouriteProducts = class FavouriteProducts extends _litElement.LitElement {
  constructor() {
    super();
    this.products = [{
      id: 1,
      name: 'Product 1',
      favourite: false
    }, {
      id: 2,
      name: 'Product 2',
      favourite: false
    }, {
      id: 3,
      name: 'Product 3',
      favourite: false
    }];
  }
  render() {
    return (0, _litElement.html)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n            <style>\n                .product-list {\n                    list-style-type: none;\n                    padding: 0;\n                    box-shadow: 8px 5px 20px rgba(0,0,0.1);\n                }\n                .product-item {\n                    padding: 10px;\n                    border-bottom: 1px solid #ccc;\n                    display: flex;\n                    justify-content: space-between;\n                    align-items: center;\n                }\n                .favourite {\n                    color: red;\n                }\n            </style>\n            <ul class=\"product-list\">\n                ", "\n            </ul>\n        "])), this.products.map(product => (0, _litElement.html)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n                    <li class=\"product-item\">\n                        ", "\n                        ", "\n                        <sl-button @click=\"", "\">\n                            ", "\n                        </sl-button>\n                    </li>\n                "])), this.name, this.product.name, () => this.toggleFavourite(product), favourite.product ? '❤️' : '♡')));
  }
  toggleFavourite(product) {
    favourite.product = !favourite.product;
    this.requestUpdate();
  }
}, _defineProperty(_FavouriteProducts, "properties", {
  products: {
    type: Array
  }
}), _FavouriteProducts));
},{"@polymer/lit-element":"../node_modules/@polymer/lit-element/lit-element.js","lit-html":"../node_modules/lit-html/lit-html.js","../Router":"Router.js","../Auth":"Auth.js","../App":"App.js","../UserAPI":"UserAPI.js","../Toast":"Toast.js"}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }
  return bundleURL;
}
function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }
  return '/';
}
function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');
function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }
  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }
    cssTimeout = null;
  }, 50);
}
module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"scss/master.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./../../static/images/login/login-background.svg":[["login-background.bccf9b27.svg","../static/images/login/login-background.svg"],"../static/images/login/login-background.svg"],"./../../static/images/home/home-bg-graphics.svg":[["home-bg-graphics.e19972cb.svg","../static/images/home/home-bg-graphics.svg"],"../static/images/home/home-bg-graphics.svg"],"./../../static/images/mental-health/mental-health-bg-graphics.svg":[["mental-health-bg-graphics.016614e7.svg","../static/images/mental-health/mental-health-bg-graphics.svg"],"../static/images/mental-health/mental-health-bg-graphics.svg"],"./../../static/images/mindfulness/mindfulness-bg-graphics.svg":[["mindfulness-bg-graphics.79a1ec02.svg","../static/images/mindfulness/mindfulness-bg-graphics.svg"],"../static/images/mindfulness/mindfulness-bg-graphics.svg"],"./../../static/images/resources/resources-bg-graphics.svg":[["resources-bg-graphics.e9b7dbb9.svg","../static/images/resources/resources-bg-graphics.svg"],"../static/images/resources/resources-bg-graphics.svg"],"./../../static/images/about/about-bg-graphics.svg":[["about-bg-graphics.8f312ed0.svg","../static/images/about/about-bg-graphics.svg"],"../static/images/about/about-bg-graphics.svg"],"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _App = _interopRequireDefault(require("./App.js"));
require("./components/va-app-header");
require("./components/va-product");
require("./components/va-order");
require("./components/va-checkout");
require("./components/va-favourite-line.js");
require("./components/va-favourite-product.js");
require("./scss/master.scss");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// components (custom web components), va is for 'vanilla'
// import makes these elements available on all other page view where rendering something
// ie can use <va-product></va-product> anywhere in the project
// everytime create a componment make sure to import into index.js otherwise will not work

// styles

// app.init
document.addEventListener('DOMContentLoaded', () => {
  _App.default.init();
});
},{"./App.js":"App.js","./components/va-app-header":"components/va-app-header.js","./components/va-product":"components/va-product.js","./components/va-order":"components/va-order.js","./components/va-checkout":"components/va-checkout.js","./components/va-favourite-line.js":"components/va-favourite-line.js","./components/va-favourite-product.js":"components/va-favourite-product.js","./scss/master.scss":"scss/master.scss"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56160" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map