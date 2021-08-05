import { Component, AfterViewInit, HostListener, ElementRef } from '@angular/core';
import { ResizeService } from '../../services/resize.service';
import { ScreenSize } from './screen-size.enum';

@Component({
  selector: 'app-size-detector',
  templateUrl: './size-detector.component.html'
})
export class SizeDetectorComponent implements AfterViewInit {
  prefix = 'is-';
  sizes = [
    {
      id: ScreenSize.XS, name: 'xs', css: `d-block d-sm-none`
    },
    {
      id: ScreenSize.SM, name: 'sm', css: `d-none d-sm-block d-md-none`
    },
    {
      id: ScreenSize.MD, name: 'md', css: `d-none d-md-block d-lg-none`
    },
    {
      id: ScreenSize.LG, name: 'lg', css: `d-none d-lg-block d-xl-none`
    },
    {
      id: ScreenSize.XL, name: 'xl', css: `d-none d-xl-block`
    },
  ];
  iPhone678ScreenWidth: number = 375;

  constructor(private elementRef: ElementRef, private resizeService: ResizeService) { }

  @HostListener("window:resize", [])
  private onResize() {
    this.detectScreenSize();
  }

  ngAfterViewInit() {
    this.detectScreenSize();
  }

  private detectScreenSize() {
    console.log();
    if (window.innerWidth <= this.iPhone678ScreenWidth) {
      this.resizeService.onResize(ScreenSize.XXS);
      return;
    }

    const currentSize = this.sizes.find(x => {
      // get the HTML element
      const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);

      // check its display property value
      const isVisible = window.getComputedStyle(el).display != 'none';

      return isVisible;
    });

    this.resizeService.onResize(currentSize.id);
  }
}
