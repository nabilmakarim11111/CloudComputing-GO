class User {
    constructor(email, password, name){
        this.name = name;
        this.email = email;
        this.password = password;
        this.gambar_profil = null;
        this.skin_type = null; // Set default value to null
        this.createdAt = new Date();
        this.updatedAt = null;
        this.token = {
            auth: null,
            forgetPass: null
        };
    }
}

module.exports = User;
