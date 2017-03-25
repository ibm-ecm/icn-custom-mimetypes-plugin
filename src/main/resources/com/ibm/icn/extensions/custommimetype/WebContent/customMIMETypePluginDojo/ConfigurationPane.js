/**
 * Copyright 2017 IBM Corporation
 */
define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "ecm/widget/admin/PluginConfigurationPane",
    "dojo/text!./templates/ConfigurationPane.html"
], function (
    declare,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    PluginConfigurationPane,
    template
) {

    return declare([ PluginConfigurationPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
		templateString: template,
		widgetsInTemplate: true,
	
		/**
		 * Called on load
		 * @override
		 * @param {function} callback Callback function
		 */
		load: function (/* callback */) {
            if (this.configurationString) {
                var jsonConfig = JSON.parse(this.configurationString);
                var output = '', i, j;
                for (i in jsonConfig) {
                    var mt = jsonConfig[i];
                    output = output + mt.mimetype + ':';
                    for (j in mt.extensions) {
                        var ext = mt.extensions[j];
                        output = output + ext + ',';
                    }
                    // Replace last ',' with ';'
                    output = output.replace(/,$/, "") + ";";
                }
                // Remove last ';'
                output = output.slice(0, -1);
                
                // Set field
                this.mimetypesField.set('value', output);
            }
        },
        
        /**
		 * Called on param change events
		 * @private
		 */
        _onParamChange : function () {
            var input = this.mimetypesField.get('value');
            
            if (input.match(/^(?:;?\w+\/[\w\+]+:\w+(?:,\w+)*)+$/g)) {
                var configJson = [], i;
                var associations = input.split(';');
                for (i in associations) {
                    var association = associations[i];
                    var splitedAssociation = association.split(':');
                    var mimetype = splitedAssociation[0];
                    var extensions = splitedAssociation[1];
                    var splitedExtensions = extensions.split(',');
                    // Creating object
                    var obj = {
                        mimetype: mimetype,
                        extensions: splitedExtensions
                    };
                    // Adding object to configArray
                    configJson.push(obj);
                }
                this.configurationString = JSON.stringify(configJson);
                this.onSaveNeeded(true);
            }
        },
        /**
		 * Validating the MIME Types field
		 * @override
		 */
        validate : function () {
            var input = this.mimetypesField.get('value');
            return input.match(/^(?:;?\w+\/[\w\+]+:\w+(?:,\w+)*)+$/g);
        }
	});
});