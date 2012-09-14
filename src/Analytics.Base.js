/* 
*	@Class:			Analytics.Base
*	@Description:	Analytics wrapper around Omiture, Google Analytics and Floodlight
*	@Author:		Tim Benniks <tim.benniks@akqa.com>
*	@Dependencies:	jQuery
*
---------------------------------------------------------------------------- */

/*global jQuery:true, Analytics:true */
(function($, Analytics)
{
	"use strict";

    Analytics.Base = function(options)
	{
		var init = function() 
		{
            $.each(options, function(key, value)
			{
				checkAndInit(key, value.file);
			});
		},

		checkAndInit = function(classToLoad)
		{
			if($.isFunction(Analytics[classToLoad]))
			{
				return new Analytics[classToLoad](options[classToLoad]);
			}
			else
			{
				throw(classToLoad + ' does not exist.');
			}
		};

		init();
	};

}(jQuery, window.Analytics = window.Analytics || {}));