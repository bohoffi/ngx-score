/**
 * Created by HOFFM59 on 10.05.2017.
 */
import {Measure} from './measure';
import {childWithNameExists, getChildrenByName} from '../../../utils/xml-utils';

export class Part {

  private _measures: Array<Measure>;

  constructor(private _node: Node) {
    if (childWithNameExists(this._node, 'measure')) {
      let lastDivision = 0;
      this._measures = getChildrenByName(this._node, 'measure').map((m: Node, i: number) => {
        const measure = new Measure(m, lastDivision);
        if (measure.attributes.length && !isNaN(measure.attributes[0].divisions)) {
          lastDivision = measure.attributes[0].divisions;
        }
        return measure;
      });
    }
  }

  get measures(): Array<Measure> {
    return this._measures;
  }

  getAllStaves(): any {
    return this._measures.map(m => m.staves);
  }

  getAllClefs(): any {
    return this._measures.map(m => m.clefs);
  }

  getNotesByStaff(index: number): any {
    return this._measures.map(m => m.getNotesByStaff(index));
  }

  getAllMeasuresWithKeys() {
    return this._measures.filter(m => m.hasAttributes && m.attributes.some(a => a.key !== undefined));
  }
}
