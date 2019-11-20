module.exports = class Regime {
  constructor(
    params = {
      startMonth: 1,
      endMonth: 1,
      startDay: 1,
      endDay: -1,
      regimeZ: "Z1",
      regimeM: "M1",
      regimeQAB: "A"
    }
  ) {
    const {
      endMonth,
      startMonth,
      startDay,
      endDay,
      regimeZ,
      regimeM,
      regimeQAB
    } = params;
    this.startMonth = startMonth;
    this.endMonth = endMonth;
    this.startDay = startDay;
    this.endDay = endDay;
    this.regimeZ = regimeZ;
    this.regimeM = regimeM;
    this.regimeQAB = regimeQAB;
  }

  serialized() {
    return {
      startMonth: this.startMonth,
      endMonth: this.endMonth,
      startDay: this.startDay,
      endDay: this.endDay,
      regimeZ: this.regimeZ,
      regimeM: this.regimeM,
      regimeQAB: this.regimeQAB
    };
  }
};
