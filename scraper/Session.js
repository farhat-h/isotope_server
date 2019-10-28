module.exports = class Session {
    constructor(params = { day: -1, time: "DEFAULT_TIME", subject: "DEFAULT_SUBJECT", professor: "DEFAULT_PROFESSOR", type: "DEFAULT_TYPE", room: "DEFAULT_ROOM", regime: "DEFAULT_REGIME", subGroup: "DEFAULT_SUBGROUP", majorId: "GROUP_KEY" }) {
        this.time = params.time;
        this.subject = params.subject;
        this.professor = params.professor;
        this.type = params.type;
        this.room = params.room;
        this.regime = params.regime;
        this.subGroup = params.subGroup;
        this.majorId = params.majorId;
        this.day = params.day;
    }
    serialized() {
        return {
            day: this.day,
            time: this.time,
            subject: this.subject,
            professor: this.professor,
            type: this.type,
            room: this.room,
            regime: this.regime,
            subGroup: this.subGroup,
            majorId: this.majorId
        }
    }
}