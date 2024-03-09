"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { Container } from "../components/Container";
import { useQuery } from "react-query";
import { converKelvinToCelsius } from "@/utilis/convertKelvinToCelsius";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayorNightIcon } from "@/utilis/getDayorNightIcon";
import WeatherDetails from "@/components/WeatherDetails";
import { metersToKilometers } from "@/utilis/metersToKilometers";
import convertWindSpeed from "@/utilis/convertWindSpeed";
import ForecastWeatherDetails from "@/components/ForecastWeatherDetails";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";
import Loading from "@/components/Loading";
import { WeatherData } from "@/components/weatherProps";

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=3c1dea2028be117835cbb1379d2b0932&cnt=56`
      );
      return data;
    }
  );
  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });
  const firstData = data?.list[0];
  if (isLoading) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading....</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {loadingCity ? (
          <Loading />
        ) : (
          <>
            <section className="space-y-4">
              {/* today data */}
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end">
                  <p className="text-2xl">
                    {format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}
                  </p>
                  <p className="text-lg mx-1">
                    ({format(parseISO(firstData?.dt_txt ?? ""), "yyyy.MM.dd")})
                  </p>
                </h2>
                <Container className="gap-10 px-6 items-center">
                  <div className="flex flex-col px-4">
                    <span className="text-5xl">
                      {converKelvinToCelsius(firstData?.main.temp ?? 284)}°
                    </span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span>Feels like</span>
                      <span>
                        {converKelvinToCelsius(firstData?.main.feels_like ?? 0)}
                        °
                      </span>
                    </p>
                    <p className="text-xs space-x-2">
                      <span>
                        {converKelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓
                      </span>
                      <span>
                        {converKelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑
                      </span>
                    </p>
                  </div>
                  {/* {time and weather icon} */}
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {data?.list.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(d.dt_txt), "h:mm a")}
                        </p>
                        <WeatherIcon
                          iconname={getDayorNightIcon(
                            d.weather[0].icon,
                            d.dt_txt
                          )}
                        />
                        <p>{converKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className="flex gap-4">
                <Container className="w-fit justify-center flex-col px-4 items-center">
                  <p className="capitalize text-center">
                    {firstData?.weather[0].description}
                  </p>
                  <WeatherIcon
                    iconname={getDayorNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                  />
                </Container>
                <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-auto">
                  <WeatherDetails
                    airPressure={`${firstData?.main.pressure} hPa`}
                    visability={metersToKilometers(
                      firstData?.visibility ?? 10000
                    )}
                    humidity={`${firstData?.main.humidity}%`}
                    sunrise={format(
                      fromUnixTime(data?.city.sunrise ?? 1702949452),
                      "H:mm"
                    )}
                    sunset={format(
                      fromUnixTime(data?.city.sunset ?? 1702949452),
                      "H:mm"
                    )}
                    windspeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                  />
                </Container>
              </div>
            </section>
            {/* 7 day forecast data */}
            <section className="flex w-full flex-col gap-4">
              <p className="text-2xl">Forecast for upcoming days</p>
              {firstDataForEachDate.map((d, i) => (
                <ForecastWeatherDetails
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                  day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure} hPa `}
                  humidity={`${d?.main.humidity}% `}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 1702517657),
                    "H:mm"
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 1702517657),
                    "H:mm"
                  )}
                  visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
                  windspeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
