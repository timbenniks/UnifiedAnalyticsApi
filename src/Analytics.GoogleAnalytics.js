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

	/*
	*	Analytics.GoogleAnalytics
	*	@constructor
	*/
	Analytics.GoogleAnalytics = function(options)
	{
		var init = function()
		{
			if(typeof window._gaq === 'undefined')
			{
				window._gaq = [['_setAccount', options.key]];
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
		
		/*
		*	Gets the trackingData and pushes it into _gaq.
		*	@param {object} event Contains the trackingData send by the function call.
		*/
		trackPage = function(event)
		{
			var trackingData = mapTrackingData('trackPage', event.trackingData);
			window._gaq.push(['_trackPageview', trackingData.url]);
		},

		/*
		*	Gets the trackingData and pushes it into _gaq.
		*	@param {object} event Contains the trackingData send by the function call.
		*/
		trackEvent = function(e)
		{
			var trackingData = mapTrackingData('trackEvent', e.trackingData);
			window._gaq.push(['_trackEvent', trackingData.category, trackingData.action, trackingData.opt_label, trackingData.opt_value, trackingData.opt_noninteraction]);
		},

		/*
		*	Builds up the {s} object from the tracking data it receives.
		*	@param {string} func The name of the used function (trackPage or trackEvent).
		*	@param {object} trackingData Contains the original trackingData.
		*	@return {function} Returns the mapper as a function call.
		*/
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