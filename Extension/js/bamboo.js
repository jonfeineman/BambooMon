var server = localStorage["server"];
var project = localStorage["project"];
var restPath = server + '/rest/api/latest';

function getRequestURI(service, key, expand)
{
	if (expand != undefined){
		return restPath + '/' + service + '/' + key + '.json?expand=' + expand;
	}

	return restPath + '/' + service + '/' + key + '.json';
	
}

function getBrowseURI(key)
{
	return server + "/browse/" + key;
}

  var projectName;
  var size;
  var maxResult;
  var results = [];
  var resultSets = [];
  var loaded = 0;
  var failed = 0;
  var allSuccess = true;

function getData(requestURI, resultType) {
  var resultSets = [];
  clearBadge();

  $.getJSON(requestURI, function(data) {
    projectName = data.name;
    size = parseInt(data.plans.size);
    maxResult = parseInt(data.plans["max-result"]);

    $('#project-name')[0].innerHTML = projectName;

    $('#progressbar').progressbar({ value: 0,
    								max: size,
                  					complete: function() {
                  						setBadge();
					                    $('#loading').hide();
					                    $('#plans').show();
					                  }
				                  });
    $('#progress-text')[0].innerHTML = "Loading... (" + loaded + "/" + size + ")";
	$('#plans').hide();
	$('#loading').show();

    getPlans(requestURI);
    });
}

function setBadge(){
	if (allSuccess) {
		chrome.browserAction.setBadgeBackgroundColor({color:[0,255,0,255]});
		chrome.browserAction.setBadgeText({text: loaded + ""});
	}
	else {
		chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
		chrome.browserAction.setBadgeText({text: failed + ""});		
	}
}

function clearBadge(){
	chrome.browserAction.setBadgeBackgroundColor({color:[0,0,0,0]});
	chrome.browserAction.setBadgeText({text: ""});
}

function getPlans(requestURI) {
    for (var x = 0; x <= size; x += maxResult) {
      resultSets.push(getDataSet(requestURI, x));
    }

    //$(resultSets).each(console.log($(this)));

    $.when.apply($, resultSets).then(function() {
      results.sort(sortAlpha);
      for (var i=0; i < results.length; i++)
      {
        var planName = results[i].shortName;
        if (planName.indexOf("Framework") == -1) {
          planName = planName.replace("ESP2.","");
        }
        var container = document.createElement("div");
        container.id = results[i].key;
        container.setAttribute("class","plan-container");
        var div = document.createElement("div");
        div.setAttribute("class", "plan");
        var a = document.createElement("a");
        a.setAttribute("class", "plan-name");
        a.innerText = planName;
        div.appendChild(a);
        container.appendChild(div);
        $('#plans')[0].appendChild(container);
        getResult(results[i].key);
      }
    });
}

function sortAlpha(a,b) {
  return a.shortName > b.shortName ? 1 : -1;
}

function getDataSet(requestURI, startIndex)
{
    return $.getJSON(requestURI + '&start-index=' + startIndex, function (data) {
      var plans = $(data.plans.plan);
      var items = [];

      for (var i=0; i < plans.length; i++) {
        results.push(plans[i]);
      }
  });
}

function getResult(key) {
  requestURI = getRequestURI('result', key, 'results.result&max-results=1');
  $.getJSON(requestURI, function(data) {
    loaded++;
    if (data.results.result[0].state.toLowerCase() != "successful") {
    	var notification = webkitNotifications.createNotification(
    			'images/bamboo_icon_red.png',
    			'Build Failure',
    			'Build Plan: ' + data.results.result[0].planName + '\r\n' +
    			'Build Started: ' + data.results.result[0].prettyBuildStartedTime + '\r\n' +
    			'Tests: ' + data.results.result[0].buildTestSummary + '\r\n' +
    			'Build Reason: ' + data.results.result[0].buildReason
    			);
    	notification.show();
    	allSuccess = false;
    	failed++;
    }

    $('#progressbar').progressbar("option", "value", loaded);
    $('#progress-text')[0].innerHTML = "Loading... (" + loaded + "/" + size + ")";
    $('#' + key + ' .plan').addClass(data.results.result[0].state.toLowerCase());
    $('#' + key).click(function () {
    	window.open(getBrowseURI(key));
    	return false;
	});
    $('#' + key + ' .plan').tooltip({ content: 	"<span>" + data.results.result[0].planName + "</span><br/>" +
    											"Completed: " + data.results.result[0].buildRelativeTime + "<br/>" +
    											"Build Time: " + data.results.result[0].buildDurationDescription + "<br/>" + 
    											"Tests: " + data.results.result[0].buildTestSummary + "<br/>",
    					   tooltipClass: "tooltip " + data.results.result[0].state.toLowerCase(),
                           items: "div",
                           position: ({
                            my: "center top",
                            at: "bottom",
                            of: $('#' + key + ' .plan'),
                            collision: "flip fit"
                           })});
  });
}