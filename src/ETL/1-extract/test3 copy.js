module.exports = {


    extrapolation: async function () {

        console.log('extrapolation!')
        // console.log(this)

        const evaluateFn = (options) => {
            try {
    
                var d = { 
                    ...options.data,
                    uid: Data.uid 
                }
    
                return $.ajax({
                    ...options,
                    data: JSON.stringify(d)
                })
    
            } catch (e) {
                return e.message
            }
        }
    
        const res = await this.httpreq.QXML({url:'https://bsr.sudrf.ru/bigs/listHistoryQueries.action',evaluateFn}) 
        
        return res

    }

}