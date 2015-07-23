(function($) {

  Contextly.metadataParser.MsgPhx = Contextly.createClass({

    extend: Contextly.metadataParser.OpenGraph,

    statics: {

      getValue: function(key) {
        if (key === 'pub_date') {
          // Get publication date from the page content.
          var raw = $('#blox-story')
            .find('.story-times .updated[title]')
            .attr('title') || '';
          var parsed = raw.match(/^(\d+\-\d+\-\d+)T(\d+:\d+:\d+)?/);
          if (parsed) {
            var result = parsed[1] + ' ';
            if (parsed.length >= 2) {
              result += parsed[2];
            }
            else {
              result += '12:00:00';
            }
            return result;
          }
        }

        return Contextly.metadataParser.OpenGraph.getValue.apply(this, arguments);
      }

    }

  });

  // Erase the rest formats from the detection list.
  Contextly.metadataFormats = {};
  Contextly.metadataFormats['MsgPhx'] = Contextly.metadataParser.MsgPhx;

})(jQuery);