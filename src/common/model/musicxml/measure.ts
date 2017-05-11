/**
 * Created by HOFFM59 on 10.05.2017.
 */
import {Attributes} from './attributes';
import {getAttributeByName, getChildrenByName} from '../../../utils/xml-utils';
import {Note} from './note';
import {Time} from './time';
import {Clef} from './clef';

export class Measure {

  private _number: number;
  private _width: number;

  private _attributes: Array<Attributes>;

  private _notes: Array<any>;

  constructor(private _node: Node, lastDivision: number) {
    const numAttr = getAttributeByName(this._node, 'number');
    if (!!numAttr) {
      this._number = parseInt(numAttr.value, 10);
    }
    const widthAttr = getAttributeByName(this._node, 'width');
    if (!!widthAttr) {
      this._width = parseFloat(widthAttr.value);
    }

    this._attributes = getChildrenByName(this._node, 'attributes').map(a => new Attributes(a));

    const divisions = lastDivision === 0 ? this._attributes[0].divisions : lastDivision;
    this._notes = getChildrenByName(this._node, 'note').map(n => new Note(n, divisions));
  }

  get number(): number {
    return this._number;
  }

  get width(): number {
    return this._width;
  }

  get attributes(): Array<Attributes> {
    return this._attributes;
  }

  get staves(): Array<number> {
    return this._notes.map(n => n.staff);
  }

  get clefs(): Array<Clef> {
    const clefs = this.attributes.map(a => !!a.clef ? a.clef.filter(c => c.number) : []);
    // Collect all distributed clefs in all attributes in measure
    return [].concat(...clefs);
  }

  getNotesByStaff(index: number): Array<Note> {
    return this._notes.filter(n => n.staff === index);
  }

  getNotesByBackup(): Array<Array<Note>> {
    const bList: Array<Array<Note>> = [];
    let nList: Array<Note> = [];
    this._notes.forEach((n) => {
      nList.push(n);
      if (n.isLast) {
        bList.push(nList);
        nList = [];
      }
    });
    return bList;
  }

  getAllTimes(): Array<Time> {
    let times = this._attributes.map(a => a.time);
    times = Array(this.staves.length).fill(times[0]);
    return times;
  }

  get hasAttributes(): boolean {
    return this._attributes !== undefined && this._attributes.length > 0;
  }
}
