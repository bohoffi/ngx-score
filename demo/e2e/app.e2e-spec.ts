import { NgxScorePage } from './app.po';

describe('ngx-score App', () => {
  let page: NgxScorePage;

  beforeEach(() => {
    page = new NgxScorePage ();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
