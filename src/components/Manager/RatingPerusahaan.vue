<template>
<v-main>
<v-container>
    <v-card class="elevation-6">
            <v-card-title class="elevation-4">
                <h3 class="text-h3 font-weight-medium">Rating Performa Perusahaan</h3>
            </v-card-title>
        </v-card>
      </v-container>
        <v-container>
            <v-card class="elevation-6">
            <v-card-title class="elevation-4">
                <h7 class="text-h4 font-weight-medium">Rerata Rating Perusahaan
                    <v-icon color="warning">mdi-star</v-icon>
                    {{average}}
                </h7>
            </v-card-title>
        </v-card>
        </v-container>
      <v-container>
        <v-card class="elevation-6">
            <v-data-table :headers="headers" :items="transaksis">
                <template v-slot:[`item.rating_ajr`]="{item}">
                        <span v-if="item.rating_ajr===1">
                            <v-icon color="warning">mdi-star</v-icon>
                        </span>
                        <span v-else-if="item.rating_ajr===2">
                            <v-icon color="warning">mdi-star</v-icon>
                            <v-icon color="warning">mdi-star</v-icon>
                        </span>
                         <span v-else-if="item.rating_ajr===3">
                            <v-icon color="warning">mdi-star</v-icon>
                            <v-icon color="warning">mdi-star</v-icon>
                            <v-icon color="warning">mdi-star</v-icon>
                        </span>
                         <span v-else-if="item.rating_ajr===4">
                            <v-icon color="warning">mdi-star</v-icon>
                            <v-icon color="warning">mdi-star</v-icon>
                            <v-icon color="warning">mdi-star</v-icon>
                            <v-icon color="warning">mdi-star</v-icon>
                        </span>
                         <span v-else-if="item.rating_ajr===5">
                            <v-icon color="warning">mdi-star</v-icon>
                            <v-icon color="warning">mdi-star</v-icon>
                            <v-icon color="warning">mdi-star</v-icon>
                            <v-icon color="warning">mdi-star</v-icon>
                            <v-icon color="warning">mdi-star</v-icon>
                        </span>
                    </template>
            </v-data-table>
        </v-card>
      </v-container>
</v-main>
</template>

<script> 
/* eslint-disable */ 
export default{
    name: "Rating AJR",

    data(){
        return{
            load: false,
            error_message: false,
            response_message: false,
            transaksis: [],
            average: 0,
            headers:[
                {text:'No Transaksi', value: 'no_transaksi', align:'center'},
                {text:'Rating AJR', value: 'rating_ajr', align:'center'},
            ]
        }
        
    },
    methods:{
        readData(){
                var url =  this.$api+'/transaksipenyewaan/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.transaksis = response.data.data;
                    })

        },
        getAverage(){
             var url =  this.$api+'/average-ratingajr/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.average = response.data.data;
                        
                    })
        }
    },
    
    mounted(){
        this.readData();
        this.getAverage();
    }
}

</script>