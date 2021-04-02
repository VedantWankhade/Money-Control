const usersCollection = db.collection('users');

// listen for auth status changes
auth.onAuthStateChanged(function(user) {
    // console.log(user);

    if (user)
    {
        console.log("User is logged in:"/*, user*/);
        // get data
        renderHome(false);
        usersCollection.onSnapshot(snap =>
        {
            // console.log(snap.docs);
            console.log(user.uid);
            let u; 
            usersCollection.doc(user.uid).get().then((res) => {
                u = res.data();
                if (u.admin) {
                    renderAdminControl(true);
                    fillUsers(snap.docs);
                }
                else renderCard(true);
            });
            setupUI(user);
        }, err => console.log(err.message));
    } else {
        console.log("User is logged out");
        fillUsers([]);
        renderAdminControl(false);
        setupUI();
        renderCard(false);
        renderHome(false);
    }
})

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // get user info
    const username = signupForm['signup-username'].value;
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const upiId = signupForm['signup-upi-id'].value;
    // const refferedFrom = signupForm['signup-refer-code'].value;
    const refferedFrom = 'EZiARWLTj7cXRKtq7TZfyhQFpVX2';

    let allowSignUp = false;
    let reffered;
    if (refferedFrom === '') {
        reffered = false;
    } else {
        let refferedFromUserRef;
        let refferedFromUser;
        if (refferedFrom !== '') {
            refferedFromUserRef = await usersCollection.doc(refferedFrom).get();
            if (refferedFromUserRef.exists) {
                refferedFromUser = refferedFromUserRef.data();
                if (refferedFromUser.remainingRefferals > 0)
                    reffered = true;
            }
        }
    }

    if (!allowSignUp) {
        console.log("reffereal code has expired");
    }

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // console.log(cred.user);

        return db.collection('users').doc(cred.user.uid).set({
            username, email, upiId, refferedFrom, refferCode: cred.user.uid, remainingRefferals: 10
        })
    }).then(() => {
        // close signup modal and reset the form
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        
        if (allowReffered) {
            const decrement = firebase.firestore.FieldValue.increment(-1);
            usersCollection.doc(refferedFrom).update({remainingRefferals: decrement});
        }
    })
})

// logout
const logout = document.getElementsByClassName('logout');
// console.log(logout);

Array.prototype.forEach.call(logout, function(element) {
    
    element.addEventListener('click', e =>
            {
                e.preventDefault();
                auth.signOut();
            })
});

// login
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // console.log(cred.user);

        // close the login modal and reset the form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
})