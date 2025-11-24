// we grab our header and our desktop header
// we insert the contents of our header into the desktop one

const header = document.querySelector('.header')
const desktopHeader = document.querySelector('.header-desktop')
// const order = data.order

desktopHeader.innerHTML = header.innerHTML

// 1. when the .header enters the viewprt, hide the desktop header (by adding the visible class)
// 2. when the header leaves, show it (by adding the visible class)

inView('.header')
    .on('enter', el => desktopHeader.classList.remove('visible'))
    .on('exit', el => desktopHeader.classList.add('visible'))


// here we enable the tilt library on all our images
VanillaTilt.init(document.querySelectorAll('.image'), {
    max: 25,
    speed: 400
})


// here we grab all our images we want to fade in
// we add the visible class which toggles the opacity
inView('.fade')
    .on('enter', img => img.classList.add('visible'))
    .on('exit', img => img.classList.remove('visible'))


// 1. when we click the .register-button, run a function 
// 2. grab the front element and add a class of .slide-up
const registerButton = document.querySelector('.register-button')
registerButton.addEventListener('click', event => {
    // stops any default actions from happening
    event.preventDefault()
    const frontEl = document.querySelector('.front')
    frontEl.classList.add('slide-up')
})



// create a stripe client
const stripe = Stripe('pk_test_51SU6VJE4IfwZuTIem0fMh0cH55idndR5NFncqmBBufnHqUWzpxigfEAMD5rwJGMqrDbl3ppqQVizysTGdLmiFOnO00xJWwnKQs');

// create an instance of elements
const elements = stripe.elements()

// custom styling can be passed to options when creating an element
// (Note that this demo uses a wider set of styles than the guide below)
const style = {
    base: {
        color: '#32325d',
        lineHeight: '18px',
        fontFamily: '"Nelvetica Neue", Nelvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
}

// create an instance pf the card Element
const card = elements.create('card', { style: style })

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element')

// Handle real-time validation errors from the card Element
card.addEventListener('change', function (event) {
    const displayError = document.getElementById('card-errors')
    if (event.error) {
        displayError.textContent = event.error.message
    } else {
        displayError.textContent = ''
    }

})


// handle from submission
const form = document.getElementById('payment-form')
form.addEventListener('submit', function (event) {
    event.preventDefault()
    // here we lock the form
    form.classList.add('processing')

    stripe.createToken(card).then(function (result) {

        if (result.error) {
            // here we unlock the form again if there's an error   
            form.classList.remove('processing')
            // inform the user if there was an error
            const errorEl = document.getElementById('card-errors')
            // set the error text to the error message
            errorEl.textContent = result.error.message
        } else {
            // now we take over tp handle sending the token t our server
            // send the token to your server
            stripeTokenHandler(result.token)
        }
    })
})

function stripeTokenHandler(token) {
    const stripe_token = token.id;
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;

    const url = 'http://localhost:3000/order'; // <-- поставь свой URL сервера

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            order: {
                stripe_token,
                name,
                email
            }
        })
    })
    .then(async response => {
        // если сервер вернул ошибку — прочитаем текст, чтобы не поймать Unexpected token '<'
        if (!response.ok) {
            const text = await response.text();
            console.error("Server error:", text); 
            throw new Error("Server returned " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Order response:", data);

        // читаем данные заказа
        const order = data.orderReceived;
        console.log("Order received from server:", order);

        // если хочешь — покажем пользователю на странице
        const resultEl = document.getElementById('order-result');
        if (resultEl) {
            resultEl.textContent = 
                `Ваш заказ принят!
                 Имя: ${order.name}
                 Email: ${order.email}
                 Token: ${order.stripe_token}`;
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });
}


// function stripeTokenHandler(token) {
//     const stripe_token = token.id
//     const name = document.querySelector('#name').value
//     const email = document.querySelector('#email').value

//     const backendUrl = form.getAttribute('action')

//     fetch(backendUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             order: {
//                 stripe_token: stripe_token,
//                 name: name,
//                 email: email
//             }
//         })
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.order) {
//                 const order = data.order

//                 form.querySelector('.form-title').textContent = 'Payment successful!'

//                 const messagesEl = document.getElementById('form-messages')

//                 // успех
//                 console.log(data)
//                 messagesEl.innerHTML = `
//     Thank you <strong>${order.name}</strong>, your payment was successful.<br>
//     A receipt has been sent to <strong>${order.email}</strong>.
// `

//                 // ошибка
//                 messagesEl.textContent = 'There was an error with payment, please try again or contact help@goodtim.es'

//                 form.classList.remove('processing')
//                 console.log(data)
//             }
//         })
//         .catch(error => {
//             const errorEl = document.getElementById('card-errors')
//             if (errorEl) {
//                 errorEl.textContent = `There was an error with payment. Please try again or contact help@goodtim.es.`
//             }
//             form.classList.remove('processing')
//             console.log(error)
//         })

//     console.log(stripe_token, name, email) // outside fetch chain
// } // <-- final closing brace for function
