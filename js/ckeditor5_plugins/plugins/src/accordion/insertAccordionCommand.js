/**
 * @file defines InsertaccordionCommand, which is executed when the accordion
 * toolbar button is pressed.
 */
// cSpell:ignore accordionediting

import { Command } from 'ckeditor5/src/core';

export default class InsertAccordionCommand extends Command {
  execute(options = {}) {
    const { model } = this.editor;
    const { open = false } = options;

    model.change((writer) => {
      // Insert <accordion>*</accordion> at the current selection position
      // in a way that will result in creating a valid model structure.
      model.insertContent(createAccordion(writer, open));
    });
  }

  refresh() {
    const { model } = this.editor;
    const { selection } = model.document;

    // Determine if the cursor (selection) is in a position where adding a
    // accordion is permitted. This is based on the schema of the model(s)
    // currently containing the cursor.
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition(),
      'accordion',
    );

    // If the cursor is not in a location where a accordion can be added, return
    // null so the addition doesn't happen.
    this.isEnabled = allowedIn !== null;
  }
}

function createAccordion(writer, open) {
  // Create instances of the three elements registered with the editor in
  // accordionediting.js.
  const accordion = writer.createElement('accordion', { open });
  const accordionTitle = writer.createElement('accordionTitle');
  const accordionContent = writer.createElement('accordionContent');

  // Append the title and description elements to the accordion, which matches
  // the parent/child relationship as defined in their schemas.
  writer.append(accordionTitle, accordion);
  writer.append(accordionContent, accordion);

  // The accordionDescription text content will automatically be wrapped in a
  // `<p>`.
  writer.appendElement('paragraph', accordionContent);

  // Return the element to be added to the editor.
  return accordion;
}
