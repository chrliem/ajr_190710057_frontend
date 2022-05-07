<template>
    <v-main class="list">
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Customer AJR </h2>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-data-table :headers="headers" :items="customers" :search="search" @click="viewHandler(item)">
                 <template v-slot:[`item.tipe_sewa_customer`]="{ item }">
                    <span v-if="item.tipe_sewa_customer===null"><v-chip color="error">Belum Diverifikasi</v-chip></span>
                    <span v-else-if="item.tipe_sewa_customer===0"><v-chip color="orange">Terverifikasi dan Hanya Diperbolehkan Sewa Mobil dengan Driver</v-chip></span>
                    <span v-else-if="item.tipe_sewa_customer===1"><v-chip color="green" >Terverifikasi dan Diperbolehkan Sewa Mobil tanpa Driver</v-chip></span>
                </template>
                <template v-slot:[`item.kartu_identitas_customer`]="{ item }">
                    <v-img
                        :src="$baseURL+'/storage/kartu_identitas_customer/'+item.kartu_identitas_customer"
                        height="50px"
                        width="50px"
                    ></v-img>
                </template>
                <template v-slot:[`item.sim_customer`]="{ item }">
                     <v-img
                        :src="$baseURL+'/storage/sim_customer/'+item.sim_customer"
                        height="50px"
                        width="50px"
                        @click="overlay1=!overlay1"
                    ></v-img>
                    <v-overlay :value="overlay1">
                        <v-img :src="$baseURL+'/storage/sim_customer/'+item.sim_customer"></v-img>
                    <v-btn color="success" @click="overlay1 = false">Close</v-btn>
                    </v-overlay>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-chip><v-icon color="green" @click="viewHandler(item.id_customer)">mdi-eye-circle</v-icon></v-chip>
                    <v-chip><v-icon @click="viewHandler2(item.id_customer)" color="primary">mdi-check-circle</v-icon></v-chip>
                </template>
            </v-data-table>
        </v-card>
        </v-container>

        <v-dialog v-model="detail_customer" persistent max-width="600px">
            <v-card max-width="600px">
              <v-card-title>
                  Detail Data Customer
                  <v-spacer></v-spacer>
                   <v-btn color="success" @click="close">Close</v-btn>
            </v-card-title>
             <v-card-text align="left">
          
            <div class="text-left">ID Customer    : {{customer1.id_customer}}</div>
            <div class="text-left">Nama           :{{customer1.nama_customer}}</div>
            <div class="text-left">Tanggal Lahir  : {{customer1.tgl_lahir_customer}}</div>
            <div class="text-left">Jenis Kelamin  : {{customer1.jenis_kelamin_customer}}</div>
            <div class="text-left">Alamat         : {{customer1.alamat_customer}}</div>
            <div class="text-left">No Telepon     : {{customer1.no_telepon_customer}}</div>
            <div class="text-left">No Karu Identitas  : {{customer1.no_kartu_identitas_customer}}</div>
            <div class="text-left">No SIM    : {{customer1.no_sim_customer}}</div>
            <div class="text-left">Alamat Email   : {{customer1.email}}</div>
            <strong>Tipe Transaksi: </strong>
            <div>
            <v-chip
                v-bind:class="setColorStatus(customer1.tipe_sewa_customer)"
                class="rounded pa-1 text-center text-wrap"
            >{{setTipe(customer1.tipe_sewa_customer)}}</v-chip></div>
            <p></p>
            <p><strong>Dokumen: </strong></p>
            <strong>Kartu Identitas Customer</strong>
            <v-img
                :src="$baseURL+'/storage/kartu_identitas_customer/'+customer1.kartu_identitas_customer"
                max-height="200px"
                max-width="300px"
                @click="overlay=!overlay"
            ></v-img>
            <v-overlay :value="overlay">
                <v-img height="600px"
                width="800px" :src="$baseURL+'/storage/kartu_identitas_customer/'+customer1.kartu_identitas_customer"></v-img>
             <v-btn color="success" @click="overlay = false">Close</v-btn>
          </v-overlay>
            <div v-if="customer1.sim_customer===null">
              <strong>SIM Customer</strong>
              <div>SIM Belum Ada</div>
              </div>
            <div v-else>
            <strong>SIM Customer</strong>
            <v-img
                :src="$baseURL+'/storage/sim_customer/'+customer1.sim_customer"
                max-height="200px"
                max-width="300px"
                 @click="overlay1=!overlay1"
            ></v-img>
            <v-overlay :value="overlay1">
                <v-img :src="$baseURL+'/storage/sim_customer/'+customer1.sim_customer" 
                height="600px"
                width="800px"></v-img>
             <v-btn color="success" @click="overlay1 = false">Close</v-btn>
          </v-overlay>
            </div>
            </v-card-text>
               
            </v-card>
            </v-dialog>

            <v-dialog v-model="verifikasi_customer" persistent max-width="600px">
            <v-card max-width="600px">
              <v-card-title>
                  Verifikasi Data Customer
                  <v-spacer></v-spacer>
            </v-card-title>
             <v-card-text align="left">
            <p><strong>Dokumen: </strong></p>
            <strong>Kartu Identitas Customer</strong>
            <v-img
                :src="$baseURL+'/storage/kartu_identitas_customer/'+customer1.kartu_identitas_customer"
                max-height="200px"
                max-width="300px"
                @click="overlay=!overlay"
            ></v-img>
            <v-overlay :value="overlay">
                <v-img height="800px"
                width="1200px" :src="$baseURL+'/storage/kartu_identitas_customer/'+customer1.kartu_identitas_customer"></v-img>
             <v-btn color="success" @click="overlay = false">Close</v-btn>
          </v-overlay>
            <div v-if="customer1.sim_customer===null">
              <strong>SIM Customer</strong>
              <div>SIM Belum Ada</div>
              </div>
            <div v-else>
            <strong>SIM Customer</strong>
            <v-img
                :src="$baseURL+'/storage/sim_customer/'+customer1.sim_customer"
                max-height="200px"
                max-width="300px"
                 @click="overlay1=!overlay1"
            ></v-img>
            <v-overlay :value="overlay1">
                <v-img :src="$baseURL+'/storage/sim_customer/'+customer1.sim_customer" 
                height="800px"
                width="1200px"></v-img>
             <v-btn color="success" @click="overlay1 = false">Close</v-btn>
          </v-overlay>
            </div>
            </v-card-text>
            <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Batal</v-btn>
            <v-btn color="blue darken-1" text @click="verifyData(customer1.id_customer)">Verifikasi</v-btn>          
        </v-card-actions>
            </v-card>
            </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
        {{error_message}}
        </v-snackbar> 
    </v-main>
