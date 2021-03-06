/**
 * @class
 */
Contextly.widget.Factory = Contextly.createClass({

  statics: /** @lends Contextly.widget.Factory */{

    /**
     * @param widget
     *
     * @returns {Contextly.widget.Base|null}
     */
    getWidget: function(widget) {
      if (!widget) {
        return null;
      }

      switch (widget.type) {
        case Contextly.widget.types.SIDEBAR:
        case Contextly.widget.types.AUTO_SIDEBAR:
          return new Contextly.widget.Sidebar(widget);

        case Contextly.widget.types.STORYLINE_SUBSCRIBE:
          return new Contextly.widget.StoryLineSubscribe(widget);

        case Contextly.widget.types.SIDERAIL:
          return new Contextly.widget.Siderail(widget);

        default:
          // Snippet.
          switch (widget.settings.display_type) {
            case Contextly.widget.styles.TEXT:
              return new Contextly.widget.TextSnippet(widget);

            case Contextly.widget.styles.TABS:
            case Contextly.widget.styles.BLOCKS:
              return new Contextly.widget.BlocksSnippet(widget);

            case Contextly.widget.styles.BLOCKS2:
              return new Contextly.widget.Blocks2Snippet(widget);

            case Contextly.widget.styles.FLOAT:
              return new Contextly.widget.FloatSnippet(widget);
          }
      }
    }

  }

});
