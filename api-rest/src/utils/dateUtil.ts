export class DateUtil {
  static dateRange(startDate: string, endDate: string) {
    var start = startDate.split('-');
    var end = endDate.split('-');
    var startYear = parseInt(start[1]);
    var endYear = parseInt(end[1]);
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
      var endMonth = i != endYear ? 11 : parseInt(end[0]) - 1;
      var startMon = i === startYear ? parseInt(start[0]) - 1 : 0;
      for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
        var month = j + 1;
        var displayMonth = month < 10 ? '0' + month : month;
        dates.push([displayMonth, i].join('-'));
      }
    }
    return "'" + dates.join("','") + "'"
  }
}
