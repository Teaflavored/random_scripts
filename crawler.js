(function(){
  var kissMangaParams = {
    listingClass: "listing"
  };
  var currentPage = window.location.href;

  // var onInitFs = function (fs) {
  //   debugger
  // };
  //
  // var errorHandler = function (fs) {
  //   debugger
  // };
  //
  // window.webkitStorageInfo.requestQuota(
  //   window.PERSISTENT,
  //   1024*1024,
  //   function (grantedBytes) {
  //     window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
  //   },
  //   function (e) {
  //     alert(e);
  //   }
  // );

  var Crawler = new (function (params) {
    var mangaUrlsToParse,
      listingClass = params.listingClass,
      urls = [],
      ajaxParams,
      imageUrls = {

      };

      String.prototype.matchAll = function(regexp) {
      var matches = [];
      this.replace(regexp, function() {
        var arr = ([]).slice.call(arguments, 0);
        var extras = arr.splice(-2);
        arr.index = extras[0];
        arr.input = extras[1];
        matches.push(arr);
      });
      return matches.length ? matches : null;
    };

    var parsePageAndGetImageUrls = function () {
      for (var i = 0; i < 1; i++) {
        $.get(urls[0], function (data) {
          console.log("hi");
          var doc = data;
          var jqueryData = $(doc);
          $.each(jqueryData, function (idx, el) {
            var $el = $(el);
            var elHtml = $el.html();
            var match;
            var regexp = /\.push\(\"(.*)\"\)/g;
            if ($el.is("script") && elHtml.match(/\d+\.png/)) {
              if (!imageUrls[i]) {
                imageUrls[i] = [];
              }
                match = regexp.exec(elHtml);
                while( match != null) {
                  imageUrls[i].push ( match[1] );
                  regexp.lastIndex = match.index + 1;
                  match = regexp.exec(elHtml);
                }
            }
          });
          downloadPhotos();
        });
      }
    };

    var downloadPhotos = function () {
      var anchorTag,
          pages,
          chapter;
      for (chapter in imageUrls) {
        pages = imageUrls[chapter];
        for (var i = 0; i < pages.length; i++) {
          anchorTag = $("<a class='auster-download-links' href='" + pages[i] +"' download='" + "Chapter_" + chapter + "_" + i + ".jpg" + "' target='_blank'></a>");
          $("body").append(anchorTag);
        }
      }

      $.each($(".auster-download-links"), function(idx, el){
        window.setTimeout(function(){
          // el.click();
          $(el).css({
            "display" : "block",
            "width" : "100%",
            "height" : "200px",
            "background" : "blue",
          })
        }, 100);
      });
    };

    var getUrlsKissManga = function () {
      var allLinks,
          docList;
      if (window.jQuery && window.$) {
        allLinks = $("." + listingClass).find("a");
        $.each(allLinks, function (idx, el) {
          urls.push($(el).attr("href"));
        });
      } else {
        docList = document.getElementsByClassName(listingClass);
        if (docList != null && docList[0]) {
          allLinks = docList[0].getElementsByTagName("a");
          if (allLinks.length > 0) {
            for (var i = 0; i < allLinks.length; i++ ) {
              urls.push(allLinks[i].getAttribute("href"));
            }
          }
        }
      }
    };

    this.run = function () {
      getUrlsKissManga();
      parsePageAndGetImageUrls();
    };
  })(kissMangaParams);

  Crawler.run();
})();
