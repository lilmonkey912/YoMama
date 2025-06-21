# Configuration
NAME = frontwindow
OUTPUT = $(NAME).node
SRC = frontwindow.c
MAC_SRC = frontwindow.m
WIN_SRC = frontwindow.c
ARCH := $(shell uname)

NODE_INCLUDE = $(shell node -p "require('node-addon-api').include" 2>/dev/null || echo "")
NODE_ABI = $(shell node -p "require('node:process').versions.modules")

# Default
all: build

# macOS build
build-macos:
	@echo "→ Building for macOS..."
	mkdir -p build/darwin
	clang \
		-O2 \
		-shared \
		-fPIC \
		-framework AppKit \
		-framework ApplicationServices \
		-I$(NODE_INCLUDE) \
		$(SRC) $(MAC_SRC) -o build/darwin/$(OUTPUT) \
		-undefined dynamic_lookup

# Clean
clean:
	@echo "→ Cleaning..."
	rm -rf build

# Default: auto-detect
build:
ifeq ($(ARCH), Darwin)
	make build-macos
else
ifeq ($(OS),Windows_NT)
	make build-win
else
	$(error Unsupported platform)
endif
endif
