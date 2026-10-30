sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], (Controller,History) => {
    "use strict";

    return Controller.extend("bookscapmfreestyleui5.controller.View2", {

        onInit(){
            this.getOwnerComponent().getRouter().getRoute('RouteView2').attachPatternMatched(this._onObjMatched,this);
            //this.getOwnerComponent().getRouter().getRoute("RouteView2").attachMatched(this._onMatched,this)
        },
        _onObjMatched(oEvent){
            const bookId = oEvent.getParameter('arguments').ID;
            var sPath = `/BooksSet(ID=${bookId})`;
            this.getView().bindElement({
                path : sPath,
                parameters : {
                    $expand : 'chapters'
                }
            })
        },
        _onMatched : function(){
            debugger;
        },
        _backToView1 : function(oEvent){
            //window.history.go(-1);
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if(sPreviousHash !== undefined){
                window.history.go(-1);
            }else{ //Fallback
                this.getOwnerComponent().getRoute.navTo("Home",{},true);
            }
        },
        _cancelToHome : function(){
            //Reset Model Changes
            this.getView().getModel().resetChanges();
            //Replace Hash
            sap.ui.core.routing.HashChanger.getInstance().replaceHash('');
        },
        


    });
});