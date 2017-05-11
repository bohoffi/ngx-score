/**
 * Created by HOFFM59 on 10.05.2017.
 */
import {Clef} from './clef';
import {Time} from './time';
import {Key} from './key';
import {childWithNameExists, getChildByName, getChildrenByName, getNumber, getText} from '../../../utils/xml-utils';

export class Attributes {

  private _divisions: number;
  private _key: Key;
  private _staves: number;
  private _time: Time;
  private _clef: Array<Clef>;

  private _staffLines: number;
  private _staffTunings: Array<{ step: string; octave: number }>;

  constructor(private _node: Node) {
    if (childWithNameExists(this._node, 'divisions')) {
      this._divisions = getNumber(this._node, 'divisions');
    }
    if (childWithNameExists(this._node, 'key')) {
      this._key = new Key(getChildByName(this._node, 'key'));
    }
    if (childWithNameExists(this._node, 'staves')) {
      this._staves = getNumber(this._node, 'staves');
    }
    if (childWithNameExists(this._node, 'time')) {
      this._time = new Time(getChildByName(this._node, 'time'));
    }
    if (childWithNameExists(this._node, 'clef')) {
      const _clefs = getChildrenByName(this._node, 'clef');
      this._clef = [..._clefs].map(c => new Clef(c));
    }

    this._parseStaffDetails();
  }

  get divisions(): number {
    return this._divisions;
  }

  get key(): Key {
    return this._key;
  }

  get staves(): number {
    return this._staves;
  }

  get time(): Time {
    return this._time;
  }

  get clef(): Array<Clef> {
    return this._clef;
  }

  private _parseStaffDetails() {
    if (childWithNameExists(this._node, 'staff-details')) {
      const staffDetails = getChildByName(this._node, 'staff-details');

      if (childWithNameExists(staffDetails, 'staff-lines')) {
        this._staffLines = getNumber(staffDetails, 'staff-lines');
      } else {
        this._staffLines = 5;
      }

      if (childWithNameExists(staffDetails, 'staff-tuning')) {
        const staffTunings = getChildrenByName(staffDetails, 'staff-tuning');

        if (staffTunings.length > this._staffLines) {
          throw new Error(`staff-tuning count exceed staff-lines count: ${staffTunings.length} > ${this._staffLines}`);
        }

        this._staffTunings = staffTunings.map(st => {
          return {step: getText(st, 'tuning-step'), octave: getNumber(st, 'tuning-octave')};
        });
      }
    }
  }
}
