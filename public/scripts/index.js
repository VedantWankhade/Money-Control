const userList = document.querySelector('.users');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelectorAll('.account-details');

const renderCard = (flag) => {
    const card =  document.getElementById('pay-card');
    if(flag)
        card.style.display = 'block';
    else card.style.display = 'none';
}

const renderHome = (flag) => {
    const home = document.getElementById('home');
    if (flag)
        home.style.display = 'block';
    else home.style.display = 'none';
}

const renderAdminControl = (flag) => {
    const adminControl = document.getElementById('admin-control');
    if (flag)
        adminControl.style.display = 'block';
    else adminControl.style.display = 'none';
}

const setupUI = user => {

    if (user) {
        // set account info
        const html = `
            <div>Logged in as ${user.email}</div>
        `;
        accountDetails.innerHTML = html;

        // toggle ui elements
        loggedInLinks.forEach(link => link.style.display = 'block')
        loggedOutLinks.forEach(link => link.style.display = 'none');
    } else {
        accountDetails.innerHTML = '';
        // toggle ui elements
        loggedInLinks.forEach(link => link.style.display = 'none')
        loggedOutLinks.forEach(link => link.style.display = 'block');
    }
}

// fill user list
const fillUsers = (data) => {
    let html = '';
    if (data.length) {
        data.forEach(doc => {
            const user = doc.data();

           // console.log(user);
            if(!user.admin) { 

            const li = `
                <li>
                    <div class="collapsible-header grey lighten-4">${user.username}</div>
                    <div class="collapsible-body white">${user.email}</div>
                </li>
            `;
            html += li;
            }
        })
    } else {
        html = ``;
    }
    userList.innerHTML = html;
}

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});

  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });