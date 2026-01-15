@echo off
set JUNIT_JAR=junit-platform-console-standalone-1.10.2.jar
echo Compiling...
if not exist bin mkdir bin
javac -d bin src\StudentAnalyzer.java
javac -d bin -cp "%JUNIT_JAR%;bin" test\StudentAnalyzerTest.java
echo Running tests...
java -jar %JUNIT_JAR% -cp bin --select-class StudentAnalyzerTest
pause
