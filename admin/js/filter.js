/**
 * JavaScript file for filter form functionality
 *
 * @author  Ridzwan
 * @date    21 Nov 2006
 */

/**
 * Dynamically add elements for a new search rule
 *
 * @param none
 * @return none
 */
function addSearchRule()
{
    var id = lastId + 1;
    fltCount++;
    var field = '<select id="fltFld' + id + '" name="fltFld[]" onChange="changeOp(this); checkInput();">';

    for (var i = 0; i < labels.length; i++)
        field += '<option value="' + values[i] + '">' + labels[i] + '</option>';

    field += '</select>';
    var op = '<select id="fltOpr' + id + '" name="fltOp[]" onChange="changeParam(this);"></select>';
    var param = '<div id="fltVal' + id + '" style="display: none">';
    param += '<input id="fltParam1|' + id + '" type="text" name="fltParam1[]" ';
    param += 'onKeyUp="checkInput();" onKeyPress="return noEnter(event);"></div>';
    var mns = '<input id="fltMns' + id + '" class="button" type="button" value="-" onclick="deleteSearchTableRow(this);">';
    var pls = '<input id="fltPls' + id + '" class="button" type="button" value="+" onclick="addSearchRule();">';
    var row = new Array(field, op, param, (mns + ' ' + pls));
    addSearchTableRow('fltTable', row);
    changeOp(document.getElementById('fltFld' + id));
    lastId = id;
    togglePlusMinus(true);
}

/**
 * Dynamically change search operators based on the field's datatype
 *
 * @param field         The field for the rule
 * @return none
 */
function changeOp(field)
{
    var fldId = field.id;
    var id = fldId.substr(6);
    var oprId = 'fltOpr' + id;
    var fldVal = document.getElementById(fldId).value;
    clearParams(id);

    switch (dts[fldVal]) {
    case 'custom':
        document.getElementById(oprId).length = 0;
        document.getElementById(oprId)[0] = new Option(opLabel['='], '=');
        document.getElementById(oprId)[1] = new Option(opLabel['!='], '!=');
        break;

    case 'unix_timestamp':
    case 'sql_datetime':
        document.getElementById(oprId).length = 0;
        document.getElementById(oprId)[0] = new Option(opLabel['DATE_='], '=');
        document.getElementById(oprId)[1] = new Option(opLabel['DATE_!='], '!=');
        document.getElementById(oprId)[2] = new Option(opLabel['DATE_>'], '>');
        document.getElementById(oprId)[3] = new Option(opLabel['DATE_<'], '<');
        document.getElementById(oprId)[4] = new Option(opLabel['INLAST'], 'INLAST');
        document.getElementById(oprId)[5] = new Option(opLabel['NOTINLAST'], 'NOTINLAST');
        document.getElementById(oprId)[6] = new Option(opLabel['BETWEEN'], 'BETWEEN');
        break;

    case 'int':
        document.getElementById(oprId).length = 0;
        document.getElementById(oprId)[0] = new Option(opLabel['='], '=');
        document.getElementById(oprId)[1] = new Option(opLabel['!='], '!=');
        document.getElementById(oprId)[2] = new Option(opLabel['>'], '>');
        document.getElementById(oprId)[3] = new Option(opLabel['<'], '<');
        document.getElementById(oprId)[4] = new Option(opLabel['BETWEEN'], 'BETWEEN');
        break;

    case 'string':
        document.getElementById(oprId).length = 0;
        document.getElementById(oprId)[0] = new Option(opLabel['CONTAINS'], 'CONTAINS');
        document.getElementById(oprId)[1] = new Option(opLabel['NOTCONTAINS'], 'NOTCONTAINS');
        document.getElementById(oprId)[2] = new Option(opLabel['='], '=');
        document.getElementById(oprId)[3] = new Option(opLabel['!='], '!=');
        document.getElementById(oprId)[4] = new Option(opLabel['STARTS'], 'STARTS');
        document.getElementById(oprId)[5] = new Option(opLabel['ENDS'], 'ENDS');
        break;
    }

    if (eval(removeOp[fldVal])) {
        var op = new String();

        for (i = 0; i < document.getElementById(oprId).options.length; i++) {
            for (j = 0; j < removeOp[fldVal].length; j++) {
                if (dts[fldVal] == 'unix_timestamp' || dts[fldVal] == 'sql_datetime')
                    op = removeOp[fldVal][j].replace(/DATE_/, '');
                else
                    op = removeOp[fldVal][j];

                if (document.getElementById(oprId).options[i].value == op)
                    document.getElementById(oprId).remove(i);
            }
        }
    }

    changeParam(document.getElementById(oprId));
}

