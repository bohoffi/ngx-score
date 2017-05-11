/**
 * Created by HOFFM59 on 10.05.2017.
 */
import {getAttributeByName, getNumber, getText} from '../../../utils/xml-utils';

export class Clef {

  private _number: number;
  private _sign: string;
  private _line: number;

  private _clefs: any;

  constructor(private _node: Node) {
    if (getAttributeByName(this._node, 'number')) {
      this._number = parseInt(getAttributeByName(this._node, 'number').value, 10);
    } else {
      this._number = 1;
    }
    this._sign = getText(this._node, 'sign');
    this._line = getNumber(this._node, 'line');

    // TODO: Move somewhere else
    this._clefs = {
      'G2': 'treble',
      'C3': 'alto',
      'G4': 'tenor',
      'F4': 'bass',
      'percussion': 'percussion',
    };
  }

  get number(): number {
    return this._number;
  }

  get sign(): string {
    return this._sign;
  }

  get line(): number {
    return this._line;
  }

  get clefs(): any {
    return this._clefs;
  }

  getVexClef() {
    return this._clefs[this.sign + this.line];
  }
}
