module.exports = {


    loading: async function (data) {

        console.log('loading!')

        console.log(data)

        this.exports.csv({data:[data],header:true})

        const d = [data].map(i=>({...i,historyQueries:JSON.stringify(i.historyQueries)}))

        this.db.save('POSTGRES',d)

    },


    model:{
        fields:{
            uid: 'STRING',
            filter: 'STRING',
            historyQueries:'STRING'
        },
        options:{}
    }

}