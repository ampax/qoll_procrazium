/** Uncomment the following to enable server side debugging **/
/** enable debugging - $ export NODE_OPTIONS='--debug' **/
/** disable debugging - $ $ export NODE_OPTIONS='' **/
Inspector.runIfDebugging({
  delay: 1500,
  kill: function (inspectorProcess) {
    inspectorProcess.kill();
  }
});