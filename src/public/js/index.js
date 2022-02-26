const socket = io();

let chatBox = document.getElementById('chatBox');
let user;
let products = [];

Swal.fire({
  title: 'Welcome to the chat!',
  text: 'enter your username: ',
  input: 'text',
  allowOutsideClick: false,
  inputValidator: (value) => {
      return !value && 'You need an username!';
    },

}).then((result) => {
  user = result.value;
  socket.emit('newUser', user);
});

chatBox.addEventListener('keyup', (e) => {
  console.log(e.key);
  if (e.key === 'Enter' && chatBox.value.trim() !== '') {
    socket.emit('chat message', {user: user, message: chatBox.value});
    chatBox.value = '';
  }
});

socket.on('history', (data) => {
  let history = document.getElementById('messages');
  let messages = ""
  data.forEach(message => {
    messages += `<p> <span class="user"> ${message.userId} </span> - <span class="date"> ${message.date} </span> - <span class="message"> ${message.message} </span>  </p>`
  })
  history.innerHTML = messages;
  document.getElementById('final').scrollIntoView(true)
});

socket.on('products', (data) => {

  fetch('templates/realTimeProducts.ejs').then(response => response.text()).then(template => {
    document.getElementById('products').innerHTML = ejs.render(template, {products: data});
  });
})

socket.on('alert', data => {
  Swal.fire ({
    title: "New user connected",
    text: data,
    icon: "success",
    timer: 3000,
    toast: true,
    position: "top-end",
  });
})

let productForm = document.getElementById('productForm');

const handleSubmit = (e, form, route) => {
  e.preventDefault();
  let formData = new FormData(form)
  let obj = {}
  formData.forEach((value, key)=>obj[key] = value)
  form.reset();
  socket.emit('newProduct', obj);
}

productForm.addEventListener('submit', (e)=> handleSubmit(e, e.target, '/api/products'))