</template>

<script>
/* eslint-disable */
    export default{
        name: "Customer",
        data(){
            return{
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                overlay: false,
                overlay1: false,
                detail_customer: false,
                verifikasi_customer: false,
                customers: [],
                customer1: [],
                getId: '',
                headers: [
                    {text: "ID Customer", value: "id_customer"},
                    {text: "Nama Customer", value:"nama_customer"},
                    // {text: "Alamat", value:"alamat_customer"},
                    // {text: "Tanggal Lahir",value: "tgl_lahir_customer"},
                    // {text: "Jenis Kelamin", value: "jenis_kelamin_customer"},
                    // {text: "No Telepon", value: "no_telepon_customer"},
                    // {text: "No Kartu Identitas", value:"no_kartu_identitas_customer"},
                    // {text: "Kartu Identitas", value: "kartu_identitas_customer"},
                    // {text: "No SIM", value:"no_sim_customer"},
                    // {text: "SIM", value:"sim_customer"},
                    {text: "Email", value:"email"},
                    {text: "Tipe Sewa", value:"tipe_sewa_customer"},
                    {text: "Action", value:"actions"}
                ]
            };
            
        },
        methods:{
            readData(){
                var url=this.$api+'/customer/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+ localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.customers=response.data.data
                    })
            },
            verifyData(id_customer){
                var url=this.$api+'/customer/'+id_customer+'/verifikasi'
                this.load = true;
                this.$http.get(url, {
                    headers:{
                    'Authorization':'Bearer '+localStorage.getItem('token')
                 }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.readData();
                    this.verifikasi_customer= false;
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },
            setColorStatus(tipe_sewa_customer){
                if(tipe_sewa_customer===null){
                    return 'error'
                }else if(tipe_sewa_customer===1){
                    return 'success'
                }else if(tipe_sewa_customer===0){
                    return 'warning'
                }
                },
                setTipe(tipe_sewa_customer){
                if(tipe_sewa_customer===null){
                    return 'Belum Diverifikasi'
                }else if(tipe_sewa_customer===0){
                    return 'Hanya Diperbolehkan Sewa Mobil dengan Driver'
                }else if(tipe_sewa_customer===1){
                    return 'Diperbolehkan Sewa Mobil Tanpa Driver'
                }
                },
            readDatabyId(){
                var url=this.$api+'/customer/'+this.getId
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.customer1=response.data.data
                    })
            },
            viewHandler(id_customer){
                this.getId = id_customer;
                this.readDatabyId();
                this.detail_customer = true;
            },
            viewHandler2(id_customer){
                this.getId = id_customer;
                this.readDatabyId();
                this.verifikasi_customer = true;
            },
            close(){
                this.detail_customer= false;
                this.verifikasi_customer = false;
            }
        },
        mounted(){
            this.readData();
            this.readDatabyId();
        }
    }
</script>