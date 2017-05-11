/**
 * Created by HOFFM59 on 10.05.2017.
 */
import {getNumber, getText} from '../../../utils/xml-utils';

export class Key {

  private _fifths: number;
  private _mode: string;

  constructor(private _node: Node) {
    this._fifths = getNumber(this._node, 'fifths');
    this._mode = getText(this._node, 'mode');
    // Default is always Major
    if (this._mode === '') {
      this._mode = 'major';
    }
  }

  get fifths(): number {
    return this._fifths;
  }

  get mode(): string {
    return this._mode;
  }
}
