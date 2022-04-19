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
          <strong>Kartu Identitas Customer</strong>
            <v-img
                :src="$baseURL+'/storage/kartu_identitas_customer/'+customers.kartu_identitas_customer"
                height="100px"
                width="100px"
                @click="overlay=!overlay"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay">
                <v-img :src="$baseURL+'/storage/kartu_identitas_customer/'+customers.kartu_identitas_customer"></v-img>
             <v-btn color="success" @click="overlay = false">Close</v-btn>
          </v-overlay>
            
            <strong>SIM Customer</strong>
            <v-img
                :src="$baseURL+'/storage/sim_customer/'+customers.sim_customer"
                height="100px"
                width="100px"
                 @click="overlay1=!overlay1"
            ></v-img>
            <v-overlay :absolute="absolute1" :value="overlay1">
                <v-img :src="$baseURL+'/storage/sim_customer/'+customers.sim_customer"></v-img>
             <v-btn color="success" @click="overlay1 = false">Close</v-btn>
          </v-overlay>

            <div class="text-left">ID Customer    : {{customers.id_customer}}</div>
            <div class="text-left">Nama           :{{customers.nama_customer}}</div>
            <div class="text-left">Tanggal Lahir  : {{customers.tgl_lahir_customer}}</div>
            <div class="text-left">Jenis Kelamin  : {{customers.jenis_kelamin_customer}}</div>
            <div class="text-left">Alamat         : {{customers.alamat_customer}}</div>
            <div class="text-left">No Telepon     : {{customers.no_telepon_customer}}</div>
            <div class="text-left">No Karu Identitas  : {{customers.no_kartu_identitas_customer}}</div>
            <div class="text-left">No SIM    : {{customers.no_sim_customer}}</div>
            <div class="text-left">Alamat Email   : {{customers.email_customer}}</div>
            <v-chip
                v-bind:class="setColorStatus(customers.tipe_sewa_customer)"
                class="rounded pa-1 text-center text-wrap"
            >{{setTipe(customers.tipe_sewa_customer)}}</v-chip>
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
            <v-text-field 
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                v-model="form.password_customer" label="Password Customer" required></v-text-field>
            <v-file-input
                v-model="form.kartu_identitas_customer"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Kartu Identitas Customer"
                prepend-icon="mdi-camera"
                label="Kartu Identitas Customer"
              ></v-file-input>
              <v-file-input
                v-model="form.sim_customer"
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
    name: "Profile",
    data() {
        return {
            show: false,
            show1: false,
            load: false,
            snackbar: false,
            error_message: '',
            color: '', 
            dialog: false,
            customers:[],
            absolute: true,
            absolute1: true,
            overlay1: false,
            overlay: false,
            customer: new FormData,
            form: {
                nama_customer: null,
                alamat_customer: null,
                tgl_lahir_customer: null,
                jenis_kelamin_customer: null,
                no_telepon_customer: null,
                no_kartu_identitas_customer: null,
                kartu_identitas_customer: null,
                no_sim_customer: null,
                email_customer: null,
                password_customer: null
            }
        };
    },
    methods: {
    readData(){
            var url=this.$api+'/customer/CUS20220419-001' //+ localStorage.getItem('id')
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
        return 'Hanya Diperbolehkan Sewa Mobil'
      }else if(tipe_sewa_customer===1){
          return 'Diperboleh Sewa Mobil dan Driver'
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
            this.customer.append('nama_customer',this.form.nama_customer);
            this.customer.append('alamat_customer',this.form.alamat_customer);
            this.customer.append('tgl_lahir_customer',this.form.tgl_lahir_customer);
            this.customer.append('jenis_kelamin_customer', this.form.jenis_kelamin_customer);
            this.customer.append('no_telepon_customer',this.form.no_telepon_customer);
            this.customer.append('no_kartu_identitas_customer', this.form.no_kartu_identitas_customer);
            this.customer.append('kartu_identitas_customer',this.form.kartu_identitas_customer);
            this.customer.append('no_sim_customer',this.form.no_sim_customer);
            this.customer.append('sim_customer',this.form.sim_customer);
            this.customer.append('email_customer', this.form.email_customer);
            this.customer.append('password_customer',this.form.password_customer);

            var url = this.$api+'/customer/CUS20220419-001'
                this.load = true;
                this.$http.post(url, this.customer, {
                    headers: {
                    'Authorization':'Bearer' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
    },
    close(){
                this.dialog = false;
        },
        resetForm(){
            this.form = {
                nama_customer: null,
                alamat_customer: null,
                tgl_lahir_customer: null,
                jenis_kelamin_customer: null,
                no_telepon_customer: null,
                no_kartu_identitas_customer: null,
                kartu_identitas_customer: null,
                no_sim_customer: null,
                email_customer: null,
                password_customer: null
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
            this.form.no_sim_customer = customers.no_sim_customer;
            this.form.kartu_identitas_customer = customers.kartu_identitas_customer;
            this.form.sim_customer = customers.sim_customer;
            this.form.email_customer = customers.email_customer;
            this.form.password_customer = customers.password_customer;
            this.dialog = true;
        }
    },
    
    mounted(){
        this.readData();
    },
}
</script>