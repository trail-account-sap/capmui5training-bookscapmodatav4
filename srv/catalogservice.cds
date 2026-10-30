using {bookscapmv4.db as db} from '../db/booksmodelv4';

service BooksLibSrv @(path: 'bookssrv') {
    //@odata.draft.enabled
    entity BooksSet   as projection on db.Books;

    entity GenderVH   as projection on db.GenderVH;
    entity AgeGroupVH as projection on db.AgeGroupVH;


    entity ChaptersSet as projection on db.Chapters;
}

annotate BooksLibSrv.BooksSet with @(UI: {
    LineItem               : [
        {
            Value: title,
            Label: 'Title'
        },
        {
            Value: author,
            Label: 'Author'
        },
        {
            Value: price,
            Label: 'Price'
        },
        {
            Value: publishedDate,
            Label: 'Published Date'
        },
        {
            Value: gender,
            Label: 'Gender'
        },
        {
            Value: ageGroup,
            Label: 'Age Group'
        }
    ],
    SelectionFields        : [
        title,
        author,
        price,
        publishedDate,
        gender,
        ageGroup
    ],
    HeaderInfo             : {
        $Type         : 'UI.HeaderInfoType',
        TypeName      : 'Book',
        TypeNamePlural: 'Books',
        Title         : {Value: title},
        Description   : {Value: author},
    },
    Facets                 : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            Target: '@UI.FieldGroup#General'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Publication Details',
            Target: '@UI.FieldGroup#Publication'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Pricing Information',
            Target: '@UI.FieldGroup#Pricing'
        }
    ],
    FieldGroup #General    : {Data: [
        {
            Label: 'Title',
            Value: title
        },
        {
            Label: 'Author',
            Value: author
        },
        {
            Label: 'Age Group',
            Value: ageGroup
        },
        {
            Label: 'Gender',
            Value: gender
        }
    ]},
    FieldGroup #Publication: {Data: [{
        Label: 'Published Date',
        Value: publishedDate
    }]},
    FieldGroup #Pricing    : {Data: [{
        Label: 'Price',
        Value: price
    }]}
});

annotate BooksLibSrv.BooksSet with {
    gender   @(Common.ValueList: {
        CollectionPath: 'GenderVH',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: gender,
                ValueListProperty: 'code'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'text'
            }
        ]
    });
    ageGroup @(Common.ValueList: {
        CollectionPath: 'AgeGroupVH',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParamaterInOut',
                LocalDataProperty: ageGroup,
                ValueListProperty: 'code'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'text'
            }
        ]
    })
};
