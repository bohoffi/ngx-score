/**
 * Created by HOFFM59 on 05.05.2017.
 */

export class Beat {
  count: number;
  quantifier: number;

  raw: string;

  constructor(raw?: string) {
    this.raw = raw;
  }
}
