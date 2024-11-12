/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CKEditor5"] = factory();
	else
		root["CKEditor5"] = root["CKEditor5"] || {}, root["CKEditor5"]["plugins"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/ckeditor5_plugins/plugins/src/accordion/ToggleAccordionOpenCommand.js":
/*!**********************************************************************************!*\
  !*** ./js/ckeditor5_plugins/plugins/src/accordion/ToggleAccordionOpenCommand.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ToggleAccordionOpenCommand)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n\n\nclass ToggleAccordionOpenCommand extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Command {\n  execute() {\n    const { model } = this.editor;\n    const selection = model.document.selection;\n    const position = selection.getFirstPosition();\n\n    model.change(writer => {\n      // Find the nearest ancestor that is an accordion element.\n      const accordionElement = position.findAncestor('accordion');\n\n      if (accordionElement) {\n        const isOpen = accordionElement.getAttribute('open');\n        writer.setAttribute('open', !isOpen, accordionElement);\n      } else {\n        console.log('No accordion element found in selection.');\n      }\n    });\n  }\n\n  refresh() {\n    const { model } = this.editor;\n    const selection = model.document.selection;\n    const position = selection.getFirstPosition();\n\n    // Enable the command only if an accordion is in the selection path.\n    const accordionElement = position.findAncestor('accordion');\n    this.isEnabled = !!accordionElement;\n  }\n}\n\n\n//# sourceURL=webpack://CKEditor5.plugins/./js/ckeditor5_plugins/plugins/src/accordion/ToggleAccordionOpenCommand.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/plugins/src/accordion/accordionEdit.js":
/*!*********************************************************************!*\
  !*** ./js/ckeditor5_plugins/plugins/src/accordion/accordionEdit.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ AccordionEditing)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/widget */ \"ckeditor5/src/widget.js\");\n/* harmony import */ var _insertAccordionCommand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./insertAccordionCommand */ \"./js/ckeditor5_plugins/plugins/src/accordion/insertAccordionCommand.js\");\n/* harmony import */ var _ToggleAccordionOpenCommand__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ToggleAccordionOpenCommand */ \"./js/ckeditor5_plugins/plugins/src/accordion/ToggleAccordionOpenCommand.js\");\n\n\n\n\n\n\n// cSpell:ignore simplebox insertsimpleboxcommand\n\n/**\n * CKEditor 5 plugins do not work directly with the DOM. They are defined as\n * plugin-specific data models that are then converted to markup that\n * is inserted in the DOM.\n *\n * CKEditor 5 internally interacts with simpleBox as this model:\n * <simpleBox>\n *    <simpleBoxTitle></simpleBoxTitle>\n *    <simpleBoxDescription></simpleBoxDescription>\n * </simpleBox>\n *\n * Which is converted for the browser/user as this markup\n * <section class=\"simple-box\">\n *   <h2 class=\"simple-box-title\"></h1>\n *   <div class=\"simple-box-description\"></div>\n * </section>\n *\n * This file has the logic for defining the simpleBox model, and for how it is\n * converted to standard DOM markup.\n */\nclass AccordionEditing extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n  static get requires() {\n    return [ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.Widget];\n  }\n\n  init() {\n    this._defineSchema();\n    this._defineConverters();\n    this.editor.commands.add(\n      'insertAccordion',\n      new _insertAccordionCommand__WEBPACK_IMPORTED_MODULE_2__[\"default\"](this.editor),\n    );\n    this.editor.commands.add(\n      'toggleAccordionOpen',\n      new _ToggleAccordionOpenCommand__WEBPACK_IMPORTED_MODULE_3__[\"default\"](this.editor)\n    );\n  }\n\n  /*\n   * This registers the structure that will be seen by CKEditor 5 as\n   * <simpleBox>\n   *    <simpleBoxTitle></simpleBoxTitle>\n   *    <simpleBoxDescription></simpleBoxDescription>\n   * </simpleBox>\n   *\n   * The logic in _defineConverters() will determine how this is converted to\n   * markup.\n   */\n  _defineSchema() {\n    // Schemas are registered via the central `editor` object.\n    const schema = this.editor.model.schema;\n\n    schema.register('accordion', {\n      // Behaves like a self-contained object (e.g. an image).\n      isObject: true,\n      // Allow in places where other blocks are allowed (e.g. directly in the root).\n      allowWhere: '$block',\n      allowAttributes: ['open'],  // Allow the `open` attribute\n\n    });\n\n    schema.register('accordionTitle', {\n      // This creates a boundary for external actions such as clicking and\n      // keypress. For example, when the cursor is inside this box, the\n      // keyboard shortcut for \"select all\" will be limited to the contents of\n      // the box.\n      isLimit: true,\n      // This is only to be used within simpleBox.\n      allowIn: 'accordion',\n      // Allow content that is allowed in blocks (e.g. text with attributes).\n      allowContentOf: '$block',\n    });\n\n    schema.register('accordionContent', {\n      isLimit: true,\n      allowIn: 'accordion',\n      allowContentOf: '$root',\n    });\n\n    schema.addChildCheck((context, childDefinition) => {\n      // Disallow simpleBox inside simpleBoxDescription.\n      if (\n        context.endsWith('accordionContent') &&\n        childDefinition.name === 'accordion'\n      ) {\n        return false;\n      }\n    });\n  }\n\n  /**\n   * Converters determine how CKEditor 5 models are converted into markup and\n   * vice-versa.\n   */\n  _defineConverters() {\n    // Converters are registered via the central editor object.\n    const { conversion } = this.editor;\n\n    // Upcast Converters: determine how existing HTML is interpreted by the\n    // editor. These trigger when an editor instance loads.\n    //\n    // If <section class=\"simplebox\"> is present in the existing markup\n    // processed by CKEditor, then CKEditor recognizes and loads it as a\n    // <simpleBox> model.\n    conversion.for('upcast').elementToElement({\n      model: (viewElement, { writer: modelWriter }) => {\n        const isOpen = viewElement.hasClass('accordion--open');\n        const accordion = modelWriter.createElement('accordion', { open: isOpen });\n        return accordion;\n      },\n      view: {\n        name: 'article',\n        classes: 'accordion',\n      },\n    });\n\n    conversion.for( 'upcast' ).add( dispatcher => {\n      // Look for every view <div> element.\n      dispatcher.on( 'element:h2', ( evt, data, conversionApi ) => {\n        // Get all the necessary items from the conversion API object.\n        const {\n          consumable,\n          writer,\n          safeInsert,\n          convertChildren,\n          updateConversionResult\n        } = conversionApi;\n\n        // Get view item from data object.\n        const viewTitleElement = data.viewItem;\n        const viewPreElement = viewTitleElement.parent;\n\n        if ( !viewPreElement || !viewPreElement.is( 'element', 'header' ) ) {\n          return;\n        }\n\n        if ( !consumable.test( viewTitleElement, { name: true } ) ) {\n          return;\n        }\n\n        // Create model element.\n        const modelElement = writer.createElement( 'accordionTitle' );\n\n        convertChildren( viewTitleElement, modelElement );\n\n        if ( !safeInsert( modelElement, data.modelCursor ) ) {\n          return;\n        }\n\n        consumable.consume( viewTitleElement, {name: true});\n\n        updateConversionResult( modelElement, data );\n      } );\n    } );\n\n    // If <h2 class=\"simple-box-title\"> is present in the existing markup\n    // processed by CKEditor, then CKEditor recognizes and loads it as a\n    // <simpleBoxTitle> model, provided it is a child element of <simpleBox>,\n    // as required by the schema.\n    conversion.for('upcast').elementToElement({\n      model: 'accordionTitle',\n      view: {\n        name: 'h2',\n        classes: 'accordion__title',\n      },\n    });\n\n    conversion.for('upcast').elementToElement({\n      model: 'openAccordionHeader',\n      view: {\n        name: 'header',\n        classes: 'accordion__header',\n      },\n    });\n\n    // If <h2 class=\"simple-box-description\"> is present in the existing markup\n    // processed by CKEditor, then CKEditor recognizes and loads it as a\n    // <simpleBoxDescription> model, provided it is a child element of\n    // <simpleBox>, as required by the schema.\n    conversion.for('upcast').elementToElement({\n      model: 'accordionContent',\n      view: {\n        name: 'div',\n        classes: 'accordion__content',\n      },\n    });\n\n    // conversion.for('dataDowncast').elementToElement({\n    //   model: 'accordion',\n    //   view: {\n    //     name: 'article',\n    //     classes: 'accordion',\n    //   },\n    // });\n    conversion.for('dataDowncast').elementToStructure( {\n      model: 'accordion',\n      view: ( modelElement, { writer } ) => {\n\n        // Determine if the accordion is open based on the attribute.\n        const classes = modelElement.getAttribute('open') ? 'accordion accordion--open' : 'accordion';\n\n        return writer.createContainerElement( 'article', { class: classes }, [\n          writer.createContainerElement( 'header', { class: 'accordion__header' }, [\n            writer.createSlot(node => node.is( 'element', 'accordionTitle' ))\n          ] ),\n          writer.createSlot(node => node.is( 'element', 'accordionContent' )),\n        ] );\n      }\n    } );\n\n    conversion.for('dataDowncast').elementToElement({\n      model: 'accordionTitle',\n      view: {\n        name: 'h2',\n        classes: 'accordion__title',\n      },\n    });\n\n    // Instances of <simpleBoxDescription> are saved as\n    // <div class=\"simple-box-description\">{{inner content}}</div>.\n    conversion.for('dataDowncast').elementToElement({\n      model: 'accordionContent',\n      view: {\n        name: 'div',\n        classes: 'accordion__content',\n      },\n    });\n\n    // Editing Downcast Converters. These render the content to the user for\n    // editing, i.e. this determines what gets seen in the editor. These trigger\n    // after the Data Upcast Converters, and are re-triggered any time there\n    // are changes to any of the models' properties.\n    //\n    // Convert the <simpleBox> model into a container widget in the editor UI.\n    conversion.for('editingDowncast').elementToElement({\n      model: 'accordion',\n      view: (modelElement, { writer: viewWriter }) => {\n        // Check the `open` attribute and set the appropriate classes.\n        const isOpen = modelElement.getAttribute('open');\n        const classes = isOpen ? 'accordion accordion--open' : 'accordion';\n\n        const section = viewWriter.createContainerElement('article', {\n          class: classes,\n        });\n\n        return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidget)(section, viewWriter, { label: 'accordion widget' });\n      },\n    });\n\n    // Listen for changes to the `open` attribute and update the view immediately.\n    conversion.for('editingDowncast').add(dispatcher => {\n      dispatcher.on('attribute:open:accordion', (evt, data, conversionApi) => {\n        const { item, attributeNewValue } = data;\n        const { mapper, writer } = conversionApi;\n        const viewElement = mapper.toViewElement(item);\n\n        if (!viewElement) return;\n\n        // Apply or remove inline styles based on the `open` attribute value.\n        if (attributeNewValue) {\n          writer.setStyle('border', 'solid 5px green', viewElement);\n          // writer.setStyle('background-color', '#e7f1ff', viewElement);\n        } else {\n          writer.removeStyle('border', viewElement);\n          // writer.removeStyle('background-color', viewElement);\n        }\n      });\n    });\n\n    // Convert the <simpleBoxTitle> model into an editable <h2> widget.\n    conversion.for('editingDowncast').elementToElement({\n      model: 'accordionTitle',\n      view: (modelElement, { writer: viewWriter }) => {\n        const h2 = viewWriter.createEditableElement('h2', {\n          class: 'accordion__title',\n          placeholder: 'Tittel',\n        });\n        return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidgetEditable)(h2, viewWriter);\n      },\n    });\n\n    // Convert the <simpleBoxDescription> model into an editable <div> widget.\n    conversion.for('editingDowncast').elementToElement({\n      model: 'accordionContent',\n      view: (modelElement, { writer: viewWriter }) => {\n        const div = viewWriter.createEditableElement('div', {\n          class: 'accordion__content',\n          placeholder: 'Innhold',\n        });\n        return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidgetEditable)(div, viewWriter);\n      },\n    });\n  }\n}\n\n\n//# sourceURL=webpack://CKEditor5.plugins/./js/ckeditor5_plugins/plugins/src/accordion/accordionEdit.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/plugins/src/accordion/accordionUi.js":
/*!*******************************************************************!*\
  !*** ./js/ckeditor5_plugins/plugins/src/accordion/accordionUi.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ AccordionUI)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/ui */ \"ckeditor5/src/ui.js\");\n/* harmony import */ var _accordion_open_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../accordion-open.svg */ \"./js/ckeditor5_plugins/plugins/src/accordion-open.svg\");\n/**\n * @file Registers a split button with a simple toggle action on the arrow button.\n */\n\n\n\n\n\nclass AccordionUI extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n  init() {\n    const editor = this.editor;\n\n    // Register the split button in the toolbar.\n    editor.ui.componentFactory.add('accordion', (locale) => {\n      const splitButtonView = new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.SplitButtonView(locale);\n\n      // Configure the split button appearance.\n      splitButtonView.set({\n        label: editor.t('Accordion'),\n        icon: _accordion_open_svg__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n        tooltip: true,\n        isToggleable: true,\n      });\n\n      splitButtonView.extendTemplate({\n        attributes: {\n          class: 'accordion-button',\n        },\n      })\n\n      // Main action (left side of the split button) to insert the accordion.\n      this.listenTo(splitButtonView, 'execute', () => {\n        editor.execute('insertAccordion', { open: true });\n      });\n\n      // Toggle \"Open\" state when clicking the arrow button.\n      this.listenTo(splitButtonView.arrowView, 'execute', () => {\n        editor.execute('toggleAccordionOpen');\n        splitButtonView.arrowView.isOn = !splitButtonView.arrowView.isOn;\n      });\n\n      return splitButtonView;\n    });\n  }\n}\n\n\n//# sourceURL=webpack://CKEditor5.plugins/./js/ckeditor5_plugins/plugins/src/accordion/accordionUi.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/plugins/src/accordion/index.js":
/*!*************************************************************!*\
  !*** ./js/ckeditor5_plugins/plugins/src/accordion/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Accordion)\n/* harmony export */ });\n/* harmony import */ var _accordionEdit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./accordionEdit */ \"./js/ckeditor5_plugins/plugins/src/accordion/accordionEdit.js\");\n/* harmony import */ var _accordionUi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./accordionUi */ \"./js/ckeditor5_plugins/plugins/src/accordion/accordionUi.js\");\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/**\n * @file This is what CKEditor refers to as a master (glue) plugin. Its role is\n * just to load the “editing” and “UI” components of this Plugin. Those\n * components could be included in this file, but\n *\n * I.e, this file's purpose is to integrate all the separate parts of the plugin\n * before it's made discoverable via index.js.\n */\n// cSpell:ignore accordionediting accordionui\n\n// The contents of AccordionUI and Accordion editing could be included in this\n// file, but it is recommended to separate these concerns in different files.\n\n\n\n\nclass Accordion extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__.Plugin {\n  // Note that AccordionEditing and AccordionUI also extend `Plugin`, but these\n  // are not seen as individual plugins by CKEditor 5. CKEditor 5 will only\n  // discover the plugins explicitly exported in index.js.\n  static get requires() {\n    return [_accordionEdit__WEBPACK_IMPORTED_MODULE_0__[\"default\"], _accordionUi__WEBPACK_IMPORTED_MODULE_1__[\"default\"]];\n  }\n}\n\n\n//# sourceURL=webpack://CKEditor5.plugins/./js/ckeditor5_plugins/plugins/src/accordion/index.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/plugins/src/accordion/insertAccordionCommand.js":
