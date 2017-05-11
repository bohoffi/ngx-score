/**
 * Created by HOFFM59 on 10.05.2017.
 */
import {childWithNameExists, getChildByName, getNumber, getText, getTextArray} from '../../../utils/xml-utils';

export class Note {

  private _divisions: number;
  private _isRest: boolean;
  private _isInChord: boolean;
  private _isLast: boolean;
  private _voice: number;
  private _staff: number;
  private _duration: number;
  private _type: string;
  private _beamState: boolean;
  private _isLastBeamNote: boolean;
  private _pitch: { step: string; octave: number };
  private _noteLength: number;
  private _dots: number;
  private _types: any;
  private _tabNotation: { fret: number; string: number };

  constructor(private _node: Node, divisions: number) {
    /**
     * Private property to store measures divions units
     * @prop {Number} Note.mDivisions
     */
    this._divisions = divisions;
    /**
     * Shows if this note is a rest
     * @prop {Boolean} Note.isRest
     */
    this._isRest = childWithNameExists(this._node, 'rest');
    /**
     * Shows if this note is part of a chord
     * @prop {Boolean} Note.isInChord
     */
    this._isInChord = childWithNameExists(this._node, 'chord');

    /**
     * Shows if this Note is before a backup element or the last in the measure
     * @prop {Boolean} Note.isLast
     */
    // this._isLast = this._node.nextSibling === null ||
    //   this._node.nextSibling === undefined ||
    //   this._node.nextSibling.nodeName === 'backup';
    this._isLast = (<any>this._node).nextElementSibling === null ||
      (<any>this._node).nextElementSibling === undefined ||
      (<any>this._node).nextElementSibling.nodeName === 'backup';

    /**
     * The note's voice number
     * @prop {Number} Note.Voice
     */
    this._voice = getNumber(this._node, 'voice');
    /**
     * The note's staff number
     * @prop {Number} Note.Staff
     */
    const tStaff = getNumber(this._node, 'staff');
    this._staff = isNaN(tStaff) ? 1 : tStaff;
    /**
     * The duration of the note
     * @prop {Number} Note.Duration
     */
    this._duration = getNumber(this._node, 'duration');

    /**
     * The notes type of representation (8th, whole, ...)
     * @prop {String} Note.Type
     */
    this._type = getText(this._node, 'type');

    /**
     * The notes beam state. It indicates if a beam starts or ends here
     * @prop {Array} Note.Beam is an array of beams. They can be 'begin', 'end',
     *               'continue' or 'none'
     */
    // FIXME: Description doesn't match implementation
    this._beamState = getTextArray(this._node, 'beam').indexOf('begin') > -1 ||
      getTextArray(this._node, 'beam').indexOf('continue') > -1 ||
      getTextArray(this._node, 'beam').indexOf('end') > -1;

    /**
     * Indicates if this is the last not in a beam.
     * @prop {Boolean} Note.isLastBeamNote is an boolean that indicates the last
     * not in a beam
     */
    this._isLastBeamNote = getTextArray(this._node, 'beam').every(b => b.indexOf('end') > -1);

    /**
     * The notes pitch. It is defined by a step and the octave.
     * @prop {Object} .Step: Step inside octave
     *                .Octave: Octave of the note
     */
    if (childWithNameExists(this._node, 'pitch')) {
      const pitchNode = getChildByName(this._node, 'pitch');
      this._pitch = {
        step: childWithNameExists(pitchNode, 'step') ? getText(pitchNode, 'step') : undefined,
        octave: getNumber(pitchNode, 'octave'),
      };
    } else if (childWithNameExists(this._node, 'unpitched')) {
      const unpitchedNode = getChildByName(this._node, 'unpitched');
      this._pitch = {
        step: childWithNameExists(unpitchedNode, 'display-step') ? getText(unpitchedNode, 'display-step') : undefined,
        octave: getNumber(unpitchedNode, 'display-octave'),
      };
    }

    /**
     * The note's length. It is defined by the duration divided by the divisions
     * in this measure.
     * @param {Number} Note.NoteLength defines the note's length
     */
    this._noteLength = this._duration / this._divisions;

    this._dots = 0;

    // TODO: Move somewhere else
    this._types = {
      '': this.calculateType(),
      'whole': 'w',
      'half': 'h',
      'quarter': 'q',
      'eighth': '8',
      '16th': '16',
      '32nd': '32',
      '64th': '64',
      '128th': '128',
      '256th': '256',
      '512th': '512',
      '1024th': '1024',
    };

    this._parseNotations();
  }

  get staff(): number {
    return this._staff;
  }

  get isLast(): boolean {
    return this._isLast;
  }

  get isInChord(): boolean {
    return this._isInChord;
  }

  get isRest(): boolean {
    return this._isRest;
  }

  get dots(): number {
    return this._dots;
  }

  get beamState(): boolean {
    return this._beamState;
  }

  get isLastBeamNote(): boolean {
    return this._isLastBeamNote;
  }

  calculateType() {
    let ret;

    if (this._noteLength === 4) {
      ret = 'w';
    } else if (this._noteLength >= 2 && this._noteLength <= 3) {
      ret = 'h';
    } else if (this._noteLength >= 1 && this._noteLength < 2) {
      ret = 'w';
    } else if (this._noteLength === 0.25) {
      ret = 'q';
    } else if (this._noteLength === 0.5) {
      ret = 'h';
    } else if (this._noteLength <= (1 / 8)) {
      ret = Math.round(1 / (1 / 8)).toString();
    }
    return ret;
  }

  getVexNote(): any {
    const kStep = this.isRest ? 'b' : this._pitch.step;
    const kOctave = this.isRest ? '4' : this._pitch.octave;
    const type = this._types[this._type];
    if (type === undefined) {
      throw new Error(`BadArguments -- Invalid type -- ${JSON.stringify(this)}`);
    }
    // const ret = { keys: [kStep + '/' + kOctave], duration: type };
    const ret: any = Object.assign({}, {keys: [kStep + '/' + kOctave], duration: type});
    if (this.isRest) {
      ret.type = 'r';
    }
    // if (this._node.nextSibling !== null) {
    if ((<any>this._node).nextElementSibling !== null) {
      // const tempNote = new Note(this._node.nextSibling, this._duration);
      const tempNote = new Note((<any>this._node).nextElementSibling, this._duration);
      if (tempNote.isInChord) {
        ret.keys.push(...tempNote.getVexNote().keys);
      }
    }
    return ret;
  }

  /**
   * Notations refer to musical notations, not XML notations. Multiple notations are allowed in order to represent
   * multiple editorial levels. The print-object attribute, added in Version 3.0, allows notations to represent details
   * of performance technique, such as fingerings, without having them appear in the score.
   * @private
   */
  private _parseNotations() {
    if (childWithNameExists(this._node, 'notations')) {
      const notations = getChildByName(this._node, 'notations');

      if (childWithNameExists(notations, 'technical')) {
        const technical = getChildByName(notations, 'technical');

        if (childWithNameExists(technical, 'fret') && childWithNameExists(technical, 'string')) {
          this._tabNotation = {
            fret: getNumber(technical, 'fret'),
            string: getNumber(technical, 'string')
          };
        }
      }
    }
  }
}
