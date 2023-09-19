class Admin {
    constructor({ admin }) {
        this.admin = admin;
    }

    confirm() {
        if (this.admin === process.env.ADMIN) {
            return true;
        }
        return false;
    }
}

module.exports = Admin;