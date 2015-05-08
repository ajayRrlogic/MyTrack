'use strict';

// Configuring the Articles module


angular.module('geofences').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Geofences', 'geofences');
	//	Menus.addSubMenuItem('topbar', 'geofences', 'List Geofences', 'geofences');
	//	Menus.addSubMenuItem('topbar', 'geofences', 'New Geofence', 'geofences/create');
	}
]);
