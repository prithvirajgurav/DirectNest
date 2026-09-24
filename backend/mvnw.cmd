@echo off
set MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.9
if not exist "%MAVEN_HOME%" (
    echo Downloading Maven 3.9.9...
    mkdir "%MAVEN_HOME%"
    curl -o "%TEMP%\maven.zip" "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip"
    powershell -Command "Expand-Archive -Path '%TEMP%\maven.zip' -DestinationPath '%USERPROFILE%\.m2\wrapper\dists' -Force"
    del "%TEMP%\maven.zip"
)
"%MAVEN_HOME%\bin\mvn.cmd" %*
