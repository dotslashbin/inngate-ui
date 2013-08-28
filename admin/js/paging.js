/**
 * JavaScript file for paging functionality
 *
 * @author  Ridzwan
 * @date    13 Dec 2006
 */

/**
 * Real-time validation of page number inputs
 *
 * @param obj       DOM object of page number input text field
 * @param evt       DOM event for page number input text field
 * @param url       The base URL to redirect the user upon hitting "Enter"
 *                  - Valid user input page is piggy-backed on this URL
 * @param max       The upper bound of the the page limit
 *                  - User input page cannot be above this max  
 * @return none
 */
function checkPageInput(obj, evt, url, max)
{
    var e = (window.event) ? window.event : evt;
    var code = (e.keyCode) ? e.keyCode : (e.which) ? e.which : '';
    var regex = new RegExp('^[0-9]*$');

    if (code == 13) {
        // Enter key was pressed
        if (obj.value.match(regex) == null || parseInt(obj.value) > max)
            obj.value = '';
        else {
            url += '&pag=' + obj.value;
            location.href = url;
        }
    } else {
        // Get the previous string and last new input char
        var prev = obj.value.substr(0, obj.value.length - 1);
        var last = obj.value.substr(obj.value.length - 1, 1);

        if (last.match(regex) == null)
            obj.value = prev;
    }
}
