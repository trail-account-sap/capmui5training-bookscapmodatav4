namespace bookscapmv4.db;

entity GenderVH {
    key code : String(1);
        text : String;
}

entity AgeGroupVH {
    key code : String;
        text : String;
}

type allgender     : String enum {
    Male = 'M';
    Female = 'F';
}

type booksagegroup : String enum {
    Kids = 'Kids';
    Adult = 'Adult';
}

type statusTxt     : String enum {
    C = 'Completed';
    I = 'InProgress';
    N = 'NotStarted'
}

entity Books {
    key ID            : UUID;
        title         : String(45);
        author        : String(45);
        price         : Decimal(10, 2);
        status        : statusTxt;
        publishedDate : DateTime;
        gender        : allgender;
        ageGroup      : booksagegroup;
        chapters      : Composition of many Chapters
                            on chapters.books = $self;

}

entity Chapters {
    key ID    : UUID;
        title : String;
        pages : Integer;
        books : Association to Books;
}
