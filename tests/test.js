var a = ['Vueling Airlines',
    '124',
    '2h25m',
    'British Airways',
    '140',
    '2h25m',
    'Iberia',
    '140',
    '2h25m',
    'easyJet',
    '142',
    '2h30m',
    'Transavia France',
    '151',
    '2h30m',
    'Transavia France',
    '151',
    '2h30m',
    'Ryanair',
    '157',
    '2h30m',
    'Aigle Azur',
    '172',
    '2h15m',
    'easyJet',
    '168',
    '2h30m',
    'Transavia France',
    '176',
    '2h30m',
    'TAP Portugal',
    '188',
    '2h25m',
    'TAP Portugal',
    '192',
    '2h25m',
    'Air France',
    '222',
    '2h30m',
    'Air France',
    '229',
    '2h30m',
    'Air France',
    '229',
    '2h30m'
];

var b = '20-11-2016';

function buildFlightsFromData(data, targetDate) {
    var result = [];
    for (var i = 0; i < data.length;) {
        var aux = data.splice(i, 3);
        result.push({ airline: aux[0], date: targetDate, price: aux[1], duration: aux[2] });
    }
    return result;
}
console.log(buildFlightsFromData(a, b));