/**
 * Dynamically change parameter input based on the operator
 *
 * @param op            The operator for the rule
 * @return none
 */
function changeParam(op)
{
    var opId = op.id;
    var id = opId.substr(6);
    var opVal = document.getElementById(opId).value;
    var fldVal = document.getElementById('fltFld' + id).value;
    var param1Val = document.getElementById('fltParam1|' + id).value;
    var param2Val = new String();

    if (eval(document.getElementById('fltParam2|' + id)))
        param2Val = document.getElementById('fltParam2|' + id).value;

    if (dts[fldVal] == 'custom') {
        var param = '<select name="fltParam1[]" id="fltParam1|' + id + '"></select>';
        document.getElementById('fltVal' + id).innerHTML = param;
        document.getElementById('fltParam1|' + id).length = 0;

        for (var i = 0; i < custom[fldVal].length; i++) {
            document.getElementById('fltParam1|' + id)[i] = new Option(custom[fldVal][i], raw[fldVal][i]);

            if (param1Val == raw[fldVal][i])
                document.getElementById('fltParam1|' + id)[i].selected = true;
        }
    } else if (dts[fldVal].search(/time/) != -1 && opVal.search(/INLAST/) != -1) {
        var regex = new RegExp('^[0-9]*$');

        if (param1Val.match(regex) == null)
            param1Val = '';

        var param = '<input id="fltParam1|' + id + '" type="text" name="fltParam1[]" value="' + param1Val + '"';
        param += ' size="3" class="textbox" onKeyUp="checkNumeric(this); checkInput();" onKeyPress="return noEnter(event);">';
        param += '&nbsp;&nbsp;&nbsp;';
        param += '<select name="fltParam2[]" id="fltParam2|' + id + '"></select>';
        document.getElementById('fltVal' + id).innerHTML = param;
        document.getElementById('fltParam2|' + id).length = 0;
        document.getElementById('fltParam2|' + id)[0] = new Option(timeUnits['days'], 'days');
        document.getElementById('fltParam2|' + id)[1] = new Option(timeUnits['weeks'], 'weeks');
        document.getElementById('fltParam2|' + id)[2] = new Option(timeUnits['months'], 'months');
        document.getElementById('fltParam2|' + id)[3] = new Option(timeUnits['years'], 'years');
        document.getElementById('fltParam1|' + id).length = 0;

        for (var i = 1; i < 11; i++) {
            document.getElementById('fltParam1|' + id)[i - 1] = new Option(i, i);

            if (param1Val == i)
                document.getElementById('fltParam1|' + id)[i - 1].selected = true;
        }

        for (var i = 0; i < document.getElementById('fltParam2|' + id).length; i++) {
            if (param2Val == document.getElementById('fltParam2|' + id)[i].value)
                document.getElementById('fltParam2|' + id)[i].selected = true;
        }
    } else {
        var param = '<input id="fltParam1|' + id + '" type="text" name="fltParam1[]" value="' + param1Val + '" onKeyUp="';

        if (dts[fldVal] == 'int')
            param += 'checkNumeric(this);';

        param += ' checkInput();" onKeyPress="return noEnter(event);">';

        if (param2Val == 'undefined' || param2Val == 'days' || param2Val == 'weeks' || param2Val == 'months' || param2Val == 'years')
            param2Val = '';

        if (opVal == 'BETWEEN') {
            param += '&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;';
            param += '<input id="fltParam2|' + id + '" type="text" name="fltParam2[]" value="' + param2Val + '" onKeyUp="';

            if (dts[fldVal] == 'int')
                param += 'checkNumeric(this);';

            param += ' checkInput();" onKeyPress="return noEnter(event);">';
        }

        document.getElementById('fltVal' + id).innerHTML = param;
    }

    document.getElementById('fltVal' + id).style.display = 'block';
    checkInput();
}

