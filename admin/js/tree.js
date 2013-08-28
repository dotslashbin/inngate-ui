// Title: Tigra Tree
// Description: See the demo at url
// URL: http://www.softcomplex.com/products/tigra_menu_tree/
// Version: 1.1
// Date: 11-12-2002 (mm-dd-yyyy)
// Notes: This script is free. Visit official site for further details.

function tree (a_items, a_template, b_noNodeId ) {

        this.a_tpl      = a_template;
        this.a_config   = a_items;
        this.o_root     = this;
        this.a_index    = [];
        this.o_selected = null;
        this.n_depth    = -1;
        this.b_noNodeId = b_noNodeId;
        
        var o_icone = new Image(),
                o_iconl = new Image();
        o_icone.src = a_template['icon_e'];
        o_iconl.src = a_template['icon_l'];
        a_template['im_e'] = o_icone;
        a_template['im_l'] = o_iconl;
        for (var i = 0; i < 64; i++)
                if (a_template['icon_' + i]) {
                        var o_icon = new Image();
                        a_template['im_' + i] = o_icon;
                        o_icon.src = a_template['icon_' + i];
                }
        
        this.toggle = function (n_id) {        var o_item = this.a_index[n_id]; o_item.open(o_item.b_opened) };
        this.expand = function (n_id) {        var o_item = this.a_index[n_id]; o_item.expand_me(o_item.b_opened) };
        this.select = function (n_id) { return this.a_index[n_id].select(); };
        this.mout   = function (n_id) { this.a_index[n_id].upstatus(true) };
        this.mover  = function (n_id, alwaysopen) { this.a_index[n_id].upstatus(); statusOverride(this.a_index[n_id], alwaysopen); };

        this.a_children = [];
        for (var i = 0; i < a_items.length; i++)
                new tree_item(this, i);

        this.n_id = trees.length;
        trees[this.n_id] = this;
        
        for (var i = 0; i < this.a_children.length; i++) {
                document.write(this.a_children[i].init());
                this.a_children[i].open();
        }
}
function tree_item (o_parent, n_order) {

        this.n_depth  = o_parent.n_depth + 1;
        this.a_config = o_parent.a_config[n_order + (this.n_depth ? 2 : 0)];
        if (!this.a_config) return;

        this.o_root    = o_parent.o_root;
        this.o_parent  = o_parent;
        this.n_order   = n_order;
        this.b_opened  = !this.n_depth;
        this.b_noNodeId = o_parent.b_noNodeId;

        this.n_id = this.o_root.a_index.length;
        this.o_root.a_index[this.n_id] = this;
        o_parent.a_children[n_order] = this;

        this.a_children = [];
        for (var i = 0; i < this.a_config.length - 2; i++)
                new tree_item(this, i);

        this.get_icon = item_get_icon;
        this.open     = item_open;
        this.expand_me = item_expand;
        this.select   = item_select;
        this.init     = item_init;
        this.upstatus = item_upstatus;
        this.is_last  = function () { return this.n_order == this.o_parent.a_children.length - 1 };
}

function item_open (b_close) {
        var o_idiv = get_element('i_div' + this.o_root.n_id + '_' + this.n_id);
        if (!o_idiv) return;
        
        if (!o_idiv.innerHTML) {
                var a_children = [];
                for (var i = 0; i < this.a_children.length; i++)
                        a_children[i]= this.a_children[i].init();
                o_idiv.innerHTML = a_children.join('');
        }
        o_idiv.style.display = (b_close ? 'none' : 'block');
        
        this.b_opened = !b_close;
        var o_jicon = document.images['j_img' + this.o_root.n_id + '_' + this.n_id],
                o_iicon = document.images['i_img' + this.o_root.n_id + '_' + this.n_id];
        if (o_jicon) o_jicon.src = this.get_icon(true);
        if (o_iicon) o_iicon.src = this.get_icon();
        this.upstatus();
}

