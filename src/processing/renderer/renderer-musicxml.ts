/**
 * Created by HOFFM59 on 10.05.2017.
 */
import * as Vex from 'vexflow';

import {BaseRenderer} from './renderer-base';
import {MusicXml} from '../../common/model';

// FIXME cloned from vexflow sources because this is not accessable using @types/vexflow
const keySpecs: any = {
  'C': {acc: null, num: 0},
  'Am': {acc: null, num: 0},
  'F': {acc: 'b', num: 1},
  'Dm': {acc: 'b', num: 1},
  'Bb': {acc: 'b', num: 2},
  'Gm': {acc: 'b', num: 2},
  'Eb': {acc: 'b', num: 3},
  'Cm': {acc: 'b', num: 3},
  'Ab': {acc: 'b', num: 4},
  'Fm': {acc: 'b', num: 4},
  'Db': {acc: 'b', num: 5},
  'Bbm': {acc: 'b', num: 5},
  'Gb': {acc: 'b', num: 6},
  'Ebm': {acc: 'b', num: 6},
  'Cb': {acc: 'b', num: 7},
  'Abm': {acc: 'b', num: 7},
  'G': {acc: '#', num: 1},
  'Em': {acc: '#', num: 1},
  'D': {acc: '#', num: 2},
  'Bm': {acc: '#', num: 2},
  'A': {acc: '#', num: 3},
  'F#m': {acc: '#', num: 3},
  'E': {acc: '#', num: 4},
  'C#m': {acc: '#', num: 4},
  'B': {acc: '#', num: 5},
  'G#m': {acc: '#', num: 5},
  'F#': {acc: '#', num: 6},
  'D#m': {acc: '#', num: 6},
  'C#': {acc: '#', num: 7},
  'A#m': {acc: '#', num: 7},
};

/**
 * @see https://github.com/bneumann/vexflow-musicxml/blob/master/src/VexRenderer.js
 */
export class MusicXmlRenderer extends BaseRenderer {

  private staveList = [];
  private beamList = [];
  private connectors = [];
  private voiceList = [];

  private keySpec = [];

  private staveSpace = 100;
  private staveWidth = 250;
  private staveXOffset = 20;
  private staveYOffset = 20;
  private systemSpace = this.staveSpace * 2 + 50;

  private layout: { measuresPerStave: number; linesPerPage: number; systems: any; points: any };

  constructor(c: HTMLCanvasElement | any) {
    super(c);

    // for (const k in Vex.Flow.keySignature.keySpecs) {
    //   if ({}.hasOwnProperty.call(Vex.Flow.keySignature.keySpecs, k)) {
    //     const newEntry = Vex.Flow.keySignature.keySpecs[k];
    //     newEntry.name = k;
    //     this.keySpec.push(newEntry);
    //   }
    // }
    this.keySpec = Object.keys(keySpecs).map(k => {
      const newEntry = keySpecs[k];
      newEntry.name = k;
      return newEntry;
    });

    // Some formatting constants
    this.staveSpace = 100;
    this.staveWidth = 250;
    this.staveXOffset = 20;
    this.staveYOffset = 20;
    this.systemSpace = this.staveSpace * 2 + 50;
  }

  getScoreHeight() {
    return this.systemSpace * this.layout.linesPerPage;
  }

  calculateLayout(musicXml: MusicXml.MusicXml) {
    const width = this.isSvg ? this.container.getAttribute('width') : this.container.width;
    // const height = this.isSvg ? this.canvas.getAttribute('height') : this.canvas.height;
    const mps = Math.floor(width / this.staveWidth); // measures per stave
    // Reset the stave width to fill the page
    this.staveWidth = Math.round(width / mps) - this.staveXOffset;
    // TODO: Use page height for calculation
    const measures = musicXml.parts[0].measures;
    const lpp = Math.ceil(measures.length / mps);    // lines per page
    const sps = musicXml.parts
      .map(p => p.getAllStaves()) // get all the staves in a part
      .map(sa => sa.length)       // get the length of the array (number of staves)
      .reduce((e, ne) => e + ne);   // sum them up

    const a = [];
    let idx = 0;

    for (let s = 0; s < sps; s++) { // systems / all staves
      for (let l = 0; l < lpp; l++) { // lines
        for (let m = 0; m < mps; m++) { // measures
          const point = {
            x: (this.staveWidth * m) + this.staveXOffset,
            y: l * this.systemSpace + s * this.staveSpace + this.staveYOffset,
            index: idx,
          };
          // uncomment for debug purposes
          // this.context.fillText(' line: ' + l +
          //                   ' stave ' + s +
          //                   ' measure ' + m +
          //                   ' index: ' + idx, point.x, point.y)
          a.push(point);
          idx++;
          if (idx === measures.length) {
            idx = 0;
            break;
          }
        }
      }
    }
    return {
      measuresPerStave: mps,
      linesPerPage: lpp,
      systems: sps,
      points: a,
    };
  }

