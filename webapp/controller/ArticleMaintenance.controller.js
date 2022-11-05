sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageBox'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, MessageBox) {
        "use strict";

        return Controller.extend("anubhav.barcode.articlecountapp.controller.ArticleMaintenance", {
            onInit: function () {
                this.oLocal = this.getView().getModel("local");
            },
            onBarcode: function(){
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        alert("We got a barcode\n" +
                              "Result: " + result.text + "\n" +
                              "Format: " + result.format + "\n" +
                              "Cancelled: " + result.cancelled);
                    },
                    function (error) {
                        alert("Scanning failed: " + error);
                    },
                    {
                        preferFrontCamera : true, // iOS and Android
                        showFlipCameraButton : true, // iOS and Android
                        showTorchButton : true, // iOS and Android
                        torchOn: true, // Android, launch with the torch switched on (if available)
                        saveHistory: true, // Android, save scan history (default false)
                        prompt : "Place a barcode inside the scan area", // Android
                        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                        formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                        orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                        disableAnimations : true, // iOS
                        disableSuccessBeep: false // iOS and Android
                    }
                 );
            },
            oLocal: null,
            onFetchArticle: function(oEvent){
                if(oEvent.getParameter("value")){
                    this.sArticleId = oEvent.getParameter("value");
                };
                var oDataModel = this.getView().getModel();
                var that = this;
                oDataModel.read("/ArticleMatsterSet('" + this.sArticleId + "')",{
                    success: function(data){
                        that.oLocal = that.getView().getModel("local");
                        that.oLocal.setProperty("/article", data);
                    },
                    error: function(){

                    }
                });
            },
            onBook: function(){
                var payload = {
                    "ArticleId":this.oLocal.getProperty("/article/ArticleId"),
                    "ChangedAt": "2022-05-11T00:00:00",
                    "Qtyfrom": "0.00",
                    "Qtyto": this.oLocal.getProperty("/updatedQty")
                };
                var oDataModel = this.getView().getModel();
                var that = this;
                oDataModel.create("/ArticleQtySet", payload,{
                    success: function(){
                        MessageBox.alert("The Article quantity have been counted now");
                        var oDataModel = that.getView().getModel();
                        var that2 = that;
                        oDataModel.read("/ArticleMatsterSet('" + that.sArticleId + "')",{
                            success: function(data){
                                that.oLocal = that2.getView().getModel("local");
                                that2.oLocal.setProperty("/article", data);
                            },
                            error: function(){

                            }
                        });
                    }
                });
            },
            onSelect:function(oEvent){
                debugger;
                //  selected by user stext
                var sText= oEvent.getParameter("selectedItem").getKey();
                // construct a filter object
                var oFilter = new Filter("relation", FilterOperator.EQ, sText);
                // get the select object
                var oSelect= this.getView().byId("idSelect2");
                // inject the filter inside the binding of items
                oSelect.getBinding("items").filter(oFilter);
            }, 
        });
    });
