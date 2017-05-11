/**
 * Created by HOFFM59 on 05.05.2017.
 */
import {Rest} from './rest';
import {Note} from './note';
import {Chord} from './chord';
import {Beat} from './beat';
import {Tabbable} from './interfaces';

export class Measure {
  beat: Beat;
  chords: Array<Chord>;
  notes: Array<Note>;
  rests: Array<Rest>;
  run: Array<Tabbable>;
  raw: string;

  constructor(raw?: string) {
    this.raw = raw;

    this.chords = [];
    this.notes = [];
    this.rests = [];
    this.run = [];
  }

  add(element: Note | Chord | Rest): void {
    if (element instanceof Note) {
      this.notes.push(element);
    } else if (element instanceof Chord) {
      this.chords.push(element);
    } else if (element instanceof Rest) {
      this.rests.push(element);
    }
    this.run.push(element);
  }

  get isValid(): boolean {
    const itemValueSum = this.run.map(r => this.beat.quantifier / r.quantifier).reduce((s, q) => s + q, 0);
    return this.beat.count === itemValueSum;
  }
}
