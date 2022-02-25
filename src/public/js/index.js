const socket = io();

let chatBox = document.getElementById('chatBox');
let user;

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
  console.log(`history: ${data}`);
  let history = document.getElementById('history');
  let messages = ""
  data.forEach(message => {
    messages += `<p> ${message.userId} - ${message.message} </p>`
  })
  history.innerHTML = messages;
});

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

// let productForm = document.getElementById('productForm');
//
// const handleSubmit = (e, form, route) => {
//   e.preventDefault();
//   let formData = new FormData(form)
//   let obj = {}
//   formData.forEach((value, key)=>obj[key] = value)
//   fetch(route, {
//     method:"POST",
//     body:JSON.stringify(obj),
//     headers:{
//       "Content-type":"application/json"
//     }
//   }).then(res=>res.json()).then(json => console.log(json))
//   form.reset();
// }
//
// productForm.addEventListener('submit', (e)=> handleSubmit(e, e.target, '/api/products'))
