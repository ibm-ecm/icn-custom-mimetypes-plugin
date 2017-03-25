/**
 * Copyright 2017 IBM Corporation
 */
require([
    "dojo/_base/array",
    "dojo/aspect",
    "ecm/model/Request",
    "ecm/model/Repository"
], function (
    array,
    aspect,
    Request,
    Repository
) {
	/**
	 * Use this function to add any global JavaScript methods your plug-in requires.
	 */
    
    var signalMIMETypeFixPlugin = null;
    
    /**
     * Return the exension if the name has one
     * @private
     * @param   {string} name The filename
     * @returns {string} The extension, '' if the file doesn't have one (no dot)
     */
    var getExt = function (name) {
        var idx = name.lastIndexOf('.');
        if (idx >= 0) {
            return name.substr(idx + 1);
        } else {
            return '';
        }
    };

    /**
     * Resolve the type using the MIME Types stored in the desktop object
     * @param   {File}  file The File object
     * @returns {string} The MIME Type found, '' if none is found
     */
    var resolveType = function (name) {
        var res = '', ext = getExt(name);
        if (ext !== '') {
            array.some(ecm.model.desktop._mimeTypeDefs, function (el) {
                if (el.extensions.indexOf(ext) >= 0) {
                    res = el.mimeTypes[0];
                    return true;
                }
            });
        }
        return res;
    };

    // Set the correct MIME Type at add time so the Content Management System (P8, CM, CMOD, ...) does not have to figure itself
    // That will save the configuration part on its side.
    aspect.before(Repository.prototype, "addDocumentItem", function (parentFolder, objectStore, templateName, criterias, contentSourceType, mimeType, filename, content, childComponentValues, permissions, securityPolicyId, addAsMinorVersion, autoClassify, allowDuplicateFileNames, setSecurityParent, teamspaceId, callback, isBackgroundRequest, onError, compoundDocument, uploadProgress, applicationGroup, application, parameters) {
        if (!mimeType || mimeType === "") {
            mimeType = resolveType(filename);
        }
        return [parentFolder, objectStore, templateName, criterias, contentSourceType, mimeType, filename, content, childComponentValues, permissions, securityPolicyId, addAsMinorVersion, autoClassify, allowDuplicateFileNames, setSecurityParent, teamspaceId, callback, isBackgroundRequest, onError, compoundDocument, uploadProgress, applicationGroup, application, parameters];
    });
    
    
    /**
     * Injects the custom MIME Types array
     * @private
     * @param {Array[{mimetype: string, extensions: string[]}]} mimetypesArray Array of custom mappings
     */
    var _injectMIMETypes = function (mimetypesArray) {
        var mimeTypeDefs = ecm.model.desktop._mimeTypeDefs, i;
        for (i in mimetypesArray) {
            var mt = mimetypesArray[i];
            var association = {
                mimeTypes: [mt.mimetype],
                extensions: mt.extensions,
                fileType: "file.type.unknown"
            };
            mimeTypeDefs.push(association);
        }
        // Execute this method only on the first login
        // If we keep executing it we will have several times the same values
        // in the mimeTypeDefs array which is harmless but useless
        if (signalMIMETypeFixPlugin) {
            signalMIMETypeFixPlugin.remove();
        }
    };

    /**
     * @private
     * @returns {boolean} <code>true</code> if the plugin is already deployed, <code>false</code> otherwise
     */
    var pluginDeployed = function () {
        var i;
        for (i = 0; i < ecm.model.desktop._plugins.length; i++) {
            if (ecm.model.desktop._plugins[i].id == "CustomMIMETypePlugin") {
                return true;
            }
        }
        return false;
    };

    /**
     * Retrieve plugin configuration from the server and inject it to the desktop/s MIME Types mapping
     * @private
     */
    var _loadConfiguration = function () {
        if (pluginDeployed()) {
            Request.invokePluginService("CustomMIMETypePlugin", "GetConfigurationService", {
                requestCompleteCallback : function (response) {
                    // Here we can inject the custom MIME Types in the desktop config
                    _injectMIMETypes(response);
                }
            });
        }
    };

    /**
     * Function called on the onLogin event from desktop
     * @private
     * @param {ecm.model.Repository} repository The repository
     */
    var _onLogin = function (repository) {
        _loadConfiguration();
    };

    // We need to be connected to load the configuration, so postpone if we are not yet
    if (ecm.model.desktop.connected) {
        _loadConfiguration();
    } else {
        // dojo/on won't work because desktop does not fire events,
        // hence use aspect to call our method at the end of the dektop.onLogin
        signalMIMETypeFixPlugin = aspect.after(ecm.model.desktop, "onLogin", _onLogin);
    }
});
