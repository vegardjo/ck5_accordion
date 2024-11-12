import { Plugin } from 'ckeditor5/src/core';
import { toWidget, toWidgetEditable } from 'ckeditor5/src/widget';
import { Widget } from 'ckeditor5/src/widget';
import InsertAccordionCommand from './insertAccordionCommand';
import ToggleAccordionOpenCommand from './ToggleAccordionOpenCommand';

// cSpell:ignore simplebox insertsimpleboxcommand

/**
 * CKEditor 5 plugins do not work directly with the DOM. They are defined as
 * plugin-specific data models that are then converted to markup that
 * is inserted in the DOM.
 *
 * CKEditor 5 internally interacts with simpleBox as this model:
 * <simpleBox>
 *    <simpleBoxTitle></simpleBoxTitle>
 *    <simpleBoxDescription></simpleBoxDescription>
 * </simpleBox>
 *
 * Which is converted for the browser/user as this markup
 * <section class="simple-box">
 *   <h2 class="simple-box-title"></h1>
 *   <div class="simple-box-description"></div>
 * </section>
 *
 * This file has the logic for defining the simpleBox model, and for how it is
 * converted to standard DOM markup.
 */
export default class AccordionEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {
    this._defineSchema();
    this._defineConverters();
    this.editor.commands.add(
      'insertAccordion',
      new InsertAccordionCommand(this.editor),
    );
    this.editor.commands.add(
      'toggleAccordionOpen',
      new ToggleAccordionOpenCommand(this.editor)
    );
  }

  /*
   * This registers the structure that will be seen by CKEditor 5 as
   * <simpleBox>
   *    <simpleBoxTitle></simpleBoxTitle>
   *    <simpleBoxDescription></simpleBoxDescription>
   * </simpleBox>
   *
   * The logic in _defineConverters() will determine how this is converted to
   * markup.
   */
  _defineSchema() {
    // Schemas are registered via the central `editor` object.
    const schema = this.editor.model.schema;

    schema.register('accordion', {
      // Behaves like a self-contained object (e.g. an image).
      isObject: true,
      // Allow in places where other blocks are allowed (e.g. directly in the root).
      allowWhere: '$block',
      allowAttributes: ['open'],  // Allow the `open` attribute

    });

    schema.register('accordionTitle', {
      // This creates a boundary for external actions such as clicking and
      // keypress. For example, when the cursor is inside this box, the
      // keyboard shortcut for "select all" will be limited to the contents of
      // the box.
      isLimit: true,
      // This is only to be used within simpleBox.
      allowIn: 'accordion',
      // Allow content that is allowed in blocks (e.g. text with attributes).
      allowContentOf: '$block',
    });

    schema.register('accordionContent', {
      isLimit: true,
      allowIn: 'accordion',
      allowContentOf: '$root',
    });

    schema.addChildCheck((context, childDefinition) => {
      // Disallow simpleBox inside simpleBoxDescription.
      if (
        context.endsWith('accordionContent') &&
        childDefinition.name === 'accordion'
      ) {
        return false;
      }
    });
  }

  /**
   * Converters determine how CKEditor 5 models are converted into markup and
   * vice-versa.
   */
  _defineConverters() {
    // Converters are registered via the central editor object.
    const { conversion } = this.editor;

    // Upcast Converters: determine how existing HTML is interpreted by the
    // editor. These trigger when an editor instance loads.
    //
    // If <section class="simplebox"> is present in the existing markup
    // processed by CKEditor, then CKEditor recognizes and loads it as a
    // <simpleBox> model.
    conversion.for('upcast').elementToElement({
      model: (viewElement, { writer: modelWriter }) => {
        const isOpen = viewElement.hasClass('accordion--open');
        const accordion = modelWriter.createElement('accordion', { open: isOpen });
        return accordion;
      },
      view: {
        name: 'article',
        classes: 'accordion',
      },
    });

    conversion.for( 'upcast' ).add( dispatcher => {
      // Look for every view <div> element.
      dispatcher.on( 'element:h2', ( evt, data, conversionApi ) => {
        // Get all the necessary items from the conversion API object.
        const {
          consumable,
          writer,
          safeInsert,
          convertChildren,
          updateConversionResult
        } = conversionApi;

        // Get view item from data object.
        const viewTitleElement = data.viewItem;
        const viewPreElement = viewTitleElement.parent;

        if ( !viewPreElement || !viewPreElement.is( 'element', 'header' ) ) {
          return;
        }

        if ( !consumable.test( viewTitleElement, { name: true } ) ) {
          return;
        }

        // Create model element.
        const modelElement = writer.createElement( 'accordionTitle' );

        convertChildren( viewTitleElement, modelElement );

        if ( !safeInsert( modelElement, data.modelCursor ) ) {
          return;
        }

        consumable.consume( viewTitleElement, {name: true});

        updateConversionResult( modelElement, data );
      } );
    } );

    // If <h2 class="simple-box-title"> is present in the existing markup
    // processed by CKEditor, then CKEditor recognizes and loads it as a
    // <simpleBoxTitle> model, provided it is a child element of <simpleBox>,
    // as required by the schema.
    conversion.for('upcast').elementToElement({
      model: 'accordionTitle',
      view: {
        name: 'h2',
        classes: 'accordion__title',
      },
    });

    conversion.for('upcast').elementToElement({
      model: 'openAccordionHeader',
      view: {
        name: 'header',
        classes: 'accordion__header',
      },
    });

    // If <h2 class="simple-box-description"> is present in the existing markup
    // processed by CKEditor, then CKEditor recognizes and loads it as a
    // <simpleBoxDescription> model, provided it is a child element of
    // <simpleBox>, as required by the schema.
    conversion.for('upcast').elementToElement({
      model: 'accordionContent',
      view: {
        name: 'div',
        classes: 'accordion__content',
      },
    });

    // conversion.for('dataDowncast').elementToElement({
    //   model: 'accordion',
    //   view: {
    //     name: 'article',
    //     classes: 'accordion',
    //   },
    // });
    conversion.for('dataDowncast').elementToStructure( {
      model: 'accordion',
      view: ( modelElement, { writer } ) => {

        // Determine if the accordion is open based on the attribute.
        const classes = modelElement.getAttribute('open') ? 'accordion accordion--open' : 'accordion';

        return writer.createContainerElement( 'article', { class: classes }, [
          writer.createContainerElement( 'header', { class: 'accordion__header' }, [
            writer.createSlot(node => node.is( 'element', 'accordionTitle' ))
          ] ),
          writer.createSlot(node => node.is( 'element', 'accordionContent' )),
        ] );
      }
    } );

    conversion.for('dataDowncast').elementToElement({
      model: 'accordionTitle',
      view: {
        name: 'h2',
        classes: 'accordion__title',
      },
    });

    // Instances of <simpleBoxDescription> are saved as
    // <div class="simple-box-description">{{inner content}}</div>.
    conversion.for('dataDowncast').elementToElement({
      model: 'accordionContent',
      view: {
        name: 'div',
        classes: 'accordion__content',
      },
    });

    // Editing Downcast Converters. These render the content to the user for
    // editing, i.e. this determines what gets seen in the editor. These trigger
    // after the Data Upcast Converters, and are re-triggered any time there
    // are changes to any of the models' properties.
    //
    // Convert the <simpleBox> model into a container widget in the editor UI.
    conversion.for('editingDowncast').elementToElement({
      model: 'accordion',
      view: (modelElement, { writer: viewWriter }) => {
        // Check the `open` attribute and set the appropriate classes.
        const isOpen = modelElement.getAttribute('open');
        const classes = isOpen ? 'accordion accordion--open' : 'accordion';

        const section = viewWriter.createContainerElement('article', {
          class: classes,
        });

        return toWidget(section, viewWriter, { label: 'accordion widget' });
      },
    });

    // Listen for changes to the `open` attribute and update the view immediately.
    conversion.for('editingDowncast').add(dispatcher => {
      dispatcher.on('attribute:open:accordion', (evt, data, conversionApi) => {
        const { item, attributeNewValue } = data;
        const { mapper, writer } = conversionApi;
        const viewElement = mapper.toViewElement(item);

        if (!viewElement) return;

        // Apply or remove inline styles based on the `open` attribute value.
        if (attributeNewValue) {
          writer.setStyle('border', 'solid 5px green', viewElement);
          // writer.setStyle('background-color', '#e7f1ff', viewElement);
        } else {
          writer.removeStyle('border', viewElement);
          // writer.removeStyle('background-color', viewElement);
        }
      });
    });

    // Convert the <simpleBoxTitle> model into an editable <h2> widget.
    conversion.for('editingDowncast').elementToElement({
      model: 'accordionTitle',
      view: (modelElement, { writer: viewWriter }) => {
        const h2 = viewWriter.createEditableElement('h2', {
          class: 'accordion__title',
          placeholder: 'Tittel',
        });
        return toWidgetEditable(h2, viewWriter);
      },
    });

    // Convert the <simpleBoxDescription> model into an editable <div> widget.
    conversion.for('editingDowncast').elementToElement({
      model: 'accordionContent',
      view: (modelElement, { writer: viewWriter }) => {
        const div = viewWriter.createEditableElement('div', {
          class: 'accordion__content',
          placeholder: 'Innhold',
        });
        return toWidgetEditable(div, viewWriter);
      },
    });
  }
}
