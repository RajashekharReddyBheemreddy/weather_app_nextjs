import React from 'react'
import { FiDroplet } from 'react-icons/fi';
import { ImMeter } from 'react-icons/im';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { MdAir } from 'react-icons/md';
import { singleWeatherDetailProps } from './weatherProps';

export interface WeatherDetailProps {
    visability: string;
    humidity: string;
    windspeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
    const {
        visability = '25km',
        humidity = '61%',
        windspeed = '7 km/h',
        airPressure = '1012 hPa',
        sunrise = '6:20',
        sunset = '18:48'
    } = props;
  return (
    <>
    <SingleWeatherDetail
    icon ={<LuEye />}
    information='visability'
    value={visability}
    />
        <SingleWeatherDetail
    icon ={<FiDroplet />}
    information='Humidity'
    value={humidity}
    />
    <SingleWeatherDetail
    icon ={<MdAir />}
    information='Wind speed'
    value={windspeed}
    />
        <SingleWeatherDetail
    icon ={<ImMeter />}
    information='Air pressure'
    value={airPressure}
    />
        <SingleWeatherDetail
    icon ={<LuSunrise />}
    information='Sunrise'
    value={sunrise}
    />
        <SingleWeatherDetail
    icon ={<LuSunset />}
    information='Sunset'
    value={sunset}
    />
    </>
  )
}
function SingleWeatherDetail(props: singleWeatherDetailProps){
    return(
        <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
            <p className='whitespace-nowrap'>{props.information}</p>
            <div className="text-3xl">{props.icon}</div>
            <p>{props.value}</p>
        </div>
    )
}