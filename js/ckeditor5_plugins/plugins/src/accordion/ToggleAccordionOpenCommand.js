import { Command } from 'ckeditor5/src/core';

export default class ToggleAccordionOpenCommand extends Command {
  execute() {
    const { model } = this.editor;
    const selection = model.document.selection;
    const position = selection.getFirstPosition();

    model.change(writer => {
      // Find the nearest ancestor that is an accordion element.
      const accordionElement = position.findAncestor('accordion');

      if (accordionElement) {
        const isOpen = accordionElement.getAttribute('open');
        writer.setAttribute('open', !isOpen, accordionElement);
      } else {
        console.log('No accordion element found in selection.');
      }
    });
  }

  refresh() {
    const { model } = this.editor;
    const selection = model.document.selection;
    const position = selection.getFirstPosition();

    // Enable the command only if an accordion is in the selection path.
    const accordionElement = position.findAncestor('accordion');
    this.isEnabled = !!accordionElement;
  }
}
