/**
 * Created by HOFFM59 on 05.05.2017.
 */
import * as Vex from 'vexflow';
import {Tabbable} from './interfaces';
import {Note} from './note';

export class Chord implements Tabbable {
  value: string;
  quantifier: number;
  notes: Array<Note>;

  raw: string;

  constructor(raw?: string) {
    this.raw = raw;

    this.notes = [];
  }

  toTabNote(): Vex.Flow.Note {
    const chord = new Vex.Flow.TabNote({
      positions: this.notes.map(n => {
        return {str: n.tabbed.string, fret: n.tabbed.fret};
      }),
      stem_direction: Vex.Flow.Stem.DOWN,
      duration: `${this.quantifier}`
    }, true);

    if (this.raw.match(/\~/g)) {
      chord.addModifier(new Vex.Flow.Vibrato());
    }

    return chord;
  }
}
