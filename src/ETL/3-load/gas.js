module.exports = {


    loading: async function (data) {

        console.log('loading!')

        // console.log(data)

        if(data){
            this.exports.csv({data,header:true,delimiter:'~'})
        
            this.db.save('POSTGRES',data)  
        }



    },


    model:{
        fields:{
            gas_id: 'STRING(100)',
            case_user_doc_number_rewrite: 'STRING(1000)',
            case_doc_instance: 'STRING(1000)',
            u_case_user_article: 'STRING(1000)',
            case_doc_kind: 'STRING(1000)',
            case_court_type_cat: 'STRING(1000)',
            case_doc_subject_rf: 'STRING(1000)',
            case_doc_district_rf: 'STRING(1000)',
            case_user_doc_court: 'STRING(1000)',
            case_user_judge: 'STRING(1000)',
            case_common_document_type: 'STRING(1000)',
            case_common_doc_result: 'STRING(1000)',
            case_common_doc_result_date: 'DATE',
            case_user_doc_validity_date: 'DATE',
            u_common_case_defendant_m_search: 'STRING(1000)',
            // case_user_document_text_tag: 'STRING(9999999)',
        },
        options:{
            logging:false
        }
    }

}