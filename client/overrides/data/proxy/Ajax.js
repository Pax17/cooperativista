
Ext.define('Ext.override.data.proxy.Ajax', {
    override: 'Ext.data.proxy.Ajax',

    doRequest: function(operation) {
        var me = this,
            writer  = me.getWriter(),
            request = me.buildRequest(operation),
            method  = me.getMethod(request),
            jsonData, params;

        if (writer && operation.allowWrite()) {
            request = writer.write(request);
        }

        request.setConfig({
            binary              : me.getBinary(),
            headers             : me.getHeaders(),
            timeout             : me.getTimeout(),
            scope               : me,
            callback            : me.createRequestCallback(request, operation),
            method              : method,
            useDefaultXhrHeader : me.getUseDefaultXhrHeader(),
            disableCaching      : false // explicitly set it to false, ServerProxy handles caching
        });

        console.log(method.toUpperCase(),  me.getParamsAsJson());
        if (method.toUpperCase() !== 'GET' && me.getParamsAsJson()) {
            params = request.getParams();

            console.log(params);
            if (params) {
                jsonData = request.getJsonData();
                if (jsonData) {
                    jsonData = Ext.Object.merge({}, jsonData, params);
                } else {
                    jsonData = params;
                }
                request.setJsonData(jsonData);
                request.setParams(undefined);
                //console.log(jsonData, request);
            }
        }

        if (me.getWithCredentials()) {
            request.setWithCredentials(true);
            request.setUsername(me.getUsername());
            request.setPassword(me.getPassword());
        }
        return me.sendRequest(request);
    },

    /**
     * Fires a request
     * @param {Ext.data.Request} request The request
     * @return {Ext.data.Request} The request
     * @private
     */
    sendRequest: function(request) {
       // console.log(request);
        request.setRawRequest(Ext.Ajax.request(request.getCurrentConfig()));
        this.lastRequest = request;

        return request;
    }
});