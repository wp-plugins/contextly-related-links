!function(){var template=Handlebars.template,templates=Contextly.templates=Contextly.templates||{};templates.alert=template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,helper,buffer="",functionType="function",escapeExpression=this.escapeExpression;return buffer+='<div class="alert alert-',(helper=helpers.type)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.type,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'">\n  <button type="button" class="close"><i class="icon-remove"></i></button>\n  <span class="alert-text">',(helper=helpers.text)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.text,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+"</span>\n</div>\n"}),templates.inputFields=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data){var helper,options,buffer="";return buffer+='\n      <button class="url-submit btn btn-success">\n        <i class="icon-ok"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Use link",options):helperMissing.call(depth0,"t","Use link",options)))+"\n      </button>\n    "}function program3(depth0,data){var helper,options,buffer="";return buffer+='\n      <button class="url-submit btn">\n        <i class="icon-arrow-right"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Add link",options):helperMissing.call(depth0,"t","Add link",options)))+"\n      </button>\n    "}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,helper,options,buffer="",helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression,self=this;return buffer+='<div class="input-fields control-group">\n  <div class="input-prepend input-append inline">\n    <span class="add-on"><i class="icon-search"></i></span>\n    <input class="search-phrase" type="text"\n           placeholder="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Search phrase",options):helperMissing.call(depth0,"t","Search phrase",options)))+'">\n    <button class="search-submit btn btn-primary">\n      <i class="icon-arrow-down"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Search",options):helperMissing.call(depth0,"t","Search",options)))+'\n    </button>\n  </div>\n\n  <span class="inputs-splitter">'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"or",options):helperMissing.call(depth0,"t","or",options)))+'</span>\n\n  <div class="input-prepend input-append inline">\n    <span class="add-on"><i class="icon-link"></i></span>\n    <input class="link-url" type="text"\n           placeholder="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"http://paste-a-link-here.com",options):helperMissing.call(depth0,"t","http://paste-a-link-here.com",options)))+'">\n    ',stack1=helpers["if"].call(depth0,(stack1=depth0&&depth0.editor,null==stack1||stack1===!1?stack1:stack1.isLink),{hash:{},inverse:self.program(3,program3,data),fn:self.program(1,program1,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\n  </div>\n</div>"}),templates.progressIndicator=template(function(Handlebars,depth0,helpers,partials,data){return this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{},'<div class="progress-indicator hidden"></div>'}),templates.searchTabs=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data){var helper,options,buffer="";return buffer+='\n    <li class="search-tab right" data-search-type="sidebars" data-site-url="">\n      <a class="search-tab-link" href="#">\n        '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Existing sidebars",options):helperMissing.call(depth0,"t","Existing sidebars",options)))+"\n      </a>\n    </li>\n  "}function program3(depth0,data){var stack1,helper,buffer="";return buffer+='\n    <li class="search-tab" data-search-type="links" data-site-url="',(helper=helpers.site_url)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.site_url,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'">\n      <a class="search-tab-link" href="#">',(helper=helpers.site_name)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.site_name,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+"</a>\n    </li>\n  "}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,buffer="",helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression,functionType="function",self=this;return buffer+='<ul class="search-tabs nav nav-tabs hidden">\n  ',stack1=helpers["if"].call(depth0,(stack1=depth0&&depth0.editor,null==stack1||stack1===!1?stack1:stack1.isSidebar),{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\n  ",stack1=helpers.each.call(depth0,depth0&&depth0.annotations,{hash:{},inverse:self.noop,fn:self.program(3,program3,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\n</ul>"}),templates.searchPager=template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var helper,options,buffer="",helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression;return buffer+='<ul class="search-pager pager hidden">\n  <li class="previous disabled">\n    <a href="#" class="search-prev"><i class="icon-angle-left"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Previous",options):helperMissing.call(depth0,"t","Previous",options)))+'</a>\n  </li>\n  <li class="next">\n    <a href="#" class="search-next">'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Next",options):helperMissing.call(depth0,"t","Next",options)))+' <i class="icon-angle-right"></i></a>\n  </li>\n</ul>'}),templates.searchResults=template(function(Handlebars,depth0,helpers,partials,data){return this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{},'<ul class="search-results"></ul>\n'}),templates.searchResultsEmpty=template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var helper,options,buffer="",helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression;return buffer+='<div class="search-no-results">\n  '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"No results.",options):helperMissing.call(depth0,"t","No results.",options)))+"\n</div>"}),templates.searchResultsLinks=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data,depth1){var stack1,helper,options,buffer="";return buffer+='\n  <li class="search-result clearfix" data-url="',(helper=helpers.url)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.url,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'">\n    <div class="search-result-action-wrapper left cell">\n      ',stack1=helpers["if"].call(depth0,(stack1=depth1&&depth1.editor,null==stack1||stack1===!1?stack1:stack1.isLink),{hash:{},inverse:self.program(4,program4,data),fn:self.program(2,program2,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+='\n    </div>\n    <div class="search-result-info cell">\n      <h4 class="search-result-title">',(helper=helpers.title)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.title,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'</h4>\n\n      <p class="search-result-description">',(helper=helpers.description)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.description,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'</p>\n\n      <div class="website-url-wrapper">\n        <a href="',(helper=helpers.url)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.url,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'" class="website-link" title="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Preview",options):helperMissing.call(depth0,"t","Preview",options)))+'">\n          <i class="icon-eye-open"></i> <span class="website-url">',(helper=helpers.display_url)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.display_url,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'</span>\n        </a>\n      </div>\n    </div>\n    <div class="search-result-action-wrapper right cell">\n      ',stack1=helpers["if"].call(depth0,(stack1=depth1&&depth1.editor,null==stack1||stack1===!1?stack1:stack1.isLink),{hash:{},inverse:self.program(4,program4,data),fn:self.program(2,program2,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\n    </div>\n  </li>\n"}function program2(depth0,data){var helper,options,buffer="";return buffer+='\n        <button class="website-add btn btn-mini btn-success">\n          <i class="icon-ok"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Use",options):helperMissing.call(depth0,"t","Use",options)))+"\n        </button>\n      "}function program4(depth0,data){var helper,options,buffer="";return buffer+='\n        <button class="website-add btn btn-mini">\n          <i class="icon-arrow-right"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Add",options):helperMissing.call(depth0,"t","Add",options)))+"\n        </button>\n      "}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression,functionType="function",self=this;return stack1=helpers.each.call(depth0,depth0&&depth0.links,{hash:{},inverse:self.noop,fn:self.programWithDepth(1,program1,data,depth0),data:data}),stack1||0===stack1?stack1:""}),templates.urlPreview=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data){var helper,options,buffer="";return buffer+='\n        <button class="url-preview-remove btn btn-mini btn-danger hidden">\n          <i class="icon-trash"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Remove link",options):helperMissing.call(depth0,"t","Remove link",options)))+"\n        </button>\n      "}function program3(depth0,data){var helper,options,buffer="";return buffer+='\n        <button class="url-preview-confirm btn btn-mini btn-success hidden">\n          <i class="icon-ok"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Use link",options):helperMissing.call(depth0,"t","Use link",options)))+"\n        </button>\n      "}function program5(depth0,data){var helper,options,buffer="";return buffer+='\n        <button class="url-preview-confirm btn btn-mini hidden">\n          <i class="icon-arrow-right"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Add link",options):helperMissing.call(depth0,"t","Add link",options)))+"\n        </button>\n      "}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,helper,options,buffer="",helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression,self=this;return buffer+='<div class="url-preview-overlay hidden">\n  <div class="url-preview-frame-wrapper">\n    <iframe class="url-preview-frame" src="about:blank" frameBorder="0"></iframe>\n  </div>\n  <div class="url-preview-toolbar">\n    <a href="javascript:" class="url-preview-link">\n      <i class="icon-external-link"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"View in new tab",options):helperMissing.call(depth0,"t","View in new tab",options)))+'\n    </a>\n    <div class="url-preview-buttons">\n      ',stack1=helpers.unless.call(depth0,(stack1=depth0&&depth0.editor,null==stack1||stack1===!1?stack1:stack1.isLink),{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+='\n\n      <button class="url-preview-cancel btn btn-mini btn-warning">\n        <i class="icon-remove"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Close preview",options):helperMissing.call(depth0,"t","Close preview",options)))+"\n      </button>\n\n      ",stack1=helpers["if"].call(depth0,(stack1=depth0&&depth0.editor,null==stack1||stack1===!1?stack1:stack1.isLink),{hash:{},inverse:self.program(5,program5,data),fn:self.program(3,program3,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\n    </div>\n  </div>\n</div>"}),templates.sectionLinks=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data){var stack1,helper,options,buffer="";return buffer+='\n  <li class="section-link clearfix" data-url="',(helper=helpers.native_url)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.native_url,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'" data-id="',(helper=helpers.id)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.id,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'">\n    <div class="handle"></div>\n    <a href="javascript:" class="remove-link" title="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Remove the link",options):helperMissing.call(depth0,"t","Remove the link",options)))+'">\n      <i class="icon-trash"></i>\n    </a>\n    <a href="',(helper=helpers.native_url)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.native_url,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'" class="test-link" title="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Preview",options):helperMissing.call(depth0,"t","Preview",options)))+'">\n      <i class="icon-eye-open"></i>\n    </a>\n\n    <div class="link-title">\n      <textarea class="link-title-editor',stack1=helpers["if"].call(depth0,depth0&&depth0.pending,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+='">',(helper=helpers.title)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.title,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+"</textarea>\n      ",stack1=helpers["if"].call(depth0,depth0&&depth0.pending,{hash:{},inverse:self.noop,fn:self.program(4,program4,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\n    </div>\n  </li>\n"}function program2(){return" hidden"}function program4(){return'\n        <div class="link-progress-indicator"></div>\n      '}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,functionType="function",escapeExpression=this.escapeExpression,helperMissing=helpers.helperMissing,self=this;return stack1=helpers.each.call(depth0,depth0&&depth0.links,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data}),stack1||0===stack1?stack1:""}),templates.editor=template(function(Handlebars,depth0,helpers,partials,data){this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),partials=this.merge(partials,Handlebars.partials),data=data||{};var stack1,helper,options,buffer="",self=this,helperMissing=helpers.helperMissing,escapeExpression=this.escapeExpression,functionType="function";return buffer+='<div class="container-fluid contextly-editor">\n  <div class="row-fluid">\n    <div class="span8">\n      ',stack1=self.invokePartial(partials.inputFields,"inputFields",depth0,helpers,partials,data),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\n      ",stack1=self.invokePartial(partials.searchTabs,"searchTabs",depth0,helpers,partials,data),(stack1||0===stack1)&&(buffer+=stack1),buffer+='\n      <div class="search-output"></div>\n      ',stack1=self.invokePartial(partials.searchPager,"searchPager",depth0,helpers,partials,data),(stack1||0===stack1)&&(buffer+=stack1),buffer+='\n    </div>\n    <div class="span4 sidebar-right">\n      <div class="sidebar-settings">\n        <div class="control-group">\n          <input class="sidebar-title" type="text" placeholder="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Sidebar title",options):helperMissing.call(depth0,"t","Sidebar title",options)))+'" value="'+escapeExpression((stack1=depth0&&depth0.sidebar,stack1=null==stack1||stack1===!1?stack1:stack1.name,typeof stack1===functionType?stack1.apply(depth0):stack1))+'">\n        </div>\n        <div class="control-group">\n          <textarea class="sidebar-description" placeholder="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Sidebar description",options):helperMissing.call(depth0,"t","Sidebar description",options)))+'">'+escapeExpression((stack1=depth0&&depth0.sidebar,stack1=null==stack1||stack1===!1?stack1:stack1.description,typeof stack1===functionType?stack1.apply(depth0):stack1))+'</textarea>\n        </div>\n        <div class="control-group">\n          <div class="btn-group input-prepend sidebar-layout">\n            <span class="add-on">'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Layout:",options):helperMissing.call(depth0,"t","Layout:",options)))+'</span>\n            <button class="btn sidebar-layout-switch" data-layout="left">\n              '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Left",options):helperMissing.call(depth0,"t","Left",options)))+'\n            </button>\n            <button class="btn sidebar-layout-switch" data-layout="wide">\n              '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Wide",options):helperMissing.call(depth0,"t","Wide",options)))+'\n            </button>\n            <button class="btn sidebar-layout-switch" data-layout="right">\n              '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Right",options):helperMissing.call(depth0,"t","Right",options)))+'\n            </button>\n          </div>\n        </div>\n\n        <div class="sidebar-modal modal hidden" tabindex="-1">\n          <div class="modal-header">\n            <button type="button" class="close" data-dismiss="modal">\n              <i class="icon-remove"></i>\n            </button>\n            <h3>\n              '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Both sidebar title and description are empty!",options):helperMissing.call(depth0,"t","Both sidebar title and description are empty!",options)))+'\n            </h3>\n          </div>\n          <div class="modal-body">\n            <p>\n              '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Would you like to add a title and/or description to the sidebar?",options):helperMissing.call(depth0,"t","Would you like to add a title and/or description to the sidebar?",options)))+'\n            </p>\n          </div>\n          <div class="modal-footer">\n            <button class="btn btn-success" data-dismiss="modal">\n              '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Yes, return to the form",options):helperMissing.call(depth0,"t","Yes, return to the form",options)))+'\n            </button>\n            <button class="sidebar-modal-confirm btn btn-warning">\n              '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"No, just save it",options):helperMissing.call(depth0,"t","No, just save it",options)))+'\n            </button>\n          </div>\n        </div>\n      </div>\n\n      <div class="sidebar-result hidden">\n        <h3 class="widget-title">'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Result:",options):helperMissing.call(depth0,"t","Result:",options)))+'</h3>\n\n        <ul class="section-links"></ul>\n\n        <div class="control-group sidebar-add-to-related-wrapper">\n          <label class="checkbox-right"\n                 title="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"If you check this box, the sidebar stories will also be added to the list of related links.",options):helperMissing.call(depth0,"t","If you check this box, the sidebar stories will also be added to the list of related links.",options)))+'">\n            <input type="checkbox" class="sidebar-add-to-related"\n                   checked="checked">\n            '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Add links to the module too",options):helperMissing.call(depth0,"t","Add links to the module too",options)))+'\n          </label>\n        </div>\n      </div>\n\n      <div class="dialog-actions">\n        <button class="dialog-action action-remove btn btn-danger"\n                title="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Remove the sidebar",options):helperMissing.call(depth0,"t","Remove the sidebar",options)))+'">\n          <i class="icon-trash"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Remove",options):helperMissing.call(depth0,"t","Remove",options)))+'\n        </button>\n        <button class="dialog-action action-cancel btn btn-warning"\n                title="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Reset all changes",options):helperMissing.call(depth0,"t","Reset all changes",options)))+'">\n          <i class="icon-remove"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Cancel",options):helperMissing.call(depth0,"t","Cancel",options)))+'\n        </button>\n        <button class="dialog-action action-save btn btn-success"\n                title="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Save the sidebar",options):helperMissing.call(depth0,"t","Save the sidebar",options)))+'">\n          <i class="icon-ok"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Save",options):helperMissing.call(depth0,"t","Save",options)))+"\n        </button>\n      </div>\n    </div>\n  </div>\n</div>\n",stack1=self.invokePartial(partials.urlPreview,"urlPreview",depth0,helpers,partials,data),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\n",stack1=self.invokePartial(partials.progressIndicator,"progressIndicator",depth0,helpers,partials,data),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\n"}),templates.searchResultsSidebars=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data){var stack1,helper,options,buffer="";return buffer+='\n  <li class="search-result search-sidebars-result clearfix" data-sidebar-id="',(helper=helpers.id)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.id,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'">\n    <div class="search-result-action-wrapper left cell">\n      <div class="btn-group">\n        <button class="search-sidebar-add-all btn btn-mini">\n          <i class="icon-arrow-right"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Add all",options):helperMissing.call(depth0,"t","Add all",options)))+'\n        </button>\n        <button class="search-sidebar-actions-toggle btn btn-mini dropdown-toggle">\n          <span class="caret"></span>\n        </button>\n        <ul class="dropdown-menu">\n          <li>\n            <a href="#" class="search-sidebar-add-all">\n              <i class="icon-arrow-right"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Add all links",options):helperMissing.call(depth0,"t","Add all links",options)))+'\n            </a>\n          </li>\n          <li>\n            <a href="#" class="search-sidebar-overwrite">\n              <i class="icon-double-angle-right"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Overwrite whole sidebar",options):helperMissing.call(depth0,"t","Overwrite whole sidebar",options)))+'\n            </a>\n          </li>\n        </ul>\n      </div>\n    </div>\n    <div class="search-result-info cell">\n      ',stack1=helpers["if"].call(depth0,depth0&&depth0.name,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\n      ",stack1=helpers["if"].call(depth0,depth0&&depth0.description,{hash:{},inverse:self.noop,fn:self.program(4,program4,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+='\n\n      <ul class="search-sidebar-content">\n        ',stack1=helpers.each.call(depth0,(stack1=depth0&&depth0.links,null==stack1||stack1===!1?stack1:stack1.previous),{hash:{},inverse:self.noop,fn:self.program(6,program6,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+='\n      </ul>\n      <div class="search-sidebar-links-toggles hidden">\n        <button class="search-sidebar-links-expand search-sidebar-links-toggle hidden btn btn-mini btn-info">\n          <i class="icon-caret-down"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Expand",options):helperMissing.call(depth0,"t","Expand",options)))+'\n        </button>\n        <button class="search-sidebar-links-collapse search-sidebar-links-toggle hidden btn btn-mini btn-info">\n          <i class="icon-caret-up"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Colapse",options):helperMissing.call(depth0,"t","Colapse",options)))+'\n        </button>\n      </div>\n    </div>\n    <div class="search-result-action-wrapper right cell">\n      <div class="btn-group">\n        <button class="search-sidebar-add-all btn btn-mini">\n          <i class="icon-arrow-right"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Add all",options):helperMissing.call(depth0,"t","Add all",options)))+'\n        </button>\n        <button\n          class="search-sidebar-actions-toggle btn btn-mini dropdown-toggle">\n          <span class="caret"></span>\n        </button>\n        <ul class="dropdown-menu">\n          <li>\n            <a href="#" class="search-sidebar-add-all">\n              <i class="icon-arrow-right"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Add all links",options):helperMissing.call(depth0,"t","Add all links",options)))+'\n            </a>\n          </li>\n          <li>\n            <a href="#" class="search-sidebar-overwrite">\n              <i class="icon-double-angle-right"></i> '+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Overwrite whole sidebar",options):helperMissing.call(depth0,"t","Overwrite whole sidebar",options)))+"\n            </a>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </li>\n"}function program2(depth0,data){var stack1,helper,buffer="";return buffer+='\n        <h4 class="search-result-title">',(helper=helpers.name)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.name,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+"</h4>\n      "}function program4(depth0,data){var stack1,helper,buffer="";return buffer+='\n        <p class="search-result-description">',(helper=helpers.description)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.description,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+"</p>\n      "}function program6(depth0,data){var stack1,helper,options,buffer="";return buffer+='\n          <li class="search-sidebar-content-item">\n            <a class="search-sidebar-link" href="',(helper=helpers.native_url)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.native_url,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'">\n              <i class="icon-eye-open"></i> <span class="search-sidebar-link-title">',(helper=helpers.title)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.title,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'</span>\n            </a>\n\n            <button class="search-sidebar-add-single btn btn-mini" title="'+escapeExpression((helper=helpers.t||depth0&&depth0.t,options={hash:{},data:data},helper?helper.call(depth0,"Add link",options):helperMissing.call(depth0,"t","Add link",options)))+'">\n              <i class="icon-arrow-right"></i>\n            </button>\n          </li>\n        '}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,functionType="function",escapeExpression=this.escapeExpression,helperMissing=helpers.helperMissing,self=this;return stack1=helpers.each.call(depth0,depth0&&depth0.sidebars,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data}),stack1||0===stack1?stack1:""})}();