/**
 * Created by HOFFM59 on 26.04.2017.
 */
import {MusicXmlTokenizer} from './tokenizer/tokenizer-musicxml';
import {TokenizerType} from './tokenizer/types';
import {ITokenizer} from './tokenizer/interfaces';
import {TabTokenizer} from './tokenizer/tokinizer-tab';

export const createTokenizer = (type: TokenizerType): ITokenizer => {
  switch (type) {
    case 'TAB':
      return new TabTokenizer();
    case 'musicXML':
      return new MusicXmlTokenizer();
    default:
      return null;
  }
};
