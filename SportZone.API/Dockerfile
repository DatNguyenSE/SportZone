# Sử dụng image .NET SDK để build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["SportZoneSolution.csproj", "./"]
RUN dotnet restore "SportZoneSolution.csproj"
COPY . .
RUN dotnet build "SportZoneSolution.csproj" -c Release -o /app/build
RUN dotnet publish "SportZoneSolution.csproj" -c Release -o /app/publish

# Sử dụng image .NET Runtime để chạy
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SportZone.API.dll"]