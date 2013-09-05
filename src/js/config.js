'use strict';

/*
NOTE: Configure these values before doing any grunt task to build the application javascript.
These are available from the root scope and elsewhere.
*/
var endpoint_proto = 'http';
var endpoint_host = 'localhost';
var endpoint_port = '8080';
var endpoint_path = '/controller/nb';

var endpoint_base = endpoint_proto + '://' + endpoint_host + ':' + endpoint_port;

angular.element(document).ready(function () {
        opendaylight.value('config', {
        		endpoint_base : endpoint_base,
                endpoint : endpoint_base + endpoint_path
            });
        opendaylight.config(['RestangularProvider', function(RestangularProvider) {
          RestangularProvider.setBaseUrl('http://15.185.101.203:8080/controller/nb/v2');
        }])
        angular.bootstrap(document, ['opendaylight']);
    });