/**
 * Created by HOFFM59 on 05.05.2017.
 */
import * as Vex from 'vexflow';
import {Tabbable} from './interfaces';

export class Rest implements Tabbable {
  quantifier: number;

  raw: string;

  constructor(raw?: string) {
    this.raw = raw;
  }

  toTabNote(): Vex.Flow.Note {
    return new Vex.Flow.StaveNote({keys: ['b/4'], stem_direction: Vex.Flow.Stem.UP, duration: `${this.quantifier}r`});
  }
}
