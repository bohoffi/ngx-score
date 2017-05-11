/**
 * Created by HOFFM59 on 09.05.2017.
 */
import {childWithNameExists, getAttributeByName, getChildByName, getChildrenByName, getText} from '../../../utils/xml-utils';
import {Part} from './part';
import {Identification} from './identification';
import {Measure} from './measure';

export class MusicXml {

  private _xmlDocument: Document;
  private _rootNode: Node;

  private _version: Attr;
  private _identification: any;
  private _movementTitle: string;
  private _workTitle: string;
  private _workNumber: string;

  private _parts: Array<Part>;

  constructor(xmlContent: string) {
    this._xmlDocument = new DOMParser().parseFromString(xmlContent, 'text/xml');
    this._rootNode = getChildByName(this._xmlDocument, 'score-partwise');

    this._version = getAttributeByName(this._rootNode, 'version');
    if (childWithNameExists(this._rootNode, 'identification')) {
      this._identification = new Identification(getChildByName(this._rootNode, 'identification'));
    }
    if (childWithNameExists(this._rootNode, 'movement-title')) {
      this._movementTitle = getText(this._rootNode, 'movement-title');
    }
    if (childWithNameExists(this._rootNode, 'work')) {
      const work = getChildByName(this._rootNode, 'work');
      if (childWithNameExists(work, 'work-title')) {
        this._workTitle = getText(work, 'work-title');
      }
      if (childWithNameExists(work, 'work-number')) {
        this._workNumber = getText(work, 'work-number');
      }
    }

    if (childWithNameExists(this._rootNode, 'part')) {
      this._parts = getChildrenByName(this._rootNode, 'part').map(p => new Part(p));
    }
  }

  get version(): string {
    return this._version ? this._version.value : '';
  }

  get identification(): any {
    return this._identification;
  }

  get parts(): Array<Part> {
    return this._parts;
  }

  getMeasuresFromPart(number: number): Array<Measure> {
    if (number >= this._parts.length) {
      throw new Error(`PartOutOfBounds`);
    }
    return this._parts[number].measures;
  }
}
