export class WeatherInfo {
  constructor(temperature, location) {
    this.temperature = temperature;
    this.location = location;
  }

  static fromResponse(data) {
    return new WeatherInfo(
      data.temperature,
      data.location
    );
  }
}
