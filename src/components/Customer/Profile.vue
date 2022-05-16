<template>
 <v-main class="list">
     
    <v-container class="fullheight">
        
        <v-card class="elevation-6">
            <v-card-title class="elevation-4">
                <h3 class="text-h3 font-weight-medium">Profil Customer</h3>
            </v-card-title>
        </v-card>
    </v-container>
    
    <v-container>
    <v-card class="elevation-6">
  
      <v-card-text align="left">
          
            <div class="text-left"><strong>No Customer </strong>   : {{customers.id_customer}}</div>
            <div class="text-left"><strong>Nama  </strong>            :{{customers.nama_customer}}</div>
            <div class="text-left"><strong>Tanggal Lahir  </strong>   : {{customers.tgl_lahir_customer}}</div>
            <div class="text-left"><strong>Jenis Kelamin  </strong>  : {{customers.jenis_kelamin_customer}}</div>
            <div class="text-left"><strong>Alamat     </strong>      : {{customers.alamat_customer}}</div>
            <div class="text-left"><strong>No Telepon    </strong>   : {{customers.no_telepon_customer}}</div>
            <div class="text-left"><strong>No Karu Identitas  </strong>  : {{customers.no_kartu_identitas_customer}}</div>
            <div v-if="customers.sim_customer===null">
              <div class="text-left"><strong>No SIM  </strong>    : Belum ada</div>
            </div>
            <div v-else class="text-left"><strong>No SIM   </strong>   : {{customers.no_sim_customer}}</div>
            <div class="text-left"><strong>Alamat Email </strong>   : {{customers.email}}</div>
            <strong>Tipe Transaksi: </strong>
            <div>
            <v-chip
                v-bind:class="setColorStatus(customers.tipe_sewa_customer)"
                class="rounded pa-1 text-center text-wrap"
            >{{setTipe(customers.tipe_sewa_customer)}}</v-chip></div>
            <p></p>
            <p><strong>Dokumen: </strong></p>
            <strong>Kartu Identitas Customer</strong>
            <v-img
                :src="$baseURL+'/storage/kartu_identitas_customer/'+customers.kartu_identitas_customer"
                max-height="200px"
                max-width="300px"
                @click="overlay=!overlay"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay">
                <v-img height="800px"
                width="1200px" :src="$baseURL+'/storage/kartu_identitas_customer/'+customers.kartu_identitas_customer"></v-img>
             <v-btn color="success" @click="overlay = false">Close</v-btn>
          </v-overlay>
            <div v-if="customers.sim_customer===null">
              <strong>SIM Customer</strong>
              <div>SIM Belum Ada</div>
              </div>
            <div v-else>
            <strong>SIM Customer</strong>
            <v-img
                :src="$baseURL+'/storage/sim_customer/'+customers.sim_customer"
                max-height="200px"
                max-width="300px"
                 @click="overlay1=!overlay1"
            ></v-img>
            <v-overlay absolute="true" :value="overlay1">
                <v-img :src="$baseURL+'/storage/sim_customer/'+customers.sim_customer" 
                height="800px"
                width="1200px"></v-img>
             <v-btn color="success" @click="overlay1 = false">Close</v-btn>
          </v-overlay>
            </div>
      </v-card-text>
    <v-card-actions>
       <v-btn color="primary" dark @click="editHandler(customers)"> Edit Profil

        </v-btn>
    </v-card-actions>
  </v-card>
   </v-container>

   <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> Edit Profil Customer </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.nama_customer" label="Nama Customer" required></v-text-field>
            <v-text-field v-model="form.alamat_customer" label="Alamat Customer" required></v-text-field>
            <p>Tanggal Lahir Customer</p>
            <v-date-picker v-model="form.tgl_lahir_customer" label="Tanggal Lahir Customer" required></v-date-picker>
            <v-radio-group v-model="form.jenis_kelamin_customer" label="Jenis Kelamin Customer" required>
              <v-radio value="Laki-laki" label="Laki-laki"></v-radio>
              <v-radio  value="Perempuan" label="Perempuan"></v-radio>
            </v-radio-group>
            <v-text-field v-model="form.no_telepon_customer" label="No Telepon Customer" required></v-text-field>
            <v-text-field v-model="form.no_kartu_identitas_customer" label="No Kartu Identitas" required></v-text-field>
            <v-text-field v-model="form.no_sim_customer" label="No SIM"></v-text-field>
            <v-text-field v-model="form.email_customer" label="Email Customer" required></v-text-field>
            <!-- <v-text-field 
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                v-model="form.password_customer" label="Password Customer" required></v-text-field> -->
            <v-file-input
                id="kartu_identitas"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Kartu Identitas Customer"
                prepend-icon="mdi-camera"
                label="Kartu Identitas Customer"
              ></v-file-input>
              <v-file-input
                id="sim"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload SIM Customer"
                prepend-icon="mdi-camera"
                label="SIM Customer"
              ></v-file-input>                
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="update">Simpan</v-btn>          
        </v-card-actions>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" top>
            <div v-for="(errorArray, index) in error_message" :key="index">
                <div v-for="(error_message,  index) in errorArray" :key="index">
                    {{error_message}}
                </div>
            </div>
        </v-snackbar>
      </v-card>
    </v-dialog>

   <v-snackbar v-model="snackbar1" :color="color" timeout="2000" bottom>
    {{response_message}}
    </v-snackbar> 
 </v-main>
