sap.ui.define([], function () {
    "use Strict";
    return {
        //All Conditional Functions
        formatStatusIcon: function (val) {
            debugger;
            switch (val) {
                case 'C': return "sap-icon://accept"; break;
                case 'I': return "sap-icon://pending"; break;
                default: return "sap-icon://alert"

            }
        },
        formatStatusColor(status){
            switch(status){
                case "C":return 'Positive';break;
                case "I":return 'Critical';break;
                default :return 'Negative';break;
            }
        },
        formatRowHighlight(status){
            switch(status){
                case "C":return 'Success';
                case "I":return 'Warning';
                default:return 'Error';
            }
        },
        formatDate1(pubDate){
            if(!pubDate) return ""
            return new Date(pubDate).toLocaleDateString();
        },
        formatDate2(pubDate){
            if(!pubDate) return ""
            var d1 = sap.ui.core.format.DateFormat.getInstance({
                //pattern : "yyyy-MM-dd'T'HH:mm:ss"
                pattern : "MMM dd, yyyy"
            });
            return d1.format(new Date(pubDate));
        },
        formatPrice:function(price){
            if(!price) return null;
            return "$ "+Number(price*100).toFixed(2);
        },
        formatPriceBand:function(price,ageGroup){
            if(!price || !ageGroup) return price;
            if(price > 200 && ageGroup === "Kids"){
                return Number(price-((price*15)/100)).toFixed(2) ;
            }else{
                return price;
            }
        },
        formatPriceBandState: function(price,ageGroup){
            if(!price || !ageGroup) return;
            if(price > 100 && ageGroup === "Kids"){
                return "Success";
            }else{
                return "Warning";
            }
        }
    };
})