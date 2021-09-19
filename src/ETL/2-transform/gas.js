module.exports = {


    transformation: async function (data) {

        console.log('GAS transformation!')

        let acts = []


        const nameFields = [
            // "Номер дела"
            "case_user_doc_number_rewrite"
            
            // "Инстанция"
            ,"case_doc_instance"
            
            // "Статья УК РФ"
            ,"u_case_user_article"
            
            // "Вид судопроизводства"
            ,"case_doc_kind"
            
            // "Уровень суда"
            ,"case_court_type_cat"
            
            // "Субъект РФ"
            ,"case_doc_subject_rf"
            
            // "Округ РФ"
            ,"case_doc_district_rf"
            
            // "Наименование суда"
            ,"case_user_doc_court"
            
            // "Судья"
            ,"case_user_judge"
            
            // "Тип документа"
            ,"case_common_document_type"
            
            // "Результат"
            ,"case_common_doc_result"
            
            // "Дата решения"
            ,"case_common_doc_result_date"
            
            // "Дата вступления в силу"
            ,"case_user_doc_validity_date"
            
            // "Лица"
            ,"u_common_case_defendant_m_search"
            
            // "Текст документа"
            // ,"case_user_document_text_tag"
        ]

        for (const key in data) {

            let d = data[key]
            .filter(i => nameFields.includes(i.name))

            let fields = {}

            for (const f in d) {

                fields[d[f].name] = d[f].value ? d[f].value : d[f].dateValue
                
            }

            let act = {gas_id:key, ...fields}

            acts.push(act)

        }

        // console.log(acts)

        return acts

    }

}