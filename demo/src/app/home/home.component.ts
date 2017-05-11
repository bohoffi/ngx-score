import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {createRenderer, createTokenizer, IRenderer, ITokenizer} from 'ngx-score';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  formGroup: FormGroup;

  container: HTMLElement;
  inner: HTMLElement;
  canvas: HTMLCanvasElement;

  private tokenizer: ITokenizer;
  private _renderer: IRenderer;

  constructor(private titleService: Title,
              private _fb: FormBuilder) {
    this.formGroup = this._fb.group({
      syntax: ''
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Home | ngx-score');

    this.container = document.getElementById('main');
    this.canvas = document.createElement('canvas');
    this.canvas.style.zIndex = '0';
    this.inner = document.createElement('div');
    this.inner.style.position = 'relative';
    this.inner.appendChild(this.canvas);
    this.container.appendChild(this.inner);

    this.tokenizer = createTokenizer('TAB');
    this._renderer = createRenderer(this.tokenizer, this.canvas);
  }

  ngAfterViewInit(): void {
    this.formGroup.controls['syntax'].valueChanges.debounceTime(1000).subscribe(
      syntax => {
        // const result = this.tokenizer.parse(syntax).result;
        const result = this.tokenizer.parse(syntax);
        console.log('measures: ', result);
        // this._renderer.render(result, this.canvas);
        this._renderer.render(result);
      },
      err => console.error(err)
    );
  }
}
