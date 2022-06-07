<template>
  <div>
    <v-card color="grey lighten-4" flat height="100px" tile>
        <v-toolbar prominent color="blue darken-3">
            <v-toolbar-title><h2 class="white--text">ATMA JOGJA RENTAL</h2></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <v-btn class="ma-2" color="blue" dark @click="dialogLogin = true"> LOGIN</v-btn>
                <v-btn color="success" dark @click="dialogRegister = true"> REGISTER CUSTOMER </v-btn>
            </v-toolbar-title>
    </v-toolbar>
    </v-card>
    <v-container fill-height>
        <v-layout flex align-center justify-center>
            <v-flex xs10 sm5>
                <v-img elevetion-4 :src="logoAJR"></v-img>
            </v-flex>
        </v-layout>
    </v-container>

    <v-dialog v-model="dialogRegister" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> Register Customer </span>
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
            <v-text-field v-model="form.no_kartu_identitas_customer" label="No Kartu Identitas (KTP/Kartu Pelajar/Kartu Mahasiswa" required></v-text-field>
            <v-text-field v-model="form.no_sim_customer" label="No SIM (Apabila sudah memiliki SIM)"></v-text-field>
            <v-text-field v-model="form.email_customer" label="Email Customer" required></v-text-field>
            <v-file-input
                id="kartu_identitas"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Kartu Identitas Customer"
                prepend-icon="mdi-camera"
                label="Kartu Identitas Customer"
                clearable="true"
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
          <v-btn color="blue darken-1" text @click="save">Regsiter</v-btn>          
        </v-card-actions>
        <!-- <v-snackbar v-model="snackbar" :color="color" timeout="2000" top>
            <div v-for="(errorArray, index) in error_message" :key="index">
                <div v-for="(error_message,  index) in errorArray" :key="index">
                    {{error_message}}
                </div>
            </div>
        </v-snackbar> -->
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogLogin" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> Login</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.email" label="Email" required></v-text-field>
            <v-text-field v-model="form.password" type="password" label="Password" required></v-text-field>        
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="login">Login</v-btn>          
        </v-card-actions>
        <!-- <v-snackbar v-model="snackbar" :color="color" timeout="2000" top>
            <div v-for="(errorArray, index) in error_message" :key="index">
                <div v-for="(error_message,  index) in errorArray" :key="index">
                    {{error_message}}
                </div>
            </div>
        </v-snackbar> -->
      </v-card>
    </v-dialog>

     <v-snackbar v-model="snackbar" :color="color" timeout="2000" top>
            <div v-for="(errorArray, index) in error_message" :key="index">
                <div v-for="(error_message,  index) in errorArray" :key="index">
                    {{error_message}}
                </div>
            </div>
        </v-snackbar>
    <v-snackbar v-model="snackbar1" :color="color" timeout="2000" bottom>
      {{response_message}}
    </v-snackbar>
    <v-snackbar v-model="snackbar2" :color="color" timeout="2000" top>

                    {{error_message}}
        </v-snackbar>
<router-view></router-view>
     
  </div>
</template>

<script>
export default{
  /* eslint-disable */ 

    name: "Main",
    data() {
        return{
            logoAJR: require('@/assets/logoAJR1.png'),
            dialogLogin: false,
            dialogRegister: false,
            error_message:'',
            response_message:'',
            color: '',
            snackbar:false,
            snackbar1: false,
            snackbar2: false,
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
                email: '',
                password: ''
            }
        };
    },
    methods:{
        save(){

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

            var url = this.$api+'/customer/'
                this.load = true;
                this.$http.post(url, this.customer, {
                    headers: {
                    'Authorization':'Bearer' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.response_message = response.data.message;
                    this.color = "green";
                    this.snackbar1 = true;
                    this.load = true;
                    this.close();
                    this.resetForm();
                    location.reload();
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    console.log("Register",error.response.data.message)
                    this.color = "blue";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        login(){
            this.$http.post(this.$api + '/login', {
              email: this.form.email,
              password: this.form.password
            }).then(response =>{
              this.response_message = response.data.message;
              if(response.data.message==='Authenticated as Pegawai'){
                localStorage.setItem('id', response.data.user.id_pegawai);
                localStorage.setItem('token', response.data.access_token);
                

                if(response.data.user.id_role===1){
                  localStorage.setItem('role','Manager');
                  localStorage.setItem('nama',response.data.user.nama_pegawai);
                  this.color = "green";
                  this.snackbar1 = true;
                  this.load = true;
                  this.close();
                  this.resetForm();
                  this.$router.push({
                    name: 'Manager'
                  });
                }else if(response.data.user.id_role === 2){
                  localStorage.setItem('role','Customer Service');
                  localStorage.setItem('nama',response.data.user.nama_pegawai);
                  this.color = "green";
                  this.snackbar1 = true;
                  this.load = true;
                  this.close();
                  this.resetForm();
                  this.$router.push({
                    name: 'Customer Service'
                  })
                }else if(response.data.user.id_role === 3){
                  localStorage.setItem('role','Admin');
                  localStorage.setItem('nama',response.data.user.nama_pegawai);
                  this.color = "green";
                  this.snackbar1 = true;
                  this.load = true;
                  this.close();
                  this.resetForm();
                  this.$router.push({
                    name: 'Admin'
                  })
                }

              }else if(response.data.message==='Authenticated as Customer'){
                localStorage.setItem('id', response.data.user.id_customer);
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('role','Customer');
                localStorage.setItem('nama',response.data.user.nama_customer);
                this.color = "green";
                  this.snackbar1 = true;
                  this.load = true;
                  this.close();
                  this.resetForm();
                this.$router.push({
                  name:"Customer"
                })
              }else if(response.data.message==='Authenticated as Driver'){
                localStorage.setItem('id', response.data.user.id_driver);
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('role','Driver');
                localStorage.setItem('nama',response.data.user.nama_driver);
                this.color = "green";
                  this.snackbar1 = true;
                  this.load = true;
                  this.close();
                  this.resetForm();
                this.$router.push({
                  name: 'Driver'
                })
              } 
              
            }).catch(error =>{
                this.error_message = error.response.data.message;
                if(error.response.data.message==='User Not Found' || error.response.data.message==='Incorrect Password'){
                  this.snackbar2=true;
                  this.color = "blue";
                  this.load = false;
                  localStorage.removeItem('token')
                }else{
                  this.color = "blue";
                  this.snackbar = true;
                  this.load = false;
                  localStorage.removeItem('token')
                }
                
            })
        },
        close(){
                this.dialogRegister= false;
                this.dialogLogin = false;
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
                email: '',
                password: ''
            }
            
        },
        cancel(){
                this.resetForm();
                this.dialogRegister = false;
                this.dialogLogin = false;
                location.reload();
        },
    }
    
}
</script>
