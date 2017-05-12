/**
 * Created by HOFFM59 on 10.05.2017.
 */
import {TokenizerType} from './types';
import {ITokenizer} from './interfaces';
import {BaseTokenizer} from './tokenizer-base';
import {Common} from '../../common/model';

export class TabTokenizer extends BaseTokenizer implements ITokenizer<Array<Common.Measure>> {

  // (?:\:+)?(\|)(?:\:+)? => |, |:, |:
  private _measureSplit: RegExp = /[\|$]+/g;
  /**
   * Captures single beat, notes, chords, breaks
   * (B:\d+\/\d+) => beat
   * (\s?(?:\d+_)(?:\d+\>\d+)\s?) => (quantifier_)note
   * ((?:\d+)?\[(?:\s?(?:\d+\>\d+)\s?)+\]) => (quantifier)chord
   * ((?:\d+)?BR) => (quantifier)break
   */
    // private _measureElement: RegExp = /(B:\d+\/\d+)|(\s?(?:\d+_)?(?:\d+\>\d+)\s?)|((?:\d+)?\[(?:\s?(?:\d+\>\d+)\s?)+\])|((?:\d+)?BR)/g;
  private _measureElement: RegExp =
    /(B:\d+\/\d+)|(\s?(?:\d+_)?(?:\d+\>\d+)(?:\.)?(?:\~)?\s?)|((?:\d+)?\[(?:\s?(?:\d+\>\d+)\s?)+\](?:\.)?(?:\~)?)|((?:\d+)?BR)/g;
  private _beat: RegExp = /(B:\d+\/\d+)/g;
  // private _note: RegExp = /(\s?(?:\d+_)?(?:\d+\>\d+)\s?)/g;
  private _noteQuantifier: RegExp = /(?:\d+_)?/g;
  private _defaultQuantifierRegExp: RegExp = /^\d+/g;
  private _chord: RegExp = /((?:\d+)?\[(?:\s?(?:\d+\>\d+)\s?)+\])/g;
  private _break: RegExp = /((?:\d+)?BR)/g;

  private _vibrato: RegExp = /\~/g;

  // private _fullNote: RegExp = new RegExp(this._note.source);
  private x: RegExp = /(?:\d+\>\d+)/g;
  private _fullNote: RegExp = new RegExp(`(\s?${this._noteQuantifier.source}${this.x.source}(?:\.)?(?:${this._vibrato.source})?\s?)`);

  // parse(input: any): ITokenizer {
  //   this.result = input.split(this._measureSplit).filter(m => !!m).map(m => this._measure(m));
  //   return this;
  // }
  parse(input: any): Array<Common.Measure> {
    return input.split(this._measureSplit).filter(m => !!m).map(m => this._measure(m));
  }

  getType(): TokenizerType {
    return 'TAB';
  }

  private _measure(input: string): Common.Measure {

    const measure = new Common.Measure(input);

    input.split(this._measureElement)
      .filter(e => !!e && new RegExp(this._measureElement).test(e))
      .forEach(elem => {
        if (this._isBeat(elem.trim())) {
          const beat = new Common.Beat(elem.trim());
          const beatParts = beat.raw.match(new RegExp(/\d+/g));
          beat.count = !!beatParts ? +beatParts[0] : this._defaultQuantifier;
          beat.quantifier = !!beatParts ? +beatParts[1] : this._defaultQuantifier;
          measure.beat = beat;

        } else if (this._isChord(elem.trim())) {

          const chord = new Common.Chord(elem.trim());
          chord.value = chord.raw.replace(this._defaultQuantifierRegExp, '');
          chord.quantifier = this._getQuantifier(chord.raw, this._defaultQuantifierRegExp);

          chord.notes = chord.raw.replace(new RegExp(/((?:\d+)?\[)|(\])/g), '')
          // .split(this._note).filter(e => !!e && e !== '[' && e !== ']').map(n => {
            .split(this._fullNote).filter(e => !!e && e !== '[' && e !== ']').map(n => {
              const note = new Common.Note(n.trim());
              note.value = note.raw.replace(this._noteQuantifier, '');
              note.quantifier = this._getQuantifier(note.raw, this._noteQuantifier);
              return note;
            });

          measure.add(chord);

        } else if (this._isNote(elem.trim())) {

          const note = new Common.Note(elem.trim());
          note.value = note.raw.replace(this._noteQuantifier, '');
          note.quantifier = this._getQuantifier(note.raw, this._noteQuantifier);
          measure.add(note);

        } else if (this._isBreak(elem.trim())) {
          const br = new Common.Rest(elem.trim());
          br.quantifier = this._getQuantifier(br.raw, this._defaultQuantifierRegExp);
          measure.add(br);
        }
      });

    if (!measure.beat) {
      const beat = new Common.Beat('B:4/4');
      beat.count = 4;
      beat.quantifier = this._defaultQuantifier;
      measure.beat = beat;
    }

    console.log('measure is valid: ', measure.isValid);

    return measure;
  }

  private _isBeat(input: string): boolean {
    return !!input.match(this._beat);
  }

  private _isNote(input: string): boolean {
    // return !!input.match(this._note);
    return !!input.match(this._fullNote);
  }

  private _isChord(input: string): boolean {
    return !!input.match(this._chord);
  }

  private _isBreak(input: string): boolean {
    return !!input.match(this._break);
  }

  private _getQuantifier(raw: string, quantifierRegExp: RegExp): number {
    const quantifier = raw.match(quantifierRegExp);
    return !!quantifier && !!quantifier[0] ? parseInt(quantifier[0], this._defaultRadix) : this._defaultQuantifier;
  }
}
