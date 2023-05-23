"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SessionState;
(function (SessionState) {
    SessionState[SessionState["Pending"] = 0] = "Pending";
    SessionState[SessionState["WaitingForSessionId"] = 1] = "WaitingForSessionId";
    SessionState[SessionState["LoadingSession"] = 2] = "LoadingSession";
    SessionState[SessionState["Listening"] = 3] = "Listening";
})(SessionState || (SessionState = {}));
exports.default = SessionState;
