/**
 * Created by HOFFM59 on 10.05.2017.
 */
import {getChildByName, getChildrenByName, getText} from '../../../utils/xml-utils';
import {Creator} from './creator';

export class Identification {

  private _creators: Array<Creator>;
  private _rights: string;
  private _encoding: any;

  constructor(private _node: Node) {
    this._creators = getChildrenByName(this._node, 'creator').map(c => new Creator(c));
    this._rights = getText(this._node, 'rights');
    this._encoding = getChildByName(this._node, 'encoding');
  }
}
