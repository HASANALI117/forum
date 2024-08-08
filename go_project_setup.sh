#!/bin/bash

# Get the project name from the user
echo "Enter the project name:"
read projectName

# Create the project directory
# mkdir $projectName
# cd $projectName

# Create the directories for the standard Go project layout
mkdir -p cmd/$projectName
mkdir -p pkg
mkdir -p api
mkdir -p web
mkdir -p scripts
mkdir -p build
mkdir -p deployments
mkdir -p test
mkdir -p docs

# Create the main.go file in the cmd directory
echo 'package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}' > cmd/$projectName/main.go

# Create a basic README.md file
echo "# $projectName" > README.md

# Create a .gitignore file
echo '# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary, built with `go test -c`
*.test

# Output of the go coverage tool, specifically when used with LiteIDE
*.out

# Dependency directories (remove the comment below to include it)
# vendor/

# Go workspace file
go.work' > .gitignore

echo "Standard Go Project Layout for $projectName created."