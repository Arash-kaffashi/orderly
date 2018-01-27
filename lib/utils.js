function capitalize(str) {
  let wordReg = "[\\u00C0-\\u1FFF\\u2C00-\\uD7FF\\w]";
  let cap = str.replace(new RegExp(wordReg + "+", "g"), function(s) {
    return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
  });

  return cap
    .replace(/\b.\S/, function(match) {
      if (new RegExp(wordReg).test(match[0])) {
        return match;
      } else {
        return match[0] + match[1].toUpperCase();
      }
    })
    .replace(/\b(D)[aeo]/g, function(match) {
      return match.toLowerCase();
    });
}

export function isBetween(instant, first, final) {
  return instant.isSameOrAfter(first) && instant.isBefore(final);
}

function isObject(obj) {
  return obj === Object(obj);
}

export function scale(scale, moment) {
  scale.duration = moment.duration(scale.duration);
  return scale;
}

export function starter(starter, { startsAt }, moment) {
  starter.day = moment(starter.day).set(startsAt);
  return starter;
}

export function exceptions(exceptions, moment) {
  let res = {};
  if (exceptions) {
    for (let employe in exceptions) {
      res[capitalize(employe)] = [];
      for (let obj of exceptions[employe]) {
        obj.date = moment(obj.date);
        res[capitalize(employe)].push(obj);
      }
    }
  }
  return res;
}

export function employes(emp, exceptions, { startsAt, duration }) {
  let len = emp.length;

  return function employesFn(index, instant) {
    let next = index >= 0 ? index % len : (index + len) % len;

    if (exceptions) {
      for (let name in exceptions) {
        if (name === capitalize(emp[next])) {
          let startTime = instant.clone().set(startsAt),
            endTime = startTime.clone().add(duration),
            exception = exceptions[name].find(({ date }) =>
              isBetween(date, startTime, endTime)
            );

          if (exception) {
            switch (exception.type) {
              case "skip":
                return employesFn(++next, instant);
                break;

              default:
                throw exception.type + " not defined";
                break;

              case "replace":
                return exception.by;
                break;
            }
          }
        }
      }
    }
    return emp[next];
  };
}

export function validRange({ from, until }, weekdays) {
  let range = weekdays.slice(
    weekdays.indexOf(from),
    weekdays.indexOf(until) + 1
  );

  return moment => !!~range.indexOf(moment.format("dddd"));
}

/* export function checkClassArgs(prop, weekdays, moment) {
  if (!("employes" in prop))
    return "Couldn't create a orderly Object, provide a 'employes' array in the object";
  if (!Array.isArray(prop.employes)) return "Employes must be an Array";
  if (!("scale" in prop) && !isObject(prop.scale))
    return "Inform the orderly scale, with the type, from, until, duration and startsAt keys and values";
  {
    let keys = ["type", "from", "until", "duration", "startsAt"];

    let missingKeys = Object.keys(prop.scale).filter(
      key => !~keys.indexOf(key)
    );

    if (missingKeys.length)
      return "Missing this keys in the scale object: " + missingKeys;

    if (prop.scale.type !== "week")
      return 'Scale "type" property is not valid, must be "week"';
    if (!~weekdays.indexOf(prop.scale.from))
      return 'Scale "from" is not a day of week';
    if (!~weekdays.indexOf(prop.scale.until))
      return 'Scale "until" is not a day of week';
    if (!moment(prop.scale.duration).isValid())
      return 'Scale "duration" is invalid';
    if (!moment(prop.scale.startsAt).isValid())
      return 'Scale "startsAt" is invalid';
  }
  if (!("starter" in prop) && !isObject(prop.starter))
    return 'Inform the orderly starter, with the name of "employe" and the start "day"';
  if (
    typeof prop.starter.employe !== "string" &&
    !~prop.employes.indexOf(prop.starter.employe)
  )
    return "Must inform the employe or the name is not in the employes array";
  if (!moment(prop.starter.day).isValid) return "Starter day is invalid";
} */
