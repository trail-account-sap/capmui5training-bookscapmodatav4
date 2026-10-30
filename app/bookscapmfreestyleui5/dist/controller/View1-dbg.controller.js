//const { action } = require("@sap/cds/lib/core/classes");

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
    "../model/formatter" //or try with bookscapmfreestyleui5.model.formatter
], (Controller, MessageBox, History, formatter) => {
    "use strict";

    return Controller.extend("bookscapmfreestyleui5.controller.View1", {
        formatter: formatter,
        onInit() {
            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel, 'book');

            //This oTable and oBinding are used for only filters and sortes here.
            var oTable = this.getView().byId("booksTable");
            var oBinding = oTable.getBinding('items');

            /* 
            
            // Filter Logic OData V4
            var aFilter = [
                new sap.ui.model.Filter('price','LT',100)
            ]
            oBinding.filter(aFilter); 
            
            */

            /* 

            //Sorter Function
            //new sap.ui.model.Sorter(sPath, bDescending, vGroup)
            var oSorter = new sap.ui.model.Sorter('price', false);
            oBinding.sort(oSorter);

             */

            //Router Logic
            this.getOwnerComponent().getRouter().attachRoutePatternMatched(this._onAnyRouteMatched, this);

        },
        _onAnyRouteMatched: function (oEvent) {
            debugger;
            const name = oEvent.getParameter('name');
            const oArg = oEvent.getParameter('arguments');
            //MessageBox.information(`name : ${name}\nArguments : ${oArg}`);
        },
        async _showChapters(oEvent) {
            //sap.m.MessageToast.show('clicked');
            var oModel = this.getView().getModel('book');
            var oBookCtx = oEvent.getParameter('listItem').getBindingContext('book');
            if (!oBookCtx) return;
            var sId = oBookCtx.getProperty('ID');
            var sPath = `/BooksSet(ID=${sId})`;
            //Bind context with sPath
            var oCtxBinding = oModel.bindContext(sPath, null, {
                $expand: 'chapters'
            });

            var oObj = await oCtxBinding.requestObject();
            var aChapters = (oObj && oObj.chapters) ? oObj.chapters : [];

            this.getView().setModel(new sap.ui.model.json.JSONModel(aChapters), 'ch');

        },

        onItemPress(oEvent) {
            const oCtx = oEvent.getSource().getBindingContext('book');
            const oObj = oCtx.getObject();
            this.getOwnerComponent().getRouter().navTo("RouteView2", {
                ID: oObj.ID
            })
            //this.getOwnerComponent().getRouter().navTo("RouteView2");

        },
        async _CreateNewRecord() {
            var oModel = this.getView().getModel('book');
            var sGroupId = 'bookcud';
            var oPayload = {
                "title": "Rich Dad Poor Dad",
                "author": "Robert Kiyosaki",
                "price": 2,
                "publishedDate": "2026-10-14T10:45:00Z",
                "gender": "M",
                "ageGroup": "Adult",
            };
            var oItemsBinding = this.byId('booksTable').getBinding('items');
            oItemsBinding.create(oPayload);
            await oModel.submitBatch(sGroupId);
            /* .then(x => {
                oItemsBinding.refresh(); //Optional in V4
            })
            .catch(err => {
                sap.m.MessageBox.error(err.message || 'Error While creating thie entry');
            }); */
        },
        async _updateExistingRecord() {
            var oModel = this.getView().getModel('book');
            var oTable = this.byId("booksTable");
            var oItem = oTable.getSelectedItem();
            var sGroupId = 'bookcud';
            if (!oItem) {
                sap.m.MessageToast.show("Please select a book and try updating it");
                return ""
            }
            var oCtx = oItem.getBindingContext('book'); //OData V4 Context
            debugger;
            //1 Change the property of an entry
            oCtx.setProperty('price', 10000);
            oCtx.setProperty('title', 'NEW TITLE***************');
            //2 Send to backend (PATHCH)
            await oModel.submitBatch(sGroupId)
                .then(x => {
                    sap.m.MessageToast.show('Updated');
                })
                .catch(err => {
                    sap.m.MessageToast.show(err.message || "Error While updating this record");
                })

        },
        async _deleteExistingRecord() {
            var sGroupId = 'bookcud';
            var oTable = this.byId("booksTable");
            var oItem = oTable.getSelectedItem();
            if (!oItem) {
                sap.m.MessageToast.show("Select an item before proceed to delete");
                return;
            }
            var oCtx = oItem.getBindingContext('book');
            var oModel = this.getView().getModel('book');
            var title = oCtx.getObject().title;
            MessageBox.confirm(`Are you sure to Delete ${title}?`, {
                actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.DELETE,
                onClose: async (sAction) => {
                    if (sAction !== MessageBox.Action.DELETE) return;
                    try {
                        oCtx.delete(sGroupId);
                        await oModel.submitBatch(sGroupId);
                        MessageBox.information("Deleted");

                    } catch (err) {
                        MessageBox.error(err.message || "Error while deleting this record");

                    }
                }
            })
        },

        async _batchUpdate() {
            var oModel = this.getView().getModel('book');
            var sGroupId = 'bookcud';
            var oPayload1 = {
                "title": "Pride and Prejudice",
                "author": "Jane Austen",
                "price": 99999,
                "publishedDate": "2026-10-14T10:45:00Z",
                "gender": "M",
                "ageGroup": "Adult",
            };
            var oPayload2 = {
                "title": "The Hobbit",
                "author": "J.R.R. Tolkien",
                "price": 11111,
                "publishedDate": "2026-10-14T10:45:00Z",
                "gender": "F",
                "ageGroup": "Kids",
            };
            var oItemBinding = this.byId("booksTable").getBinding("items");
            oItemBinding.create(oPayload1, { groupId: sGroupId });
            oItemBinding.create(oPayload2, { groupId: sGroupId });

            try {
                await oModel.submitBatch(sGroupId);
                MessageBox.information(`2 Records (${oPayload1.title},${oPayload2.title}) has been created in one $Batch`);

            } catch (err) {
                MessageBox.error(err.message || 'Error while creating data in Batch Update');
            }

        },
        async _createFragment() {
            if (!this._oCreateDialog) {
                this._oCreateDialog = await this.loadFragment({
                    name: 'bookscapmfreestyleui5.fragments.createFragment'
                });
                this.getView().addDependent(this._oCreateDialog);
            }
            const oCreateModel = new sap.ui.model.json.JSONModel({
                newBook: {
                    title: '',
                    author: '',
                    price: null,
                    publishedDate: null
                }
            });
            this.getView().setModel(oCreateModel, 'create');
            this._oCreateDialog.open();
        },
        onCancelCreate() {
            this._oCreateDialog.close();
        },
        async onSaveBook() {
            var oModel = this.getView().getModel('book');
            var oCreateModel = this.getView().getModel('create');
            var oPayload = structuredClone(oCreateModel.getProperty('/newBook'));
            //Basic Validation
            if (!oPayload.title || !oPayload.author) {
                //alert("Title and Author should not empty");
                MessageBox.warning("Title and Author are required");
                return;
            }
            var sGroupId = 'bookcud';
            try {
                const oListBinding = oModel.bindList('/BooksSet');
                const oContext = oListBinding.create(oPayload, {
                    groupId: sGroupId
                });
                await oModel.submitBatch(sGroupId);
                await oContext.created();
                MessageBox.success('A Book entry has been created successfully');
                this._oCreateDialog.close();
                oCreateModel.setProperty('/newBook', { 'title': '', 'author': '', 'price': null, 'publishedDate': null });
                this.byId('booksTable').getBinding('items').refresh();



            } catch (err) {
                sap.m.MessageToast.show('Hey');
                MessageBox.error(err?.message || "Error while a book entry");
            }
        },
        _headerItemCrud: async function () {
            const oModel = this.getView().getModel('book');
            const sGroupId = 'bookcud';
            var oPayload = {
                title: "The Greatness Guide",
                author: "Robin Sharm",
                price: 100.22,
                publishedDate: "2026-10-18T00:00:00Z",
                chapters: [
                    {
                        title: "3AM Club",
                        pages: 25
                    },
                    {
                        title: "4AM Club",
                        pages: 11
                    },
                    {
                        title: "5AM Club",
                        pages: 29
                    },
                    {
                        title: "6AM Club",
                        pages: 5
                    },
                    {
                        title: "7AM Club",
                        pages: 91
                    }
                ]
            };
            try {
                var oBookBinding = oModel.bindList('/BooksSet');
                var oContext = oBookBinding.create(oPayload, { groupId: sGroupId });
                await oModel.submitBatch(sGroupId);
                await oContext.created();
                MessageBox.success("JSON Deep Insert Success with Book and Chapters as Header Items");
                this.byId('booksTable').getBinding('items').refresh();

            } catch (err) {
                sap.m.MessageToast(err?.message || "Error While performing JSON Deep Insert/Header Item CRUD");
            }
        },
        _backHome: function (oEVent) {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("Home", {}, true);
            }
        },
        _onBookValueHelp: async function () {
            //sap.m.MessageToast.show('No Value Helps Available Right Now. Try again later');
            if (!this._booksFrag) {
                this._booksFrag = await this.loadFragment({
                    name: 'bookscapmfreestyleui5.fragments.booksVH'
                });
                this.getView().addDependent(this._booksFrag);
            }
            this._booksFrag.open();
        },
        onCancelBookVH: function () {
            this._booksFrag.close();
        },
        onBooksRowPress: function (oEvent) {
            var oBookTitle = oEvent.getSource().getBindingContext('book').getObject().title;
            //sap.m.MessageToast.show(oBookTitle);
            this.byId('idBooksVH').setValue(oBookTitle);
            this._booksFrag.close();
            this.byId('booksTable').getBinding('items').filter(new sap.ui.model.Filter('title', 'Contains', oBookTitle));

        },
        _resetBooksTable: function () {
            this.byId('idBooksVH').setValue('');
            this.byId('booksTable').getBinding('items').filter([]);
        },
        onSearch(oEvent) {
            //sap.m.MessageToast.show('Search');
            var val = this.byId('idSearchValue').getValue().trim();
            if (val && val.length >= 3) {
                this.byId('booksTable').getBinding('items').filter(new sap.ui.model.Filter('title', 'Contains', val));
            } else {
                this.byId('booksTable').getBinding('items').filter([]);
            }

        }

    });
});