# lut-loader
A webpack loader that allows to bundle LUT files as PNG

## Webpack Configuration

You can use lut-loader in combination with others loader.
For example, if you want parse a .cube file and import as PNG directly in your source code you have to do:

``` js
module: {
  rules: [{
    test: /\.cube$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: utils.assetsPath('assets/lut/[name].[hash:7].png')
        }
      },
      {
        loader: 'lut-loader'
      }
    ]
  }]
}
```

or if you want obtain only the buffer data:

``` js
module: {
  rules: [{
    test: /\.cube$/,
    use: [
      {
        loader: 'lut-loader'
      }
    ]
  }]
}
```

example of usage:

``` js
import LUTNight from './assets/luts-source/night.cube'

// ...

applyPngLut(LUTNight)
``` 