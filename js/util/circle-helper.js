/*global tau */
/*jslint unparam: true */
(function(tau) {
    var page,
        elScroller,
        headerHelper;

    if (tau.support.shape.circle) {
        document.addEventListener("pagebeforeshow", function (e) {
            page = e.target;
            elScroller = page.querySelector(".ui-scroller");

            if (elScroller) {
                elScroller.setAttribute("tizen-circular-scrollbar", "");
            }

            headerHelper = tau.helper.HeaderMarqueeStyle.create(page, {});
        });

        document.addEventListener("pagebeforehide", function (e) {
            headerHelper.destroy();
            headerHelper = null;

            if(elScroller) {
                elScroller.removeAttribute("tizen-circular-scrollbar");
            }
        });
    }
}(tau));
