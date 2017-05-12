/**
 * Created by HOFFM59 on 10.05.2017.
 */

import {TokenizerType} from './types';

export interface ITokenizer<T> {

  parse(input: any): T;

  getType(): TokenizerType;
}
