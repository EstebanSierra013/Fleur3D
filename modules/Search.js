import { Wind } from './Wind.js'

class Search {
  constructor(){
    this.input = document.querySelector(".js-search-input")
    this.form = document.querySelector(".js-search-form")
    this.cities = []
    this.init()
  }

  init(){
    this.getCities()
    this.watchUserInput()
  }

  watchUserInput() {
    this.form.addEventListener("submit", ( e ) =>  {
      e.preventDefault()
      this.getLatLong()
    })
  }

  getLatLong(){
    const name = this.input.value
    const cityData = this.getCityData(name)
    if(cityData){
      const long = cityData.lng
      const lat = cityData.lat
      window.app.city = name
      window.app.resetAnimation = true
      new Wind( { long, lat } )
    }else{
      alert("City does not exist")
    }
  }

  getCities(){
    fetch("../data/france-cities.json")
    .then( response => response.json())
    .then( data => {
      this.cities = data
    })
  }

  getCityData( cityName ){
    const cityData = this.cities.find(
      ( cityObject ) => cityObject.city.toLowerCase() === cityName.toLowerCase()
    )
    return cityData
  }
}

export { Search }