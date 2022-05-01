
const RANDOM_DOGS_API_URL = "https://api.thedogapi.com/v1/images/search?limit=4"
const DOGS_URL_FAVORITES = "https://api.thedogapi.com/v1/favourites"
const UPLOAD_DOGS_URL="https://api.thedogapi.com/v1/images/upload"

const APY_KEY = call_apy_key()

const api = axios.create({
  baseURL: 'https://api.thedogapi.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key':APY_KEY
  }
});


let search_section=document.getElementById("search")

let favourites_section=document.getElementById("favorites")

let search_dogs_button = document.createElement('button')
    search_dogs_button.id = "search_dogs"
    search_dogs_button.textContent="Search Dogs"
    search_dogs_button.onclick = searchRandomDogs

let chooseFile = document.getElementById("choose-file")
let imgPreview = document.getElementById("img-preview")
      chooseFile.addEventListener("change", function () {
        getImgData();
      });

let upload_dog_button = document.getElementById("uploadbutton")
    upload_dog_button.onclick =uploadDog
    

async function searchRandomDogs(){
  let {data,status} = await api.get("/images/search?limit=4")

    if (status!=200){
        console.log(`Hubo un error + ${response.status} ${data.message}`)
    }

    else{
        search_section.innerHTML="";
        data.forEach((dog,index)=>{
        let article = document.createElement('article')
        let figure = document.createElement('figure')
        let image = document.createElement('img')
        image.src =dog.url

        let save_favorite_dog_button = document.createElement('button')
        save_favorite_dog_button.class = "save_dog"
        save_favorite_dog_button.textContent="Save"
        save_favorite_dog_button.onclick = () => saveDogInFavorites(dog.id)
        figure.appendChild(image)
        article.appendChild(figure)
        article.appendChild(save_favorite_dog_button)
        search_section.appendChild(article)
        })
        search_section.appendChild(search_dogs_button)

    }
}

async function saveDogInFavorites(id){
    let {data,status} = await api.post("/favourites",{image_id:id})
      if (status !== 200) {
        console.log(data)
      }
      else{
        loadFavoritesDogs()
      }
}

async function loadFavoritesDogs(){
    let {data,status} = await api.get("/favourites")
  
    if (status !== 200) {
        alert(`Hubo un error + ${response.status} ${data.message}`)
    }
    else{
      favourites_section.innerHTML="";
      let favorite_title = document.createElement("h2")
          favorite_title.textContent="Your Favorites Dogs"
          favourites_section.append(favorite_title)

      data.forEach((dog,index)=>{
      let article = document.createElement('article')
      let figure = document.createElement('figure')
      let image = document.createElement('img')
          image.src =dog.image.url
      let delete_favorite_dog_button = document.createElement('button')
          delete_favorite_dog_button.class = "delete_dog"
          delete_favorite_dog_button.textContent="Delete"
          delete_favorite_dog_button.onclick = () => deleteFavoriteDog(dog.id)

      figure.appendChild(image)
      article.appendChild(figure)
      article.appendChild(delete_favorite_dog_button)
      favourites_section.appendChild(article)
      })

    }
}

async function deleteFavoriteDog(id){

  let {data,status} = await api.delete(`/favourites/${id}`)

  if (status !== 200) {
    console.log(data)
  }
  else{
    loadFavoritesDogs()
  }
}

function getImgData() {
  const files = chooseFile.files[0]
  if (files) {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(files)
    fileReader.addEventListener("load", function () {
      let current_upload_image=document.getElementById("upload_image")
          current_upload_image.src =this.result
    });    
  }
}

async function uploadDog (){
  
  let form = document.getElementById("uploadform")
  let formData = new FormData(form)
  
  let {data,status}= await api.post("/images/upload",formData)
  
  if (status !== 201) {
    console.log(data)
  }
  else{
    saveDogInFavorites(data.id)
    loadFavoritesDogs()
    let current_upload_image=document.getElementById("upload_image")
    current_upload_image.src =""

  }
}


searchRandomDogs()
loadFavoritesDogs()