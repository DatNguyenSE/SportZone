# 1. BẮT BUỘC dùng image .NET 9.0
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# 2. Copy TỪNG file .csproj vào đúng thư mục tương ứng
# (Tôi đang giả sử thư mục chứa API của bạn tên là "SportZone.API" và thư mục thứ 4 là "Domain")
COPY ["SportZone.API/SportZone.API.csproj", "SportZone.API/"]
COPY ["Application/SportZone.Application.csproj", "Application/"]
COPY ["Infrastructure/SportZone.Infrastructure.csproj", "Infrastructure/"]
COPY ["Domain/SportZone.Domain.csproj", "Domain/"] 

# 3. Restore project chính
RUN dotnet restore "SportZone.API/SportZone.API.csproj"

# 4. Copy toàn bộ code
COPY . .

# 5. Build và Publish
WORKDIR "/src/SportZone.API"
RUN dotnet build "SportZone.API.csproj" -c Release -o /app/build
RUN dotnet publish "SportZone.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 6. Dùng image Runtime .NET 9.0 để chạy
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "SportZone.API.dll"]