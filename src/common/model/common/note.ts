/**
 * Created by HOFFM59 on 05.05.2017.
 */
import {Tabbable, Tabbed} from './interfaces';
import * as Vex from 'vexflow';

export class Note implements Tabbable {
  value: string;
  quantifier: number;
  raw: string;

  private _divider: RegExp = /\d+/g;

  constructor(raw?: string) {
    this.raw = raw;
  }

  get tabbed(): Tabbed {

    const tabbedParts = this.value.match(this._divider);

    return !!tabbedParts && !!tabbedParts[0] && !!tabbedParts[0] ? {
      string: parseInt(tabbedParts[0], 10),
      fret: parseInt(tabbedParts[1], 10)
    } : {string: 0, fret: 0};
  }

  toTabNote(): Vex.Flow.Note {
    const note = new Vex.Flow.TabNote({
      positions: [{
        str: this.tabbed.string,
        fret: this.tabbed.fret
      }],
      stem_direction: Vex.Flow.Stem.DOWN,
      duration: `${this.quantifier}`
    }, true);

    if (this.raw.match(/\~/g)) {
      note.addModifier(new Vex.Flow.Vibrato());
    }
    if (this.raw.match(/\./g)) {
      note.addDot();
    }

    return note;
  }
}
