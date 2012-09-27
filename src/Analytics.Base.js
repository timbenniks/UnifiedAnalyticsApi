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

	/*
	*	Analytics.Base
	*	@constructor
	*/
	Analytics.Base = function(options)
	{
		var init = function()
		{
            $.each(options, function(key, value)
			{
				checkAndInit(key, value.file);
			});
		},

		/*
		*	Checks if classToLoad exists as a function and returns a new instance of it.
		*	@param {string} classToLoad The name of the class to load and initialize.
		*	@return {function} The instance of the class.
		*/
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