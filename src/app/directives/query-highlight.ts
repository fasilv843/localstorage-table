import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appQueryHighlight]',
})
export class QueryHighlight {
  query = input.required<string>()

  el = inject(ElementRef)
  renderer = inject(Renderer2)

  originalContent: string | null = null;

  constructor() {
    effect(() => {
      const query = this.query().trim().toLowerCase();
      const element = this.el.nativeElement;

      if (this.originalContent === null) {
        this.originalContent = element.innerText; // Save original content for future use
      }
      
      // Reset content
      this.renderer.setProperty(element, 'innerHTML', this.originalContent);

      if (!query) return;

      const regex = new RegExp(`(${query})`, 'i');

      const highlighted = this.originalContent?.replace(regex, match => {
        return `<span style="background-color: yellow">${match}</span>`;
      });

      this.renderer.setProperty(element, 'innerHTML', highlighted);
    });
  }

}
