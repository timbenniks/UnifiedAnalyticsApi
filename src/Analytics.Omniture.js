/*
*	@Class:			Analytics.Omniture
*	@Description:	Omniture implementation for Analytics wrapper
*	@Author:		Tim Benniks <tim.benniks@akqa.com>
*	@Dependencies:	jQuery, Analtics.Base
*
---------------------------------------------------------------------------- */

/*global Modernizr:true, jQuery:true, Analytics:true, s:true */
(function($, Analytics, Modernizr)
{
    "use strict";

    Analytics.Omniture = function(options)
	{
		var codeLocation = options.codeLocation,
            s,

		init = function()
		{
			if(codeLocation)
			{
				if(Modernizr && typeof Modernizr.load === 'function')
                {
                    Modernizr.load([
                    {
                        load: codeLocation,
                        complete: function()
                        {
                            s = window.s;
                        }
                    }]);
                }
                else
                {
                    throw('Modernizr does not exists or "Modernizr.load" has not been added to your Modernizr build.');
                }
			}
			else
			{
				throw('Omniture s_code.js not found');
			}

			$(window)
				.on('trackPage', trackPage)
				.on('trackEvent', trackEvent);
		},

		trackPage = function(e)
		{
			var trackingData = mapTrackingData('trackPage', e.trackingData);

			buildUpOmnitureObject(trackingData);

			s.t(s);
		},
		
		trackEvent = function(e)
		{
			var trackingData = mapTrackingData('trackEvent', e.trackingData);

			buildUpOmnitureObject(trackingData);

			s.tl(trackingData.element, trackingData.type || 'o', trackingData.linkName);
		},
		
		cleanOmnitureData = function ()
		{
			for(var i = 0; i < 50; i++)
			{
				s['prop' + i] = '';
				s['eVar' + i] = '';
			}

			s.products = '';
			s.events = '';
			s.pageName = '';
			s.linkTrackVars = 'None';
			s.linkTrackEvents = 'None';
		},

		buildUpOmnitureObject = function(trackingData)
		{
			var propsEvarsConcatinated = '',
				eventsConcatinated = '';
			
			cleanOmnitureData();

			if(trackingData.props)
			{
				$.each(trackingData.props, function(key, val) 
				{
					propsEvarsConcatinated += ',' + key;
					s[key] = val;
				});
				
				s.linkTrackVars = propsEvarsConcatinated;
			}
			
			if(trackingData.evars)
			{
				$.each(trackingData.evars, function(key, val) 
				{
					propsEvarsConcatinated += ',' + key;
					s[key] = val;
				});
				
				s.linkTrackVars = propsEvarsConcatinated;
			}
			
			if(trackingData.events)
			{
				$.each(trackingData.events, function(key, val) 
				{
					eventsConcatinated += key + ',';
					s[key] = val;
				});
				
				eventsConcatinated = eventsConcatinated.substring(0, eventsConcatinated.length - 1);
				
				s.events = eventsConcatinated;
				s.linkTrackEvents = eventsConcatinated;
				s.linkTrackVars += ',events';
			}

			if(trackingData.pageName)
			{
				s.pageName = trackingData.pageName;
			}
		},

		mapTrackingData = function(func, trackingData)
		{
			if(options.mapper && typeof options.mapper === 'function')
			{
				return options.mapper(func, trackingData);
			}
			else
			{
				throw('No mapper function found for Omniture');
			}
		};

		init();
	};

}(jQuery, window.Analytics = window.Analytics || {}, Modernizr));