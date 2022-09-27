const app = Vue.createApp({
    data() {
        return {
            // pagina gral
            pagina: 'Registrarse',
            juegos: [],
            juego: null,

            // registro de usuario
            emailRegistro: '',
            passwordRegistro: '',

            // inicio de sesion
            emailInicio: '',
            passwordInicio: '',

            // usuario
            alias: 'Anonimo',
            foto: './assets/images/avatar.png',
            inicioSesion: false,
            usuario: null,

            // comentarios
            comentarios: [],
            comentariosJuego: [],
            comentarioInput: '',
        }
    },
    created() {
        fetch('./database.json')
            .then(res => res.json())
            .then(res => this.juegos = res.games)
            .catch(err => console.log(err))
    },
    mounted() {

        // https://firebase.google.com/docs/database/web/read-and-write 

        const comentariosDB = firebase.database().ref('/Comentarios')

        comentariosDB.on('child_added', (data) => {
            traerComentarios(data)
        })

    },
    methods: {
        verDetalles(juego) {
            this.juego = juego
            this.pagina = juego.nombre


            // actualizar
            this.comentarios = []

            const comentariosDB = firebase.database().ref('/Comentarios')

            comentariosDB.on('child_added', (data) => {
                traerComentarios(data)
            })

            this.comentariosJuego = this.comentarios.filter(e => e.juegoId == juego.id)

            this.comentarioInput = ''
        },
        cambiarVista(vista) {
            this.pagina = vista
            this.juego = null
        },
        // Email
        crearUsuario() {
            if (this.emailRegistro != '' && this.passwordRegistro != '') {
                firebase.auth().createUserWithEmailAndPassword(this.emailRegistro, this.passwordRegistro)
                    .then((userCredential) => {
                        // Signed in
                        const user = userCredential.user;
                        console.log(user)
                        // lo que va a pasar, cuando termine de registrarse
                        this.pagina = 'Iniciar Sesion'
                        this.emailRegistro = ''
                        this.passwordRegistro = ''
                    })
                    .catch((error) => {

                        const errorCode = error.code;
                        const errorMessage = error.message;

                        console.log(errorCode)
                        console.log(errorMessage)
                        // ..
                    });
            }
        },
        iniciarSesion() {
            if (this.emailInicio != '' && this.passwordInicio != '') {
                firebase.auth().signInWithEmailAndPassword(this.emailInicio, this.passwordInicio)
                    .then((userCredential) => {
                        // Signed in
                        const user = userCredential.user;

                        this.usuario = user
                        this.alias = this.usuario.email
                        this.inicioSesion = true
                        this.pagina = 'Inicio'
                        this.emailInicio = ''
                        this.passwordInicio = ''
                        // ...
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorCode)
                        console.log(errorMessage)
                    });
            }
        },
        // Google
        crearUsuarioGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth()
                .signInWithPopup(provider)
                .then((result) => {
                    /** @type {firebase.auth.OAuthCredential} */
                    const credential = result.credential;

                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;

                    this.pagina = 'Iniciar Sesion'
                    // ...
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    console.log(errorCode)
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    const credential = error.credential;
                    // ...
                });
        },
        iniciarSesionGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth()
                .signInWithPopup(provider)
                .then((result) => {
                    /** @type {firebase.auth.OAuthCredential} */
                    var credential = result.credential;

                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;

                    this.usuario = user
                    this.pagina = 'Inicio'
                    this.alias = this.usuario.displayName
                    this.inicioSesion = true
                    document.getElementById('avatar').src = this.usuario.photoURL

                    this.emailInicio = ''
                    this.passwordInicio = ''

                    this.emailRegistro = ''
                    this.passwordRegistro = ''

                    // ...
                }).catch((error) => {
                    // Handle Errors here.
                    var errorCode = error.code;
                    console.log(errorCode)
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                });

        },
        // Todos
        cerrarSesion() {
            firebase.auth().signOut();

            this.usuario = null
            this.alias = 'Anonimo'
            this.pagina = 'Inicio'
            this.inicioSesion = false

            this.emailInicio = ''
            this.passwordInicio = ''
            document.getElementById('avatar').src = this.foto
        },
        // crear comentarios
        crearComentario(juego) {

            // https://firebase.google.com/docs/database/web/read-and-write

            let comentarioObj = {
                usuario: this.usuario.displayName ? this.usuario.displayName : this.usuario.email,
                comentario: this.comentarioInput,
                foto: this.usuario.photoURL ? this.usuario.photoURL : this.foto,
                juegoId: juego.id,
                usuarioId: this.usuario.uid,
            }

            console.log(comentarioObj)

            // FIREBASE - CREA EL NUEVO COMENTARIO

            let nuevoComentarioKey = firebase.database().ref().child('Comentarios').push().key

            console.log(nuevoComentarioKey)

            var updates = {}

            updates['/Comentarios/' + nuevoComentarioKey] = comentarioObj

            firebase.database().ref().update(updates)

            this.comentarioInput = ''

            // actualizar
            this.comentarios = []

            const comentariosDB = firebase.database().ref('/Comentarios')

            comentariosDB.on('child_added', (data) => {
                traerComentarios(data)
            })

            this.comentariosJuego = this.comentarios.filter(e => e.juegoId == juego.id)

            this.comentarioInput = ''


        }
    },
    computed: {
        inicioSesionUsuario() {
            // https://firebase.google.com/docs/auth/web/manage-users

            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    var uid = user.uid;

                    // INICIA SESION AUTOMATICAMENTE

                    this.usuario = user

                    if (this.usuario.displayName) {
                        this.alias = this.usuario.displayName
                    } else {
                        this.alias = this.usuario.email
                    }

                    this.inicioSesion = true
                    this.pagina = 'Inicio'

                    this.emailInicio = ''
                    this.passwordInicio = ''

                    if (this.usuario.photoURL) {
                        document.getElementById('avatar').src = this.usuario.photoURL
                    } else {
                        document.getElementById('avatar').src = this.foto
                    }

                    // ...
                } else {
                    // User is signed out

                    this.usuario = null
                    this.alias = 'Anonimo'
                    this.pagina = 'Inicio'
                    this.inicioSesion = false

                    this.emailInicio = ''
                    this.passwordInicio = ''
                    document.getElementById('avatar').src = this.foto

                    // ...
                }
            });
        },
    },
}).mount('#app')


const traerComentarios = (datos) => {

    let comentarioObj = {
        usuario: datos.val().usuario,
        comentario: datos.val().comentario,
        foto: datos.val().foto,
        juegoId: datos.val().juegoId,
        usuarioId: datos.val().usuarioId,
    }

    app.comentarios.push(comentarioObj)
}