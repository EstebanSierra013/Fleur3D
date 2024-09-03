class Wind {
  constructor( props ){
    const { long, lat } = props
    this.long = long
    this.lat = lat
    this.url = ""
    this.init()
  }

  init(){
    this.buildUrl()
    this.getWindData()
  }
  
  buildUrl() {
    const base = 'https://api.open-meteo.com/v1/forecast'
    const requiredLatitude = 'latitude=' + this.lat
    const requiredLongitude = 'longitude=' + this.long

    const params = ['wind_speed_10m', 'wind_direction_10m']
    const paramsStringList = params.join(',') 

    this.url = `${base}?${requiredLatitude}&${requiredLongitude}&current=${paramsStringList}`
  }

  getWindData(){
    fetch(this.url)
    .then( response => response.json())
    .then( data => {
      window.app.windDirection = this.changeWindDirection(data.current.wind_direction_10m)
      document.querySelector(".js-data-direction").innerHTML +=
      `<h2>${data.current.wind_direction_10m}</h2>`      
      window.app.windSpeed = data.current.wind_speed_10m
      document.querySelector(".js-data-speed").innerHTML +=
      `<h2>${window.app.windSpeed}</h2>`
    })
  }

  changeWindDirection( windDirection ){
    if( windDirection > 180 ) {
      return windDirection -= 360
    } else {
      return windDirection
    }
  }
}

export { Wind }