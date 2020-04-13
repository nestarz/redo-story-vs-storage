function checkTurnOrStun(turnConfig, timeout) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (promiseResolved) {
        if (promiseResolved == "STUN") resolve("STUN");
        return;
      }
      resolve(false);
      promiseResolved = true;
    }, timeout || 5000);

    var promiseResolved = false,
      myPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection, //compatibility for firefox and chrome
      pc = new myPeerConnection({ iceServers: [turnConfig] }),
      noop = function() {};
    pc.createDataChannel(""); //create a bogus data channel
    pc.createOffer(function(sdp) {
      if (sdp.sdp.indexOf("typ relay") > -1) {
        // sometimes sdp contains the ice candidates...
        promiseResolved = "TURN";
        resolve(true);
      }
      pc.setLocalDescription(sdp, noop, noop);
    }, noop); // create offer and set local description
    pc.onicecandidate = function(ice) {
      //listen for candidate events
      if (!ice || !ice.candidate || !ice.candidate.candidate) return;
      if (ice.candidate.candidate.indexOf("typ relay") != -1) {
        promiseResolved = "TURN";
        resolve("TURN");
      } else if (
        !promiseResolved &&
        (ice.candidate.candidate.indexOf("typ prflx") != -1 ||
          ice.candidate.candidate.indexOf("typ srflx") != -1)
      ) {
        promiseResolved = "STUN";
        if (turnConfig.urls.indexOf("turn:") !== 0) resolve("STUN");
      } else return;
    };
  });
}

export default async rtcConfiguration => {
  await checkTurnOrStun({ urls: [rtcConfiguration.iceServers[0].urls[0]] })
    .then(function(result) {
      console.log(
        result ? "YES, Server active as " + result : "NO, server not active"
      );
    })
    .catch(console.error.bind(console));

  await checkTurnOrStun({
    urls: [rtcConfiguration.iceServers[0].urls[1]],
    credential: rtcConfiguration.iceServers[0].credential,
    username: rtcConfiguration.iceServers[0].username
  })
    .then(function(result) {
      console.log(
        result ? "YES, Server active as " + result : "NO, server not active"
      );
    })
    .catch(console.error.bind(console));
};
