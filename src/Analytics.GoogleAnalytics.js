/* 
*	@Class:			Analytics.GoogleAnalytics
*	@Description:	GoogleAnalytics implementation for Analytics wrapper
*	@Author:		Tim Benniks <tim.benniks@akqa.com>
*	@Dependencies:	jQuery, Analtics.Base
*	@TODO:			Look into customVariables (https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingCustomVariables)
*	@TODO:			Ecommerce (https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingEcommerce)
*
---------------------------------------------------------------------------- */

/*global Modernizr:true, jQuery:true, Analytics:true */
(function($, Analytics, Modernizr)
{
    "use strict";

    Analytics.GoogleAnalytics = function(options)
	{
		var init = function()
		{
			if(typeof window._gaq === 'undefined')
			{
				window._gaq = ['_setAccount', options.key];
			}

            if(Modernizr && typeof Modernizr.load === 'function')
            {
                Modernizr.load('//www.google-analytics.com/ga.js');
            }
            else
            {
                throw('Modernizr does not exists or "Modernizr.load" has not been added to your Modernizr build.');
            }

			$(window)
				.on('trackPage', trackPage)
				.on('trackEvent', trackEvent);
		},

        trackPage = function(e)
		{
			var trackingData = mapTrackingData('trackPage', e.trackingData);
			window._gaq.push(['_trackPageview', trackingData.url]);
		},
		
		// @category (required)			The name you supply for the group of objects you want to track.
		// @action (required)			A string that is uniquely paired with each category, and commonly used to define the type of user interaction for the web object.
		// @label (optional)			An optional string to provide additional dimensions to the event data.
		// @value (optional)			An integer that you can use to provide numerical data about the user event.
		// @non-interaction (optional)	A boolean that when set to true, indicates that the event hit will not be used in bounce-rate calculation.
		trackEvent = function(e)
		{
			var trackingData = mapTrackingData('trackEvent', e.trackingData);

            console.log(trackingData);

			window._gaq.push(['_trackEvent', trackingData.category, trackingData.action, trackingData.opt_label, trackingData.opt_value, trackingData.opt_noninteraction]);
		},

		mapTrackingData = function(func, trackingData)
		{
			if(options.mapper && typeof options.mapper === 'function')
			{
				return options.mapper(func, trackingData);
			}
			else
			{
				throw('No mapper function found for Google Analytics.');
			}
		};

		init();
	};

}(jQuery, window.Analytics = window.Analytics || {}, Modernizr));