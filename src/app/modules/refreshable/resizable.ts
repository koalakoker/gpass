import { ScreenSize } from 'src/app/components/size-detector/screen-size.enum';
import { ResizeService } from 'src/app/services/resize.service';

export class Resizable {

  GPassButtonStyle: string = '';
  GPassLabelStyle: string = '';

  constructor(resizeService: ResizeService) {
    resizeService.onResize$.subscribe((size) => {
      setTimeout(() => {
        this.styleUpdate(size);
      }, 10);
    })
  }

  styleUpdate(size: ScreenSize) {
    switch (size) {
      case ScreenSize.XXS:
        this.GPassButtonStyle = 'GPassButton-small';
        this.GPassLabelStyle = 'GPassLabel-small';
        break;

      default:
        this.GPassButtonStyle = 'GPassButton-big';
        this.GPassLabelStyle = '';
        break;
    }
  }
}