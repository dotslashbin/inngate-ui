/**
 * Toggles all row checkboxes when checkbox switch (in header row) is clicked
 *
 * @param formId        The DOM ID of the list table
 * @param switchId      The DOM ID of the checkbox switch
 * @param groupId       The DOM ID of the checkbox rows
 * @return none
 */
function checkAll(formId, switchId, groupId)
{
    if (typeof document.forms[formId].elements[groupId] != 'object') {
        return;
    }

    for(var i = 0; i < document.forms[formId].elements[groupId].length; i++) {
        document.forms[formId].elements[groupId][i].checked = document.forms[formId].elements[switchId].checked;
    }
}

/**
 * Toggles checkbox switch if row checkboxes are all checked
 *
 * @param formId        The DOM ID of the list table
 * @param switchId      The DOM ID of the checkbox switch
 * @param groupId       The DOM ID of the checkbox rows
 * @param evt           The triggering event
 * @return none
 */
function checkColumn(formId, switchId, groupId, evt)
{
    var e = (window.event) ? window.event : evt;
    var TotalBoxes = document.forms[formId].elements[groupId].length;
    var TotalOn = 0;

    for(var i = 0; i < TotalBoxes; i++) {
        if (document.forms[formId].elements[groupId][i].checked) {
            TotalOn++;
        }
    }

    if (TotalBoxes == TotalOn) {
        document.forms[formId].elements[switchId].checked = true;
    } else {
        document.forms[formId].elements[switchId].checked = false;
    }

    e.cancelBubble = true;
}

/**
 * Activates button(s) linked to checkboxes when at least 1 checkbox is active
 *
 * @param formId        The DOM ID of the list table
 * @param btnId         The DOM ID of the buttons to toggle
 * @param groupId       The DOM ID of the checkbox rows
 * @param evt           The triggering event
 * @return none
 */
function toggleBtn(formId, btnId, groupId, evt)
{
    var e = (window.event) ? window.event : evt;
    var TotalOn = 0;
    
    if (document.forms[formId].elements[groupId].length > 1) {
        for(var i = 0; i < document.forms[formId].elements[groupId].length; i++) {
            if (document.forms[formId].elements[groupId][i].checked) {
                document.forms[formId].elements[btnId].disabled = false;
                TotalOn++;
            }
        }

        if (TotalOn < 1) {
            document.forms[formId].elements[btnId].disabled = true;
        }
    } else {
        if (document.forms[formId].elements[groupId].checked) {
            document.forms[formId].elements[btnId].disabled = false;
        } else {
            document.forms[formId].elements[btnId].disabled = true;
        }
    }

    e.cancelBubble = true;
}
