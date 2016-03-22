
/** matchs indexes **/
db.getCollection("matchs").ensureIndex({
  "_id": NumberInt(1)
},[

]);


/** matchs records **/
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784d2"),
  "category": "GROUPE",
  "categoryName": "GROUPEA",
  "dateDeadLineBet": "2016-06-10T17:00:00Z",
  "dateMatch": "2016-06-10T19:00:00Z",
  "key": "GROUPEA_FRA_ROU",
  "libteamA": "FRANCE",
  "libteamB": "ROUMANIE",
  "resultA": "",
  "resultB": "",
  "teamA": "FRA",
  "teamB": "ROU"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784d3"),
  "category": "GROUPE",
  "categoryName": "GROUPEA",
  "dateDeadLineBet": "2016-06-11T11:00:00Z",
  "dateMatch": "2016-06-11T13:00:00Z",
  "key": "GROUPEA_ALB_SWI",
  "libteamA": "ALBANIE",
  "libteamB": "SUISSE",
  "resultA": "",
  "resultB": "",
  "teamA": "ALB",
  "teamB": "SWI"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784d4"),
  "category": "GROUPE",
  "categoryName": "GROUPEB",
  "dateDeadLineBet": "2016-06-11T14:00:00Z",
  "dateMatch": "2016-06-11T16:00:00Z",
  "key": "GROUPEB_WAL_SLO",
  "libteamA": "PAYS DE GALLES",
  "libteamB": "SLOVAQUIE",
  "resultA": "",
  "resultB": "",
  "teamA": "WAL",
  "teamB": "SLO"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784d5"),
  "category": "GROUPE",
  "categoryName": "GROUPEB",
  "dateDeadLineBet": "2016-06-11T17:00:00Z",
  "dateMatch": "2016-06-11T19:00:00Z",
  "key": "GROUPEB_ENG_RUS",
  "libteamA": "ANGLETERRE",
  "libteamB": "RUSSIE",
  "resultA": "",
  "resultB": "",
  "teamA": "ENG",
  "teamB": "RUS"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784d6"),
  "category": "GROUPE",
  "categoryName": "GROUPED",
  "dateDeadLineBet": "2016-06-12T11:00:00Z",
  "dateMatch": "2016-06-12T13:00:00Z",
  "key": "GROUPED_TUR_CRO",
  "libteamA": "TURQUIE",
  "libteamB": "CROATIE",
  "resultA": "",
  "resultB": "",
  "teamA": "TUR",
  "teamB": "CRO"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784d7"),
  "category": "GROUPE",
  "categoryName": "GROUPEC",
  "dateDeadLineBet": "2016-06-12T14:00:00Z",
  "dateMatch": "2016-06-12T16:00:00Z",
  "key": "GROUPEC_POL_IRN",
  "libteamA": "POLOGNE",
  "libteamB": "IRLANDE DU NORD",
  "resultA": "",
  "resultB": "",
  "teamA": "POL",
  "teamB": "IRN"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784d8"),
  "category": "GROUPE",
  "categoryName": "GROUPEC",
  "dateDeadLineBet": "2016-06-12T17:00:00Z",
  "dateMatch": "2016-06-12T19:00:00Z",
  "key": "GROUPEC_ALL_UKR",
  "libteamA": "ALLEMAGNE",
  "libteamB": "UKRAINE",
  "resultA": "",
  "resultB": "",
  "teamA": "ALL",
  "teamB": "UKR"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784d9"),
  "category": "GROUPE",
  "categoryName": "GROUPED",
  "dateDeadLineBet": "2016-06-13T11:00:00Z",
  "dateMatch": "2016-06-13T13:00:00Z",
  "key": "GROUPED_ESP_TCQ",
  "libteamA": "ESPAGNE",
  "libteamB": "REP TCHEQUE",
  "resultA": "",
  "resultB": "",
  "teamA": "ESP",
  "teamB": "TCQ"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784da"),
  "category": "GROUPE",
  "categoryName": "GROUPEE",
  "dateDeadLineBet": "2016-06-13T14:00:00Z",
  "dateMatch": "2016-06-13T16:00:00Z",
  "key": "GROUPEE_IRL_SWE",
  "libteamA": "IRLANDE",
  "libteamB": "SUEDE",
  "resultA": "",
  "resultB": "",
  "teamA": "IRL",
  "teamB": "SWE"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784db"),
  "category": "GROUPE",
  "categoryName": "GROUPEE",
  "dateDeadLineBet": "2016-06-13T17:00:00Z",
  "dateMatch": "2016-06-13T19:00:00Z",
  "key": "GROUPEE_BEL_ITA",
  "libteamA": "BELGIQUE",
  "libteamB": "ITALIE",
  "resultA": "",
  "resultB": "",
  "teamA": "BEL",
  "teamB": "ITA"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784dc"),
  "category": "GROUPE",
  "categoryName": "GROUPEF",
  "dateDeadLineBet": "2016-06-14T14:00:00Z",
  "dateMatch": "2016-06-14T16:00:00Z",
  "key": "GROUPEF_AUT_HON",
  "libteamA": "AUTRICHE",
  "libteamB": "HONGRIE",
  "resultA": "",
  "resultB": "",
  "teamA": "AUT",
  "teamB": "HON"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784dd"),
  "category": "GROUPE",
  "categoryName": "GROUPEF",
  "dateDeadLineBet": "2016-06-14T17:00:00Z",
  "dateMatch": "2016-06-14T19:00:00Z",
  "key": "GROUPEF_POR_ISL",
  "libteamA": "PORTUGAL",
  "libteamB": "ISLANDE",
  "resultA": "",
  "resultB": "",
  "teamA": "POR",
  "teamB": "ISL"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784de"),
  "category": "GROUPE",
  "categoryName": "GROUPEB",
  "dateDeadLineBet": "2016-06-15T11:00:00Z",
  "dateMatch": "2016-06-15T13:00:00Z",
  "key": "GROUPEB_RUS_SLO",
  "libteamA": "RUSSIE",
  "libteamB": "SLOVAQUIE",
  "resultA": "",
  "resultB": "",
  "teamA": "RUS",
  "teamB": "SLO"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784df"),
  "category": "GROUPE",
  "categoryName": "GROUPEA",
  "dateDeadLineBet": "2016-06-15T14:00:00Z",
  "dateMatch": "2016-06-15T16:00:00Z",
  "key": "GROUPEA_ROU_SWI",
  "libteamA": "ROUMANIE",
  "libteamB": "SUISSE",
  "resultA": "",
  "resultB": "",
  "teamA": "ROU",
  "teamB": "SWI"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784e0"),
  "category": "GROUPE",
  "categoryName": "GROUPEA",
  "dateDeadLineBet": "2016-06-15T17:00:00Z",
  "dateMatch": "2016-06-15T19:00:00Z",
  "key": "GROUPEA_FRA_ALB",
  "libteamA": "FRANCE",
  "libteamB": "ALBANIE",
  "resultA": "",
  "resultB": "",
  "teamA": "FRA",
  "teamB": "ALB"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784e1"),
  "category": "GROUPE",
  "categoryName": "GROUPEB",
  "dateDeadLineBet": "2016-06-16T11:00:00Z",
  "dateMatch": "2016-06-16T13:00:00Z",
  "key": "GROUPEB_ENG_WAL",
  "libteamA": "ANGLETERRE",
  "libteamB": "PAYS DE GALLES",
  "resultA": "",
  "resultB": "",
  "teamA": "ENG",
  "teamB": "WAL"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784e2"),
  "category": "GROUPE",
  "categoryName": "GROUPEC",
  "dateDeadLineBet": "2016-06-16T14:00:00Z",
  "dateMatch": "2016-06-16T16:00:00Z",
  "key": "GROUPEC_UKR_IRN",
  "libteamA": "UKRAINE",
  "libteamB": "IRLANDE DU NORD",
  "resultA": "",
  "resultB": "",
  "teamA": "UKR",
  "teamB": "IRN"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784e3"),
  "category": "GROUPE",
  "categoryName": "GROUPEC",
  "dateDeadLineBet": "2016-06-16T17:00:00Z",
  "dateMatch": "2016-06-16T19:00:00Z",
  "key": "GROUPEC_ALL_POL",
  "libteamA": "ALLEMAGNE",
  "libteamB": "POLOGNE",
  "resultA": "",
  "resultB": "",
  "teamA": "ALL",
  "teamB": "POL"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784e4"),
  "category": "GROUPE",
  "categoryName": "GROUPEE",
  "dateDeadLineBet": "2016-06-17T11:00:00Z",
  "dateMatch": "2016-06-17T13:00:00Z",
  "key": "GROUPEE_ITA_SWE",
  "libteamA": "ITALIE",
  "libteamB": "SUEDE",
  "resultA": "",
  "resultB": "",
  "teamA": "ITA",
  "teamB": "SWE"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784e5"),
  "category": "GROUPE",
  "categoryName": "GROUPED",
  "dateDeadLineBet": "2016-06-17T14:00:00Z",
  "dateMatch": "2016-06-17T16:00:00Z",
  "key": "GROUPED_TCQ_CRO",
  "libteamA": "REP TCHEQUE",
  "libteamB": "CROATIE",
  "resultA": "",
  "resultB": "",
  "teamA": "TCQ",
  "teamB": "CRO"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784e6"),
  "category": "GROUPE",
  "categoryName": "GROUPED",
  "dateDeadLineBet": "2016-06-17T17:00:00Z",
  "dateMatch": "2016-06-17T19:00:00Z",
  "key": "GROUPED_ESP_TUR",
  "libteamA": "ESPAGNE",
  "libteamB": "TURQUIE",
  "resultA": "",
  "resultB": "",
  "teamA": "ESP",
  "teamB": "TUR"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784e7"),
  "category": "GROUPE",
  "categoryName": "GROUPEE",
  "dateDeadLineBet": "2016-06-18T11:00:00Z",
  "dateMatch": "2016-06-18T13:00:00Z",
  "key": "GROUPEE_BEL_IRL",
  "libteamA": "BELGIQUE",
  "libteamB": "IRLANDE",
  "resultA": "",
  "resultB": "",
  "teamA": "BEL",
  "teamB": "IRL"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784e8"),
  "category": "GROUPE",
  "categoryName": "GROUPEF",
  "dateDeadLineBet": "2016-06-18T14:00:00Z",
  "dateMatch": "2016-06-18T16:00:00Z",
  "key": "GROUPEF_ISL_HON",
  "libteamA": "ISLANDE",
  "libteamB": "HONGRIE",
  "resultA": "",
  "resultB": "",
  "teamA": "ISL",
  "teamB": "HON"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784e9"),
  "category": "GROUPE",
  "categoryName": "GROUPEF",
  "dateDeadLineBet": "2016-06-18T17:00:00Z",
  "dateMatch": "2016-06-18T19:00:00Z",
  "key": "GROUPEF_POR_AUT",
  "libteamA": "PORTUGAL",
  "libteamB": "AUTRICHE",
  "resultA": "",
  "resultB": "",
  "teamA": "POR",
  "teamB": "AUT"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784ea"),
  "category": "GROUPE",
  "categoryName": "GROUPEA",
  "dateDeadLineBet": "2016-06-19T17:00:00Z",
  "dateMatch": "2016-06-19T19:00:00Z",
  "key": "GROUPEA_ROU_ALB",
  "libteamA": "ROUMANIE",
  "libteamB": "ALBANIE",
  "resultA": "",
  "resultB": "",
  "teamA": "ROU",
  "teamB": "ALB"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784eb"),
  "category": "GROUPE",
  "categoryName": "GROUPEA",
  "dateDeadLineBet": "2016-06-19T17:00:00Z",
  "dateMatch": "2016-06-19T19:00:00Z",
  "key": "GROUPEA_SWI_FRA",
  "libteamA": "SUISSE",
  "libteamB": "FRANCE",
  "resultA": "",
  "resultB": "",
  "teamA": "SUI",
  "teamB": "FRA"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784xx"),
  "category": "GROUPE",
  "categoryName": "GROUPEB",
  "dateDeadLineBet": "2016-06-20T17:00:00Z",
  "dateMatch": "2016-06-20T19:00:00Z",
  "key": "GROUPEB_RUS_WAL",
  "libteamA": "RUSSIE",
  "libteamB": "PAYS DE GALLES",
  "resultA": "",
  "resultB": "",
  "teamA": "RUS",
  "teamB": "WAL"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784yy"),
  "category": "GROUPE",
  "categoryName": "GROUPEB",
  "dateDeadLineBet": "2016-06-20T17:00:00Z",
  "dateMatch": "2016-06-20T19:00:00Z",
  "key": "GROUPEB_SLO_ENG",
  "libteamA": "SLOVAQUIE",
  "libteamB": "ANGLETERRE",
  "resultA": "",
  "resultB": "",
  "teamA": "SLO",
  "teamB": "ANG"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784ec"),
  "category": "GROUPE",
  "categoryName": "GROUPEC",
  "dateDeadLineBet": "2016-06-21T14:00:00Z",
  "dateMatch": "2016-06-21T16:00:00Z",
  "key": "GROUPEC_UKR_POL",
  "libteamA": "UKRAINE",
  "libteamB": "POLOGNE",
  "resultA": "",
  "resultB": "",
  "teamA": "UKR",
  "teamB": "POL"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784ed"),
  "category": "GROUPE",
  "categoryName": "GROUPEC",
  "dateDeadLineBet": "2016-06-21T14:00:00Z",
  "dateMatch": "2016-06-21T16:00:00Z",
  "key": "GROUPEC_IRN_ALL",
  "libteamA": "IRLANDE DU NORD",
  "libteamB": "ALLEMAGNE",
  "resultA": "",
  "resultB": "",
  "teamA": "IRN",
  "teamB": "ALL"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784ee"),
  "category": "GROUPE",
  "categoryName": "GROUPED",
  "dateDeadLineBet": "2016-06-21T17:00:00Z",
  "dateMatch": "2016-06-21T19:00:00Z",
  "key": "GROUPED_TCQ_TUR",
  "libteamA": "REP TCHEQUE",
  "libteamB": "TURQUIE",
  "resultA": "",
  "resultB": "",
  "teamA": "TCQ",
  "teamB": "TUR"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784ef"),
  "category": "GROUPE",
  "categoryName": "GROUPED",
  "dateDeadLineBet": "2016-06-21T17:00:00Z",
  "dateMatch": "2016-06-21T19:00:00Z",
  "key": "GROUPED_CRO_ESP",
  "libteamA": "CROATIE",
  "libteamB": "ESPAGNE",
  "resultA": "",
  "resultB": "",
  "teamA": "CRO",
  "teamB": "ESP"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784f0"),
  "category": "GROUPE",
  "categoryName": "GROUPEF",
  "dateDeadLineBet": "2016-06-22T14:00:00Z",
  "dateMatch": "2016-06-22T16:00:00Z",
  "key": "GROUPEF_ISL_AUT",
  "libteamA": "ISLANDE",
  "libteamB": "AUTRICHE",
  "resultA": "",
  "resultB": "",
  "teamA": "ISL",
  "teamB": "AUT"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784f1"),
  "category": "GROUPE",
  "categoryName": "GROUPEF",
  "dateDeadLineBet": "2016-06-22T14:00:00Z",
  "dateMatch": "2016-06-22T16:00:00Z",
  "key": "GROUPEF_HON_POR",
  "libteamA": "HONGRIE",
  "libteamB": "PORTUGAL",
  "resultA": "",
  "resultB": "",
  "teamA": "HON",
  "teamB": "POR"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784f2"),
  "category": "GROUPE",
  "categoryName": "GROUPEE",
  "dateDeadLineBet": "2016-06-22T17:00:00Z",
  "dateMatch": "2016-06-22T19:00:00Z",
  "key": "GROUPEE_ITA_IRL",
  "libteamA": "ITALIE",
  "libteamB": "IRLANDE",
  "resultA": "",
  "resultB": "",
  "teamA": "ITA",
  "teamB": "IRL"
});
db.getCollection("matchs").insert({
  "_id": ObjectId("56e1cd368abf5aba1f2784f3"),
  "category": "GROUPE",
  "categoryName": "GROUPEE",
  "dateDeadLineBet": "2016-06-22T17:00:00Z",
  "dateMatch": "2016-06-22T19:00:00Z",
  "key": "GROUPEE_SWE_BEL",
  "libteamA": "SUEDE",
  "libteamB": "BELGIQUE",
  "resultA": "",
  "resultB": "",
  "teamA": "SWE",
  "teamB": "BEL"
});
