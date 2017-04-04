# Coffee Time
This project is part of the FrontEnd Nanodegree at Udacity. It's a single-page app that integrates Foursquare and GoogleMaps to implement a search feature so that the user can find coffee places on the area.

## Install
> You'll need a Foursquare account to try the app

1. Download the project folder to your computer
2. Go to the terminal
    * Install dependencies  
        * `npm install`
    * Build the app
        * `gulp styles`
        * `gulp resize`
    * Serve the app
        * `python -mSimpleHTTPServer`
4. Open a browser and launch the app at http://127.0.0.1:8000/

## Update app's credentials
* Register your app at [Foursquare](https://foursquare.com/developers/register)
* Register your project at [Google console](https://console.developers.google.com/) and enable your keys for Google Maps Google Maps APIs (JavaScript API, Geocoding)
* Go to [data.js](app/data.js) and update the keys for googleGeo (Geocoding) and fq (Foursquare)

    ```javascript
        keys: {
            fq: "YOUR_FOURSQUARE_CLIENT_ID",
            googleGeo: 'YOUR_GOOGLEGEO_KEY'
        }
    ```

## Add/Change components
There are 4 components (navigation, searchBox, searchResults, section) that share a common [viewModel](app/viewModel.js).

* To add a new component, you need to create a folder under components with two files: a html file for the template, and a js file for the component logic (register and custom bindings).
```javascript
    ko.components.register('componentName', {
        viewModel: componentViewModel,
        template:  componentTemplate
    });
```
* Go to [main.js](app/main.js) and update the require.config object with the paths to the new files
* Don't forget to update the dependencies in the related files

```javascript
    define(['componentName'], function () {})
```

## Add/Change styles
* Go to [main.less](app/styles/src/main.less)
    * Change the typography `@primaryFont` `@secondaryFont`
    * Change the color palete `@primary` `@secondary`
    * Change the breakpoints `@xsmall``@medium``@large``@xlarge`
    * Or specific styles, of course :)
* When you are done go to the terminal and run `gulp styles` command to generate the updated .css file

 > If you change the typography don't forget to update the reference to
 > Google Fonts at [index.html](index.html)


## Add/Change images
* If you want to chance the image for the start screen. All you need to do is replace the file on image folder and run the command `gulp resize`