/*!******************************************************************************!*\
  !*** ./js/ckeditor5_plugins/plugins/src/accordion/insertAccordionCommand.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ InsertAccordionCommand)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/**\n * @file defines InsertaccordionCommand, which is executed when the accordion\n * toolbar button is pressed.\n */\n// cSpell:ignore accordionediting\n\n\n\nclass InsertAccordionCommand extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Command {\n  execute(options = {}) {\n    const { model } = this.editor;\n    const { open = false } = options;\n\n    model.change((writer) => {\n      // Insert <accordion>*</accordion> at the current selection position\n      // in a way that will result in creating a valid model structure.\n      model.insertContent(createAccordion(writer, open));\n    });\n  }\n\n  refresh() {\n    const { model } = this.editor;\n    const { selection } = model.document;\n\n    // Determine if the cursor (selection) is in a position where adding a\n    // accordion is permitted. This is based on the schema of the model(s)\n    // currently containing the cursor.\n    const allowedIn = model.schema.findAllowedParent(\n      selection.getFirstPosition(),\n      'accordion',\n    );\n\n    // If the cursor is not in a location where a accordion can be added, return\n    // null so the addition doesn't happen.\n    this.isEnabled = allowedIn !== null;\n  }\n}\n\nfunction createAccordion(writer, open) {\n  // Create instances of the three elements registered with the editor in\n  // accordionediting.js.\n  const accordion = writer.createElement('accordion', { open });\n  const accordionTitle = writer.createElement('accordionTitle');\n  const accordionContent = writer.createElement('accordionContent');\n\n  // Append the title and description elements to the accordion, which matches\n  // the parent/child relationship as defined in their schemas.\n  writer.append(accordionTitle, accordion);\n  writer.append(accordionContent, accordion);\n\n  // The accordionDescription text content will automatically be wrapped in a\n  // `<p>`.\n  writer.appendElement('paragraph', accordionContent);\n\n  // Return the element to be added to the editor.\n  return accordion;\n}\n\n\n//# sourceURL=webpack://CKEditor5.plugins/./js/ckeditor5_plugins/plugins/src/accordion/insertAccordionCommand.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/plugins/src/index.js":
