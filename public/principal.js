const socket=io()
//recibo los mensajes y lo inserto en el html con el formato pedido
socket.on("messages",data=>{
let html=""
data.forEach(message => {
 html= `${html}
<li><b style="color:blue">${message.email}</b>[<em style="color:brown">${message.date}</em>]:<em style="color:green">${message.message}</em></li>`
});
document.getElementById("chatContent").innerHTML=`<ul>${html}</ul>`//inserto en el chat.ejs
})

let prod=[]
//recibo los productos y lo inserto en el html con el formato pedido
socket.on("product",(data)=>{
    let html=""
    console.log(data)
    prod = data
    for(let i=0;i<prod.lenght;i++){
     html=html +`
     <tr>
    <td>${prod[i].name}></td>
    <td><${prod[i].price}></td>
    <td><img src=<${prod[i].thumbnail}></td>
    </tr>`   
    }
   document.getElementById("productContent").innerHTML=html 
})
//escucho el ultimo mensaje enviado por el servidor,le doy formato y lo agrego al html
socket.on("messageAdded",(message)=>{
    let html=""
    html=`${html}
    <li><em>${message.email}</em>:${message.text}</li>`
    document.getElementById("chatContent").innerHTML=html
    
})
//escucho el ultimo producto enviado por el servidor,le doy formato y lo agrego al html
socket.on("productAdded",(product)=>{
    let html=""
    html=`${html}
    <tr>
    <td>${product.name}></td>
    <td><${product.price}></td>
    <td><img src=<${product.thumbnail}></td>
    </tr>`
    document.getElementById("productContent").innerHTML=html
})
//creo una funcion para crear un objeto mensaje apartir del formulario de chat.ejs y lo emito al servidor
function sendMessage(that){
    const message={
        email:that.email.value,
        message:that.message.value,
        date:new Date().toLocaleString()
    }
    socket.emit("newMessage",message)
}
//creo una funcion para crear un objeto producto apartir del formulario de form.ejs y lo emito al servidor
function addProduct(that){
    const product={
        name:that.name.value,
        price:that.price.value,
        thumbnail:that.thumbnail.value
    }
    socket.emit("newProduct",product)
}

