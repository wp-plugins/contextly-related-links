(function($) {

  /**
   * @class
   * @extends Contextly.metadataParser.Default
   */
  Contextly.metadataParser.ParselyPage = Contextly.createClass({

    extend: Contextly.metadataParser.Default,

    statics: /** @lends Contextly.metadataParser.ParselyPage */ {

      findElement: function() {
        return $('head meta[name="parsely-page"][content]')
      },

      parseData: function() {
        var data = {};
        var map = {
          post_id: 'post_id',
          type: 'type',
          title: 'title',
          image: 'image_url',
          tags: 'tags',
          url: 'link'
        };
        var parsely = Contextly.metadataParser.Default.parseData.apply(this, arguments);
        for (var dst in map) {
          var src = map[dst];
          if (typeof parsely[src] !== 'undefined') {
            data[dst] = parsely[src];
          }
        }

        // Handle fields with format conversion: author_name, pub_date and
        // categories.
        if (Contextly.Utils.isArray(parsely.authors) && parsely.authors.length) {
          // Join authors with a comma.
          data.author_name = parsely.authors.join(', ');
        }
        if (typeof parsely.section !== 'undefined') {
          // Wrap section in an array.
          data.categories = [parsely.section];
        }
        if (typeof parsely.pub_date !== 'undefined') {
          var matched = parsely.pub_date.match(/^(\d+\-\d+\-\d+)(?:T(\d+:\d+:\d+))*/);
          if (matched) {
            data.pub_date = matched[1];
            if (matched.length >= 3) {
              data.pub_date += ' ' + matched[2];
            }
          }
        }

        return data;
      }

    }

  });

})(jQuery);