/*!***************************************************!*\
  !*** ./js/ckeditor5_plugins/plugins/src/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _accordion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./accordion */ \"./js/ckeditor5_plugins/plugins/src/accordion/index.js\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  accordion: _accordion__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n});\n\n\n//# sourceURL=webpack://CKEditor5.plugins/./js/ckeditor5_plugins/plugins/src/index.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/plugins/src/accordion-open.svg":
/*!*************************************************************!*\
  !*** ./js/ckeditor5_plugins/plugins/src/accordion-open.svg ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"<?xml version=\\\"1.0\\\" encoding=\\\"utf-8\\\"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\\n<svg width=\\\"800px\\\" height=\\\"800px\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\">\\n<path d=\\\"M4 17H11\\\" stroke=\\\"#1C274C\\\" stroke-width=\\\"1.5\\\" stroke-linecap=\\\"round\\\"/>\\n<path d=\\\"M4 12L11 12\\\" stroke=\\\"#1C274C\\\" stroke-width=\\\"1.5\\\" stroke-linecap=\\\"round\\\"/>\\n<path d=\\\"M4 7L11 7\\\" stroke=\\\"#1C274C\\\" stroke-width=\\\"1.5\\\" stroke-linecap=\\\"round\\\"/>\\n<path d=\\\"M17 4L17 20M17 4L14 8M17 4L20 8M17 20L20 16M17 20L14 16\\\" stroke=\\\"#1C274C\\\" stroke-width=\\\"1.5\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"/>\\n</svg>\");\n\n//# sourceURL=webpack://CKEditor5.plugins/./js/ckeditor5_plugins/plugins/src/accordion-open.svg?");

/***/ }),