function item_expand (b_clos) {
        b_close = false;
        var o_idiv = get_element('i_div' + this.o_root.n_id + '_' + this.n_id);
        if (!o_idiv) return;
        
        if (!o_idiv.innerHTML) {
                var a_children = [];
                for (var i = 0; i < this.a_children.length; i++)
                        a_children[i]= this.a_children[i].init();
                o_idiv.innerHTML = a_children.join('');
        }
        o_idiv.style.display = (b_close ? 'none' : 'block');
        
        this.b_opened = !b_close;
        var o_jicon = document.images['j_img' + this.o_root.n_id + '_' + this.n_id],
                o_iicon = document.images['i_img' + this.o_root.n_id + '_' + this.n_id];
        if (o_jicon) o_jicon.src = this.get_icon(true);
        if (o_iicon) o_iicon.src = this.get_icon();
        
        this.upstatus();
}

function item_select (b_deselect) {
        if (!b_deselect) {
                var o_olditem = this.o_root.o_selected;
                this.o_root.o_selected = this;
                if (o_olditem) o_olditem.select(true);
        }
        var o_iicon = document.images['i_img' + this.o_root.n_id + '_' + this.n_id];
        if (o_iicon) o_iicon.src = this.get_icon();
        get_element('i_txt' + this.o_root.n_id + '_' + this.n_id).style.fontWeight = b_deselect ? 'normal' : 'bold';
        
        this.upstatus();
        return Boolean(this.a_config[1]);
}

function item_upstatus (b_clear) {
}

function item_init () {
        var a_offset = [],
                o_current_item = this.o_parent;
        for (var i = this.n_depth; i > 1; i--) {
                a_offset[i] = '<img src="' + this.o_root.a_tpl[o_current_item.is_last() ? 'icon_e' : 'icon_l'] + '" border="0" align="absbottom">';
                o_current_item = o_current_item.o_parent;
        }
        return '<table cellpadding="0" cellspacing="0" border="0"><tr><td nowrap>' + 
        (this.n_depth 
            ? a_offset.join('') + 
                (this.a_children.length                
                    ? '<a href="javascript: trees[' + this.o_root.n_id + '].toggle(' + this.n_id + ')" ' + 
                      'onmouseover="trees[' + this.o_root.n_id + '].mover(' + this.n_id + ', false); return true;" ' + 
                      'onmouseout="trees[' + this.o_root.n_id + '].mout(' + this.n_id + '); window.status = \'\'; return true;">' + 
                      '<img src="' + this.get_icon(true) + '" border="0" align="absbottom" ' + 
                      'name="j_img' + this.o_root.n_id + '_' + this.n_id + '"></a>'
                            : '<img src="' + this.get_icon(true) + '" border="0" align="absbottom">') 
            : '') +
        (this.a_config[1] != null && this.a_config[1] != ''
            ? '<a href="' + this.a_config[1] + (this.b_noNodeId?'' : '&node=' + this.n_id) + '" target="' + this.o_root.a_tpl['target'] + '" ' + 
              'onclick="trees[' + this.o_root.n_id + '].expand(' + this.n_id + '); return trees[' + this.o_root.n_id + '].select(' + this.n_id + ')" ' + 
              'ondblclick="trees[' + this.o_root.n_id + '].toggle(' + this.n_id + ')" ' + 
              'onmouseover="trees[' + this.o_root.n_id + '].mover(' + this.n_id + ', true); return true;" ' + 
              'onmouseout="trees[' + this.o_root.n_id + '].mout(' + this.n_id + '); window.status = \'\'; return true;" ' + 
              'class="t' + this.o_root.n_id + 'i" id="i_txt' + this.o_root.n_id + '_' + this.n_id + '">' + 
              '<img src="' + this.get_icon() + '" border="0" align="absbottom" ' + 
              'name="i_img' + this.o_root.n_id + '_' + this.n_id + '" class="t' + this.o_root.n_id + 'im">' + 
              this.a_config[0] + '</a>'
            : (this.get_icon() == 'js/icons/base.gif'
                 ? '<img src="<img src="' + this.get_icon() + 
                   '" border="0" align="absbottom" ' +
                   'name="i_img' + this.o_root.n_id + '_' + this.n_id + '" class="t' + this.o_root.n_id + 'im">' +
                   this.a_config[0]
                 : '<a href="javascript: trees[' + this.o_root.n_id + '].toggle(' + this.n_id + ')"' + 
                   'onmouseover="trees[' + this.o_root.n_id + '].mover(' + this.n_id + ', false); return true;" ' + 
                   'onmouseout="trees[' + this.o_root.n_id + '].mout(' + this.n_id + '); window.status = \'\'; return true;" ' +              
                   '><img src="' +  this.get_icon() + 
                   '" border="0" align="absbottom" ' + 
                   'name="i_img' + this.o_root.n_id + '_' + this.n_id + '" class="t' + this.o_root.n_id + 'im">' + 
                   this.a_config[0] + '</a>')) + 
        '</td></tr></table>' + 
        (this.a_children.length ? '<div id="i_div' + this.o_root.n_id + '_' + this.n_id + '" style="display:none"></div>' : '');
}

