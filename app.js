import { Search } from './modules/Search.js'
import { Flower } from './modules/Flower.js'

window.app = {
  city: "",
  windDirection: "",
  windSpeed: "",
  resetAnimation: false
} 

new Search()
new Flower()