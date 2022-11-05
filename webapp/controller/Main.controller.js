sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("anubhav.barcode.articlecountapp.controller.Main", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
            },
            Login: function(){
                this.oRouter.navTo("ArticleMaintenance");
            }
        });
    });
