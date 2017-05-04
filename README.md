# ngx-score - Utility to view (and edit) music scores written in musicXML, abc notation or Vex-style provided as an Angular module.

[![npm version](https://badge.fury.io/js/ngx-score.svg)](https://badge.fury.io/js/ngx-score)
[![Build Status](https://travis-ci.org/bohoffi/ngx-score.svg?branch=master)](https://travis-ci.org/bohoffi/ngx-score)
[![Coverage Status](https://coveralls.io/repos/github/bohoffi/ngx-score/badge.svg?branch=master)](https://coveralls.io/github/bohoffi/ngx-score?branch=master)
[![devDependency Status](https://david-dm.org/bohoffi/ngx-score/dev-status.svg?branch=master)](https://david-dm.org/bohoffi/ngx-score#info=devDependencies)

## Demo

View all the directives in action at https://bohoffi.github.io/ngx-score

## Dependencies
* [Angular](https://angular.io) (*requires* Angular 4 or higher, tested with 4.1.0)

## Installation
Install above dependencies via *npm*. 

Now install `ngx-score` via:
```shell
npm install --save ngx-score
```

---
##### SystemJS
>**Note**:If you are using `SystemJS`, you should adjust your configuration to point to the UMD bundle.
In your systemjs config file, `map` needs to tell the System loader where to look for `ngx-score`:
```js
map: {
  'ngx-score': 'node_modules/ngx-score/bundles/ngx-score.umd.js'
}
```
---

Once installed you need to import the main module:
```js
import {NgxScoreModule} from 'ngx-score';
```
The only remaining part is to list the imported module in your application module. The exact method will be slightly
different for the root (top-level) module for which you should end up with the code similar to (notice `NgxScoreModule.forRoot()`):
```js
import {NgxScoreModule} from 'ngx-score';

@NgModule({
  declarations: [AppComponent],
  imports: [NgxScoreModule.forRoot()],  
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

Other modules in your application can simply import `NgxScoreModule`:

```js
import {NgxScoreModule} from 'ngx-score';

@NgModule({
  declarations: [OtherComponent],
  imports: [NgxScoreModule], 
})
export class OtherModule {
}
```

## Usage



## License

Copyright (c) 2017 bohoffi. Licensed under the MIT License (MIT)

