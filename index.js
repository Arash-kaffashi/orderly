import moment from "./node_modules/moment";
import {
  scale,
  starter,
  exceptions,
  isBetween,
  employes,
  validRange
} from "./lib/utils";

moment.locale("pt-br");

const localeData = moment.localeData("pt-br"),
  weekdays = localeData._weekdays;

export default class Orderly {
  constructor(prop) {
    this.scale = scale(prop.scale, moment);
    this.starter = starter(prop.starter, prop.scale, moment);
    this.exceptions = exceptions(prop.exceptions, moment);
    this.employes = employes(prop.employes, prop.exceptions, prop.scale);
    this.validRange = validRange(prop.scale, weekdays);
    return this;
  }
  onDutyAt(day) {
    day = moment(day);

    let diff = moment(day)
        .clone()
        .diff(this.starter.day),
      initial = this.starter.day.clone(),
      finishedDuties = 0;

    while (diff >= this.scale.duration) {
      initial.add(this.scale.duration);
      diff += diff >= 0 ? -this.scale.duration : this.scale.duration;

      if (this.validRange(initial)) finishedDuties++;
    }
    //HERE

    return !this.validRange(initial)
      ? null
      : this.employes(finishedDuties, initial);
  }
  get nowOnDuty() {
    return this.onDutyAt();
  }
  onDuty(day, range = {}) {
    {
      let key = "day" in range ? "day" : "days" in range ? "days" : null;

      if (key !== null) range[key] += 1;
      else range["days"] = 1;
    }
    let counter = this.starter.day.clone(),
      diff = moment(day).diff(counter.clone()),
      init = moment(day).startOf("day"),
      final = init.clone().add(range),
      res = [];

    counter.add(
      Math.ceil(diff / this.scale.duration) * this.scale.duration,
      "milliseconds"
    );

    // anyone worked before?
    if (init.isBefore(counter)) {
      let dayBefore = counter
        .clone()
        .subtract(this.scale.duration)
        .clone();
      if (this.validRange(dayBefore))
        res.push({
          employe: this.onDutyAt(dayBefore),
          start: dayBefore.clone().format("DD/MM/YYYY HH:mm"),
          end: dayBefore
            .clone()
            .add(this.scale.duration)
            .format("DD/MM/YYYY HH:mm")
        });
    }

    while (isBetween(counter, init, final)) {
      if (this.validRange(counter)) {
        res.push({
          employe: this.onDutyAt(counter),
          start: counter.clone().format("DD/MM/YYYY HH:mm"),
          end: counter
            .clone()
            .add(this.scale.duration)
            .format("DD/MM/YYYY HH:mm")
        });
      }
      counter.add(this.scale.duration);
    }
    return res;
  }
}
