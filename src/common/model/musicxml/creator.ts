/**
 * Created by HOFFM59 on 10.05.2017.
 */
import {getAttributeByName} from '../../../utils/xml-utils';

export class Creator {

  private _name: string;
  private _type: string;

  constructor(private _node: Node) {
    this._name = this._node.textContent;
    this._type = getAttributeByName(this._node, 'type').value;
  }
}
