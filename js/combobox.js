(function( $ ) {
  $.widget( "ui.combobox", {
    options: {
      show_clear_button: false
    },
    _create: function() {
      var self = this,
        select = this.element.hide(),
        selected = select.children( ":selected" ),
        value = selected.val() ? selected.text() : "";

      var wrapper = select
        .wrap('<div class="combobox-js-wrapper">')
        .parent();
      
      var input = $( '<input type="text">' )
        .insertAfter( select )
        .val( value )
        .addClass( "ui-widget ui-widget-content ui-corner-left" );
      
      var button = $( "<button>" )
        .attr( "tabIndex", -1 )
        .attr( "title", "Show All Items" )
        .insertAfter( input )
        .button({
          icons: {
            primary: "ui-icon-triangle-1-s"
          },
          text: false
        });

      if (!select.attr('disabled') && !select.attr('readonly')) {
        input.autocomplete({
          delay: 0,
          minLength: 0,
          source: function( request, response ) {
            wrapper.addClass('combobox-hover');
            var matcher = new RegExp('(' + $.ui.autocomplete.escapeRegex(request.term) + ')', "i" );
            response( select.children( "option" ).map(function() {
              var text = $( this ).text();
              if ( this.value && ( !request.term || matcher.test(text) ) )
                return {
                  label: text.replace(matcher, "<strong>$1</strong>"),
                  value: text,
                  option: this
                };
            }) );
          },
          select: function( event, ui ) {
            ui.item.option.selected = true;
            self._trigger( "selected", event, {
              item: ui.item.option
            });
            select.change();
            wrapper.removeClass('combobox-hover');
          },
          change: function( event, ui ) {
            if ( !ui.item ) {
              var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
                valid = false;
              select.children( "option" ).each(function() {
                if ( $(this).text().match( matcher ) ) {
                  this.selected = valid = true;
                  select.change();
                  return false;
                }
              });
              if ( !valid ) {
                // remove invalid value, as it didn't match anything
                $( this ).val( "" );
                select.val( "" );
                return false;
              }
            }
          }
        });

        button.click(function() {
          // close if already visible
          if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
            input.autocomplete( "close" );
            return;
          }

          // pass empty string as value to search for, displaying all results
          input.autocomplete( "search", "" );
          input.focus();
      
          // Don't submit form
          return false;
        });

        input.data( "autocomplete" )._renderItem = function( ul, item ) {
          return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( "<a>" + item.label + "</a>" )
            .appendTo( ul );
        };
      }
      else if (select.attr('readonly') && !select.attr('disabled')) {
        input.attr('readonly', true);
        button.attr('disabled', true);
      }
      else if (select.attr('disabled')) {
        input.attr('disabled', true);
        button.attr('disabled', true);
      }            
    }
  });
})( jQuery );

