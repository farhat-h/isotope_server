const regex = /^(.*?)-?(A\d)-(.*)$/
class Major {

  constructor(item = HTMLOptionElement) {
    this.id = item.value;
    this.fullName = item.textContent;
    let parts = regex.exec(this.fullName);
    if (parts === null) {
      parts = this.fullName.split("-");
      this.majorName = parts[0];
      this.year = parts[1];
      this.year = parts[2];
    } else {
      this.majorName = parts[1];
      this.year = parts[2];
      this.group = parts[3];
    }

  }

  serialized() {
    return {
      majorId: this.id,
      year: this.year,
      group: this.group,
      fullName: this.fullName,
      majorName: this.majorName
    }
  }
}

module.exports = Major;
