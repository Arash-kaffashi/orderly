import orderly from "./index";

let employes = ["Arash", "Payam", "Ana", "Jean", "Juan"],
  options = {
    employes,
    scale: {
      type: "week",
      from: "Segunda-feira",
      until: "Quinta-feira",
      duration: { days: 1 },
      startsAt: { hours: 12 }
    },
    starter: {
      employe: "Arash",
      day: "2018-01-18"
    }
  },
  dds = new orderly(options);

test("onDuty at Friday", () => {
  expect(dds.onDutyAt("2018-01-19 11:59")).toEqual("Arash");
});

test("onDuty at Saturday", () => {
  expect(dds.onDutyAt("2018-01-20")).toBeNull();
});

test("onDuty at Sunday", () => {
  expect(dds.onDutyAt("2018-01-21")).toBeNull();
});

test("onDuty at Monday", () => {
  expect(dds.onDuty("2018-01-22")).toEqual([
    {
      employe: "Payam",
      start: "22/01/2018 12:00",
      end: "23/01/2018 12:00"
    }
  ]);
});

test("onDuty at Tuesday", () => {
  expect(dds.onDuty("2018-01-23")).toEqual([
    {
      employe: "Payam",
      start: "22/01/2018 12:00",
      end: "23/01/2018 12:00"
    },
    {
      employe: "Ana",
      start: "23/01/2018 12:00",
      end: "24/01/2018 12:00"
    }
  ]);
});

test("onDuty at Wednesday", () => {
  expect(dds.onDuty("2018-01-24")).toEqual([
    {
      employe: "Ana",
      start: "23/01/2018 12:00",
      end: "24/01/2018 12:00"
    },
    {
      employe: "Jean",
      start: "24/01/2018 12:00",
      end: "25/01/2018 12:00"
    }
  ]);
});

test("onDuty at Thursday", () => {
  expect(dds.onDuty("2018-01-25")).toEqual([
    {
      employe: "Jean",
      start: "24/01/2018 12:00",
      end: "25/01/2018 12:00"
    },
    {
      employe: "Juan",
      start: "25/01/2018 12:00",
      end: "26/01/2018 12:00"
    }
  ]);
});

test("onDuty at Friday", () => {
  expect(dds.onDuty("2018-01-26")).toEqual([
    {
      employe: "Juan",
      start: "25/01/2018 12:00",
      end: "26/01/2018 12:00"
    }
  ]);
});

test("get until the next day", () => {
  expect(
    dds.onDuty("2018-01-22", {
      days: 1
    })
  ).toEqual([
    {
      employe: "Payam",
      start: "22/01/2018 12:00",
      end: "23/01/2018 12:00"
    },
    {
      employe: "Ana",
      start: "23/01/2018 12:00",
      end: "24/01/2018 12:00"
    }
  ]);
});

test("get until the next week", () => {
  expect(
    dds.onDuty("2018-01-22", {
      weeks: 1
    })
  ).toEqual([
    {
      employe: "Payam",
      start: "22/01/2018 12:00",
      end: "23/01/2018 12:00"
    },
    {
      employe: "Ana",
      start: "23/01/2018 12:00",
      end: "24/01/2018 12:00"
    },
    {
      employe: "Jean",
      start: "24/01/2018 12:00",
      end: "25/01/2018 12:00"
    },
    {
      employe: "Juan",
      start: "25/01/2018 12:00",
      end: "26/01/2018 12:00"
    },
    {
      employe: "Arash",
      start: "29/01/2018 12:00",
      end: "30/01/2018 12:00"
    }
  ]);
});

test('Skip "Payam" at 22/01/2018', () => {
  let opt = Object.assign({}, options, {
    exceptions: { Payam: [{ date: "2018-01-22 12:00", type: "skip" }] }
  });
  expect(new orderly(opt).onDutyAt("2018-01-22 12:00")).toEqual("Ana");
});

test('Replace "Payam" by "Arash" at 22/01/2018', () => {
  let opt = Object.assign({}, options, {
    exceptions: {
      Payam: [{ date: "2018-01-22 12:00", type: "replace", by: "Arash" }]
    }
  });
  expect(new orderly(opt).onDutyAt("2018-01-22 12:00")).toEqual("Arash");
});

test.only("ha", () => {
  console.log(dds.onDuty("2018-01-18", { week: 1 }));
});