/**
 * Toggles search form display and the controlling button
 *
 * @param state         Flag to show/hide the filter form
 * @return none
 */
function showSearch(state)
{
    document.getElementById('fltSaveDiv').style.display = state ? 'block' : 'none';
    document.getElementById('fltFormDiv').style.display = state ? 'block' : 'none';
    document.getElementById('fltBtnDiv').style.display = state ? 'block' : 'none';
    document.getElementById('fltBtnShow').style.display = state ? 'none' : 'inline';
}

/**
 * Toggles minus and plus buttons for each rule
 *
 * @param enableFocus   Flag to indicate if input field focus is enabled/disabled
 * @return none
 */
function togglePlusMinus(enableFocus)
{
    for (i = 0; i <= lastId; i++) {
        if (eval(document.getElementById('fltPls' + i))) {
            document.getElementById('fltPls' + i).disabled = true;

            if (fltCount > 1)
                document.getElementById('fltMns' + i).disabled = false;
            else
                document.getElementById('fltMns' + i).disabled = true;
        }
    }

    enableLastPlus(enableFocus);
}

/**
 * Enables the plus button for the last search rule
 *
 * @param enableFocus   Flag to indicate if input field focus is enabled/disabled
 * @return none
 */
function enableLastPlus(enableFocus)
{
    for (i = lastId; i >= 0; i--) {
        if (eval(document.getElementById('fltPls' + i))) {
            if (fltCount == maxCount)
                document.getElementById('fltPls' + i).disabled = true;
            else {
                document.getElementById('fltPls' + i).disabled = false;

                if (enableFocus)
                    document.getElementById('fltFld' + i).focus();
            }

            break;
        }
    }
}

/**
 * Dynamically add a new search row to the search form
 *
 * @param tableId       The HTML table referenced by this tableId
 * @param values        The values to be inserted into the row
 * @return none
 */
function addSearchTableRow(tableId, values)
{
    var tbody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    var row = document.createElement('TR');

    for (var i = 0; i < values.length; i++) {
        var td = document.createElement('TD');
        td.innerHTML = values[i];
        row.appendChild(td);
    }

    tbody.appendChild(row);
}

/**
 * Dynamically remove a search row from the search form
 *
 * @param rowObj        The row to be removed
 * @return none
 */
function deleteSearchTableRow(rowObj)
{
    var tbody, idx;
    fltCount--;
    rowObj = rowObj.parentNode.parentNode;
    tbody = rowObj.parentNode;
    idx = getSearchTableRowIndex(rowObj);
    tbody.deleteRow(idx);
    togglePlusMinus(false);
    checkInput();
}

/**
 * Retrieves a table row index given a row object
 *
 * @param rowObj        The row object
 * @return int          The row index
 */
function getSearchTableRowIndex(rowObj)
{
    var tbody = rowObj.parentNode;
    var rowIdx = 0;

    for (var i = 0; i < tbody.rows.length; i++) {
        if(tbody.rows[i] == rowObj)
            rowIdx = i;
    }

    return rowIdx;
}

/**
 * Disables the "Enter"/"Return" key press event
 *
 * @param evt           A key press event
 * @return none
 */
function noEnter(evt)
{
    var e = (window.event) ? window.event : evt;
    var code = (e.keyCode) ? e.keyCode : (e.which) ? e.which : '';
    return !(code == 13);
}

/**
 * Triggered when user selects a different search from saved searches select box
 *
 * @param obj           The select box object
 * @param formUrl       The URL to redirect to
 * @return none
 */
