angular.module("school_abc_mobile", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","school_abc_mobile.controllers", "school_abc_mobile.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "School ABC Mobile" ;
		$rootScope.appLogo = "data/images/school_abc/s_logo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_dashboard = false ;
		$rootScope.hide_menu_library = false ;
		$rootScope.hide_menu_schedule = false ;
		$rootScope.hide_menu_teacher = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "school_abc_mobile",
				storeName : "school_abc_mobile",
				description : "The offline datastore for School ABC Mobile app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}

			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("school_abc_mobile.home_screen");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("ru");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("ru");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?crypto\-world\.pp\.ua/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?mad\-agency\.xyz/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?school\-abc\.ru/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("school_abc_mobile",{
		url: "/school_abc_mobile",
			abstract: true,
			templateUrl: "templates/school_abc_mobile-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("school_abc_mobile.about_us", {
		url: "/about_us",
		views: {
			"school_abc_mobile-side_menus" : {
						templateUrl:"templates/school_abc_mobile-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("school_abc_mobile.dashboard", {
		url: "/dashboard",
		views: {
			"school_abc_mobile-side_menus" : {
						templateUrl:"templates/school_abc_mobile-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("school_abc_mobile.home_screen", {
		url: "/home_screen",
		views: {
			"school_abc_mobile-side_menus" : {
						templateUrl:"templates/school_abc_mobile-home_screen.html",
						controller: "home_screenCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("school_abc_mobile.library", {
		url: "/library",
		cache:false,
		views: {
			"school_abc_mobile-side_menus" : {
						templateUrl:"templates/school_abc_mobile-library.html",
						controller: "libraryCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("school_abc_mobile.menu_one", {
		url: "/menu_one",
		views: {
			"school_abc_mobile-side_menus" : {
						templateUrl:"templates/school_abc_mobile-menu_one.html",
						controller: "menu_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("school_abc_mobile.schedule", {
		url: "/schedule",
		cache:false,
		views: {
			"school_abc_mobile-side_menus" : {
						templateUrl:"templates/school_abc_mobile-schedule.html",
						controller: "scheduleCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("school_abc_mobile.teacher", {
		url: "/teacher",
		cache:false,
		views: {
			"school_abc_mobile-side_menus" : {
						templateUrl:"templates/school_abc_mobile-teacher.html",
						controller: "teacherCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/school_abc_mobile/home_screen");
});
