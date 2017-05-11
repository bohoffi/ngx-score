/**
 * Created by HOFFM59 on 05.05.2017.
 */

import * as Vex from 'vexflow';

export interface MeasureItem {
  quantifier: number;
}

export interface Tabbed {
  string: number;
  fret: number;
}

export interface Tabbable extends MeasureItem {
  toTabNote(): Vex.Flow.Note;
}