function item_get_icon (b_junction) {
        return this.o_root.a_tpl['icon_' + ((this.a_config[1] != null ? 64 : 0) + (this.n_depth ? 0 : 32) + (this.a_children.length ? 16 : 0) + (this.a_children.length && this.b_opened ? 8 : 0) + (!b_junction && this.o_root.o_selected == this ? 4 : 0) + (b_junction ? 2 : 0) + (b_junction && this.is_last() ? 1 : 0))];
}

var trees = [];
get_element = document.all ?
        function (s_id) { return document.all[s_id] } :
        function (s_id) { return document.getElementById(s_id) };

function unselect()
{
    var olditem = trees[0].o_root.o_selected;
    trees[0].o_root.o_selected = null;
    if (olditem) olditem.select(true);
}

function expand_all() {
    for (var i = 1; i < trees[0].a_index.length; i++) {
        var o_item = trees[0].a_index[i];
        if (!o_item.b_opened) o_item.open(o_item.b_opened);
    }
}

function collapse_all() {
    for (var i = 1; i < trees[0].a_index.length; i++) {
        var o_item = trees[0].a_index[i];
        if (o_item.b_opened && o_item.get_icon() != 'js/icons/base.gif') o_item.open(o_item.b_opened);
    }
}

function highlight_selected(n_id, mytree) {
    if ((n_id >= mytree.a_index.length) || (!mytree)) return;

    // Get the selected item 
    var o_item = mytree.a_index[n_id];

    // Collect info about all item's parents
    var n_id = o_item.n_id, 
        n_depth = o_item.n_depth,
        a_index = o_item.o_root.a_index,
        a_parents = [o_item];

    while (n_depth) {
        if (a_index[n_id].n_depth < n_depth) {
            a_parents[a_parents.length] = a_index[n_id];
            n_depth--;
        }
        n_id--;
    }

    // Open all parents starting from root
    for (var i = a_parents.length-1; i >= 0; i--) {
        a_parents[i].open();
    }

    // Highlight selected item
    o_item.select(o_item.b_deselect);
}

function getText(item)
{
    if (item.n_depth < 1)
    {
        return item.a_config[0];
    }
    else
    {
        return getText(item.o_parent) + ' > ' + item.a_config[0];
    }
}

function statusOverride(item, alwaysopen)
{
    var text = getText(item);
    if (alwaysopen)
    {
        window.status = 'Show ' + text;
    }
    else
    {
        if (item.b_opened)
        {
            window.status = 'Close ' + text;
        }
        else
        {
            window.status = 'Open ' + text;
        }
    }
}
