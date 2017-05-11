/**
 * Created by HOFFM59 on 10.05.2017.
 */

import {TokenizerType} from './types';

export interface ITokenizer {

  parse(input: any): any;

  getType(): TokenizerType;
}
