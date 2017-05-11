/**
 * Created by HOFFM59 on 10.05.2017.
 */
import * as Vex from 'vexflow';
import {IRenderer} from './interfaces';
import IRenderContext = Vex.IRenderContext;

export abstract class BaseRenderer implements IRenderer {

  private _container: HTMLCanvasElement | any;
  private _isSvgContainer: boolean;

  private _vexRenderer: Vex.Flow.Renderer;
  private _rendererContext: IRenderContext;

  constructor(container: HTMLCanvasElement | any) {
    this._container = container;
    this._isSvgContainer = !(this._container instanceof HTMLCanvasElement);

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

  protected abstract renderInternal(data: any): void;
}
