/**
 * Created by HOFFM59 on 10.05.2017.
 */
import {getAttributeByName, getNumber} from '../../../utils/xml-utils';

export class Time {

  private _symbol: Attr;
  private _beats: number;
  private _beatType: number;

  constructor(private _node: Node) {
    this._symbol = getAttributeByName(this._node, 'symbol');
    this._beats = getNumber(this._node, 'beats');
    this._beatType = getNumber(this._node, 'beat-type');
  }

  get symbol(): string {
    return !!this._symbol ? this._symbol.value : null;
  }

  get beats(): number {
    return this._beats;
  }

  get beatType(): number {
    return this._beatType;
  }

  getVexTime() {
    return {num_beats: this.beats, beat_value: this.beatType, symbol: this.symbol};
  }
}
