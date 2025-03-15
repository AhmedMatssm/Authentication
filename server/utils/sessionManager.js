class SessionManager {
    constructor(){
        if(SessionManager.instance){
            return SessionManager.instance;
        }
        this.sessions = new Map() // تخزين الجلسات المستخدم
        SessionManager.instance = this;
    }

    // start new session
    startSession(userId, token){
        this.sessions.set(userId, token);
        console.log(`session started for user: ${userId}`);
    }

    // finished session
    endSession(userId, token){
        return this.sessions.get(userId) === token;
    }
}

// export copy session 
const sessionManager = new SessionManager();
Object.freeze(sessionManager); // block update in copy

module.exports = sessionManager;
