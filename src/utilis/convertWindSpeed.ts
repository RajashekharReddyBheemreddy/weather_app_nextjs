

const convertWindSpeed = (speedInMPS: number):string => {
    const speedInKPH = speedInMPS * 3.6;
  return (
    `${speedInKPH.toFixed(0)}km/h`
  )
}

export default convertWindSpeed