import {Component, OnInit} from '@angular/core';
import {Title}     from '@angular/platform-browser';


@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnInit {

  deps: Array<{ name: string; version: string; url: string; }> = [
    {
      name: 'Angular',
      version: '4.0.0',
      url: 'https://angular.io'
    }
  ];

  installSteps: Array<{ label: string; content: string; }> = [
    {
      label: 'npm package',
      content: 'npm install --save ngx-score'
    },
    {
      label: 'SystemJS (optional)',
      content: 'map: { \'ngx-score\': \'node_modules/ngx-score/bundles/ngx-score.umd.js\' }'
    },
    {
      label: 'Import module',
      content: 'imports: [NgxScoreModule.forRoot(), ...]'
    }
  ];

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Getting Started | ngx-score');
  }

}