</template>
<script>
/* eslint-disable */
export default{
    name: "Profile",
    data() {
        return {
            show: false,
            show1: false,
            load: false,
            snackbar: false,
            snackbar1: false,
            error_message: '',
            response_message: '',
            color: '', 
            dialog: false,
            customers:[],
            absolute: true,
            absolute1: true,
            overlay1: false,
            overlay: false,
            customer: new FormData,
            form: {
                nama_customer: '',
                alamat_customer: '',
                tgl_lahir_customer: '',
                jenis_kelamin_customer: '',
                no_telepon_customer: '',
                no_kartu_identitas_customer: '',
                kartu_identitas_customer: '',
                no_sim_customer: '',
                email_customer: '',
                password_customer: ''
            }
        };
    },
    methods: {
    readData(){
            var url=this.$api+'/customer-profile/'+ localStorage.getItem('id');
            this.$http.get(url,{
                headers:{
                    'Authorization':'Bearer '+localStorage.getItem('token')
                }
            }).then(response=>{
                this.customers=response.data.data
            })
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
    setColorStatus(tipe_sewa_customer){
      if(tipe_sewa_customer===null){
        return 'error'
      }else if(tipe_sewa_customer===1){
        return 'success'
      }else if(tipe_sewa_customer===0){
        return 'warning'
      }
    },

    update(){
            var kartu_identitas_customer = document.getElementById('kartu_identitas');

            if(kartu_identitas_customer.files[0]){
                this.customer.append('kartu_identitas_customer',kartu_identitas_customer.files[0]);
            }

            var sim_customer = document.getElementById('sim');

            if(sim_customer.files[0]){
                this.customer.append('sim_customer',sim_customer.files[0]);
            }
            this.customer.append('nama_customer',this.form.nama_customer);
            this.customer.append('alamat_customer',this.form.alamat_customer);
            this.customer.append('tgl_lahir_customer',this.form.tgl_lahir_customer);
            this.customer.append('jenis_kelamin_customer', this.form.jenis_kelamin_customer);
            this.customer.append('no_telepon_customer',this.form.no_telepon_customer);
            this.customer.append('no_kartu_identitas_customer', this.form.no_kartu_identitas_customer);
            this.customer.append('no_sim_customer',this.form.no_sim_customer);
            this.customer.append('email', this.form.email_customer);
            this.customer.append('password',this.form.password_customer);

            var url = this.$api+'/customer/'+this.editId
                this.load = true;
                this.$http.post(url, this.customer, {
                    headers: {
                    'Authorization':'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.response_message = response.data.message;
                    this.color = "green";
                    this.snackbar1 = true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "blue";
                    this.snackbar = true;
                    this.load = false;
                });
    },
    close(){
                this.dialog = false;
        },
        resetForm(){
            this.form = {
                nama_customer: '',
                alamat_customer: '',
                tgl_lahir_customer: '',
                jenis_kelamin_customer: '',
                no_telepon_customer: '',
                no_kartu_identitas_customer: '',
                kartu_identitas_customer: '',
                no_sim_customer: '',
                email_customer: '',
                password_customer: ''
            }
        },
        cancel(){
                this.resetForm();
                this.dialog = false;
        },
        editHandler(customers){
            this.editId = customers.id_customer;
            this.form.nama_customer = customers.nama_customer;
            this.form.alamat_customer = customers.alamat_customer;
            this.form.tgl_lahir_customer = customers.tgl_lahir_customer;
            this.form.jenis_kelamin_customer = customers.jenis_kelamin_customer;
            this.form.no_telepon_customer = customers.no_telepon_customer;
            this.form.no_kartu_identitas_customer = customers.no_kartu_identitas_customer;
            if(customers.no_sim_customer==null){
              this.form.no_sim_customer = '';
            }else{
              this.form.no_sim_customer = customers.no_sim_customer;
            }
            
            this.form.kartu_identitas_customer = customers.kartu_identitas_customer;
            this.form.sim_customer = customers.sim_customer;
            this.form.email_customer = customers.email;
            this.dialog = true;
        }
    },
    
    mounted(){
        this.readData();
    },
}
</script>