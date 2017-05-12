/**
 * Created by HOFFM59 on 10.05.2017.
 */
import * as Vex from 'vexflow';

import {BaseRenderer} from './renderer-base';
import {Common} from '../../common/model';
import {getMeasureBar} from '../../utils/vex-utils';

export class TabRenderer extends BaseRenderer {

  protected renderInternal(data: Array<Common.Measure>): void {
    this.renderer.resize(500, 500);
    this.context.setFont('Arial', 10, 100).setBackgroundFillStyle('#eed');

    // Create a tab stave of width 400 at position 10, 40 on the canvas.
    const stave = new Vex.Flow.TabStave(10, 40, 400);
    stave.addClef('tab')
      .addTimeSignature('4/4');
    stave.setEndBarType(Vex.Flow.Barline.type.DOUBLE);
    stave.setContext(this.context).draw();

    // Vex.Flow.BarNote.DEBUG = true;

    const notes: Vex.Flow.Note[] = data.reduce((res, m) => {
      return res.concat(m.run.map(t => {
        const tabNote = t.toTabNote();
        if (!m.isValid) {
          // TODO mark notes as invalid
        }
        return tabNote;
      }), getMeasureBar());
    }, []);

    // Vex.Flow.Formatter.DEBUG = true;

    // automatic way
    Vex.Flow.Formatter.FormatAndDraw(this.context, stave, notes, {auto_beam: true, align_rests: true});

    // manual way
    // const opts = {auto_beam: true, align_rests: true};
    //
    // const defaultTime = {
    //   num_beats: 4,
    //   beat_value: 4,
    //   resolution: Vex.Flow.RESOLUTION,
    // };
    // const voice: Vex.Flow.Voice = new Vex.Flow.Voice(defaultTime);
    // voice.setMode(Vex.Flow.Voice.Mode.SOFT);
    // voice.addTickables(notes);
    //
    // const beams = opts.auto_beam ? Vex.Flow.Beam.applyAndGetBeams(voice, Vex.Flow.Stem.DOWN, []) : [];
    //
    // const formatter: Vex.Flow.Formatter = new Vex.Flow.Formatter();
    // formatter.joinVoices([voice]);
    // formatter.formatToStave([voice], stave, {align_rests: opts.align_rests, context: this.context});
    //
    // voice.setStave(stave);
    // voice.draw(this.context, stave);
    //
    // beams.forEach(b => b.setContext(this.context).draw());
  }
}
