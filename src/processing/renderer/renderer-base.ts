/**
 * Created by HOFFM59 on 10.05.2017.
 */
import * as Vex from 'vexflow';
import {IRenderer} from './interfaces';
import IRenderContext = Vex.IRenderContext;

export abstract class BaseRenderer implements IRenderer {

  private _container: HTMLCanvasElement | HTMLObjectElement;
  private _isSvgContainer: boolean;

  private _vexRenderer: Vex.Flow.Renderer;
  private _rendererContext: IRenderContext;

  constructor(container: HTMLCanvasElement | HTMLObjectElement) {
    this._container = container;
    if (this._container instanceof HTMLCanvasElement) {
      this._isSvgContainer = false;
    } else if (!!(this._container as HTMLObjectElement).contentDocument) {
      this._isSvgContainer = true;
    } else {
      throw new Error('The given container has to be either a canvas or a svg!');
    }

    this._vexRenderer = new Vex.Flow.Renderer(this._container,
      this._isSvgContainer ? Vex.Flow.Renderer.Backends.SVG : Vex.Flow.Renderer.Backends.CANVAS);
    this._rendererContext = this._vexRenderer.getContext();
  }

  get renderer(): Vex.Flow.Renderer {
    return this._vexRenderer;
  }

  get context(): IRenderContext {
    return this._rendererContext;
  }

  get container(): HTMLCanvasElement | any {
    return this._container;
  }

  get isSvg(): boolean {
    return this._isSvgContainer;
  }

  render(data: any): void {
    // console.time('render');
    this.renderInternal(data);
    // console.timeEnd('render');
  }

  clear(): void {
    if (!this._isSvgContainer) {
      (this._container as HTMLCanvasElement).getContext('2d').clearRect(0, 0,
        (this._container as HTMLCanvasElement).width,
        (this._container as HTMLCanvasElement).height);
    } else {
      (this._container as HTMLObjectElement).contentDocument.clear();
    }
  }

  protected abstract renderInternal(data: any): void;
}