function changeFilter(obj, formUrl)
{
    location.href = formUrl + '&flt=' + obj.value;
}

/**
 * Triggered when user clicks "Save" to save a search
 *
 * @param label         Form label string
 * @param errorMsg      Error message string
 * @param reservedName  Reserved search name, cannot be saved to this
 * @param defaultName   Default search name, used in prompt box
 * @param formUrl       The URL to POST filter form data to
 * @return none
 */
function saveFilter(label, errorMsg, reservedName, defaultName, formUrl)
{
    if (defaultName == reservedName)
        var filter = prompt(label);
    else
        var filter = prompt(label, defaultName);

    var regex = new RegExp('^[0-9A-Za-z _]*$');

    if (filter.match(regex) != null && filter != null && filter != '' && filter != reservedName) {
        submitFilter('save|' + filter, formUrl);
    } else {
        alert(errorMsg);
    }
}

/**
 * Triggered when user clicks a button other than "Save" on the filter form
 *
 * @param mode          The type of button clicked
 * @param formUrl       The URL to POST filter form data to
 * @return none
 */
function submitFilter(mode, formUrl)
{
    document.getElementById('fltAction').value = mode;
    document.fltForm.action = formUrl;
    document.fltForm.submit();
}

/**
 * Updates the last ID to maintain dynamic adding/removing of search rules
 *
 * @param newId         The new ID to be updated
 * @return none
 */
function updateLastId(newId)
{
    lastId = newId;
}

/**
 * Updates the filter count to maintain dynamic adding/removing of search rules
 *
 * @param newCount      The new count to be updated
 * @return none
 */
function updateFltCount(newCount)
{
    fltCount = newCount;
}

/**
 * Enable/Disable the "Apply" button on the filter form
 *
 * @param state         true to enable, false to disable
 * @return none
 */
function toggleBtnApply(state)
{
    document.getElementById('fltBtnApply').disabled = state ? false : true;
}

/**
 * Enable/Disable the "Delete" button on the filter form
 *
 * @param state         true to enable, false to disable
 * @return none
 */
function toggleBtnDelete(state)
{
    document.getElementById('fltBtnDelete').disabled = state ? false : true;
}

/**
 * Enable/Disable the "Save" button on the filter form
 *
 * @param state         true to enable, false to disable
 * @return none
 */
function toggleBtnSave(state)
{
    document.getElementById('fltBtnSave').disabled = state ? false : true;
}

/**
 * Enable the "Apply" & "Save" buttons on the filter form if rules are complete
 *
 * @param none
 * @return none
 */
function checkInput()
{
    toggleBtnApply(false);
    toggleBtnSave(false);
    var input = document.getElementsByTagName('input');
    var id = 0;

    for (var i = 0; i < input.length; i++) {
        if (input[i].name == 'fltParam1[]' && input[i].value != '') {
            toggleBtnApply(true);
            toggleBtnSave(true);
            return;
        }
    }

    var select = document.getElementsByTagName('select');

    for (var i = 0; i < select.length; i++) {
        if (select[i].name == 'fltParam1[]') {
            toggleBtnApply(true);
            toggleBtnSave(true);
            return;
        }
    }
}

/**
 * Clears parameter input(s)
 *
 * @param id            HTML element ID
 * @return none
 */
function clearParams(id)
{
    var param1 = document.getElementById('fltParam1|' + id);

    if (param1.type == 'text')
        param1.value = '';
    else
        param1[param1.selectedIndex].value = '';

    if (eval(document.getElementById('fltParam2|' + id))) {
        var param2 = document.getElementById('fltParam2|' + id);

        if (param2.type == 'text')
            param2.value = '';
        else
            param2[param2.selectedIndex].value = '';
    }
}

/**
 * Checks whether the value for a given object is numeric
 *
 * @param obj           The HTML object
 * @return none
 */
function checkNumeric(obj)
{
    var regex = new RegExp('^[0-9]*$');

    if (obj.value.match(regex) == null)
        obj.value = '';
}