/***/ "ckeditor5/src/core.js":
/*!************************************************************!*\
  !*** delegated ./core.js from dll-reference CKEditor5.dll ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ \"dll-reference CKEditor5.dll\"))(\"./src/core.js\");\n\n//# sourceURL=webpack://CKEditor5.plugins/delegated_./core.js_from_dll-reference_CKEditor5.dll?");

/***/ }),

/***/ "ckeditor5/src/ui.js":
/*!**********************************************************!*\
  !*** delegated ./ui.js from dll-reference CKEditor5.dll ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ \"dll-reference CKEditor5.dll\"))(\"./src/ui.js\");\n\n//# sourceURL=webpack://CKEditor5.plugins/delegated_./ui.js_from_dll-reference_CKEditor5.dll?");

/***/ }),

/***/ "ckeditor5/src/widget.js":
/*!**************************************************************!*\
  !*** delegated ./widget.js from dll-reference CKEditor5.dll ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ \"dll-reference CKEditor5.dll\"))(\"./src/widget.js\");\n\n//# sourceURL=webpack://CKEditor5.plugins/delegated_./widget.js_from_dll-reference_CKEditor5.dll?");

/***/ }),

/***/ "dll-reference CKEditor5.dll":
/*!********************************!*\
  !*** external "CKEditor5.dll" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = CKEditor5.dll;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/ckeditor5_plugins/plugins/src/index.js");
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});