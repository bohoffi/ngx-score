/**
 * Created by HOFFM59 on 10.05.2017.
 */
import {ITokenizer} from './interfaces';
import {TokenizerType} from './types';
import {MusicXml} from '../../common/model';

export class MusicXmlTokenizer implements ITokenizer<Promise<MusicXml.MusicXml>> {

  parse(input: any): Promise<MusicXml.MusicXml> {

    if (typeof input === 'string') {

      // file should be fetched from url
      if (input.endsWith('.xml')) {
        // return this._http.get(`assets/musicxml/${input}`)
        //   .map((resp: Response) => resp.text())
        //   .toPromise()
        //   .then(content => this.parse(content));
        return this._fetch(`assets/musicxml/${input}`)
          .then(content => this.parse(content));
      }

      // file content => load it
      if (input.startsWith('<?xml')) {
        return Promise.resolve(new MusicXml.MusicXml(input));
      }
    }
  }

  getType(): TokenizerType {
    return 'musicXML';
  }

  private _fetch(url: string): Promise<string> {
    let xhttp: XMLHttpRequest;
    if (XMLHttpRequest) {
      xhttp = new XMLHttpRequest();
    // } else if (ActiveXObject === undefined) {
    //   // for IE<7
    //   xhttp = new ActiveXObject('Microsoft.XMLHTTP');
    } else {
      return Promise.reject(new Error('XMLHttp not supported.'));
    }
    return new Promise((resolve: (value: string) => void, reject: (error: any) => void) => {
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === XMLHttpRequest.DONE) {
          if (xhttp.status === 200) {
            resolve(xhttp.responseText);
          } else if (xhttp.status === 0 && xhttp.responseText) {
            resolve(xhttp.responseText);
          } else {
            // reject(new Error('AJAX error: '' + xhttp.statusText + '''));
            reject(new Error('Could not retrieve requested URL'));
          }
        }
      };
      xhttp.overrideMimeType('text/plain; charset=x-user-defined');
      xhttp.open('GET', url, true);
      xhttp.send();
    });
  }
}
