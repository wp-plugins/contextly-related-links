(function($) {

  Contextly.metadataParser.DmnAddons = Contextly.createClass({

    statics: {

      parseDmnModDate: function(result) {
        // Get mod date from non-standard meta-tag.
        var raw = $('meta[name="LastModifiedDate"]:first')
          .attr('content') || '';
        var parsed = raw.match(/^(\d+\-\d+\-\d+)T(\d+:\d+:\d+)?/);
        if (parsed) {
          var modDate = parsed[1] + ' ';
          if (parsed.length >= 2) {
            modDate += parsed[2];
          }
          else {
            modDate += '12:00:00';
          }
          result.mod_date = modDate;
        }
      }

    }

  });

  Contextly.metadataParser.DmnParselyPage = Contextly.createClass({

    extend: [Contextly.metadataParser.ParselyPage, Contextly.metadataParser.DmnAddons],

    statics: {

      parseSource: function() {
        var result = Contextly.metadataParser.ParselyPage.parseSource.apply(this, arguments);

        this.parseDmnModDate(result);

        return result;
      }

    }

  });

  Contextly.metadataParser.DmnJsonLd = Contextly.createClass({

    extend: [Contextly.metadataParser.JsonLd, Contextly.metadataParser.DmnAddons],

    statics: {

      parseSource: function() {
        var result = Contextly.metadataParser.JsonLd.parseSource.apply(this, arguments);

        this.parseDmnModDate(result);

        return result;
      }

    }

  });

  // Erase the rest formats from the detection list.
  Contextly.metadataFormats = {};
  Contextly.metadataFormats['DmnParselyPage'] = Contextly.metadataParser.DmnParselyPage;
  Contextly.metadataFormats['DmnJsonLd'] = Contextly.metadataParser.DmnJsonLd;

})(jQuery);