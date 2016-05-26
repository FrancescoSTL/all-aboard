'use strict';

var buttons = require('sdk/ui/button/action');
let { Cu } = require('chrome');
var notifications = require("sdk/notifications");
var pageMod = require('sdk/page-mod');
var preferences = require("sdk/simple-prefs").prefs;
var prefService = require("sdk/preferences/service");
var self = require('sdk/self');
var sidebar = require('sdk/ui/sidebar');
var simpleStorage = require('sdk/simple-storage');
var tabs = require('sdk/tabs');
var timers = require('sdk/timers');
var utils = require('sdk/window/utils');
let UITour = Cu.import("resource:///modules/UITour.jsm").UITour;

var allAboard;
var content;
var firstrunRegex = /.*firefox[\/\d*|\w*\.*]*\/firstrun\//;
var visible = false;

function showBadge() {
    notifications.notify({
        title: 'All Aboard',
        text: 'You have a new message',
        iconURL: './media/icons/icon-32.png',
        onClick: toggleSidebar
    });

    allAboard.state('window', {
        badge: '1',
        badgeColor: '#5F9B0A'
    });
}

function toggleSidebar(state) { 
    var activeWindow = utils.getMostRecentBrowserWindow();

    // remove all highlights if the user clicks the url bar
    UITour.getTarget(activeWindow, "urlbar", false).then(function (chosenItem) {
        var urlbar = chosenItem.node;
        urlbar.addEventListener('click', function() {
            UITour.hideHighlight(activeWindow);
        });
    });

    var _sidebar = activeWindow.document.getElementById('sidebar');
    _sidebar.style.width = '320px';
    _sidebar.style.maxWidth = '320px';

    // clears the badge
    allAboard.state('window', {
        badge: null
    });

    if (visible) {
        content.hide();
    } else {
        content.show();
    }
}

/**
 * Purpose: Highlight a given item in the browser chrome
 * Parameters: item - String of item you are attempting to highlight
 */
function highLight(item) {
    var activeWindow = utils.getMostRecentBrowserWindow();
        
    UITour.getTarget(activeWindow, item, false).then(function(chosenItem) {
        try {
            UITour.showHighlight(activeWindow, chosenItem, "wobble");
        }
        catch(e) {
            console.log("Could not highlight element. Check if UITour.jsm supports highlighting of element passed.");
        }
    });
}

/**
 * Modifies the /firstrun page
 * http://regexr.com/3dbrq
 */
function modifyFirstrun() {
    pageMod.PageMod({
        include: firstrunRegex,
        contentScriptFile: './js/firstrun.js',
        contentScriptWhen: 'ready',
        contentStyleFile: './css/firstrun.css',
        onAttach: function(worker) {
            worker.port.on('dialogSubmit', function(choices) {
                preferences.isOnBoarding = choices.isOnBoarding;
                preferences.whatMatters = choices.whatMatters;
                prefService.set('distribution.id', 'mozilla86-' + choices.whatMatters + '-' + choices.isOnBoarding);
            });

            // listens for a message from pageMod when a user clicks on the "No thanks" link on
            // the new user question on firstrun
            worker.port.on('onboardingDismissed', function(dismissed) {
                preferences.onboardingDismissed = dismissed;
            });
        }
    });
}

function init() {
    // if the add-on was loaded at startup and the installTime variable does not exist in
    // simple storage, this is the first time Fx has been launched.
    if ((self.loadReason === 'startup') && ('undefined' === simpleStorage.storage.installTime)) {
        // store the firstrun time
        simpleStorage.storage.installTime = Date.now();
    }

    allAboard = buttons.ActionButton({
        id: 'all-aboard',
        label: 'Mozilla Firefox Onboarding',
        icon: {
            '16': './media/icons/icon-16.png',
            '32': './media/icons/icon-32.png',
            '64': './media/icons/icon-64.png'
        },
        onClick: toggleSidebar
    });

    content = sidebar.Sidebar({
        id: 'allboard-content',
        title: 'Make Firefox your own',
        url: './tmpl/utility/day8.html',
        onShow: function() {
            visible = true;
        },
        onHide: function() {
            visible = false;
        },
        onAttach: function(worker) {
            worker.port.on('openMigrationTool', function() {
                // Imports the MigrationUtils need to show the migration tool, and imports
                // Services, needed for the observer.
                // Note: Need to use the `chrome` module to do this which, according to the
                // docs should not really be done:
                // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/chrome
                Cu.import("resource:///modules/MigrationUtils.jsm");
                Cu.import("resource://gre/modules/Services.jsm");

                MigrationUtils.showMigrationWizard();

                Services.obs.addObserver((subject, topic, data) => {
                    worker.port.emit('migrationCompleted');
                }, "Migration:Ended", false);
            });
            // handle when user clicks button to try private browsing
            worker.port.on('highLightPB', function() {
                highLight("privateWindow");
            });
        }
    });

    // listen for ready(essentially DOMContentLoaded) events on tabs
    tabs.on('ready', function(tab) {
        // Check whether the yup/nope question was answered,
        // and ensure the active tab has a url that is not a firstrun page
        if (preferences.isOnBoarding && !firstrunRegex.test(tabs.activeTab.url)) {
            // show the sidebar
            toggleSidebar();
        }
    });

    modifyFirstrun();
}

init();
