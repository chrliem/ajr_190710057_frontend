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
          <v-btn color="blue darken-1" text @click="save">Simpan</v-btn>          
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{error_message}}
    </v-snackbar>
  </div>
</template>

<script>
export default{
    name: "Main",
    data() {
        return{
            logoAJR: require('@/assets/logoAJR1.png'),
            dialogLogin: false,
            dialogRegister: false,
            error_message:'',
            color: '',
            snackbar:false,
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
    methods:{
        save(){
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

            var url = this.$api+'/customer/'
                this.load = true;
                this.$http.post(url, this.customer, {
                    headers: {
                    'Authorization':'Bearer' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = true;
                    this.close();
                    this.resetForm();
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        close(){
                this.dialogRegister= false;
                this.dialogLogin = false;
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
                this.dialogRegister = false;
                this.dialogLogin = false;
        },
    }
    
}
</script>
