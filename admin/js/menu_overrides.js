var menu_overrides = {}; 

menu_overrides.MENU_ITEMS = null; 

menu_overrides.get_parent_menus = function () {
    
    var parentMenusContainer = []; 
            
    // Fetching Parent Menus        
    for ( var iterator = 0; iterator < menu_overrides.MENU_ITEMS.length; iterator++ ) {
        var parentMenu = menu_overrides.MENU_ITEMS[ iterator ]; 

        parentMenusContainer.push( parentMenu[0] ); 
    }
    
    return parentMenusContainer; 
}

menu_overrides.hide_all_submenus = function() {
    
    var parentMenusContainer = menu_overrides.get_parent_menus(); 

    // Iterating through parent menus to hide each of these elements
    for( var iterator = 0; iterator < parentMenusContainer.length; iterator++ ) {
        var menuName = parentMenusContainer[ iterator ]; 
        
        var currentElement = $( 'td:contains(\"'+ menuName +'\")' ); 
        
        var menuElement = null; 
        
        /**
         * NOTE: 
         * this is to iterate through the matched elements if the number of matches
         * exceeds one ( which means that that there are child elements that are 
         * of the same name ).
         */
        if( currentElement.length > 1 ) {
            
            for( var i = 0; i < currentElement.length; i++ ) {
                
                /**
                 * NOTE: 
                 * This looks for an ending "</a>" tag, which means that the 
                 * element matched is a sub menu, and not a parent menu. 
                 * If it DOES NOT MATCH, it means that it is a parent menu
                 * therefore there is a need to apply the operation.
                 */
                var htmlContent = $( currentElement[i] ).html(); 
                if ( !htmlContent.match( "</a>" ) ) {
                    menuElement = $( currentElement[i] ).parent().parent().parent(); 
                }
            }
    
        } else {
            menuElement =  $( currentElement ).parent().parent().parent(); 
        }
        
        var menuContentElements = $( menuElement ).next(); 
        $( menuContentElements ).hide(); 
    }
}

menu_overrides.initialize_events = function() {
    
    var parentMenusContainer = menu_overrides.get_parent_menus(); 
    
    for( var iterator = 0; iterator < parentMenusContainer.length; iterator++ ) {
        
        var menuName = parentMenusContainer[ iterator ]; 
        
        var currentElement = $( 'td:contains(\"'+ menuName +'\")' ); 
        
        var menuElement = null; 
        
        if ( currentElement.length > 1 ) {
            
            for( var i = 0; i < currentElement.length; i++ ) {
                
                /**
                 * NOTE: 
                 * This looks for an ending "</a>" tag, which means that the 
                 * element matched is a sub menu, and not a parent menu. 
                 * If it DOES NOT MATCH, it means that it is a parent menu
                 * therefore there is a need to apply the operation.
                 */
                var htmlContent = $( currentElement[i] ).html(); 
                if ( !htmlContent.match( "</a>" ) ) {
                    menuElement = $( currentElement[i] ).parent().parent().parent(); 
                }
            }
            
        } else {
            menuElement =  $( currentElement ).parent().parent().parent(); 
        }
        
        $( menuElement ).unbind( 'click' ).click(
                function() {
                    var elementToShow = $( this ).next(); 
                    menu_overrides.hide_all_submenus(); 
                    $( elementToShow ).show(); 
                }

        );
    }
}

$( document ).ready(
        function() {
            menu_overrides.MENU_ITEMS = TREE_ITEMS; 
            menu_overrides.hide_all_submenus(); 
            menu_overrides.initialize_events();
        }
); 
   
   
