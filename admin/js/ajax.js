function createRequestObject()
{
    var req;
 
    if(window.XMLHttpRequest)
    {
        // Firefox, Safari, Opera...
        req = new XMLHttpRequest();
    }
    else if(window.ActiveXObject)
    {
        // Internet Explorer 5+
        req = new ActiveXObject('Microsoft.XMLHTTP');
    }
    else
    {
        // There is an error creating the object, just as an old browser is being used.
        alert('Problem creating the XMLHttpRequest object');
    }

    return req;
}

function sendRequest(fileName, divName, showLoading)
{
    var http = createRequestObject();

    if (typeof(showLoading) === 'undefined')
    {
        showLoading = 'TRUE';
    }
    
    http.onreadystatechange = function() 
    {
        if (http.readyState == 4 && http.status == 200)
        {
            showContent(http.responseText, divName);
        }
        else
        {
            if (showLoading.toUpperCase() === 'TRUE')
            {
                document.getElementById(divName).innerHTML = '<img src="js/icons/loading.gif"/>';
            }
        }
    }
    http.open('get', fileName, true);
    http.send(null);
}

function showContent(response, divName)
{
    var start = response.indexOf('<div id="middle">')+17;
    var end = response.indexOf('<div id="bottom">')-7;
    var content = response.substring(start,end);

    document.getElementById(divName).innerHTML = content;
}
