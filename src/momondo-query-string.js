var MomondoQueryString = function(from, to, fromDate) {
    var translations = ['Search', 'TripType', 'SegNo', 'SO0', 'SD0', 'SDP0', 'AD', 'TK', 'DO', 'NA'];

    /*
    Search  - true
    TripType- 1 for 1 way, 2 for comeback uncluded, 3 for multiple
    SegNo   - 1 no return date, 2 with return date
    SO0     - From aeroport code
    SD0     - Destiny aeroport code
    SDP0    - Departure date
    AD      - Passengers
    TK      - Traveling class, usually ECO for economic
    DO      - Direct flights only?true,falseNA - Nearest aeroports ? true, false
    */

    this.attributes = {};
    this.attributes.search = "true";
    this.attributes.tripType = "1";
    this.attributes.segNo = "1";
    this.attributes.from = from;
    this.attributes.to = to;
    this.attributes.fromDate = fromDate;
    this.attributes.passengerNumber = "1";
    this.attributes.budget = "ECO";
    this.attributes.directFlight = "false";
    this.attributes.nearestAeroport = "false";

    this.toString = function() {
        var result = "",
            i = 0;
        for (var propertyName in this.attributes) {
            if (result.length > 0) {
                result = result + "&";
            }
            if (this.attributes[propertyName]) {
                result = result + translations[i] + "=" + this.attributes[propertyName];
            }
            i++;
        }
        return result;
    };
};

module.exports = MomondoQueryString;
