


if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}

//Html编码获取Html转义实体
function htmlEncode(value){
  return $('<div/>').text(value).html();
}

//Html解码获取Html实体
function htmlDecode(value){
  return $('<div/>').html(value).text();
}