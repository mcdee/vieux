/*
    Keep API service here

    For information about the NB API please go to:
    https://wiki..org/view/_Controller:REST_Reference_and_Authentication
*/

angular.module('odl.nbapi', [])

.factory('NBApiSvc', ['Restangular', function (Restangular) {
  var svc = {};

  svc.base = function(nbName, container) {
    container = container || 'default';
    return Restangular.one(nbName, container);
  };

  return svc;
}])


.factory('FlowSvc', function (NBApiSvc) {
  var svc = {
    base: function(container) {
      return NBApiSvc.base('flowprogrammer', container);
    }
  };

  svc.flowsUrl = function (container) {
    return svc.base(container);
  };

  svc.nodeFlowsUrl = function(container, nodeType, nodeId) {
    return svc.base(container).one('node', nodeType).one(nodeId);
  };

  svc.staticFlowUrl = function(container, nodeType, nodeId, name) {
    return svc.base(container).one('node', nodeType).one(nodeId).one('staticFlow', name);
  };

  return svc;
})


.factory('SwitchSvc', function (NBApiSvc) {
  var svc = {
    base: function(container) {
      return NBApiSvc.base('switchmanager', container);
    }
  };

  // URL for nodes
  svc.nodesUrl = function (container) {
    return svc.base(container).all('nodes');
  };

  // URL for a node
  svc.nodeUrl = function(container, type, id) {
    return svc.base(container).one('node', type).one(id);
  };

  return svc;
})


.factory('StaticRouteSvc', function (NBApiSvc) {
  var svc = {
    base: function (container) {
      return NBApiSvc.base('staticroute', container);
    }
  };

  svc.routesUrl = function (container) {
    return svc.base(container).all('routes');
  };

  svc.routeUrl = function (container, name) {
    return svc.base(container).one('route', name);
  };

  return svc;
})


.factory('SubnetSvc', function (NBApiSvc) {
  var svc = {
    base: function (container) {
      return NBApiSvc.base('subnetservice', container);
    }
  };

  svc.subnetsUrl = function (container) {
    return svc.base(container).all('subnets');
  };

  svc.subnetUrl = function (container, name) {
    return svc.base(container).one('subnet', name);
  };

  svc.subnetPortsUrl = function (container, name) {
    return svc.base(container).one('subnet', name).all('node-ports');
  };

  return svc;
})


.factory('TopologySvc', function (NBApiSvc, SwitchSvc) {
  var svc = {
    base: function (container) {
      return NBApiSvc.base('topology', container);
    }
  };

  svc.topologyUrl = function (container) {
    return svc.base(container);
  };

  svc.userLinksUrl = function (container) {
    return svc.base(container).all('user-link');
  };

  svc.userLinkUrl = function (container, linkName) {
    return svc.base(container).one('user-link', linkName);
  };

  // Fetch the data needed
  svc.getTopologyData = function (container, cb, eb) {
    var nodes = [];

    var data = {
      directed: false, multigraph: false, graph: [], nodes: [], links: []
    };

    SwitchSvc.nodesUrl().getList().then(function(npData) {
      angular.forEach(npData.nodeProperties, function(value, key){
        nodes[key] = value.node.id;
        data.nodes[key] = {id: value.node.id};
      });

      // TODO: Howto handle if a indexOf becomes -1? That would mean there's a diff between the nodes data and the topology data!?
      svc.topologyUrl().getList().then(function(tData) {
        angular.forEach(tData.edgeProperties, function(ep) {
          var edgeId = nodes.indexOf(ep.edge.headNodeConnector.node.id);
          var tailId = nodes.indexOf(ep.edge.tailNodeConnector.node.id);

          // TODO: Possible place to call errback?
          if (edgeId == -1 || tailId == -1) {
            console.log("WARNING - couldn't the id with -1: " + edgeId + ' ' + tailId);
          }

          data.links.push({"source": edgeId, "target": tailId});
        });

        // All done, let's feed the data to the upper function
        cb(data);
      });
    });
  };

  return svc;
});