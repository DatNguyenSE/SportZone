# Sử dụng image .NET SDK để build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["SportZone.API.csproj", "./"]
RUN dotnet restore "SportZone.API.csproj"
COPY . .
RUN dotnet build "SportZone.API.csproj" -c Release -o /app/build
RUN dotnet publish "SportZone.API.csproj" -c Release -o /app/publish

# Sử dụng image .NET Runtime để chạy
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SportZone.API.dll"]