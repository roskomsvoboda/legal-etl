module.exports = {


    extrapolation: async function () {

        console.log('GAS extrapolation!')
        // console.log(this)

        const evaluateFn = (options) => {
            try {

                var data_ajax = options.data

                var request = {...data_ajax.request,uid: Data.uid} 

                var q = {...data_ajax,request } 
        
                return $.ajax({
                    ...options,
                    data:JSON.stringify(q)
                })
    
            } catch (e) {
                return e.message
            }
        }

        const queryRequestsAct = (query) =>{
            return [
                {
                    "type": "Q",
                    "request": JSON.stringify({
                        "mode": "EXTENDED",
                        "typeRequests": [
                            {
                                "fieldRequests": [
                                    {
                                        "name": "case_user_doc_entry_date",
                                        "operator": "B",
                                        "query": "2021-01-14T00:00:00",
                                        "sQuery": "2021-09-14T00:00:00",
                                        "fieldName": "case_user_doc_entry_date"
                                    },
                                    {
                                        "name": "case_document_category_article_cat",
                                        "operator": "SEW",
                                        "query": query,
                                        "fieldName": "case_document_category_article_cat"
                                    }
                                ],
                                "mode": "AND",
                                "name": "common",
                                "typesMode": "AND"
                            }
                        ]
                    }),
                    "operator": "AND",
                    "queryRequestRole": "CATEGORIES"
                },
                {
                    "type": "Q",
                    "request":  JSON.stringify({
                        "mode": "EXTENDED",
                        "typeRequests": [
                            {
                                "name": "common",
                                "mode": "AND",
                                "typesMode": "AND",
                                "fieldRequests": [
                                    {
                                        "name": "case_user_document_num",
                                        "operator": "GE",
                                        "query": "1"
                                    }
                                ]
                            }
                        ]
                    }),
                    "operator": "AND",
                    "queryRequestRole": "FACET_QUERY###case_user_document_num###Да"
                }
    
            ]
        }

        


        let pattern_gas_find = {
                "request": {
                    "type": "MULTIQUERY",
                    "multiqueryRequest": {
                        "queryRequests": queryRequestsAct("Статья 137")
                    },
                    "sorts": [
                        {
                            "field": "score",
                            "order": "desc"
                        }
                    ],
                    "simpleSearchFieldsBundle": "default",
                    "start": 0,
                    "rows": 10,
                    "uid": "",
                    "noOrpho": false,
                    "facet": {
                        "field": [
                            "type"
                        ]
                    },
                    "facetLimit": 21,
                    "additionalFields": [
                        "court_document_documentype1",
                        "court_case_entry_date",
                        "court_case_result_date",
                        "court_subject_rf",
                        "court_name_court",
                        "court_document_law_article",
                        "court_case_result",
                        "case_user_document_type",
                        "case_user_doc_entry_date",
                        "case_user_doc_result_date",
                        "case_doc_subject_rf",
                        "case_user_doc_court",
                        "case_doc_instance",
                        "case_document_category_article",
                        "case_user_doc_result",
                        "case_user_entry_date",
                        "m_case_user_type",
                        "m_case_user_sub_type",
                        "ora_main_law_article"
                    ],
                    "hlFragSize": 1000,
                    "groupLimit": 3,
                    "woBoost": false
                },
                "doNotSaveHistory": false
        }

        const nameActs = ["Статья 137","Статья 138","Статья 272","Статья 274",]

        let listActs = []

        for (const key in nameActs) {

            pattern_gas_find.request.multiqueryRequest.queryRequests = queryRequestsAct(nameActs[key])

            const res = await this.httpreq.QXML({url:'https://bsr.sudrf.ru/bigs/s.action',evaluateFn,data:pattern_gas_find}) 

            // documents = [...documents,...res.searchResult.documents]
            listActs.push({nameAct:nameActs[key],documents:res.searchResult.documents})


        }

        let pattern_gas_getAct = {
            "request": {
                "start": 0,
                "rows": 10,
                "uid": "8a4ed48a-009e-4156-b364-085619eca764",
                "type": "MULTIQUERY",
                "multiqueryRequest": {
                    "queryRequests": queryRequestsAct("Статья 137")
                },
                "sorts": [
                    {
                        "field": "score",
                        "order": "desc"
                    }
                ],
                "simpleSearchFieldsBundle": "default",
                "noOrpho": false,
                "facet": {
                    "field": [
                        "type"
                    ]
                },
                "facetLimit": 21,
                "additionalFields": [
                    "court_document_documentype1",
                    "court_case_entry_date",
                    "court_case_result_date",
                    "court_subject_rf",
                    "court_name_court",
                    "court_document_law_article",
                    "court_case_result",
                    "case_user_document_type",
                    "case_user_doc_entry_date",
                    "case_user_doc_result_date",
                    "case_doc_subject_rf",
                    "case_user_doc_court",
                    "case_doc_instance",
                    "case_document_category_article",
                    "case_user_doc_result",
                    "case_user_entry_date",
                    "m_case_user_type",
                    "m_case_user_sub_type",
                    "ora_main_law_article"
                ],
                "hlFragSize": 1000,
                "groupLimit": 3,
                "woBoost": false,
                "id": "3_3a30d8154dadc29835ba6a3d6b6e1ce5",
                "shards": [
                    "Все дела (новое)"
                ],
                "hlColors": [
                    "searchHL0"
                ]
            },
            "saveBoostQuery": false,
            "oneFieldName": null
        }

        let acts = {}

        for (const la in listActs) {
            for (const i in listActs[la].documents) {

                pattern_gas_getAct.request.multiqueryRequest.queryRequests = queryRequestsAct(listActs[la].nameAct)
                pattern_gas_getAct.request.id = listActs[la].documents[i].id
                // console.log({name:listActs[la].nameAct,id: listActs[la].documents[i].id})

                const res2 = await this.httpreq.QXML({url:'https://bsr.sudrf.ru/bigs/showDocument.action',evaluateFn,data:pattern_gas_getAct}) 
                acts[listActs[la].documents[i].id] = res2.document.fields
            }
        }

        return acts

    }

}