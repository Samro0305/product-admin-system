const API = "/api/products";

function loadProducts(){

fetch(API)
.then(res=>res.json())
.then(data=>{

let rows="";

data.forEach(p=>{

rows+=`
<tr>
<td>${p.id}</td>
<td>${p.name}</td>
<td>${p.price}</td>
<td>${p.description}</td>
<td>
<button onclick="deleteProduct(${p.id})">Delete</button>
</td>
</tr>
`;

});

document.getElementById("products").innerHTML=rows;

});

}

function addProduct(){

const name=document.getElementById("name").value;
const price=document.getElementById("price").value;
const description=document.getElementById("description").value;

fetch(API,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name,price,description})
})
.then(()=>loadProducts());

}

function deleteProduct(id){

fetch(API+"/"+id,{
method:"DELETE"
})
.then(()=>loadProducts());

}

loadProducts();