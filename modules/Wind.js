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
    console.log("AQUI", this.lat, this.long)
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
      console.log(data)
    })
  }
}

export { Wind }