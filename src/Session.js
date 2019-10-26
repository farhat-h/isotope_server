module.exports = class Session {
    constructor(params = { time: "DEFAULT_TIME", subject: "DEFAULT_SUBJECT", professor: "DEFAULT_PROFESSOR", type: "DEFAULT_TYPE", room: "DEFAULT_ROOM", regime: "DEFAULT_REGIME", subGroup: "DEFAULT_SUBGROUP", majorId: "GROUP_KEY" }) {
        this.time = params.time;
        this.subject = params.subject;
        this.professor = params.professor;
        this.type = params.type;
        this.room = params.room;
        this.regime = params.regime;
        this.subGroup = params.subGroup;
        this.majorId = params.majorId;
    }
}