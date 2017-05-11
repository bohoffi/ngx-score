/**
 * Created by HOFFM59 on 09.05.2017.
 */
import {ITokenizer} from './tokenizer/interfaces';
import {IRenderer} from './renderer/interfaces';
import {TabRenderer} from './renderer/renderer-tab';
import {MusicXmlRenderer} from './renderer/renderer-musicxml';

export const createRenderer = (tokenizer: ITokenizer, container: HTMLCanvasElement | any): IRenderer => {
  switch (tokenizer.getType()) {
    case 'TAB':
      return new TabRenderer(container);
    case 'musicXML':
      return new MusicXmlRenderer(container);
    default:
      return null;
  }
};
