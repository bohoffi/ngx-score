/**
 * Created by HOFFM59 on 11.05.2017.
 */
import * as Vex from 'vexflow';

export const getMeasureBar = (type?: Vex.Flow.Barline.type): Vex.Flow.BarNote => {
  return new Vex.Flow.BarNote({duration: 'b'})
    .setType(type || Vex.Flow.Barline.type.SINGLE);
};