  protected renderInternal(data: MusicXml.MusicXml): void {
    // this.renderer.resize(500, 500);
    // this.context.setFont('Arial', 10, 100).setBackgroundFillStyle('#eed');
    //
    // this.layout = this.calculateLayout(data);
    //
    // console.log('_layout: ', this.layout);
    // console.log('_scoreHeight: ', this.getScoreHeight());

    this.layout = this.calculateLayout(data);
    const scoreHeight = this.getScoreHeight();

    this.renderer.resize(2000, scoreHeight);
    this.context.setFont('Arial', 10, 100).setBackgroundFillStyle('#eed');

    console.log('_layout: ', this.layout);
    console.log('_scoreHeight: ', scoreHeight);

    // Reset all lilsts
    this.staveList = [];
    this.beamList = [];
    this.connectors = [];
    this.voiceList = [];

    const allParts = data.parts;
    let curSystem = 0;
    let mIndex = 0;
    allParts.forEach((part) => {
      const allMeasures = part.measures;
      const allStaves = part.getAllStaves();
      const allMeasureWithKeys = part.getAllMeasuresWithKeys();

      let stave: any = {};
      stave.width = this.staveWidth;
      // Iterate all staves in this part
      allStaves.forEach((curStave, si) => {
        const staffInfo = {
          'stave': curStave,
          'si': si,
        };
        const measureList = [];
        // The notes can be set to bass, treble, etc. with the clef.
        // So we need to remember the last clef we used
        let curClef = 'treble';
        let curTime: any = {num_beats: 4, beat_value: 4, resolution: Vex.Flow.RESOLUTION};
        // Iterate all measures in this stave
        allMeasures.forEach((meas, mi) => {
          const newSystem = this.layout.measuresPerStave % (mi + 1) > 0;
          curSystem = newSystem ? curSystem + 1 : curSystem;
          const point = this.layout.points[mIndex];
          stave = new Vex.Flow.Stave(point.x, point.y, stave.width);
          mIndex++;
          measureList.push(stave);

          // Check if we have keys in this measure
          if (allMeasureWithKeys.indexOf(meas) > -1) {
            const key = this.getVexKey(meas.attributes[0].key);
            stave.addKeySignature(key);
          }
          const allClefs = meas.clefs;
          const allTimes = meas.getAllTimes();
          // Adding clef information to the stave
          if (allClefs.length > 0) {
            // Only change if the clef change is meant for this stave
            if (allClefs[staffInfo.si] && staffInfo.stave === allClefs[staffInfo.si].number) {
              curClef = allClefs[staffInfo.si] ? allClefs[staffInfo.si].getVexClef() : curClef;
              stave.addClef(curClef);
            }
          }
          // Adding time information to the stave & voice
          if (allTimes[staffInfo.si]) {
            curTime = allTimes[staffInfo.si].getVexTime();
            curTime.resolution = Vex.Flow.RESOLUTION;
          }
          if (mi === 0 || allTimes[staffInfo.si]) {
            if (1) { // eslint-disable-line
              stave.addTimeSignature(curTime.num_beats + '/' + curTime.beat_value);
            } else {
              stave.addTimeSignature('C');
            }
          }
          stave.setContext(this.context);

          // Adding notes
          // const curNotes = meas.getNotesByStaff(staffInfo.stave);
          const notesByBackup = meas.getNotesByBackup();
          let curNotes = notesByBackup[staffInfo.si];
          // FIXME: Backup mechanism ftw... :(
          const staffNoteArray = [];
          // filter chord notes. They are automatically returned by the getVexNote function
          if (curNotes) {
            curNotes = curNotes.filter(n => n.isInChord === false);
            curNotes.forEach((n) => {
              const vn = n.getVexNote();
              vn.clef = n.isRest ? 'treble' : curClef;
              const sn = new Vex.Flow.StaveNote(vn);
              for (let i = 0; i < n.dots; i++) {
                sn.addDotToAll();
              }
              sn.setStave(stave);
              staffNoteArray.push(sn);
            }); // Notes

            // Beaming: mxml has a start, end and continue for beams. VexFlow
            // handles the number of beams itself so we only need to group the
            // notes depending on their "BeamState"
            // const beamStates = curNotes.map(n => n.BeamState);
            let beamNotes = [];
            curNotes.forEach((b, i) => {
              if (b.beamState) {
                beamNotes.push(staffNoteArray[i]);
                // Beams do only make sense if more then 1 note is involved
                if (beamNotes.length > 1 && b.isLastBeamNote) {
                  this.beamList.push(new Vex.Flow.Beam(beamNotes));
                  beamNotes = [];
                }
              }
            });

            // Draw notes
            const voice = new Vex.Flow.Voice(curTime)
              .setMode(Vex.Flow.Voice.Mode.SOFT)
              .addTickables(staffNoteArray);

            new Vex.Flow.Formatter()
              .joinVoices([voice])
              .formatToStave([voice], stave, {align_rests: false, context: this.context});

            this.voiceList.push(voice);
            // Flow.Formatter.FormatAndDraw(this.context, stave, staffNoteArray);
          }
        }); // Measures
        this.staveList.push(measureList);

        // Add connectors
        if (this.staveList.length >= 2) {
          const topStave = this.staveList[0];
          const bottomStave = this.staveList[1];
          for (let measureIdx = 0; measureIdx < topStave.length; measureIdx++) {
            const connectorTypeList = [];
            if (measureIdx % this.layout.measuresPerStave === 0) {
              // Draw brace at beginning of line
              connectorTypeList.push(Vex.Flow.StaveConnector.type.BRACE);
            }
            connectorTypeList.push(Vex.Flow.StaveConnector.type.SINGLE_LEFT);
            connectorTypeList.push(Vex.Flow.StaveConnector.type.SINGLE_RIGHT);
            // eslint-disable-next-line eqeqeq
            if (measureIdx === (topStave.length - 1)) {
              // Draw Endbar
              topStave[measureIdx].setEndBarType(Vex.Flow.Barline.type.END);
              bottomStave[measureIdx].setEndBarType(Vex.Flow.Barline.type.END);
              connectorTypeList.push(Vex.Flow.StaveConnector.type.BOLD_DOUBLE_RIGHT);
            }
            for (let cType = 0; cType < connectorTypeList.length; cType++) {
              this.addConnector(topStave[measureIdx],
                bottomStave[measureIdx],
                connectorTypeList[cType]);
            }
          }
        }
      }); // Staves
    }); // Parts

    // Draw measures and lines
    this.staveList.forEach(meas => meas.forEach(s => s.setContext(this.context).draw()));
    // Draw connectors
    this.connectors.forEach(c => c.setContext(this.context).draw());
    // Draw notes
    this.voiceList.forEach(v => v.setContext(this.context).draw());
    // Draw beams
    this.beamList.forEach(beam => beam.setContext(this.context).draw());
  }

  private getVexKey(key: MusicXml.Key): any {
    let filteredKeys = this.keySpec.filter(k => k.num === Math.abs(key.fifths));
    const mode = key.mode === 'major' ? 0 : 1;
    if (key.fifths < 0) {
      filteredKeys = filteredKeys.filter(k => k.acc === 'b');
    } else if (key.fifths > 0) {
      filteredKeys = filteredKeys.filter(k => k.acc === '#');
    }
    return filteredKeys[mode].name;
  }

  addConnector(stave1, stave2, type) {
    this.connectors.push(
      new Vex.Flow.StaveConnector(stave1, stave2)
        .setType(type)
        .setContext(this.context));
  }
}
