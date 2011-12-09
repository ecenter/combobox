(function($) {
  Drupal.behaviors.combobox = {
    attach: function(context) {
      /*var settings = Drupal.settings.Combobox || [];
      for (var id in settings){
        options = settings[id];
        select = $('#' + options.id);
        if (select.css('display') != 'none') {
          select.combobox(settings);
        }
      }*/
      $('select.combobox', context).combobox();
    }
  }
})(jQuery);
