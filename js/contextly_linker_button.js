// Dummy JavaScript document
// Create a new plugin class
tinymce.create('tinymce.plugins.ContextlyPlugin', {
    init : function(ed, url) {
        // Register an example button
        ed.addButton('contextly', {
            title : 'Show Contextly Linker Window',
            image : url + '/img/contextly.gif',
			onclick : function() {
				 contextly_create_see_also();
            }
        });
    }
});

// Register plugin with a short name
tinymce.PluginManager.add('contextly', tinymce.plugins.ContextlyPlugin);
