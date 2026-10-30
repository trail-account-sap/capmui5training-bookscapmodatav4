sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"bookscapmodatav4lr/test/integration/pages/BooksSetList.gen",
	"bookscapmodatav4lr/test/integration/pages/BooksSetObjectPage.gen",
	"bookscapmodatav4lr/test/integration/pages/ChaptersSetObjectPage.gen"
], function (JourneyRunner, BooksSetListGenerated, BooksSetObjectPageGenerated, ChaptersSetObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('bookscapmodatav4lr') + '/test/flpSandbox.html#bookscapmodatav4lr-tile',
        pages: {
			onTheBooksSetListGenerated: BooksSetListGenerated,
			onTheBooksSetObjectPageGenerated: BooksSetObjectPageGenerated,
			onTheChaptersSetObjectPageGenerated: ChaptersSetObjectPageGenerated
        },
        async: true
    });

    return runner;
});

