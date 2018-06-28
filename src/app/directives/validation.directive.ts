import { Directive, ElementRef, HostListener, Input } from '@angular/core';
let $ = null;

@Directive({
  selector: '[requiredValidation]'
})
export class ValidationDirective {

  @Input() requiredValidation;

  constructor(private ele: ElementRef) {
    $ = window["jQuery"];
    this.validate(ele);
   }

   @HostListener('blur') onblur(){
     this.validate(this.ele)
   }

   validate(ele){
    let fieldName = $(ele.nativeElement).attr("name")
    let classNames : string[] = $(ele.nativeElement).attr("class")? $(ele.nativeElement).attr("class").split(" ") : '';
    if(classNames && classNames.includes('ng-invalid') && $(ele.nativeElement).next('#alert').length == 0){
      $(ele.nativeElement).after(`<div id='alert' class='alert alert-danger'>${this.requiredValidation}</div>`)
    } else if(classNames && !(classNames.includes('ng-invalid'))){
      $('#alert').remove();
    }
   }
}
