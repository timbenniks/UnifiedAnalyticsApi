Unified analytics in JavaScript
===============================

This piece of JavaScript provides a unified API for popular analytics
libraries like [Google Analytics](http://www.google.com/analytics/ "Google Analytics") 
or [Adobe Omniture](http://www.omniture.com/en/ "Adobe Omniture").

The aim is to provide a clean and simple approach to handle the metrics of your website.
There is a base class that provides two functions `trackPage` and `trackEvent`.

Analytics implementations can be different every time so this API let's
you add your own mapper function to map to specific third
party library data. So for Omniture you could map `category` to `prop1`
and `play` to `event2`. 



Setup
-----

```javascript
var analyticsInstance = new Analytics.Base(settings);
```

According to the keys in the settings object the script will instanciate
the classes these keys represent.

```javascript
var settings =
{
    GoogleAnalytics:
    {
        key: 'google-key-28364',
        mapper: function(func, data) {}
    },

    Omniture:
    {
        codeLocation: '/libs/s_code.js',
        mapper: function(func, data) {}
    }
}
```

The `mapper` property is mandatory and `func` and `data` are supplied by
the `mapTrackingData` function that all third party analytics classes
have to implement.

How to use
----------

This API has two functions which are callable by triggering an event on
the `window`.

```javascript
// The trackEvent function
$(window).trigger(
{
    type: 'trackEvent',
    trackingData: {}
});

// The trackPage function
$(window).trigger(
{
    type: 'trackPage',
    trackingData: {}
});
```

The `type` property represents the function to call inside the third
party analytics implementations.

The mapper
----------

Let's say your data structure for an event call looks like this:

```javascript
var trackingData =
{
    type: 'video',
    action: 'play',
    filename: 'Bugsbunny.mp4'
}
```

For Omniture your mapper could look like this:

```javascript
mapper: function(func, data)
{
    van mappedData = {};

    // func can be: trackPage or trackEvent
    if(func === 'trackEvent')
    {
        mappedData.prop1 = data.type;
        mappedData.eVar1 = data.action;
        mappedData.prop2 = data.filename;
    }

    return mappedData;
}
```

And for Google Analytics your mapper could look like this:

```javascript
mapper: function(func, data)
{
    van mappedData = {};

    // func can be: trackPage or trackEvent
    if(func === 'trackEvent')
    {
        mappedData.category = data.type;
        mappedData.action = data.action;
        mappedData.label = data.filename;
    }

    return mappedData;
}
```

Dependencies
------------

This library is dependend on [jQuery](http://jquery.com) and
[Modernizr](http://modernizr.com).

Extending
---------

The classes need to implement three functions: `trackPage`, `trackEvent`
and `mapTrackingData`. Each class listens on the `window` for events to
fire the tracking functions. To find out how to trigger these events
read [this](#how_to_use).

For Google Analytics the `trackPage` function does this:
`_gaq.push(['_trackPageview', trackingData.url]);`

All functions found in this skeleton class are mandatory.

```javascript
/*global Modernizr:true, jQuery:true, Analytics:true */

(function($, Analytics, Modernizr)
{
    "use strict";

    Analytics.YOUR_SPECIFIC_ANALYTICS_LIBRARY = function(options)
    {
        var init = function()
        {
            // load the specific analytics implementation code

            $(window)
                .on('trackPage', trackPage)
                .on('trackEvent', trackEvent);
        },

        trackPage = function(e)
        {
            var trackingData = mapTrackingData('trackPage', e.trackingData);

            // call the YOUR_SPECIFIC_ANALYTICS_LIBRARY implementation code here
        },

        trackEvent = function(e)
        {
            var trackingData = mapTrackingData('trackEvent', e.trackingData);

            // call the YOUR_SPECIFIC_ANALYTICS_LIBRARY implementation code here
        },

        mapTrackingData = function(func, trackingData)
        {
            if(options.mapper && typeof options.mapper === 'function')
            {
                return options.mapper(func, trackingData);
            }
            else
            {
                throw('No mapper function found for YOUR_SPECIFIC_ANALYTICS_LIBRARY.');
            }
        };

        init();
    };

}(jQuery, window.Analytics = window.Analytics || {}, Modernizr));
```