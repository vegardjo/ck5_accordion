/**
 * @file Registers a split button with a simple toggle action on the arrow button.
 */

import { Plugin } from 'ckeditor5/src/core';
import { SplitButtonView } from 'ckeditor5/src/ui';
import icon from '../accordion-open.svg';

export default class AccordionUI extends Plugin {
  init() {
    const editor = this.editor;

    // Register the split button in the toolbar.
    editor.ui.componentFactory.add('accordion', (locale) => {
      const splitButtonView = new SplitButtonView(locale);

      // Configure the split button appearance.
      splitButtonView.set({
        label: editor.t('Accordion'),
        icon,
        tooltip: true,
        isToggleable: true,
      });

      splitButtonView.extendTemplate({
        attributes: {
          class: 'accordion-button',
        },
      })

      // Main action (left side of the split button) to insert the accordion.
      this.listenTo(splitButtonView, 'execute', () => {
        editor.execute('insertAccordion', { open: true });
      });

      // Toggle "Open" state when clicking the arrow button.
      this.listenTo(splitButtonView.arrowView, 'execute', () => {
        editor.execute('toggleAccordionOpen');
        splitButtonView.arrowView.isOn = !splitButtonView.arrowView.isOn;
      });

      return splitButtonView;
    });
  }
}
